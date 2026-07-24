"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, BrainCircuit, Target, ShieldCheck, AlertTriangle } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import { CustomCursor } from "@/components/cursor"
import { Button } from "@/components/ui/button"

export default function CareerAIPage() {
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role.trim()) return

    setLoading(true)
    setError("")
    
    try {
      const data = await fetchWithAuth(`/career/gap-analysis?target_role=${encodeURIComponent(role)}`)
      setResult(data)
    } catch (err: any) {
      setError(err.message || "Analysis failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-foreground">
      <CustomCursor />
      
      <div className="border-b-4 border-foreground pb-6">
        <h1 className="font-[family-name:var(--font-black-ops)] text-4xl md:text-5xl tracking-tighter uppercase flex items-center gap-4">
          <BrainCircuit className="h-10 w-10" /> Career AI
        </h1>
        <p className="text-muted-foreground uppercase tracking-widest font-bold text-sm mt-2">Vectorize your profile against target roles</p>
      </div>

      <div className="bg-background border-4 border-foreground shadow-[12px_12px_0_var(--foreground)] p-8">
        <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
            <input 
              type="text" 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="ENTER TARGET ROLE (E.G., SENIOR REACT DEVELOPER)" 
              className="w-full h-16 pl-14 pr-4 bg-background border-2 border-foreground outline-none font-bold font-mono uppercase tracking-widest focus:border-4 transition-all"
            />
          </div>
          <Button 
            type="submit"
            disabled={loading || !role.trim()}
            className="h-16 px-10 bg-foreground text-background hover:bg-foreground/90 rounded-none uppercase font-bold tracking-widest shadow-[4px_4px_0_var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--foreground)] transition-all flex items-center gap-3 text-lg"
          >
            {loading ? <BrainCircuit className="h-6 w-6 animate-pulse" /> : <Target className="h-6 w-6" />}
            {loading ? "Analyzing..." : "Compute Gaps"}
          </Button>
        </form>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-destructive/10 border-4 border-destructive p-6 font-mono font-bold text-destructive uppercase tracking-widest">
            ERROR: {error}
          </motion.div>
        )}

        {result && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Match Score */}
            <div className="col-span-1 bg-background border-4 border-foreground shadow-[8px_8px_0_var(--foreground)] p-8 flex flex-col items-center justify-center text-center">
              <h3 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter mb-6">Match Vector</h3>
              <div className="relative flex items-center justify-center">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-border" />
                  <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent"
                    strokeDasharray={80 * 2 * Math.PI}
                    strokeDashoffset={80 * 2 * Math.PI * (1 - (result.match_score || 0) / 100)}
                    className="text-foreground transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-[family-name:var(--font-black-ops)] text-5xl">{result.match_score || 0}%</span>
                </div>
              </div>
            </div>

            {/* Verification Breakdown */}
            <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
              
              <div className="bg-background border-4 border-foreground shadow-[8px_8px_0_var(--foreground)] p-6">
                <div className="flex items-center gap-3 mb-4 border-b-2 border-foreground pb-2">
                  <ShieldCheck className="h-6 w-6 text-green-600" />
                  <h3 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter text-green-600">Verified Matches</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {(result.verified_matches || []).length > 0 ? (
                    result.verified_matches.map((skill: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-green-600 text-white font-bold text-xs uppercase border-2 border-green-800">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="font-mono text-sm text-muted-foreground uppercase">No verified overlap detected.</span>
                  )}
                </div>
              </div>

              <div className="bg-background border-4 border-foreground shadow-[8px_8px_0_var(--foreground)] p-6">
                <div className="flex items-center gap-3 mb-4 border-b-2 border-foreground pb-2">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                  <h3 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter text-destructive">Identified Gaps</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {(result.missing_skills || []).length > 0 ? (
                    result.missing_skills.map((skill: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-destructive/10 text-destructive font-bold text-xs uppercase border-2 border-destructive">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="font-mono text-sm text-muted-foreground uppercase">100% Vector Match. No gaps found.</span>
                  )}
                </div>
              </div>
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
