"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, UserCircle, Clock, Network, 
  Files, GraduationCap, Briefcase, Award, 
  AppWindow, BrainCircuit, Settings, Globe
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
  { name: "Integrations", href: "/dashboard/integrations", icon: Globe },
  { name: "Portfolio", href: "/dashboard/portfolio", icon: AppWindow },
  { name: "Resume Analytics", href: "/dashboard/resume", icon: Files },
  { name: "Career Dev", href: "/dashboard/career", icon: BrainCircuit },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:block fixed left-0 top-0 z-40 h-screen w-64 border-r-4 border-foreground bg-background">
      <Link href="/" className="flex h-16 items-center gap-3 px-6 border-b-2 border-foreground hover:bg-foreground/5 transition-colors cursor-pointer group">
        <img src="/logo.svg" alt="IdentiTea Logo" className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
        <span className="font-[family-name:var(--font-black-ops)] text-xl tracking-tighter uppercase mt-1 text-foreground">
          IdentiTea
        </span>
      </Link>
      
      <div className="h-[calc(100vh-4rem)] overflow-y-auto p-4 custom-scrollbar">
        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-bold tracking-widest uppercase transition-all border-2 ${
                  isActive 
                    ? "bg-foreground text-background border-foreground shadow-[2px_2px_0_var(--foreground)]" 
                    : "border-transparent text-muted-foreground hover:border-foreground hover:text-foreground hover:bg-foreground/5 hover:translate-x-1 hover:shadow-[2px_2px_0_var(--foreground)]"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-background" : ""}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
