import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Require user to be authenticated
 * Redirects to login page if not logged in
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return session.user;
}

/**
 * Require user to be admin
 * Redirects to unauthorized page if not admin
 */
export async function requireAdmin() {
  const user = await requireAuth();

  if (user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return user;
}

/**
 * Get current user (returns null if not logged in)
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}
