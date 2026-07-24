import { Settings, ShieldAlert, Key, DownloadCloud, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="border-b-4 border-foreground pb-6">
        <h1 className="font-[family-name:var(--font-black-ops)] text-4xl tracking-tighter uppercase">System Config</h1>
        <p className="text-muted-foreground uppercase tracking-widest font-bold text-sm mt-2">Node Parameters & Security</p>
      </div>

      <div className="space-y-8">
        
        {/* Security & Access */}
        <section>
          <h2 className="font-[family-name:var(--font-black-ops)] text-xl uppercase tracking-widest mb-4 flex items-center gap-2 border-l-4 border-foreground pl-3">
            <Key className="h-5 w-5" /> Access Control
          </h2>
          <div className="bg-background border-4 border-foreground shadow-[8px_8px_0_var(--foreground)] p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-bold uppercase tracking-widest text-sm mb-1">Local Encryption Key</h3>
                <p className="font-mono text-xs text-muted-foreground">Export your vault's private key. Keep this safe.</p>
              </div>
              <Button variant="outline" className="rounded-none border-2 border-foreground uppercase font-bold tracking-widest text-xs h-auto py-3">
                Export Key
              </Button>
            </div>
          </div>
        </section>

        {/* Data Ownership */}
        <section>
          <h2 className="font-[family-name:var(--font-black-ops)] text-xl uppercase tracking-widest mb-4 flex items-center gap-2 border-l-4 border-foreground pl-3">
            <DownloadCloud className="h-5 w-5" /> Data Sovereignty
          </h2>
          <div className="bg-background border-4 border-foreground shadow-[8px_8px_0_var(--foreground)] p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-bold uppercase tracking-widest text-sm mb-1">Export Graph Topology</h3>
                <p className="font-mono text-xs text-muted-foreground">Download your entire knowledge graph as JSON.</p>
              </div>
              <Button variant="outline" className="rounded-none border-2 border-foreground uppercase font-bold tracking-widest text-xs h-auto py-3">
                Export JSON
              </Button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section>
          <h2 className="font-[family-name:var(--font-black-ops)] text-xl uppercase tracking-widest mb-4 flex items-center gap-2 border-l-4 border-destructive text-destructive pl-3">
            <ShieldAlert className="h-5 w-5" /> Danger Zone
          </h2>
          <div className="bg-destructive/5 border-4 border-destructive shadow-[8px_8px_0_hsl(var(--destructive))] p-6 space-y-6">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-bold uppercase tracking-widest text-sm mb-1 text-destructive">Nuke Vault</h3>
                <p className="font-mono text-xs text-destructive/80">Permanently delete your account, graph, and all source documents. This cannot be undone.</p>
              </div>
              <Button variant="destructive" className="rounded-none border-2 border-destructive uppercase font-bold tracking-widest text-xs h-auto py-3 shadow-[4px_4px_0_hsl(var(--destructive))] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                <Trash2 className="h-4 w-4 mr-2" /> Delete Account
              </Button>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
