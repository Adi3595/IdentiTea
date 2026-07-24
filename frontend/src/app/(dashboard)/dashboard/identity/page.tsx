"use client"
import { ShieldCheck, Fingerprint, Lock, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";

export default function IdentityPage() {
  const [profile, setProfile] = useState<{user_id: string, email: string} | null>(null);
  const [scoreData, setScoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const [profileRes, scoreRes] = await Promise.all([
          fetchWithAuth("/users/profile"),
          fetchWithAuth("/users/identity-score")
        ]);
        setProfile(profileRes);
        setScoreData(scoreRes);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-foreground">
      
      <div className="border-b-4 border-foreground pb-6">
        <h1 className="font-[family-name:var(--font-black-ops)] text-4xl tracking-tighter uppercase">Cryptographic Identity</h1>
        <p className="text-muted-foreground uppercase tracking-widest font-bold text-sm mt-2">Decentralized Identifier (DID)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Identity Card */}
        <div className="md:col-span-2 bg-background border-4 border-foreground shadow-[8px_8px_0_var(--foreground)] p-8">
          <div className="flex flex-col md:flex-row items-start justify-between border-b-2 border-foreground pb-6 mb-6 gap-6">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 bg-foreground flex items-center justify-center shrink-0">
                <Fingerprint className="h-10 w-10 text-background" />
              </div>
              <div>
                <h2 className="font-[family-name:var(--font-black-ops)] text-3xl uppercase">{profile?.email?.split('@')[0] || "Agent Zero"}</h2>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">
                  <ShieldCheck className="h-4 w-4 text-green-500" /> Identity Verified
                </div>
              </div>
            </div>
            <div className="text-left md:text-right">
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">Network</p>
              <p className="font-bold uppercase tracking-widest text-sm border-2 border-foreground px-2 py-1 inline-block">Polygon Mainnet</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-foreground" />
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

        {/* Identity Score Card */}
        <div className="bg-background border-4 border-foreground shadow-[8px_8px_0_var(--foreground)] p-8 flex flex-col justify-between">
          <div>
            <h3 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter mb-2">Trust Score</h3>
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-6">Calculated via Graph Metrics</p>
            
            {loading ? (
               <Loader2 className="h-8 w-8 animate-spin text-foreground mx-auto my-12" />
            ) : (
              <div className="flex flex-col items-center">
                <div className="relative flex items-center justify-center mb-8">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-border" />
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent"
                      strokeDasharray={70 * 2 * Math.PI}
                      strokeDashoffset={70 * 2 * Math.PI * (1 - (scoreData?.score || 0) / 100)}
                      className="text-foreground transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-[family-name:var(--font-black-ops)] text-5xl">{scoreData?.score || 0}</span>
                  </div>
                </div>

                <div className="w-full space-y-3">
                  <div className="flex justify-between items-center text-sm font-mono border-b border-foreground/10 pb-1">
                    <span className="text-muted-foreground">Extracted Skills</span>
                    <span className="font-bold">{scoreData?.metrics?.skills_count || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-mono border-b border-foreground/10 pb-1">
                    <span className="text-muted-foreground">Extracted Projects</span>
                    <span className="font-bold">{scoreData?.metrics?.projects_count || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-mono border-b border-foreground/10 pb-1">
                    <span className="text-muted-foreground">Graph Verifications</span>
                    <span className="font-bold">{scoreData?.metrics?.verifications_count || 0}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

