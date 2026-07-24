"use client"
import { useState } from "react"
import { Target, Loader2, ArrowRight, BookOpen, Code, Trophy, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchWithAuth } from "@/lib/api"

interface SuggestionData {
  analysis: string;
  courses: { title: string; platform: string; reason: string }[];
  projects: { title: string; description: string; skills_to_learn: string[] }[];
  hackathons: { title: string; focus: string }[];
}

export default function CareerPage() {
  const [goal, setGoal] = useState("")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<SuggestionData | null>(null)
  const [error, setError] = useState("")

  const handleSuggest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!goal) return
    
    setLoading(true)
    setError("")
    
    try {
      const response = await fetchWithAuth("/career/suggest", {
        method: "POST",
        body: JSON.stringify({ goal })
      })
      setData(response)
    } catch (err: any) {
      setError(err.message || "Failed to generate suggestions")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-foreground">
      
      <div className="border-b-4 border-foreground pb-6">
        <h1 className="font-[family-name:var(--font-black-ops)] text-4xl tracking-tighter uppercase">Career Development</h1>
        <p className="text-muted-foreground uppercase tracking-widest font-bold text-sm mt-2">AI-Driven Path Synthesis</p>
      </div>

      <div className="bg-background border-4 border-foreground p-8 shadow-[8px_8px_0_var(--foreground)]">
        <div className="flex items-center gap-3 mb-6">
          <Target className="h-8 w-8" />
          <h2 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter">Set Career Target</h2>
        </div>
        
        <form onSubmit={handleSuggest} className="flex flex-col sm:flex-row items-stretch gap-4">
          <Input 
            placeholder="e.g. Senior React Developer, Web3 Security Auditor" 
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="flex-1 border-2 border-foreground rounded-none font-mono text-sm h-12"
          />
          <Button 
            disabled={loading || !goal}
            type="submit"
            className="rounded-none border-2 border-foreground bg-foreground text-background font-bold uppercase tracking-widest h-12 px-8 shadow-[4px_4px_0_var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Zap className="h-5 w-5 mr-2" />}
            {loading ? "" : "Analyze"}
          </Button>
        </form>
        {error && <p className="text-red-500 font-bold mt-4 font-mono text-sm">{error}</p>}
      </div>

      {data && (
        <div className="space-y-8 animate-in fade-in duration-700">
          
          <div className="bg-foreground text-background p-6 font-mono border-l-4 border-yellow-400">
            <h3 className="font-bold uppercase tracking-widest text-yellow-400 mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4" /> AI Analysis
            </h3>
            <p className="leading-relaxed">{data.analysis}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="space-y-4">
              <h3 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter flex items-center gap-2 border-b-2 border-foreground pb-2">
                <BookOpen className="h-6 w-6" /> Recommended Courses
              </h3>
              {data.courses.map((course, i) => (
                <div key={i} className="bg-background border-2 border-foreground p-4 group hover:bg-foreground/5 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold uppercase tracking-widest text-sm leading-tight">{course.title}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-foreground text-background shrink-0 ml-2">
                      {course.platform}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">{course.reason}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter flex items-center gap-2 border-b-2 border-foreground pb-2">
                <Code className="h-6 w-6" /> Project Ideas
              </h3>
              {data.projects.map((proj, i) => (
                <div key={i} className="bg-background border-2 border-foreground p-4 group hover:bg-foreground/5 transition-colors">
                  <h4 className="font-bold uppercase tracking-widest text-sm mb-2">{proj.title}</h4>
                  <p className="font-mono text-xs text-muted-foreground mb-3">{proj.description}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {proj.skills_to_learn.map((skill, j) => (
                      <span key={j} className="text-[10px] font-bold uppercase tracking-widest border border-foreground/30 px-2 py-1">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-4 md:col-span-2">
              <h3 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter flex items-center gap-2 border-b-2 border-foreground pb-2">
                <Trophy className="h-6 w-6" /> Target Hackathon
              </h3>
              {data.hackathons.map((hack, i) => (
                <div key={i} className="bg-background border-2 border-foreground p-6 group flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                  <div>
                    <h4 className="font-bold uppercase tracking-widest text-lg mb-1">{hack.title}</h4>
                    <p className="font-mono text-sm text-muted-foreground">{hack.focus}</p>
                  </div>
                  <Button variant="outline" className="shrink-0 rounded-none border-2 border-foreground uppercase font-bold tracking-widest text-xs h-auto py-3">
                    Find Events <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
