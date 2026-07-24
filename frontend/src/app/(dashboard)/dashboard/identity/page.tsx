"use client"
import { ShieldCheck, Fingerprint, Lock, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";

export default function IdentityPage() {
  const [profile, setProfile] = useState<{user_id: string, email: string} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await fetchWithAuth("/users/profile");
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="border-b-4 border-foreground pb-6">
        <h1 className="font-[family-name:var(--font-black-ops)] text-4xl tracking-tighter uppercase">Cryptographic Identity</h1>
        <p className="text-muted-foreground uppercase tracking-widest font-bold text-sm mt-2">Decentralized Identifier (DID)</p>
      </div>

      <div className="bg-background border-4 border-foreground shadow-[8px_8px_0_var(--foreground)] p-8">
        <div className="flex items-start justify-between border-b-2 border-foreground pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-foreground flex items-center justify-center">
              <Fingerprint className="h-8 w-8 text-background" />
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase">Agent Zero</h2>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">
                <ShieldCheck className="h-4 w-4 text-green-500" /> Identity Verified
              </div>
            </div>
          </div>
          <div className="text-right">
             <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">Network</p>
             <p className="font-bold uppercase tracking-widest text-sm border-2 border-foreground px-2 py-1 inline-block">Polygon Mainnet</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="font-bold uppercase tracking-widest text-xs text-muted-foreground mb-2">Public DID / Auth UID</p>
              <div className="flex items-center">
                <code className="flex-1 bg-foreground/5 border-2 border-foreground border-r-0 px-4 py-3 text-sm font-mono break-all">
                  {profile?.user_id || "Not connected"}
                </code>
                <Button variant="outline" className="border-2 border-foreground h-auto py-3 px-4 rounded-none hover:bg-foreground hover:text-background"
                  onClick={() => profile?.user_id && navigator.clipboard.writeText(profile.user_id)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <p className="font-bold uppercase tracking-widest text-xs text-muted-foreground mb-2">Primary Identifier (Email)</p>
              <div className="flex items-center">
                <code className="flex-1 bg-foreground/5 border-2 border-foreground border-r-0 px-4 py-3 text-sm font-mono break-all">
                  {profile?.email || "No email available"}
                </code>
                <Button variant="outline" className="border-2 border-foreground h-auto py-3 px-4 rounded-none hover:bg-foreground hover:text-background"
                  onClick={() => profile?.email && navigator.clipboard.writeText(profile.email)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

