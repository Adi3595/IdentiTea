"use client"
import { Share2, Globe, Eye, Code, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function PortfolioPage() {
  const [uid, setUid] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const publicUrl = uid ? `${origin}/portfolio/${uid}` : "Loading...";
  
  const handleCopy = () => {
    if (!uid) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const handlePreview = () => {
    if (!uid) return;
    window.open(publicUrl, "_blank");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="border-b-4 border-foreground pb-6">
        <h1 className="font-[family-name:var(--font-black-ops)] text-4xl tracking-tighter uppercase">Public Portfolio</h1>
        <p className="text-muted-foreground uppercase tracking-widest font-bold text-sm mt-2">Publish your Knowledge Graph</p>
      </div>

      <div className="bg-background border-4 border-foreground shadow-[12px_12px_0_var(--foreground)] p-8">
        
        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 bg-foreground flex items-center justify-center shrink-0">
            <Globe className="h-8 w-8 text-background" />
          </div>
          <div>
            <h2 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter">Live Domain</h2>
            <p className="font-mono text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" /> Published and routing.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="font-bold uppercase tracking-widest text-xs text-muted-foreground mb-2">Public URL</p>
            <div className="flex flex-col sm:flex-row items-stretch">
              <code className="flex-1 bg-foreground/5 border-2 border-foreground sm:border-r-0 px-4 py-3 text-sm font-mono truncate">
                {publicUrl}
              </code>
              <Button 
                onClick={handleCopy}
                disabled={!uid}
                className="rounded-none border-2 border-foreground bg-foreground text-background font-bold uppercase tracking-widest h-auto py-3 w-32"
              >
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Share2 className="h-4 w-4 mr-2" />} 
                {copied ? "Copied" : "Share"}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t-2 border-border">
            <Button 
              onClick={handlePreview}
              disabled={!uid}
              variant="outline" 
              className="rounded-none border-2 border-foreground h-auto py-4 flex flex-col gap-2 items-center justify-center hover:bg-foreground hover:text-background"
            >
              <Eye className="h-5 w-5" />
              <span className="font-bold uppercase tracking-widest text-xs">Preview</span>
            </Button>
            <Button variant="outline" className="rounded-none border-2 border-foreground h-auto py-4 flex flex-col gap-2 items-center justify-center hover:bg-foreground hover:text-background">
              <Code className="h-5 w-5" />
              <span className="font-bold uppercase tracking-widest text-xs">Embed API</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
