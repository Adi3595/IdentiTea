"use client"

import React, { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { fetchWithAuth } from "@/lib/api"
import { CustomCursor } from "@/components/cursor"
import { Network, Search } from "lucide-react"

// Dynamically import to avoid window is not defined during SSR
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false })

export default function GraphPage() {
  const [graphData, setGraphData] = useState<{nodes: any[], links: any[]}>({ nodes: [], links: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Resize observer
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current
      setDimensions({ width: clientWidth, height: clientHeight })
      
      const handleResize = () => {
        if (containerRef.current) {
          setDimensions({ width: containerRef.current.clientWidth, height: containerRef.current.clientHeight })
        }
      }
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [containerRef])

  useEffect(() => {
    const loadGraph = async () => {
      try {
        const data = await fetchWithAuth("/graph")
        
        // Data format mapping (if backend returns slightly different edge keys)
        const nodes = data.nodes || []
        const links = (data.edges || []).map((e: any) => ({
          source: e.source || e.source_id,
          target: e.target || e.target_id,
          label: e.label || e.relationship
        }))

        setGraphData({ nodes, links })
      } catch (err: any) {
        setError(err.message || "Failed to load graph")
      } finally {
        setLoading(false)
      }
    }
    loadGraph()
  }, [])

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-[calc(100vh-100px)] flex flex-col text-foreground">
      <CustomCursor />
      <div className="border-b-4 border-foreground pb-6 shrink-0 flex items-end justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-black-ops)] text-4xl md:text-5xl tracking-tighter uppercase flex items-center gap-4">
            <Network className="h-10 w-10" /> Knowledge Graph
          </h1>
          <p className="text-muted-foreground uppercase tracking-widest font-bold text-sm mt-2">Interactive Structural Web</p>
        </div>
        
        <div className="hidden md:flex items-center border-2 border-foreground bg-background px-4 py-2 w-64 shadow-[4px_4px_0_var(--foreground)]">
          <Search className="h-4 w-4 mr-2" />
          <input 
            type="text" 
            placeholder="SEARCH NODES..." 
            className="bg-transparent border-none outline-none text-xs font-bold font-mono w-full uppercase"
          />
        </div>
      </div>

      <div 
        ref={containerRef} 
        className="flex-1 bg-background border-4 border-foreground shadow-[12px_12px_0_var(--foreground)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--foreground)_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05] pointer-events-none" />
        
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center font-mono font-bold uppercase tracking-widest animate-pulse z-10">
            <Network className="h-12 w-12 mb-4 animate-spin-slow" />
            Resolving Edges...
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center font-mono font-bold uppercase tracking-widest text-destructive z-10">
            Error: {error}
          </div>
        )}

        {!loading && !error && (
          <div className="w-full h-full cursor-grab active:cursor-grabbing">
            <ForceGraph2D
              width={dimensions.width}
              height={dimensions.height}
              graphData={graphData}
              nodeLabel="label"
              nodeColor={(node: any) => {
                if (node.type === "person" || node.label === "You") return "#ef4444" // red
                if (node.type === "skill" || node.target_type === "Skill") return "#3b82f6" // blue
                if (node.type === "tech" || node.target_type === "Technology") return "#eab308" // yellow
                if (node.target_type === "Project") return "#22c55e" // green
                return "#0f0b0a"
              }}
              nodeRelSize={6}
              linkColor={() => "#d6d3d1"}
              linkDirectionalArrowLength={3.5}
              linkDirectionalArrowRelPos={1}
              backgroundColor="transparent"
              linkCurvature={0.25}
              nodeCanvasObject={(node: any, ctx, globalScale) => {
                const label = node.label || node.target_name || node.id;
                const fontSize = 12/globalScale;
                ctx.font = `bold ${fontSize}px Inter, sans-serif`;
                
                // Draw circle
                ctx.beginPath();
                ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI, false);
                ctx.fillStyle = node.color || "#0f0b0a";
                ctx.fill();
                
                // Draw text
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#0f0b0a';
                ctx.fillText(label, node.x, node.y + 12);
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
