"use client"

import React, { useEffect, useState } from "react"
import { ShieldCheck, Network, Award, AppWindow, Loader2, Share2, Copy, ExternalLink, UserCircle, GraduationCap, Briefcase } from "lucide-react"
import { useParams } from "next/navigation"

export default function PublicPortfolioPage() {
  const params = useParams()
  const id = params.id as string

  const [portfolio, setPortfolio] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/portfolio/public/${id}`)
        if (!response.ok) throw new Error("Portfolio not found")
        const data = await response.json()
        setPortfolio(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    if (id) fetchPortfolio()
  }, [id])

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center font-mono uppercase tracking-widest animate-pulse">
      <Network className="h-12 w-12 mb-4 animate-spin-slow text-primary" />
      Synthesizing Vault...
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center font-mono uppercase tracking-widest text-destructive">
      Error: {error}
    </div>
  )

  const profile = portfolio.profile || {}
  const name = profile.name || "Agent Zero"
  const tagline = profile.tagline || portfolio.tagline || "Dynamic Knowledge Worker"

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background relative overflow-x-hidden font-mono">
      
      {/* Dynamic Glowing Mesh Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse mix-blend-screen" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-foreground/5 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-24 space-y-24">
        
        {/* HERO SECTION */}
        <header className="animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-8">
          <div className="inline-flex items-center gap-2 bg-foreground/10 backdrop-blur-md border border-foreground/20 px-4 py-2 rounded-full">
            <ShieldCheck className="h-4 w-4 text-green-400" />
            <span className="text-xs font-bold uppercase tracking-widest">Verified Identity</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="font-[family-name:var(--font-black-ops)] text-5xl md:text-8xl uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/80 to-foreground/50">
              {name}
            </h1>
            <p className="text-xl md:text-3xl font-bold uppercase tracking-widest text-muted-foreground">{tagline}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button 
              onClick={copyLink}
              className="flex items-center gap-2 bg-foreground text-background px-6 py-3 font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {copied ? <Copy className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              {copied ? "Copied!" : "Share Profile"}
            </button>
            
            {profile.linkedin_url && (
              <a 
                href={profile.linkedin_url} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 bg-transparent border-2 border-foreground/30 px-6 py-3 font-bold uppercase tracking-widest text-sm hover:border-foreground transition-colors backdrop-blur-sm"
              >
                <ExternalLink className="h-4 w-4" /> Connect
              </a>
            )}
          </div>
        </header>

        {/* ABOUT & EDUCATION */}
        {(profile.bio || profile.education) && (
          <section className="grid md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 fill-mode-both">
            {profile.bio && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b-2 border-foreground/20 pb-4">
                  <UserCircle className="h-6 w-6" />
                  <h2 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter">About</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  {profile.bio}
                </p>
              </div>
            )}
            
            {profile.education && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b-2 border-foreground/20 pb-4">
                  <GraduationCap className="h-6 w-6" />
                  <h2 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter">Education</h2>
                </div>
                <div className="bg-foreground/5 border border-foreground/10 p-6 backdrop-blur-sm rounded-lg">
                  <p className="font-bold uppercase tracking-widest">{profile.education}</p>
                </div>
              </div>
            )}
          </section>
        )}

        {/* CORE SKILLS */}
        <section className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
          <div className="flex items-center gap-3 border-b-2 border-foreground/20 pb-4 mb-8">
            <Network className="h-6 w-6" />
            <h2 className="font-[family-name:var(--font-black-ops)] text-2xl md:text-4xl uppercase tracking-tighter">Core Competencies</h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {portfolio.core_skills?.map((skill: any, i: number) => (
              <div 
                key={i} 
                className="group relative bg-background/50 backdrop-blur-md border border-foreground/20 px-4 py-2 hover:border-foreground transition-all hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="font-bold uppercase tracking-widest text-sm relative z-10">
                  {skill.name || skill.label}
                </span>
              </div>
            ))}
            {!portfolio.core_skills?.length && (
              <p className="text-muted-foreground text-sm uppercase tracking-widest">Analyzing vectors... No skills published yet.</p>
            )}
          </div>
        </section>

        {/* HIGHLIGHTED PROJECTS */}
        <section className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 fill-mode-both">
          <div className="flex items-center gap-3 border-b-2 border-foreground/20 pb-4 mb-8">
            <AppWindow className="h-6 w-6" />
            <h2 className="font-[family-name:var(--font-black-ops)] text-2xl md:text-4xl uppercase tracking-tighter">Highlighted Projects</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.highlight_projects?.map((project: any, i: number) => (
              <div 
                key={i} 
                className="group relative bg-background/40 backdrop-blur-lg border border-foreground/20 p-6 hover:border-foreground hover:bg-foreground/5 transition-all hover:-translate-y-2 flex flex-col justify-between min-h-[200px]"
              >
                <div>
                  <h3 className="font-[family-name:var(--font-black-ops)] text-xl uppercase tracking-tighter mb-3">
                    {project.name || project.label}
                  </h3>
                  {project.description && (
                    <p className="text-muted-foreground text-xs leading-relaxed mb-4 line-clamp-3">
                      {project.description}
                    </p>
                  )}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-foreground/50 group-hover:text-foreground transition-colors flex items-center gap-2">
                  <Briefcase className="h-3 w-3" /> Proof of Work
                </div>
              </div>
            ))}
            {!portfolio.highlight_projects?.length && (
              <div className="col-span-full border border-dashed border-foreground/20 p-12 text-center text-muted-foreground text-sm uppercase tracking-widest backdrop-blur-sm">
                No projects verified in graph yet.
              </div>
            )}
          </div>
        </section>

        {/* CERTIFICATIONS */}
        {portfolio.certifications?.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700 fill-mode-both pb-24">
            <div className="flex items-center gap-3 border-b-2 border-foreground/20 pb-4 mb-8">
              <Award className="h-6 w-6" />
              <h2 className="font-[family-name:var(--font-black-ops)] text-2xl md:text-4xl uppercase tracking-tighter">Certifications & Awards</h2>
            </div>
            
            <div className="space-y-4">
              {portfolio.certifications.map((cert: any, i: number) => (
                <div key={i} className="flex items-center gap-4 bg-background/30 backdrop-blur-sm border border-foreground/10 p-4 hover:bg-foreground/5 hover:border-foreground/30 transition-all">
                  <div className="h-10 w-10 bg-foreground/10 rounded flex items-center justify-center shrink-0">
                    <Award className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase tracking-widest text-sm">{cert.name || cert.label}</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Verified Credential</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}
