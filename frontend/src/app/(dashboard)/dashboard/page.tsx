"use client"

import { motion } from "framer-motion"
import { 
  Award, BookOpen, Briefcase, FileText, 
  Network, ShieldCheck, Target, TrendingUp, Sparkles, Terminal
} from "lucide-react"
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts"

import { useQuery } from '@tanstack/react-query'
import { fetchWithAuth } from "@/lib/api"
import { useAuth } from "@/providers/auth-provider"

const stats = [
  { label: "Verified Skills", value: "24", icon: ShieldCheck },
  { label: "Projects", value: "12", icon: Network },
  { label: "Certificates", value: "5", icon: Award },
  { label: "Internships", value: "2", icon: Briefcase },
]

export default function DashboardPage() {
  const { user } = useAuth();

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

  const { data: identityData, isLoading: isLoadingScore } = useQuery({
    queryKey: ['identity-score'],
    queryFn: async () => {
      if (!user) return { score: 0 };
      return fetchWithAuth('/identity/score')
    },
    refetchInterval: 10000,
    enabled: !!user,
  })

  const score = identityData?.score || 0
  const identityScoreData = [{ name: "Score", value: score, fill: "var(--foreground)" }]

  return (
    <div className="space-y-12 max-w-7xl mx-auto text-foreground">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b-4 border-foreground pb-6">
        <div>
          <h1 className="font-[family-name:var(--font-black-ops)] text-4xl md:text-6xl tracking-tighter uppercase">Overview</h1>
          <p className="text-muted-foreground uppercase tracking-widest font-bold text-sm mt-2">Central Nervous System</p>
        </div>
        
        <div className="flex items-center gap-3 text-sm border-2 border-foreground bg-background px-4 py-2 shadow-[4px_4px_0_var(--foreground)]">
          <div className={`h-3 w-3 ${isLoading ? 'bg-yellow-500 animate-pulse' : (health ? 'bg-green-500' : 'bg-red-500')}`} />
          <span className="font-bold uppercase tracking-widest text-xs">
            SYS: {isLoading ? 'SYNCING' : (health ? 'ONLINE' : 'OFFLINE')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Identity Score Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 md:col-span-1 bg-background border-4 border-foreground shadow-[8px_8px_0_var(--foreground)] p-8 flex flex-col items-center justify-center relative group hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0_var(--foreground)] transition-all"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--foreground)_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03] pointer-events-none" />
          
          <h2 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter mb-4">Identity Score</h2>
          <div className="h-48 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" 
                barSize={15} data={identityScoreData} startAngle={90} endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                  background={{ fill: 'var(--border)' }}
                  cornerRadius={0}
                  dataKey="value"
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="absolute inset-0 flex items-center justify-center flex-col mt-8">
            {isLoadingScore ? (
               <span className="font-[family-name:var(--font-black-ops)] text-4xl animate-pulse">---</span>
            ) : (
               <span className="font-[family-name:var(--font-black-ops)] text-5xl">{score}</span>
            )}
            <span className="text-[10px] font-bold bg-foreground text-background px-2 py-1 uppercase tracking-widest mt-2 border border-background">
              Verified
            </span>
          </div>
        </motion.div>

        {/* Career Readiness & Evidence */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-background border-4 border-foreground p-8 shadow-[8px_8px_0_var(--foreground)] flex flex-col justify-between hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0_var(--foreground)] transition-all"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-6 w-6" />
                <h2 className="font-[family-name:var(--font-black-ops)] text-2xl tracking-tighter uppercase">Career Matrix</h2>
              </div>
              <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Target Vector: AI Engineer</p>
            </div>
            <div className="mt-8">
              <div className="flex justify-between items-end mb-3">
                <span className="font-[family-name:var(--font-black-ops)] text-5xl tracking-tighter">92%</span>
                <span className="text-xs font-bold bg-foreground text-background px-3 py-1 flex items-center gap-2 uppercase tracking-widest">
                  <TrendingUp className="h-4 w-4"/> Delta +4%
                </span>
              </div>
              <div className="h-3 w-full bg-border border-2 border-foreground overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: "92%" }} 
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  className="h-full bg-foreground" 
                />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-background border-4 border-foreground p-8 shadow-[8px_8px_0_var(--foreground)] flex flex-col justify-between hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0_var(--foreground)] transition-all"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="h-6 w-6" />
                <h2 className="font-[family-name:var(--font-black-ops)] text-2xl tracking-tighter uppercase">Evidence Engine</h2>
              </div>
              <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Cryptographic Validation</p>
            </div>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-[family-name:var(--font-black-ops)] text-5xl tracking-tighter">48</span>
              <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b-2 border-foreground pb-1">Secured Nodes</span>
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
            className="bg-background border-4 border-foreground p-6 flex flex-col items-start gap-4 hover:bg-foreground hover:text-background transition-colors group cursor-crosshair shadow-[4px_4px_0_var(--foreground)]"
          >
            <stat.icon className="h-8 w-8" />
            <div>
              <h3 className="font-[family-name:var(--font-black-ops)] text-3xl mb-1">{stat.value}</h3>
              <p className="text-xs font-bold uppercase tracking-widest group-hover:text-background text-muted-foreground">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity / Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-background border-4 border-foreground shadow-[8px_8px_0_var(--foreground)] p-8"
        >
          <h2 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter mb-6 flex items-center gap-3 border-b-2 border-foreground pb-4">
            <Terminal className="h-6 w-6"/> Pipeline Logs
          </h2>
          <div className="space-y-4 font-mono text-sm">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-l-4 border-foreground pl-4 py-2 hover:bg-foreground/5 transition-colors">
                <p className="font-bold text-foreground mb-1">&gt; INGEST: Frontend_Resume_2026.pdf</p>
                <div className="flex justify-between items-center text-muted-foreground text-xs uppercase tracking-widest">
                  <span>Status: Success [14 Nodes Extracted]</span>
                  <span>T-2H</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-background border-4 border-foreground shadow-[8px_8px_0_var(--foreground)] p-8"
        >
          <h2 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter mb-6 flex items-center gap-3 border-b-2 border-foreground pb-4">
            <Network className="h-6 w-6"/> Topology
          </h2>
          <div className="space-y-4 font-mono text-sm">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-l-4 border-foreground pl-4 py-2 hover:bg-foreground/5 transition-colors">
                <p className="font-bold text-foreground mb-1">&gt; LINK: React.js &lt;--&gt; IdentiTea Dashboard</p>
                <div className="flex justify-between items-center text-muted-foreground text-xs uppercase tracking-widest">
                  <span>Edge Weight: +0.8</span>
                  <span>Validated</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      
    </div>
  )
}
