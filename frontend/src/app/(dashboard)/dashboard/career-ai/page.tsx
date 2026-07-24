import { BrainCircuit, Send, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CareerAIPage() {
  return (
    <div className="h-[calc(100vh-8rem)] w-full max-w-5xl mx-auto flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="border-b-4 border-foreground pb-4 shrink-0 flex justify-between items-end">
        <div>
          <h1 className="font-[family-name:var(--font-black-ops)] text-4xl tracking-tighter uppercase">Career AI</h1>
          <p className="text-muted-foreground uppercase tracking-widest font-bold text-sm mt-1">Autonomous Graph Agent</p>
        </div>
        <div className="bg-foreground text-background font-bold uppercase tracking-widest text-xs px-3 py-1">
          v1.0.0
        </div>
      </div>

      <div className="flex-1 bg-background border-4 border-foreground shadow-[8px_8px_0_var(--foreground)] flex flex-col overflow-hidden relative">
        <div className="absolute top-0 w-full h-1 bg-foreground/10" />
        
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 bg-foreground flex items-center justify-center shrink-0">
              <BrainCircuit className="h-5 w-5 text-background" />
            </div>
            <div className="border-l-4 border-foreground pl-4 py-1">
              <p className="font-bold uppercase tracking-widest text-xs text-muted-foreground mb-2">System</p>
              <p className="font-mono text-sm leading-relaxed">
                Graph loaded. I have access to your timeline, 14 verified skills, and 3 documents. What would you like to analyze today?
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 flex-row-reverse text-right">
             <div className="h-10 w-10 bg-muted flex items-center justify-center shrink-0 border-2 border-foreground">
              <Terminal className="h-5 w-5 text-foreground" />
            </div>
            <div className="border-r-4 border-foreground pr-4 py-1">
              <p className="font-bold uppercase tracking-widest text-xs text-muted-foreground mb-2">You</p>
              <p className="font-mono text-sm leading-relaxed">
                Generate a summary of my ML experience for an AI Engineering role.
              </p>
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t-4 border-foreground bg-foreground/5">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Query your career graph..." 
              className="flex-1 bg-background border-2 border-foreground px-4 py-3 font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0_var(--foreground)] transition-shadow"
            />
            <Button className="rounded-none border-2 border-foreground bg-foreground text-background h-auto px-6">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
