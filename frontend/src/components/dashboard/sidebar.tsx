"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, UserCircle, Clock, Network, 
  Files, GraduationCap, Briefcase, Award, 
  Github, AppWindow, BrainCircuit, Settings
} from "lucide-react"

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
  { name: "GitHub", href: "/dashboard/github", icon: Github },
  { name: "Portfolio", href: "/dashboard/portfolio", icon: AppWindow },
  { name: "Career AI", href: "/dashboard/career-ai", icon: BrainCircuit },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-white/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-border/40">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <BrainCircuit className="h-5 w-5 text-primary" />
        </div>
        <span className="text-lg font-bold tracking-tight">IdentiTea</span>
      </div>
      
      <div className="h-[calc(100vh-4rem)] overflow-y-auto p-4 custom-scrollbar">
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-white text-primary shadow-sm ring-1 ring-border" 
                    : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
