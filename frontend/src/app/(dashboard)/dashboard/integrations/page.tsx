"use client"
import { Globe, GitBranch, Network, Link as LinkIcon, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { fetchWithAuth } from "@/lib/api";

const initialIntegrations = [
  { id: "github", name: "GitHub", icon: GitBranch, status: "Disconnected", desc: "Syncs repositories, commits, and PRs." },
  { id: "linkedin", name: "LinkedIn", icon: Network, status: "Disconnected", desc: "Syncs employment history and endorsements." },
  { id: "web3", name: "Web3 Wallet", icon: Globe, status: "Disconnected", desc: "Required for decentralized identity publishing." },
]

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [showInputFor, setShowInputFor] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleConnect = async (id: string) => {
    if (id === "github") {
      if (showInputFor !== "github") {
        setShowInputFor("github");
        return;
      }
      
      if (!usernameInput) {
        setErrorMsg("Please enter a username");
        return;
      }
      
      setConnectingId(id);
      setErrorMsg("");
      
      try {
        await fetchWithAuth("/integrations/github", {
          method: "POST",
          body: JSON.stringify({ username: usernameInput })
        });
        
        setIntegrations(prev => prev.map(int => 
          int.id === id ? { ...int, status: "Connected" } : int
        ));
        setShowInputFor(null);
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to sync GitHub");
      } finally {
        setConnectingId(null);
      }
    } else {
      // Mock for other integrations
      setConnectingId(id);
      setTimeout(() => {
        setIntegrations(prev => prev.map(int => 
          int.id === id ? { ...int, status: "Connected" } : int
        ));
        setConnectingId(null);
      }, 2000);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-foreground">
      
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
        {integrations.map((int, i) => {
          const isConnecting = connectingId === int.id;
          const isConnected = int.status === "Connected";
          const showInput = showInputFor === int.id;
          
          return (
          <div key={i} className="bg-background border-4 border-foreground p-6 flex flex-col justify-between group hover:bg-foreground/5 transition-colors">
            <div>
              <div className="flex justify-between items-start mb-6">
                <int.icon className="h-8 w-8 text-foreground" />
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 border ${
                  isConnected ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-muted text-muted-foreground border-border"
                }`}>
                  {int.status}
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-black-ops)] text-xl uppercase tracking-tighter mb-2">{int.name}</h3>
              <p className="font-mono text-xs text-muted-foreground mb-4 leading-relaxed">{int.desc}</p>
              
              {showInput && (
                <div className="mb-4">
                  <Input 
                    placeholder="Enter GitHub Username" 
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="border-2 border-foreground rounded-none font-mono text-sm"
                  />
                  {errorMsg && <p className="text-red-500 text-xs mt-2 font-bold">{errorMsg}</p>}
                </div>
              )}
            </div>
            
            <Button 
              disabled={isConnecting}
              onClick={() => !isConnected && handleConnect(int.id)}
              variant={isConnected ? "outline" : "default"} 
              className={`rounded-none w-full uppercase font-bold tracking-widest text-xs h-auto py-3 ${
                isConnected ? "border-2 border-foreground" : "bg-foreground text-background shadow-[4px_4px_0_var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              }`}
            >
              {isConnecting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
              ) : (
                <LinkIcon className="h-3 w-3 mr-2" />
              )}
              {isConnecting ? "Syncing..." : isConnected ? "Configure" : showInput ? "Confirm Sync" : "Connect"}
            </Button>
          </div>
        )})}
      </div>
    </div>
  )
}
