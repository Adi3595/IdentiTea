import { FileText, Upload, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockDocs = [
  { name: "Frontend_Resume_2026.pdf", status: "Parsed", date: "2026-07-22", nodes: 14 },
  { name: "Stanford_Transcript.pdf", status: "Parsed", date: "2026-07-21", nodes: 8 },
  { name: "AWS_Certificate_Advanced.pdf", status: "Parsed", date: "2026-07-20", nodes: 3 },
]

export default function DocumentsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex justify-between items-end border-b-4 border-foreground pb-6">
        <div>
          <h1 className="font-[family-name:var(--font-black-ops)] text-4xl tracking-tighter uppercase">Source Documents</h1>
          <p className="text-muted-foreground uppercase tracking-widest font-bold text-sm mt-2">Knowledge Graph Inputs</p>
        </div>
        
        <Button className="rounded-none border-2 border-foreground bg-foreground text-background font-bold uppercase tracking-widest shadow-[4px_4px_0_var(--foreground)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all gap-2 h-auto py-3">
          <Upload className="h-4 w-4" /> Ingest Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDocs.map((doc, i) => (
          <div key={i} className="bg-background border-4 border-foreground shadow-[8px_8px_0_var(--foreground)] p-6 flex flex-col justify-between group">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="bg-foreground/5 p-3 border-2 border-foreground">
                  <FileText className="h-6 w-6 text-foreground" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-green-500 bg-green-500/10 px-2 py-1 border border-green-500/20">
                  <CheckCircle2 className="h-3 w-3" /> {doc.status}
                </div>
              </div>
              <h3 className="font-bold text-sm truncate mb-2" title={doc.name}>{doc.name}</h3>
              <p className="font-mono text-xs text-muted-foreground mb-4">Ingested: {doc.date}</p>
            </div>
            
            <div className="flex items-center justify-between border-t-2 border-foreground pt-4 mt-2">
              <span className="font-[family-name:var(--font-black-ops)] text-xl">{doc.nodes} Nodes</span>
              <Button variant="ghost" size="icon" className="hover:bg-destructive/10 hover:text-destructive rounded-none">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <div className="border-4 border-dashed border-muted-foreground/30 bg-muted-foreground/5 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted-foreground/10 transition-colors min-h-[250px]">
          <Upload className="h-8 w-8 text-muted-foreground mb-4" />
          <p className="font-bold uppercase tracking-widest text-sm text-foreground mb-1">Upload Source</p>
          <p className="text-xs text-muted-foreground">PDF, JSON, or TXT</p>
        </div>
      </div>
    </div>
  )
}
