"use client"

import React, { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UploadCloud, Terminal, FileText, CheckCircle2, XCircle } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import { CustomCursor } from "@/components/cursor"
import { Button } from "@/components/ui/button"

export default function DocumentsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [logs, setLogs] = useState<string[]>([])
  const [result, setResult] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toISOString().split('T')[1].split('.')[0]}] ${msg}`])
  }

  const handleUpload = async () => {
    if (!file) return
    setStatus("uploading")
    setLogs([])
    addLog(`INIT: Preparing upload for ${file.name} (${(file.size / 1024).toFixed(2)} KB)`)
    
    try {
      addLog(`MIME Check: ${file.type}`)
      if (!["application/pdf", "image/png", "image/jpeg"].includes(file.type)) {
        throw new Error("Unsupported file type. Please upload a PDF, PNG, or JPEG.")
      }

      addLog("NETWORK: Establishing secure link to /api/documents/upload...")
      const formData = new FormData()
      formData.append("file", file)

      // We bypass fetchWithAuth's default Content-Type so the browser sets the boundary correctly
      const token = await (await import("@/lib/firebase")).auth.currentUser?.getIdToken()
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/documents/upload`, {
        method: "POST",
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: formData
      })

      if (!response.ok) {
        let errStr = response.statusText
        try {
          const errData = await response.json()
          errStr = errData.detail || errStr
        } catch(e){}
        throw new Error(errStr)
      }

      const data = await response.json()
      addLog(`SUCCESS: Document ingested. Knowledge Graph updated.`)
      setResult(data)
      setStatus("success")
    } catch (err: any) {
      addLog(`FATAL: ${err.message}`)
      setStatus("error")
    }
  }

  return (
    <div className="space-y-8 max-w-4xl text-foreground">
      <CustomCursor />
      <div className="border-b-4 border-foreground pb-6">
        <h1 className="font-[family-name:var(--font-black-ops)] text-4xl md:text-5xl tracking-tighter uppercase">Document Ingestion</h1>
        <p className="text-muted-foreground uppercase tracking-widest font-bold text-sm mt-2">Upload resumes & certs to feed the Graph</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Upload Zone */}
        <div className="space-y-6">
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-4 border-dashed p-12 flex flex-col items-center justify-center text-center cursor-crosshair transition-all duration-300 ${
              isDragging ? "border-foreground bg-foreground/10 scale-[1.02]" : "border-muted-foreground hover:border-foreground"
            } ${status === "uploading" ? "opacity-50 pointer-events-none" : ""}`}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg"
            />
            {file ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                <FileText className="h-16 w-16 mb-4 text-foreground" />
                <h3 className="font-bold uppercase tracking-widest">{file.name}</h3>
                <p className="text-xs text-muted-foreground mt-2">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </motion.div>
            ) : (
              <>
                <UploadCloud className={`h-16 w-16 mb-4 ${isDragging ? "text-foreground animate-bounce" : "text-muted-foreground"}`} />
                <h3 className="font-bold uppercase tracking-widest mb-2 text-foreground">Drag & Drop Document</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">PDF, PNG, JPG up to 5MB</p>
              </>
            )}
          </div>

          <Button 
            disabled={!file || status === "uploading"} 
            onClick={handleUpload}
            className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 rounded-none uppercase font-bold tracking-widest shadow-[4px_4px_0_var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--foreground)] transition-all"
          >
            {status === "uploading" ? "Processing..." : "Initiate Extraction"}
          </Button>

          {status === "success" && (
            <div className="bg-green-500/10 border-2 border-green-500 p-4 text-green-500 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-bold uppercase tracking-widest text-sm">Ingestion Complete</span>
            </div>
          )}

          {status === "error" && (
            <div className="bg-destructive/10 border-2 border-destructive p-4 text-destructive flex items-center gap-3">
              <XCircle className="h-5 w-5" />
              <span className="font-bold uppercase tracking-widest text-sm">Ingestion Failed</span>
            </div>
          )}
        </div>

        {/* Pipeline Terminal Logs */}
        <div className="bg-foreground text-background border-4 border-foreground shadow-[8px_8px_0_var(--foreground)] p-6 h-[400px] flex flex-col font-mono">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-background/20">
            <Terminal className="h-5 w-5" />
            <h2 className="uppercase tracking-widest font-bold text-sm">Extraction Pipeline</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 text-xs">
            {logs.length === 0 && <p className="text-background/50">Awaiting input...</p>}
            <AnimatePresence>
              {logs.map((log, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className={log.includes("FATAL") ? "text-red-400" : log.includes("SUCCESS") ? "text-green-400" : ""}
                >
                  &gt; {log}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Structured Output Display */}
      {result && result.metadata && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 bg-background border-4 border-foreground shadow-[8px_8px_0_var(--foreground)] p-8"
        >
          <h2 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter mb-6 border-b-2 border-foreground pb-4">
            Parsed Knowledge Nodes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold uppercase tracking-widest text-sm text-muted-foreground mb-4">Extracted Skills</h3>
              <div className="flex flex-wrap gap-2">
                {result.metadata.skills?.map((skill: any, i: number) => (
                  <span key={i} className="px-3 py-1 bg-foreground text-background font-bold text-xs uppercase border border-foreground">
                    {skill.name} <span className="opacity-50">({(skill.confidence * 100).toFixed(0)}%)</span>
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold uppercase tracking-widest text-sm text-muted-foreground mb-4">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {result.metadata.technologies?.map((tech: any, i: number) => (
                  <span key={i} className="px-3 py-1 bg-background text-foreground font-bold text-xs uppercase border-2 border-foreground">
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
