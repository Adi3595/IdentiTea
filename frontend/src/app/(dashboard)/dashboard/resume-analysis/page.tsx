"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Target, ShieldCheck, AlertTriangle, Briefcase, ChevronRight } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import { CustomCursor } from "@/components/cursor"
import { Button } from "@/components/ui/button"

export default function ResumeAnalysisPage() {
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any>(null)
  const [error, setError] = useState("")
  
  const [loadingRecs, setLoadingRecs] = useState(true)

  useEffect(() => {
    // Automatically fetch general recommendations on load
    const fetchRecs = async () => {
      try {
        const data = await fetchWithAuth("/career/recommendations")
        setRecommendations(data.recommendations || data)
      } catch (err) {
        console.error("Failed to load recommendations", err)
      } finally {
        setLoadingRecs(false)
      }
    }
    fetchRecs()
  }, [])

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
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
    <div className="space-y-8 max-w-6xl mx-auto text-foreground">
      <CustomCursor />
      
      <div className="border-b-4 border-foreground pb-6 flex items-end justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-black-ops)] text-4xl md:text-5xl tracking-tighter uppercase flex items-center gap-4">
            <FileText className="h-10 w-10" /> Resume Analytics
          </h1>
          <p className="text-muted-foreground uppercase tracking-widest font-bold text-sm mt-2">AI-Powered Career Gap Analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Target Role Input & General Recommendations */}
        <div className="space-y-8">
          <div className="bg-background border-4 border-foreground shadow-[8px_8px_0_var(--foreground)] p-6">
            <h3 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter mb-4">Target Role</h3>
            <form onSubmit={handleAnalyze} className="flex flex-col gap-4">
              <input 
                type="text" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="E.G. DATA SCIENTIST" 
                className="w-full h-14 px-4 bg-background border-2 border-foreground outline-none font-bold font-mono uppercase tracking-widest focus:border-4 transition-all"
              />
              <Button 
                type="submit"
                disabled={loading || !role.trim()}
                className="h-14 w-full bg-foreground text-background hover:bg-foreground/90 rounded-none uppercase font-bold tracking-widest shadow-[4px_4px_0_var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--foreground)] transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Target className="h-5 w-5 animate-pulse" /> : <Target className="h-5 w-5" />}
                {loading ? "Analyzing..." : "Analyze Profile"}
              </Button>
            </form>
          </div>

          <div className="bg-background border-4 border-foreground shadow-[8px_8px_0_var(--foreground)] p-6">
            <h3 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter mb-4 flex items-center gap-2">
              <Briefcase className="h-6 w-6" /> AI Suggestions
            </h3>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-4 border-b-2 border-foreground pb-2">Based on your extracted graph</p>
            
            {loadingRecs ? (
              <div className="h-32 flex items-center justify-center font-mono font-bold uppercase animate-pulse">Calculating...</div>
            ) : (
              <div className="space-y-4">
                {recommendations?.length > 0 ? (
                  recommendations.map((rec: any, i: number) => (
                    <div 
                      key={i} 
                      className="group p-4 border-2 border-foreground cursor-pointer hover:bg-foreground hover:text-background transition-colors flex justify-between items-center"
                      onClick={() => {
                        setRole(rec.title);
                      }}
                    >
                      <div>
                        <h4 className="font-bold uppercase tracking-widest">{rec.title}</h4>
                        <span className="text-xs font-mono opacity-60">Match: {rec.match}</span>
                      </div>
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  ))
                ) : (
                  <p className="text-sm font-mono text-muted-foreground">Upload documents to unlock suggestions.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Analysis Results */}
        <div className="lg:col-span-2">
          {!result && !loading && !error && (
            <div className="h-full border-4 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center p-12 text-center text-muted-foreground bg-muted/10 min-h-[500px]">
              <Target className="h-16 w-16 mb-4 opacity-20" />
              <h3 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter mb-2">Awaiting Target</h3>
              <p className="text-xs uppercase tracking-widest font-bold opacity-50 max-w-[300px]">Enter a target role on the left to see how your current knowledge graph stacks up.</p>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border-4 border-destructive p-6 font-mono font-bold text-destructive uppercase tracking-widest h-full">
              ERROR: {error}
            </div>
          )}

          {loading && (
             <div className="h-full border-4 border-foreground flex flex-col items-center justify-center p-12 text-center text-foreground bg-background shadow-[8px_8px_0_var(--foreground)] min-h-[500px]">
             <Target className="h-16 w-16 mb-4 animate-spin-slow" />
             <h3 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter animate-pulse">Running Deep Analysis</h3>
             <p className="text-xs font-mono uppercase tracking-widest font-bold mt-2 text-muted-foreground">Vectorizing graph against industry standards...</p>
           </div>
          )}

          {result && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background border-4 border-foreground shadow-[12px_12px_0_var(--foreground)] p-8 h-full"
            >
              <div className="border-b-4 border-foreground pb-6 mb-8 flex flex-col md:flex-row gap-6 justify-between items-center">
                <div>
                  <p className="text-sm font-bold font-mono text-muted-foreground uppercase mb-1">Target Role Analysis</p>
                  <h2 className="font-[family-name:var(--font-black-ops)] text-4xl uppercase tracking-tighter">{result.target_role}</h2>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold font-mono text-muted-foreground uppercase">Match Score</span>
                    <span className="font-[family-name:var(--font-black-ops)] text-5xl">{result.readiness_score || result.match_score || 0}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {/* Verified Overlap */}
                <div>
                  <div className="flex items-center gap-3 mb-4 border-b-2 border-foreground pb-2">
                    <ShieldCheck className="h-6 w-6 text-green-600" />
                    <h3 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter text-green-600">Verified Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {result.current_skills_mapped > 0 ? (
                      <p className="font-mono text-sm uppercase font-bold text-foreground bg-green-600/10 p-4 border border-green-600 w-full">
                        Your Knowledge Graph actively supports {result.current_skills_mapped} core competencies required for this role.
                      </p>
                    ) : (
                      <span className="font-mono text-sm text-muted-foreground uppercase">No verified overlap detected in your graph.</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills / Gaps */}
                <div>
                  <div className="flex items-center gap-3 mb-4 border-b-2 border-foreground pb-2">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                    <h3 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter text-destructive">Skill Gaps (To Learn)</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {(result.missing_skills || []).length > 0 ? (
                      result.missing_skills.map((skill: string, i: number) => (
                        <span key={i} className="px-4 py-2 bg-destructive/10 text-destructive font-bold text-sm uppercase border-2 border-destructive shadow-[2px_2px_0_var(--destructive)]">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="font-mono text-sm text-foreground bg-green-600/20 p-4 border-2 border-green-600 uppercase font-bold w-full">
                        100% Vector Match. No major skill gaps found for this role!
                      </span>
                    )}
                  </div>
                </div>
              </div>

            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
