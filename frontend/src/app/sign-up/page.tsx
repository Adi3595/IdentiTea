"use client"
import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Terminal, Globe } from "lucide-react";
import { CustomCursor } from "@/components/cursor";
import { MilkyAurora } from "@/components/milky-aurora";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, sendEmailVerification } from "firebase/auth";
import { useAuth } from "@/providers/auth-provider";

export default function SignUpPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loadingForm, setLoadingForm] = React.useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();

  React.useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleOAuth = async (providerName: "google" | "github") => {
    try {
      const provider = providerName === "google" ? new GoogleAuthProvider() : new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      // Firebase automatically updates the auth state listener, and our useEffect will push to /dashboard
    } catch (err: any) {
      console.error("OAuth Error:", err);
      setError(err?.message || "OAuth error occurred.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingForm(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
      }
      // Firebase will update the user state and trigger the redirect to /dashboard
    } catch (err: any) {
      console.error("Sign Up Error:", err);
      setError(err?.message || "An error occurred during sign up.");
    } finally {
      setLoadingForm(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4">
      <CustomCursor />
      <div className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter text-foreground animate-pulse">
        Initializing Vault...
      </div>
    </div>
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4 relative overflow-hidden py-8">
      <CustomCursor />
      <MilkyAurora />

      <div className="relative z-10 w-full max-w-[450px]">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 font-bold tracking-widest uppercase hover:underline underline-offset-4">
          <ArrowLeft className="h-5 w-5" /> Back to Home
        </Link>
        
        <AnimatePresence mode="wait">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="bg-background border-4 border-foreground shadow-[12px_12px_0_var(--foreground)] p-8 md:p-10"
          >
            
            <Link href="/" className="flex items-center gap-4 mb-12 cursor-pointer group">
              <div className="bg-foreground p-3 shadow-[4px_4px_0_rgba(15,11,10,1)] group-hover:shadow-[2px_2px_0_rgba(15,11,10,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
                <img src="/logo.svg" alt="IdentiTea Logo" className="w-10 h-10 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <span className="font-[family-name:var(--font-black-ops)] text-3xl md:text-4xl tracking-tighter uppercase text-foreground">
                IdentiTea
              </span>
            </Link>
            <div className="text-center">
              <h1 className="font-[family-name:var(--font-black-ops)] uppercase tracking-tighter text-2xl mb-2 text-foreground">Sign Up</h1>
              <p className="text-muted-foreground text-sm font-medium tracking-wide">Initialize your Knowledge Graph.</p>
            </div>

            <div className="space-y-4 mb-8">
              <Button 
                type="button" 
                onClick={() => handleOAuth("google")}
                className="w-full h-12 bg-background text-foreground border-2 border-foreground hover:bg-foreground/5 rounded-none font-bold uppercase tracking-widest shadow-[4px_4px_0_var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--foreground)] transition-all flex items-center justify-center gap-3"
              >
                <Globe className="h-5 w-5" /> Continue with Google
              </Button>
              <Button 
                type="button" 
                onClick={() => handleOAuth("github")}
                className="w-full h-12 bg-background text-foreground border-2 border-foreground hover:bg-foreground/5 rounded-none font-bold uppercase tracking-widest shadow-[4px_4px_0_var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--foreground)] transition-all flex items-center justify-center gap-3"
              >
                <Terminal className="h-5 w-5" /> Continue with GitHub
              </Button>
            </div>

            <div className="relative flex items-center py-5 mb-4">
              <div className="flex-grow border-t-2 border-border"></div>
              <span className="flex-shrink-0 mx-4 text-muted-foreground text-xs uppercase font-bold tracking-widest">
                Or register via
              </span>
              <div className="flex-grow border-t-2 border-border"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-destructive/10 border-l-4 border-destructive p-3 text-destructive font-mono text-xs uppercase font-bold leading-tight">
                  Error: {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="uppercase font-bold tracking-widest text-xs">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-none border-2 border-foreground focus-visible:ring-0 focus-visible:border-foreground h-12 bg-background font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="uppercase font-bold tracking-widest text-xs">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-none border-2 border-foreground focus-visible:ring-0 focus-visible:border-foreground h-12 bg-background font-mono text-sm"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loadingForm}
                className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 rounded-none uppercase font-bold tracking-widest shadow-[4px_4px_0_var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--foreground)] transition-all mt-4"
              >
                {loadingForm ? "Creating Node..." : "Sign Up"}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm font-medium text-muted-foreground">
              Already mapped? <Link href="/sign-in" className="text-foreground font-bold hover:underline underline-offset-4">Sign In.</Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
