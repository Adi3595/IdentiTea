"use client"

import React, { useEffect, useState } from "react"
import { ShieldCheck, Network, Award, AppWindow, Loader2, Share2, Copy } from "lucide-react"
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/portfolio/public/${id}`)
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
      <Network className="h-12 w-12 mb-4 animate-spin-slow" />
      Synthesizing Portfolio Matrix...
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center font-mono uppercase tracking-widest text-destructive">
      Error: {error}
    </div>
  )

  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-16 selection:bg-foreground selection:text-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--foreground)_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto space-y-12 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header */}
        <header className="border-b-4 border-foreground pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-foreground text-background text-xs font-bold px-3 py-1 uppercase tracking-widest font-mono">
                Verified Cryptographic Identity
              </span>
              <ShieldCheck className="h-5 w-5 text-green-500" />
            </div>
            <h1 className="font-[family-name:var(--font-black-ops)] text-5xl md:text-7xl uppercase tracking-tighter">
              {portfolio.seo_meta?.title?.split(" | ")[0] || "Agent Zero"}
            </h1>
            <p className="text-xl font-bold uppercase tracking-widest mt-2">{portfolio.tagline}</p>
          </div>
          
          <button 
            onClick={copyLink}
            className="group flex items-center gap-2 border-2 border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors font-mono text-sm font-bold uppercase tracking-widest"
          >
            {copied ? <Copy className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            {copied ? "Copied!" : "Share Profile"}
          </button>
        </header>

        {/* Core Skills */}
        <section className="bg-foreground text-background shadow-[12px_12px_0_rgba(100,100,100,0.2)] p-8">
          <div className="flex items-center gap-4 mb-6 border-b-2 border-background/20 pb-4">
            <Network className="h-8 w-8" />
            <h2 className="font-[family-name:var(--font-black-ops)] text-3xl uppercase tracking-tighter">Core Competencies</h2>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {portfolio.core_skills?.map((skill: any, i: number) => (
              <div key={i} className="bg-background text-foreground px-4 py-2 font-bold uppercase tracking-widest border border-background shadow-[2px_2px_0_var(--background)]">
                {skill.name || skill.label}
              </div>
            ))}
            {!portfolio.core_skills?.length && (
              <p className="font-mono text-background/50">No extracted skills available.</p>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Projects */}
          <section className="bg-background border-4 border-foreground shadow-[8px_8px_0_var(--foreground)] p-8">
            <div className="flex items-center gap-3 mb-6 border-b-2 border-foreground pb-4">
              <AppWindow className="h-6 w-6" />
              <h2 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter">Featured Projects</h2>
            </div>
            
            <div className="space-y-6">
              {portfolio.highlight_projects?.map((proj: any, i: number) => (
                <div key={i} className="group border-l-4 border-foreground pl-4 hover:pl-6 transition-all">
                  <h3 className="font-bold uppercase tracking-widest text-lg">{proj.name || proj.label || "Untitled Project"}</h3>
                  <p className="font-mono text-xs text-muted-foreground mt-2 line-clamp-2">
                    {proj.description || "Self-reported project extracted from uploaded documents."}
                  </p>
                </div>
              ))}
              {!portfolio.highlight_projects?.length && (
                <p className="font-mono text-muted-foreground">No projects extracted.</p>
              )}
            </div>
          </section>

          {/* Certifications */}
          <section className="bg-background border-4 border-foreground shadow-[8px_8px_0_var(--foreground)] p-8">
            <div className="flex items-center gap-3 mb-6 border-b-2 border-foreground pb-4">
              <Award className="h-6 w-6" />
              <h2 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter">Certifications</h2>
            </div>
            
            <div className="space-y-6">
              {portfolio.certifications?.map((cert: any, i: number) => (
                <div key={i} className="group border-l-4 border-foreground pl-4 hover:pl-6 transition-all">
                  <h3 className="font-bold uppercase tracking-widest text-lg">{cert.name || cert.label || "Certificate"}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <span className="font-mono text-xs text-muted-foreground">Extracted Evidence</span>
                  </div>
                </div>
              ))}
              {!portfolio.certifications?.length && (
                <p className="font-mono text-muted-foreground">No certifications extracted.</p>
              )}
            </div>
          </section>
        </div>

        <footer className="pt-12 pb-4 text-center">
          <p className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Generated by MemoryVerse Knowledge Graph Engine
          </p>
        </footer>
      </div>
    </div>
  )
}
