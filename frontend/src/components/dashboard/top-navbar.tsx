"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Database, 
  Terminal,
  Activity,
  LogOut,
  User as UserIcon,
  ChevronDown
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

export function TopNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push("/sign-in")
    } catch (error) {
      console.error("Error signing out", error)
    }
  }



  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 border-foreground bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
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

        <div className="ml-auto flex items-center space-x-6">
          
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
            <DropdownMenuContent className="w-56 rounded-none border-2 border-foreground shadow-[4px_4px_0_var(--foreground)]" align="end">
              <div className="px-2 py-1.5 text-sm font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none">{user?.displayName || "Agent"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-foreground h-[2px]" />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:!bg-destructive focus:!text-background data-[highlighted]:!bg-destructive data-[highlighted]:!text-background hover:!bg-destructive hover:!text-background cursor-pointer font-bold uppercase tracking-widest text-xs h-10 transition-colors group/logout">
                <LogOut className="mr-2 h-4 w-4 group-hover/logout:text-background group-data-[highlighted]/logout:text-background group-focus/logout:text-background" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
