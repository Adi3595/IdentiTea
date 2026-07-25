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
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<any>(null)

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
    if (graphRef.current) {
      // Increase repulsion so nodes don't overlap as much
      graphRef.current.d3Force('charge').strength(-400);
      graphRef.current.d3Force('link').distance(100);
    }
  }, [graphData]);

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

  const getNodeColor = (node: any) => {
    const type = node.type || node.target_type;
    switch (type) {
      case "Skill": return "#ef4444"; // red-500
      case "Project": return "#3b82f6"; // blue-500
      case "Document": return "#10b981"; // emerald-500
      case "Certificate": return "#f59e0b"; // amber-500
      case "Internship": return "#8b5cf6"; // violet-500
      case "User": return "#0f0b0a"; // foreground
      default: return "#6b7280"; // gray-500
    }
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col gap-6 text-foreground relative">
      <CustomCursor />
      <div className="border-b-4 border-foreground pb-6 shrink-0 flex items-end justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-black-ops)] text-4xl md:text-5xl tracking-tighter uppercase flex items-center gap-4">
            <Network className="h-10 w-10 text-foreground" /> Knowledge Graph
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
              ref={graphRef}
              width={dimensions.width}
              height={dimensions.height}
              graphData={graphData}
              dagMode="radialout"
              dagLevelDistance={80}
              nodeLabel="label"
              nodeColor={getNodeColor}
              nodeRelSize={7}
              linkColor={() => "rgba(100, 100, 100, 0.4)"}
              linkDirectionalArrowLength={3.5}
              linkDirectionalArrowRelPos={1}
              linkDirectionalParticles={2}
              linkDirectionalParticleSpeed={(d: any) => 0.005}
              linkDirectionalParticleWidth={2}
              backgroundColor="transparent"
              linkCurvature={0.25}
              onNodeClick={(node) => setSelectedNode(node)}
              onBackgroundClick={() => setSelectedNode(null)}
              nodeCanvasObject={(node: any, ctx, globalScale) => {
                const label = node.label || node.target_name || node.id;
                const fontSize = 14/globalScale;
                const isSelected = selectedNode && selectedNode.id === node.id;
                
                // Draw Selection Glow
                if (isSelected) {
                  ctx.beginPath();
                  ctx.arc(node.x, node.y, 10, 0, 2 * Math.PI, false);
                  ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // Slight dark glow for light mode
                  ctx.fill();
                  ctx.lineWidth = 2;
                  ctx.strokeStyle = getNodeColor(node);
                  ctx.stroke();
                }

                // Draw circle
                ctx.beginPath();
                ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI, false);
                ctx.fillStyle = getNodeColor(node);
                ctx.fill();
                
                // Draw text
                ctx.font = `bold ${fontSize}px Inter, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = isSelected ? getNodeColor(node) : '#0f0b0a';
                ctx.fillText(label, node.x, node.y + 14);
              }}
            />
          </div>
        )}
      </div>

      {/* Side Panel */}
      <div 
        className={`absolute top-28 right-8 bottom-8 w-80 bg-background border-4 border-foreground shadow-[-8px_8px_0_var(--foreground)] transition-transform duration-300 ease-in-out z-20 flex flex-col ${selectedNode ? "translate-x-0" : "translate-x-[120%]"}`}
      >
        <div className="p-4 border-b-2 border-foreground flex justify-between items-center bg-foreground text-background">
          <h2 className="font-[family-name:var(--font-black-ops)] uppercase tracking-widest text-lg">Node Details</h2>
          <button onClick={() => setSelectedNode(null)} className="hover:opacity-70 font-mono text-sm font-bold">[X]</button>
        </div>
        
        {selectedNode && (
          <div className="p-6 space-y-6 overflow-y-auto">
            <div>
              <p className="text-xs font-bold font-mono text-muted-foreground uppercase mb-1">Entity Name</p>
              <h3 className="text-xl font-bold uppercase">{selectedNode.label || selectedNode.id}</h3>
            </div>
            
            <div>
              <p className="text-xs font-bold font-mono text-muted-foreground uppercase mb-1">Entity Type</p>
              <span 
                className="px-2 py-1 text-xs font-bold uppercase text-white" 
                style={{ backgroundColor: getNodeColor(selectedNode) }}
              >
                {selectedNode.type || selectedNode.target_type || "Unknown"}
              </span>
            </div>

            <div className="pt-4 border-t-2 border-dashed border-muted-foreground/30">
              <p className="text-xs font-bold font-mono text-muted-foreground uppercase mb-2">Connected Relationships</p>
              <div className="space-y-2">
                {graphData.links
                  .filter(l => (l.source.id || l.source) === selectedNode.id || (l.target.id || l.target) === selectedNode.id)
                  .map((l: any, i: number) => {
                    const isSource = (l.source.id || l.source) === selectedNode.id;
                    const connectedNodeId = isSource ? (l.target.id || l.target) : (l.source.id || l.source);
                    const connectedNode = graphData.nodes.find(n => n.id === connectedNodeId);
                    
                    return (
                      <div key={i} className="text-xs font-mono p-2 bg-muted/20 border border-muted-foreground/20">
                        <span className="text-muted-foreground">{isSource ? "Outgoing:" : "Incoming:"}</span> <br/>
                        <span className="font-bold text-foreground">{l.label}</span> {isSource ? "→" : "←"} {connectedNode?.label || connectedNodeId}
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
