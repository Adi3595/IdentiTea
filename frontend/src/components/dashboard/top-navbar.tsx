"use client"
import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LogOut,
  User as UserIcon,
  Menu,
  X,
  LayoutDashboard, UserCircle, Clock, Network, 
  Files, BrainCircuit, AppWindow, Award, Briefcase, Globe, Settings
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/providers/auth-provider"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Identity", href: "/dashboard/identity", icon: UserCircle },
  { name: "Timeline", href: "/dashboard/timeline", icon: Clock },
  { name: "Knowledge Graph", href: "/dashboard/graph", icon: Network },
  { name: "Documents", href: "/dashboard/documents", icon: Files },
  { name: "Skills", href: "/dashboard/skills", icon: BrainCircuit },
  { name: "Projects", href: "/dashboard/projects", icon: AppWindow },
  { name: "Certificates", href: "/dashboard/certificates", icon: Award },
  { name: "Internships", href: "/dashboard/internships", icon: Briefcase },
  { name: "Achievements", href: "/dashboard/achievements", icon: Award },
  { name: "Integrations", href: "/dashboard/integrations", icon: Globe },
  { name: "Portfolio", href: "/dashboard/portfolio", icon: AppWindow },
  { name: "Resume Analytics", href: "/dashboard/resume-analysis", icon: BrainCircuit },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function TopNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push("/sign-in")
    } catch (error) {
      console.error("Error signing out", error)
    }
  }

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b-2 border-foreground bg-background">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          
          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="ml-3 font-[family-name:var(--font-black-ops)] text-xl uppercase">
              IdentiTea
            </div>
          </div>

          <div className="mr-4 hidden md:flex items-center gap-6">
            <div className="font-[family-name:var(--font-black-ops)] text-xl tracking-tighter uppercase mt-1 opacity-50">
              Vault Access
            </div>
          </div>

          {/* Global Command Palette / Search Bar */}
          <div className="flex-1 flex justify-center px-4 md:px-8">
            <div className="max-w-lg w-full relative group hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground group-focus-within:text-foreground transition-colors"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <input 
                type="text" 
                placeholder="Query Knowledge Graph..." 
                className="w-full bg-background border-2 border-foreground pl-10 pr-12 py-1.5 text-xs font-bold uppercase tracking-widest text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0_var(--foreground)] transition-shadow"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                <span className="text-[10px] font-bold bg-foreground/10 text-foreground px-1.5 py-0.5 border border-foreground/20 uppercase">CTRL+K</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 md:space-x-6">
            
            {/* System Diagnostics Ticker */}
            <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <div className="h-1.5 w-1.5 bg-green-500 rounded-none animate-pulse" />
              <span>SYS.NODE.04 // SECURE</span>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="relative h-10 w-10 rounded-full border-2 border-foreground hover:bg-foreground hover:text-background p-0 overflow-hidden group transition-all flex items-center justify-center outline-none">
                <span className="pointer-events-none w-full h-full flex items-center justify-center">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="h-5 w-5" />
                  )}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-none border-2 border-foreground shadow-[4px_4px_0_var(--foreground)] bg-background" align="end">
                <div className="px-2 py-1.5 text-sm font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold leading-none">{user?.displayName || "Agent"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-foreground h-[2px]" />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:bg-destructive focus:text-destructive-foreground hover:bg-destructive hover:text-destructive-foreground cursor-pointer font-bold uppercase tracking-widest text-xs h-10 transition-colors">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[100] bg-background md:hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b-2 border-foreground">
              <div className="font-[family-name:var(--font-black-ops)] text-2xl uppercase">
                IdentiTea
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <nav className="flex flex-col gap-2">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest uppercase transition-all border-2 ${
                        isActive 
                          ? "bg-foreground text-background border-foreground shadow-[2px_2px_0_var(--foreground)]" 
                          : "border-transparent text-muted-foreground hover:border-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? "text-background" : ""}`} />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
