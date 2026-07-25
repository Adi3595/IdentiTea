"use client"
import { Settings, ShieldAlert, Key, DownloadCloud, Trash2, UserCircle, Save, Loader2, Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { fetchWithAuth } from "@/lib/api";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  
  const [profile, setProfile] = useState({
    name: "",
    tagline: "",
    bio: "",
    education: ""
  });
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saveStatus, setSaveStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Mount theme safely
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
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
        if (data) {
          if (data.profile) {
            setProfile({
              name: data.profile.name || "",
              tagline: data.profile.tagline || "",
              bio: data.profile.bio || "",
              education: data.profile.education || ""
            });
          }
          if (data.linkedin_url) setLinkedinUrl(data.linkedin_url);
          if (data.github_url) setGithubUrl(data.github_url);
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      } finally {
        setLoadingProfile(false);
      }
    }
    loadSettings();
  }, [uid]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveStatus(null);
    try {
      await fetchWithAuth("/users/settings", {
        method: "POST",
        body: JSON.stringify({ 
          profile,
          linkedin_url: linkedinUrl,
          github_url: githubUrl
        })
      });
      setSaveStatus({ type: 'success', message: 'Profile saved successfully!' });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      console.error("Failed to save profile", err);
      setSaveStatus({ type: 'error', message: err.message || 'Failed to save profile. Ensure database is setup.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      
      <div className="border-b-4 border-foreground pb-6">
        <h1 className="font-[family-name:var(--font-black-ops)] text-4xl tracking-tighter uppercase">System Config</h1>
        <p className="text-muted-foreground uppercase tracking-widest font-bold text-sm mt-2">Node Parameters & Security</p>
      </div>

      <div className="space-y-8">

        {/* Theme Settings */}
        <section>
          <h2 className="font-[family-name:var(--font-black-ops)] text-xl uppercase tracking-widest mb-4 flex items-center gap-2 border-l-4 border-foreground pl-3">
            <Settings className="h-5 w-5" /> Interface Theme
          </h2>
          <div className="bg-background border-4 border-foreground shadow-[8px_8px_0_var(--foreground)] p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-bold uppercase tracking-widest text-sm mb-1">Visual Mode</h3>
                <p className="font-mono text-xs text-muted-foreground">Adjust the platform's visual interface.</p>
              </div>
              
              {mounted ? (
                <div className="flex bg-foreground/10 p-1 border-2 border-foreground">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${theme === 'light' ? 'bg-foreground text-background' : 'hover:bg-foreground/10'}`}
                  >
                    <Sun className="h-4 w-4" /> Light
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${theme === 'dark' ? 'bg-foreground text-background' : 'hover:bg-foreground/10'}`}
                  >
                    <Moon className="h-4 w-4" /> Dark
                  </button>
                  <button 
                    onClick={() => setTheme('system')}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${theme === 'system' ? 'bg-foreground text-background' : 'hover:bg-foreground/10'}`}
                  >
                    <Monitor className="h-4 w-4" /> System
                  </button>
                </div>
              ) : (
                <div className="h-[44px] w-[300px] bg-foreground/10 animate-pulse border-2 border-foreground" />
              )}
            </div>
          </div>
        </section>

        {/* Profile Configuration */}
        <section>
          <h2 className="font-[family-name:var(--font-black-ops)] text-xl uppercase tracking-widest mb-4 flex items-center gap-2 border-l-4 border-foreground pl-3">
            <UserCircle className="h-5 w-5" /> Profile Configuration
          </h2>
          <div className="bg-background border-4 border-foreground shadow-[8px_8px_0_var(--foreground)] p-6">
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t-2 border-dashed border-foreground/30">
                  <div className="space-y-2">
                    <label className="font-bold uppercase tracking-widest text-xs text-blue-600 dark:text-blue-400">LinkedIn Profile URL</label>
                    <Input 
                      value={linkedinUrl}
                      onChange={e => setLinkedinUrl(e.target.value)}
                      className="rounded-none border-2 border-blue-600 dark:border-blue-400 font-mono" 
                      placeholder="https://linkedin.com/in/username" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-bold uppercase tracking-widest text-xs text-gray-700 dark:text-gray-300">GitHub Profile URL</label>
                    <Input 
                      value={githubUrl}
                      onChange={e => setGithubUrl(e.target.value)}
                      className="rounded-none border-2 border-gray-700 dark:border-gray-300 font-mono" 
                      placeholder="https://github.com/username" 
                    />
                  </div>
                </div>

                {saveStatus && (
                  <div className={`p-4 border-2 font-bold uppercase tracking-widest text-xs ${saveStatus.type === 'success' ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-destructive text-destructive bg-destructive/10'}`}>
                    {saveStatus.message}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button 
                    type="submit" 
                    disabled={saving}
                    className="rounded-none border-2 border-foreground bg-foreground text-background font-bold uppercase tracking-widest h-auto py-3 px-8 shadow-[4px_4px_0_var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                  >
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    {saving ? "Saving..." : "Save Profile"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </section>
        
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
