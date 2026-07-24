import { Globe, GitBranch, Network, Link as LinkIcon, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const integrations = [
  { name: "GitHub", icon: GitBranch, status: "Connected", desc: "Syncs repositories, commits, and PRs." },
  { name: "LinkedIn", icon: Network, status: "Disconnected", desc: "Syncs employment history and endorsements." },
  { name: "Web3 Wallet", icon: Globe, status: "Disconnected", desc: "Required for decentralized identity publishing." },
]

export default function IntegrationsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="border-b-4 border-foreground pb-6">
        <h1 className="font-[family-name:var(--font-black-ops)] text-4xl tracking-tighter uppercase">Integrations</h1>
        <p className="text-muted-foreground uppercase tracking-widest font-bold text-sm mt-2">External Data Sources</p>
      </div>

      <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 flex items-start gap-4">
        <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold uppercase tracking-widest text-sm text-yellow-700 dark:text-yellow-500">Security Notice</h3>
          <p className="font-mono text-xs text-muted-foreground mt-1">
            OAuth tokens are encrypted at rest using your local key. We cannot access your external accounts without your active session.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((int, i) => (
          <div key={i} className="bg-background border-4 border-foreground p-6 flex flex-col justify-between group hover:bg-foreground/5 transition-colors">
            <div>
              <div className="flex justify-between items-start mb-6">
                <int.icon className="h-8 w-8 text-foreground" />
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 border ${
                  int.status === "Connected" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-muted text-muted-foreground border-border"
                }`}>
                  {int.status}
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-black-ops)] text-xl uppercase tracking-tighter mb-2">{int.name}</h3>
              <p className="font-mono text-xs text-muted-foreground mb-6 leading-relaxed">{int.desc}</p>
            </div>
            
            <Button 
              variant={int.status === "Connected" ? "outline" : "default"} 
              className={`rounded-none w-full uppercase font-bold tracking-widest text-xs h-auto py-3 ${
                int.status === "Connected" ? "border-2 border-foreground" : "bg-foreground text-background shadow-[4px_4px_0_var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              }`}
            >
              <LinkIcon className="h-3 w-3 mr-2" /> {int.status === "Connected" ? "Configure" : "Connect"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
