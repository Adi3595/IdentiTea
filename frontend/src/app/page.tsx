"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowRight, UploadCloud, FileText, Network, Sparkles, BrainCircuit, CheckCircle2, Quote, MousePointer2, GitCommit, ShieldCheck, Target, TerminalSquare, Lock, User, Briefcase, GraduationCap, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fadeIn, float, pulse } from "@/lib/animations"
import { MilkyAurora } from "@/components/milky-aurora"
import { CustomCursor } from "@/components/cursor"
import { useRef, useState } from "react"

export default function LandingPage() {
  const containerRef = useRef(null)
  
  // Use Case Tabs State
  const [activeTab, setActiveTab] = useState(0)
  const tabs = [
    { name: "Students", desc: "Turn raw coursework and side projects into verifiable skills for your first job. The graph finds connections you didn't know you had." },
    { name: "Professionals", desc: "Connect 10 years of scattered promotions, performance reviews, and certifications into one living, undeniable portfolio." },
    { name: "Switchers", desc: "Highlight transferable skills across entirely different industries. Prove that your background translates perfectly to the new role." }
  ]

  return (
    <div ref={containerRef} className="min-h-screen bg-background selection:bg-primary/10 relative overflow-x-hidden text-foreground">
      <CustomCursor />
      <MilkyAurora />

      {/* Sticky Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b-4 border-foreground"
      >
        <div className="flex items-center justify-between h-16 px-4 md:px-8 max-w-screen-2xl mx-auto">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/logo.svg" alt="IdentiTea Logo" className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-[family-name:var(--font-black-ops)] text-2xl md:text-3xl tracking-tight text-foreground">
              IdentiTea
            </span>
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-semibold text-muted-foreground">
            <Link href="#problem" className="hover:text-foreground transition-colors">The Problem</Link>
            <Link href="#usecases" className="hover:text-foreground transition-colors">Use Cases</Link>
            <Link href="#engine" className="hover:text-foreground transition-colors">Evidence Engine</Link>
            <Link href="#security" className="hover:text-foreground transition-colors">Security Vault</Link>
          </nav>
          <div className="flex gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" className="font-semibold hover:bg-foreground/5 hover:-translate-y-0.5 transition-all">Log In</Button>
            </Link>
            <Link href="/sign-up">
              <Button className="font-semibold px-6 bg-foreground text-background hover:bg-foreground/90">Get Early Access</Button>
            </Link>
          </div>
        </div>
      </motion.header>

      <main className="relative pt-[60px] z-10">
        
        {/* 1. Hero Section - Edge-to-Edge Grid */}
        <section 
          className="relative pt-10 pb-12 px-4 md:px-8 border-b-4 border-foreground overflow-hidden"
          style={{ background: "linear-gradient(135deg, var(--background) 0%, rgba(15,11,10,0.03) 50%, var(--background) 100%)" }}
        >
          
          {/* Floating Spheres / Circulars Effect */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* The Anchor (Massive, bottom right, bleeding off edge) */}
            <motion.div animate={{ y: [0, -30, 0], x: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }} className="absolute bottom-[-5%] right-[-5%] w-32 h-32 rounded-full shadow-[0_8px_30px_rgba(15,11,10,0.4)]" style={{ background: "radial-gradient(circle at 30% 30%, var(--background) 0%, var(--foreground) 50%)" }} />
            
            {/* High Medium Floater (Top right - Shrunk) */}
            <motion.div animate={{ y: [0, 20, 0], x: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }} className="absolute top-[12%] right-[15%] w-6 h-6 rounded-full shadow-[0_4px_15px_rgba(15,11,10,0.3)]" style={{ background: "radial-gradient(circle at 30% 30%, var(--background) 0%, var(--foreground) 50%)" }} />
            
            {/* The Text Straddler (Drifting behind title gap) */}
            <motion.div animate={{ y: [0, -15, 0], x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 2 }} className="absolute top-[38%] left-[22%] w-6 h-6 rounded-full shadow-[0_2px_10px_rgba(15,11,10,0.3)]" style={{ background: "radial-gradient(circle at 30% 30%, var(--background) 0%, var(--foreground) 50%)" }} />
            
            {/* Distant Mid-layer Floater */}
            <motion.div animate={{ y: [0, 10, 0], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 0.5 }} className="absolute top-[25%] left-[55%] w-8 h-8 rounded-full shadow-[0_2px_8px_rgba(15,11,10,0.2)]" style={{ background: "radial-gradient(circle at 30% 30%, var(--background) 0%, var(--foreground) 50%)" }} />

            {/* Tiny Orbiters (Dust/Debris effect for depth) */}
            <motion.div animate={{ y: [0, -10, 0], x: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1.5 }} className="absolute top-[8%] left-[8%] w-3 h-3 rounded-full shadow-[0_2px_5px_rgba(15,11,10,0.3)]" style={{ background: "radial-gradient(circle at 30% 30%, var(--background) 0%, var(--foreground) 50%)" }} />
            <motion.div animate={{ y: [0, 15, 0], x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 9, ease: "easeInOut", delay: 2.5 }} className="absolute bottom-[28%] left-[45%] w-4 h-4 rounded-full shadow-[0_2px_5px_rgba(15,11,10,0.3)]" style={{ background: "radial-gradient(circle at 30% 30%, var(--background) 0%, var(--foreground) 50%)" }} />
            <motion.div animate={{ y: [0, -12, 0], x: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.8 }} className="absolute bottom-[15%] right-[25%] w-5 h-5 rounded-full shadow-[0_2px_5px_rgba(15,11,10,0.3)]" style={{ background: "radial-gradient(circle at 30% 30%, var(--background) 0%, var(--foreground) 50%)" }} />
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Typography & CTA (Spans 12 cols so the button reaches the right edge) */}
            <motion.div 
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0 }
                }
              }}
              className="md:col-span-12"
            >

              
              <motion.h1 
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 } }
                }}
                className="font-[family-name:var(--font-black-ops)] text-[14vw] md:text-[12vw] lg:text-[12rem] xl:text-[15rem] tracking-tighter leading-[0.85] text-foreground mb-12 [text-shadow:15px_15px_0_rgba(15,11,10,0.15),30px_30px_0_rgba(15,11,10,0.05)] relative z-20 -ml-1 md:-ml-2 lg:-ml-3"
              >
                Escape<br />
                Folders.
              </motion.h1>
              <div className="flex flex-col md:flex-row md:items-center justify-between w-full mb-12">
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1.2 } }
                  }}
                  className="max-w-md"
                >
                  <h3 className="font-bold text-foreground text-sm uppercase tracking-widest mb-4">
                    The Living Graph
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Your professional identity is more than a 1-page PDF. Connect your resumes, projects, and certifications into a verifiable, living portfolio.
                  </p>
                </motion.div>
                
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.4 } }
                  }}
                >
                  <Link href="/sign-up" className="shrink-0 block">
                    <Button className="rounded-none h-16 px-8 text-sm font-bold uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 transition-all group flex items-center gap-4">
                      Start Building <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>


          </div>
        </section>

        {/* 2. Integrations Marquee - Brutalist solid borders */}
        <section className="py-8 bg-background border-b-4 border-foreground overflow-hidden flex items-center">
          <div className="max-w-7xl mx-auto w-full px-6 flex items-center gap-12">
            <span className="text-xs font-bold tracking-widest uppercase text-foreground shrink-0 border-r-2 border-foreground pr-8">Connects With</span>
            <div className="flex-1 overflow-hidden relative">
              <div className="flex gap-24 animate-[marquee_20s_linear_infinite] whitespace-nowrap text-foreground">
                <span className="font-black text-2xl tracking-tighter">GITHUB</span>
                <span className="font-black text-2xl tracking-tighter">LINKEDIN</span>
                <span className="font-black text-2xl tracking-tighter">COURSERA</span>
                <span className="font-black text-2xl tracking-tighter">AWS</span>
                <span className="font-black text-2xl tracking-tighter">UDEMY</span>
                <span className="font-black text-2xl tracking-tighter">GITHUB</span>
                <span className="font-black text-2xl tracking-tighter">LINKEDIN</span>
                <span className="font-black text-2xl tracking-tighter">COURSERA</span>
                <span className="font-black text-2xl tracking-tighter">AWS</span>
                <span className="font-black text-2xl tracking-tighter">UDEMY</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Chaos vs Clarity - Pure Editorial Split */}
        <section id="problem" className="scroll-mt-20 pt-10 pb-12 bg-background border-b-4 border-foreground">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-12 mb-16 text-center">
              <h2 className="text-sm font-bold tracking-widest uppercase text-foreground mb-4">The Problem & The Solution</h2>
            </div>
            
            {/* Chaos Left (Spans 5 cols) */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="md:col-span-5 flex flex-col justify-center"
            >
              <h3 className="text-4xl font-[family-name:var(--font-black-ops)] tracking-tight mb-8 -ml-1 md:-ml-2 lg:-ml-3">Escape the folders.</h3>
              <div className="space-y-6">
                <div className="border-t border-border pt-6 group hover:pl-2 transition-all duration-300 cursor-default">
                  <p className="font-bold mb-2 group-hover:text-foreground transition-colors">Scattered Identity</p>
                  <p className="text-muted-foreground leading-relaxed">Your career is currently fragmented across unnamed PDFs, Google Docs, and forgotten GitHub repositories.</p>
                </div>
                <div className="border-t border-border pt-6 group hover:pl-2 transition-all duration-300 cursor-default">
                  <p className="font-bold mb-2 group-hover:text-foreground transition-colors">Unverifiable Claims</p>
                  <p className="text-muted-foreground leading-relaxed">Anyone can write "Python" on a resume. There is no cryptographic proof connecting your claim to actual work.</p>
                </div>
                <div className="border-t border-border pt-6 border-b pb-6 group hover:pl-2 transition-all duration-300 cursor-default">
                  <p className="font-bold mb-2 group-hover:text-foreground transition-colors">Stagnant Updates</p>
                  <p className="text-muted-foreground leading-relaxed">You only update your resume when looking for a job, missing months of valuable micro-achievements.</p>
                </div>
              </div>
            </motion.div>
            
            {/* Divider (Spans 2 cols) */}
            <div className="hidden md:flex md:col-span-2 justify-center items-center">
              <div className="w-[4px] h-full bg-foreground" />
            </div>

            {/* Clarity Right (Spans 5 cols) */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="md:col-span-5 flex flex-col justify-center"
            >
              <h3 className="text-4xl font-[family-name:var(--font-black-ops)] tracking-tight mb-8 -ml-1 md:-ml-2 lg:-ml-3">Absolute clarity.</h3>
              <div className="space-y-6">
                <div className="border-t border-border pt-6">
                  <p className="font-bold mb-2 text-foreground">Connected Knowledge Graph</p>
                  <p className="text-muted-foreground leading-relaxed">Upload once. Watch as every certification and project forms a seamless web of your true professional value.</p>
                </div>
                <div className="border-t border-border pt-6">
                  <p className="font-bold mb-2 text-foreground">Evidence-Backed Skills</p>
                  <p className="text-muted-foreground leading-relaxed">Every node in your graph is mathematically linked to the source document, providing absolute truth to recruiters.</p>
                </div>
                <div className="border-t border-border pt-6 border-b pb-6">
                  <p className="font-bold mb-2 text-foreground">Living Portfolio</p>
                  <p className="text-muted-foreground leading-relaxed">Drop a new certification into the platform and the graph autonomously updates your identity and readiness score.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 4. Use Cases (Typographic Tabs on Strict Grid) */}
        <section id="usecases" className="scroll-mt-20 pt-10 pb-12 bg-background border-b-4 border-foreground">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Heading + Tabs (Spans 5 cols) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="md:col-span-5 flex flex-col border-r border-border pr-8"
            >
              <div className="mb-16">
                <h2 className="text-5xl font-[family-name:var(--font-black-ops)] tracking-tight mb-6 -ml-1 md:-ml-2 lg:-ml-3">Built for every <br/>career stage.</h2>
                <p className="text-xl text-muted-foreground">Your identity evolves. So does your graph.</p>
              </div>
              
              <div className="flex flex-col">
                {tabs.map((tab, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveTab(i)}
                    className={`text-left py-6 border-b transition-colors group flex items-center justify-between ${activeTab === i ? 'text-foreground border-foreground' : 'text-muted-foreground border-border hover:text-foreground'}`}
                  >
                    <h3 className="font-[family-name:var(--font-black-ops)] text-2xl tracking-tight">{tab.name}</h3>
                    <ArrowRight className={`h-5 w-5 transition-transform ${activeTab === i ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-50'}`} />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Tab Content (Spans 6 cols, 1 col gutter) */}
            <div className="md:col-span-6 md:col-start-7 flex flex-col justify-start min-h-[300px]">
               <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-4xl font-[family-name:var(--font-black-ops)] mb-8">{tabs[activeTab].name} Graph Layout</h3>
                    <p className="text-2xl text-muted-foreground leading-relaxed mb-12">{tabs[activeTab].desc}</p>
                    <div className="h-64 border-4 border-foreground bg-background flex items-center justify-center shadow-[8px_8px_0_rgba(15,11,10,1)]">
                       <span className="text-muted-foreground font-mono text-sm uppercase tracking-widest">[ Abstract Visualization specific to {tabs[activeTab].name} ]</span>
                    </div>
                  </motion.div>
               </AnimatePresence>
            </div>
          </div>
        </section>

        {/* 5. Evidence Engine - Text & Answer Format */}
        <section id="engine" className="scroll-mt-20 pt-10 pb-12 bg-background border-b-4 border-foreground">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="md:col-span-5"
            >
              <h2 className="text-5xl font-[family-name:var(--font-black-ops)] tracking-tight mb-8 leading-[1.1] -ml-1 md:-ml-2 lg:-ml-3">The Evidence <br/>Engine.</h2>
              <p className="text-xl text-muted-foreground leading-relaxed mb-12">
                How IdentiTea transforms a static resume into a verified, living graph without relying on black-box AI.
              </p>
              
              {/* Brutalist Data Terminal filling the empty space */}
              <div className="border-4 border-foreground bg-foreground p-6 shadow-[8px_8px_0_rgba(15,11,10,0.15)] transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-background/20">
                  <TerminalSquare className="text-background h-5 w-5" />
                  <span className="text-background font-mono text-sm uppercase tracking-widest font-bold">Extraction.log</span>
                </div>
                <pre className="text-background/90 font-mono text-sm leading-relaxed overflow-x-hidden">
                  <span className="text-primary-foreground/50">01</span> <span className="text-green-400">MERGE</span> (u:User)<br/>
                  <span className="text-primary-foreground/50">02</span> <span className="text-green-400">MERGE</span> (s:Skill {"{"}name: 'Python'{"}"})<br/>
                  <span className="text-primary-foreground/50">03</span> <span className="text-green-400">MERGE</span> (u)-[r:HAS_SKILL]-&gt;(s)<br/>
                  <span className="text-primary-foreground/50">04</span> <span className="text-blue-300">SET</span> r.confidence = 0.98<br/>
                  <span className="text-primary-foreground/50">05</span> <br/>
                  <span className="text-primary-foreground/50">06</span> <span className="text-yellow-400">&gt; SUCCESS: Node generated from PDF</span>
                </pre>
              </div>
            </motion.div>
            
            <div className="md:col-span-5 md:col-start-8 flex flex-col">
               {/* Item 1 */}
               <div className="border-t border-border py-8">
                  <h3 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-4">
                     <span className="bg-foreground text-background px-2 py-1 font-mono text-sm uppercase tracking-widest">Question</span>
                     How is data extracted?
                  </h3>
                  <div className="pl-[88px]">
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      Our NLP parsing engine ingests your PDFs and automatically extracts concrete skills, timelines, and measurable achievements. No manual data entry required.
                    </p>
                  </div>
               </div>
               
               {/* Item 2 */}
               <div className="border-t border-border py-8">
                  <h3 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-4">
                     <span className="bg-foreground text-background px-2 py-1 font-mono text-sm uppercase tracking-widest">Question</span>
                     Is the data verifiable?
                  </h3>
                  <div className="pl-[88px]">
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      Yes. Every extracted skill becomes a node. Edges are drawn linking that skill directly back to the exact paragraph in the source document, providing cryptographic truth to recruiters.
                    </p>
                  </div>
               </div>

               {/* Item 3 */}
               <div className="border-t border-border py-8 border-b">
                  <h3 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-4">
                     <span className="bg-foreground text-background px-2 py-1 font-mono text-sm uppercase tracking-widest">Question</span>
                     How do I match jobs?
                  </h3>
                  <div className="pl-[88px]">
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      We generate vector embeddings of your entire graph and calculate cosine similarity against real job descriptions to provide an undeniable Readiness Score.
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* 6. Security Vault - Brutalist borders */}
        <section id="security" className="scroll-mt-20 pt-10 pb-12 bg-background text-foreground overflow-hidden relative border-b-4 border-foreground">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="md:col-span-6 flex flex-col justify-center"
            >
              <Lock className="h-12 w-12 text-foreground mb-8" />
              <h2 className="text-6xl font-[family-name:var(--font-black-ops)] tracking-tight mb-8 -ml-1 md:-ml-2 lg:-ml-3">Your data.<br/>Your vault.</h2>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-md">
                IdentiTea does not train on your personal career data. Everything is encrypted, vector-stored securely, and entirely owned by you.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="md:col-span-6 border-4 border-foreground bg-background h-[400px] flex flex-col justify-end p-12 shadow-[12px_12px_0_rgba(15,11,10,1)] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[20px_20px_0_rgba(15,11,10,1)] transition-all duration-300 cursor-default"
            >
               <p className="font-mono text-sm text-foreground font-bold uppercase tracking-widest mb-4">Encryption Log</p>
               <div className="space-y-2 font-mono text-xs text-muted-foreground">
                  <p>&gt; Encrypting user_graph_payload...</p>
                  <p>&gt; Storing embeddings in isolated vector space...</p>
                  <p className="text-foreground font-bold">&gt; Status: Secure</p>
               </div>
            </motion.div>
          </div>
        </section>

        {/* 7. Massive Typographic CTA */}
        <section className="pt-10 pb-12 bg-background border-b-4 border-foreground">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-12 text-center flex flex-col items-center"
            >
              <h2 className="text-6xl md:text-[8rem] font-[family-name:var(--font-black-ops)] tracking-tighter mb-8 leading-[0.9] -ml-1 md:-ml-2 lg:-ml-3">
                Ready for <br/>clarity?
              </h2>
              <p className="text-2xl text-muted-foreground mb-12 max-w-2xl font-medium tracking-tight">
                Join the beta today and transform your scattered files into a living, intelligent career identity.
              </p>
              
              <Link href="/sign-up">
                <Button className="h-20 px-12 text-2xl font-[family-name:var(--font-black-ops)] bg-foreground text-background hover:bg-foreground/90 rounded-none transition-all shadow-[8px_8px_0_rgba(15,11,10,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_rgba(15,11,10,1)] flex items-center gap-4">
                  Create Your Graph <ArrowUpRight className="h-8 w-8" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* 8. The Mega Footer - Light Mode Aligned */}
      <footer className="relative bg-background border-t-4 border-foreground text-foreground pt-20 pb-12 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-8 group w-fit">
              <img src="/logo.svg" alt="IdentiTea Logo" className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-[family-name:var(--font-black-ops)] text-2xl md:text-3xl tracking-tight text-foreground">
                IdentiTea
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Your career, connected. We transform scattered professional files into a structured, living knowledge graph.
            </p>
          </div>
          
          <div className="md:col-span-2 md:col-start-7">
            <h4 className="font-bold mb-8 text-xs uppercase tracking-widest text-foreground">Platform</h4>
            <ul className="space-y-6 text-sm text-muted-foreground font-medium">
              <li><Link href="#engine" className="inline-block hover:text-foreground hover:underline underline-offset-4 hover:translate-x-1 transition-all duration-300">Evidence Engine</Link></li>
              <li><Link href="#problem" className="inline-block hover:text-foreground hover:underline underline-offset-4 hover:translate-x-1 transition-all duration-300">The Problem</Link></li>
              <li><Link href="#usecases" className="inline-block hover:text-foreground hover:underline underline-offset-4 hover:translate-x-1 transition-all duration-300">Use Cases</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="font-bold mb-8 text-xs uppercase tracking-widest text-foreground">Company</h4>
            <ul className="space-y-6 text-sm text-muted-foreground font-medium">
              <li><Link href="/about" className="inline-block hover:text-foreground hover:underline underline-offset-4 hover:translate-x-1 transition-all duration-300">About Us</Link></li>
              <li><Link href="/careers" className="inline-block hover:text-foreground hover:underline underline-offset-4 hover:translate-x-1 transition-all duration-300">Careers</Link></li>
              <li><Link href="/contact" className="inline-block hover:text-foreground hover:underline underline-offset-4 hover:translate-x-1 transition-all duration-300">Contact</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="font-bold mb-8 text-xs uppercase tracking-widest text-foreground">Social</h4>
            <ul className="space-y-6 text-sm text-muted-foreground font-medium">
              <li><Link href="#" className="inline-block hover:text-foreground hover:underline underline-offset-4 hover:translate-x-1 transition-all duration-300">Twitter / X</Link></li>
              <li><Link href="https://github.com/Adi3595/IdentiTea" target="_blank" className="inline-block hover:text-foreground hover:underline underline-offset-4 hover:translate-x-1 transition-all duration-300">GitHub</Link></li>
              <li><Link href="/privacy" className="inline-block hover:text-foreground hover:underline underline-offset-4 hover:translate-x-1 transition-all duration-300">Privacy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 border-t border-border pt-8">
          <p className="text-sm text-muted-foreground font-medium">
            © {new Date().getFullYear()} IdentiTea Inc.
          </p>
        </div>
      </footer>
    </div>
  )
}
