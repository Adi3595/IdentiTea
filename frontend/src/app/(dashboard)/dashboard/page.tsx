"use client"

import { motion } from "framer-motion"
import { 
  Award, BookOpen, Briefcase, FileText, 
  Github, Network, ShieldCheck, Target, TrendingUp 
} from "lucide-react"
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts"

import { useQuery } from '@tanstack/react-query'

const stats = [
  { label: "Verified Skills", value: "24", icon: ShieldCheck, color: "text-green-500", bg: "bg-green-500/10" },
  { label: "Projects", value: "12", icon: Network, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Certificates", value: "5", icon: Award, color: "text-purple-500", bg: "bg-purple-500/10" },
  { label: "Internships", value: "2", icon: Briefcase, color: "text-orange-500", bg: "bg-orange-500/10" },
]

const identityScoreData = [{ name: "Score", value: 85, fill: "var(--color-primary)" }]

export default function DashboardPage() {
  const { data: health, isLoading } = useQuery({
    queryKey: ['backend-health'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8000/health')
      if (!res.ok) throw new Error('Network response was not ok')
      return res.json()
    },
    retry: 3,
    refetchInterval: 5000,
  })

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        
        <div className="flex items-center gap-2 text-sm bg-card border border-border/50 px-4 py-2 rounded-full">
          <div className={`h-2 w-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : (health ? 'bg-green-500' : 'bg-red-500')}`} />
          <span className="text-muted-foreground font-medium">
            Backend: {isLoading ? 'Connecting...' : (health ? 'Connected' : 'Offline')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Identity Score Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 md:col-span-1 bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h2 className="text-lg font-semibold text-muted-foreground mb-4">Identity Score</h2>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" 
                barSize={15} data={identityScoreData} startAngle={90} endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                  background={{ fill: 'var(--color-accent)' }}
                  cornerRadius={10}
                  dataKey="value"
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="absolute inset-0 flex items-center justify-center flex-col mt-4">
            <span className="text-4xl font-extrabold text-primary">85</span>
            <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Excellent</span>
          </div>
        </motion.div>

        {/* Career Readiness & Evidence */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white border border-border/60 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-foreground">Career Readiness</h2>
              </div>
              <p className="text-sm text-muted-foreground">Match with target role: AI Engineer</p>
            </div>
            <div className="mt-8">
              <div className="flex justify-between items-end mb-3">
                <span className="text-4xl font-extrabold tracking-tight">92%</span>
                <span className="text-sm font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full flex items-center gap-1"><TrendingUp className="h-3 w-3"/> +4%</span>
              </div>
              <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: "92%" }} 
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  className="h-full bg-primary rounded-full" 
                />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white border border-border/60 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-5 w-5 text-secondary" />
                <h2 className="font-semibold text-foreground">Evidence Engine</h2>
              </div>
              <p className="text-sm text-muted-foreground">Skills backed by documentation</p>
            </div>
            <div className="mt-8">
              <span className="text-4xl font-extrabold tracking-tight">48</span>
              <span className="text-sm font-medium text-muted-foreground ml-2">verified nodes</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + (i * 0.1) }}
            className="bg-card border border-border/50 rounded-2xl p-6 flex items-center gap-4 group hover:border-primary/50 transition-colors cursor-pointer"
          >
            <div className={`h-12 w-12 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity / Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm"
        >
          <h2 className="font-medium mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-primary"/> Latest Documents</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer border border-transparent hover:border-border">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Frontend_Resume_2026.pdf</p>
                  <p className="text-xs text-muted-foreground">Processed • Extracted 14 skills</p>
                </div>
                <span className="text-xs text-muted-foreground">2h ago</span>
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm"
        >
          <h2 className="font-medium mb-4 flex items-center gap-2"><Network className="h-5 w-5 text-secondary"/> Graph Updates</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 relative">
                <div className="absolute left-[19px] top-8 bottom-[-16px] w-[2px] bg-border last:hidden" />
                <div className="h-10 w-10 rounded-full bg-accent border-4 border-background flex items-center justify-center z-10 shrink-0">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="pt-2 pb-4">
                  <p className="text-sm font-medium">New connection formed</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Linked <span className="text-foreground">React.js</span> to project <span className="text-foreground">IdentiTea Dashboard</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
