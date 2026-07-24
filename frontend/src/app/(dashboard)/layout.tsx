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

  return (
    <div className="min-h-screen bg-background">
      <CustomCursor />
      <Sidebar />
      <div className="md:pl-64 flex flex-col min-h-screen">
        <TopNavbar />
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
