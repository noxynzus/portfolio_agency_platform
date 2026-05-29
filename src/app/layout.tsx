'use client'
import { Inter, Space_Grotesk } from 'next/font/google'
// @ts-ignore
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Toaster } from 'sonner'
import Providers from '@/components/common/Providers'
import { usePathname } from 'next/navigation'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminPanel = pathname.startsWith('/dashboard')

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-cyber-black text-white antialiased`}
      >
        <Providers>
          <Toaster position="top-right" theme="dark" richColors />
          {!isAdminPanel && <Navbar />}
          <main>{children}</main>
          {!isAdminPanel && <Footer />}
        </Providers>
      </body>
    </html>
  )
}
