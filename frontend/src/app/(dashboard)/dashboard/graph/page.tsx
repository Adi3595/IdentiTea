import { Network, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GraphPage() {
  return (
    <div className="h-[calc(100vh-8rem)] w-full flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex justify-between items-end border-b-4 border-foreground pb-4 shrink-0">
        <div>
          <h1 className="font-[family-name:var(--font-black-ops)] text-4xl tracking-tighter uppercase">Knowledge Graph</h1>
          <p className="text-muted-foreground uppercase tracking-widest font-bold text-sm mt-1">3D Topology Representation</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-none border-2 border-foreground hover:bg-foreground hover:text-background"><ZoomIn className="h-4 w-4"/></Button>
          <Button variant="outline" size="icon" className="rounded-none border-2 border-foreground hover:bg-foreground hover:text-background"><ZoomOut className="h-4 w-4"/></Button>
          <Button variant="outline" size="icon" className="rounded-none border-2 border-foreground hover:bg-foreground hover:text-background"><Maximize className="h-4 w-4"/></Button>
        </div>
      </div>

      <div className="flex-1 border-4 border-foreground shadow-[8px_8px_0_var(--foreground)] relative overflow-hidden bg-foreground/5 flex items-center justify-center group cursor-crosshair">
        
        {/* Graph Placeholder Grid */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        
        <div className="relative z-10 flex flex-col items-center justify-center p-8 bg-background border-4 border-foreground shadow-[16px_16px_0_var(--foreground)] transition-transform group-hover:scale-105">
          <Network className="h-16 w-16 mb-6 text-foreground" />
          <h2 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter mb-2">Graph Engine Offline</h2>
          <p className="font-mono text-sm text-muted-foreground">Awaiting WebGL context from backend.</p>
        </div>

      </div>
    </div>
  )
}
