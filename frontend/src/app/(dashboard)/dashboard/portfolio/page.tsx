"use client"
import { Share2, Globe, Eye, Code, Check, UserCircle, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { fetchWithAuth } from "@/lib/api";

export default function PortfolioPage() {
  const [uid, setUid] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");
  
  const [profile, setProfile] = useState({
    name: "",
    tagline: "",
    bio: "",
    education: ""
  });
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    setOrigin(window.location.origin);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      if (!uid) return;
      try {
        const data = await fetchWithAuth("/users/settings");
        if (data && data.profile) {
          setProfile({
            name: data.profile.name || "",
            tagline: data.profile.tagline || "",
            bio: data.profile.bio || "",
            education: data.profile.education || ""
          });
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      } finally {
        setLoadingProfile(false);
      }
    }
    loadSettings();
  }, [uid]);

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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetchWithAuth("/users/settings", {
        method: "POST",
        body: JSON.stringify({ profile })
      });
      // Optionally show a success toast here
    } catch (err) {
      console.error("Failed to save profile", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      
      <div className="border-b-4 border-foreground pb-6">
        <h1 className="font-[family-name:var(--font-black-ops)] text-4xl tracking-tighter uppercase">Public Portfolio</h1>
        <p className="text-muted-foreground uppercase tracking-widest font-bold text-sm mt-2">Publish your Knowledge Graph</p>
      </div>

      <div className="bg-background border-4 border-foreground shadow-[12px_12px_0_var(--foreground)] p-8 mb-8">
        
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

      <div className="bg-background border-4 border-foreground shadow-[12px_12px_0_var(--foreground)] p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 bg-foreground flex items-center justify-center shrink-0">
            <UserCircle className="h-8 w-8 text-background" />
          </div>
          <div>
            <h2 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter">Profile Configuration</h2>
            <p className="font-mono text-sm text-muted-foreground mt-1">Customize your public identity</p>
          </div>
        </div>

        {loadingProfile ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8" /></div>
        ) : (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-bold uppercase tracking-widest text-xs">Full Name</label>
                <Input 
                  value={profile.name}
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  className="rounded-none border-2 border-foreground font-mono" 
                  placeholder="e.g. Satoshi Nakamoto" 
                />
              </div>
              <div className="space-y-2">
                <label className="font-bold uppercase tracking-widest text-xs">Tagline</label>
                <Input 
                  value={profile.tagline}
                  onChange={e => setProfile({...profile, tagline: e.target.value})}
                  className="rounded-none border-2 border-foreground font-mono" 
                  placeholder="e.g. Decentralized Engineer" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-bold uppercase tracking-widest text-xs">Education</label>
              <Input 
                value={profile.education}
                onChange={e => setProfile({...profile, education: e.target.value})}
                className="rounded-none border-2 border-foreground font-mono" 
                placeholder="e.g. B.S. Computer Science, Stanford University" 
              />
            </div>

            <div className="space-y-2">
              <label className="font-bold uppercase tracking-widest text-xs">About Me (Bio)</label>
              <Textarea 
                value={profile.bio}
                onChange={e => setProfile({...profile, bio: e.target.value})}
                className="rounded-none border-2 border-foreground font-mono min-h-[120px]" 
                placeholder="Write a brief professional summary..." 
              />
            </div>

            <Button 
              type="submit" 
              disabled={saving}
              className="w-full rounded-none border-2 border-foreground bg-foreground text-background font-bold uppercase tracking-widest h-auto py-4 shadow-[4px_4px_0_var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              {saving ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Save className="h-5 w-5 mr-2" />}
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        )}
      </div>

    </div>
  )
}
