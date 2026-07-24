"use client"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNavbar } from "@/components/dashboard/top-navbar"
import { useAuth } from "@/providers/auth-provider"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { CustomCursor } from "@/components/cursor"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && pathname !== '/dashboard') {
      router.push('/sign-in');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center">
        <CustomCursor />
        <div className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter text-foreground animate-pulse">
          Initializing Vault...
        </div>
      </div>
    );
  }

  // If not logged in and not on the main dashboard, don't render children to avoid flash/errors
  if (!user && pathname !== '/dashboard') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <CustomCursor />
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-screen">
        <TopNavbar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
