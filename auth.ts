import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  trustHost: true, // Only if using self-signed certs in development
  pages: {
    signIn: "/login",
    error: "/login"
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const validated = loginSchema.safeParse(credentials)
        if (!validated.success) return null
        
        const user = await db.user.findUnique({
          where: { email: validated.data.email }
        })
        
        if (!user || !user.password) return null
        
        const isValid = await bcrypt.compare(
          validated.data.password,
          user.password
        )
        
        if (!isValid) return null
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    }),
    // Optional OAuth providers (only if env vars exist)
    ...(process.env.GOOGLE_CLIENT_ID ? [Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })] : []),
    ...(process.env.GITHUB_CLIENT_ID ? [GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!
    })] : [])
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role ?? 'USER'
        token.id = user.id ?? ''
      }
      return token
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    }
  }
})
