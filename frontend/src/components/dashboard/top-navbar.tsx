"use client"

import { Search, Bell, Menu } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export function TopNavbar() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-4 bg-background/80 px-8 backdrop-blur-xl transition-all">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-lg hidden md:block group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search across your entire career..."
            className="h-12 w-full rounded-2xl border border-border bg-white shadow-sm pl-12 pr-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all hover:shadow-md"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border bg-muted px-2 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-full h-10 w-10">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="h-10 w-10 rounded-full border border-border bg-white shadow-sm flex items-center justify-center overflow-hidden hover:shadow-md transition-all cursor-pointer">
          <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-9 h-9" } }} />
        </div>
      </div>
    </header>
  )
}
