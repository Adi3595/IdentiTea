"use client"
import * as React from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Terminal, Globe, KeyRound } from "lucide-react";
import { CustomCursor } from "@/components/cursor";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  // OAuth Handler
  const handleOAuth = (strategy: "oauth_google" | "oauth_github") => {
    if (!isLoaded) return;
    signUp.authenticateWithRedirect({
      strategy,
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/build",
    });
  };

  // Sign Up Submission (creates account, requests OTP)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.error("error", err.errors[0]?.longMessage);
      setError(err.errors[0]?.longMessage || "An error occurred during sign up.");
    } finally {
      setLoading(false);
    }
  };

  // OTP Verification Submission
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/build");
      } else {
        console.log(result);
        setError("Verification incomplete. Please try again.");
      }
    } catch (err: any) {
      console.error("error", err.errors[0]?.longMessage);
      setError(err.errors[0]?.longMessage || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4 relative overflow-hidden py-8">
      <CustomCursor />
      
      {/* Background aesthetics */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ background: "repeating-linear-gradient(45deg, var(--foreground) 0, var(--foreground) 2px, transparent 0, transparent 50%)", backgroundSize: "40px 40px" }} />
      
      {/* Floating Spheres Effect */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div animate={{ y: [0, -30, 0], x: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }} className="absolute bottom-[-5%] right-[-5%] w-64 h-64 rounded-full shadow-[0_8px_30px_rgba(15,11,10,0.4)]" style={{ background: "radial-gradient(circle at 30% 30%, var(--background) 0%, var(--foreground) 50%)" }} />
        <motion.div animate={{ y: [0, 20, 0], x: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }} className="absolute top-[10%] right-[20%] w-16 h-16 rounded-full shadow-[0_4px_15px_rgba(15,11,10,0.3)]" style={{ background: "radial-gradient(circle at 30% 30%, var(--background) 0%, var(--foreground) 50%)" }} />
        <motion.div animate={{ y: [0, 10, 0], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 0.5 }} className="absolute top-[30%] left-[5%] w-24 h-24 rounded-full shadow-[0_2px_8px_rgba(15,11,10,0.2)]" style={{ background: "radial-gradient(circle at 30% 30%, var(--background) 0%, var(--foreground) 50%)" }} />
        <motion.div animate={{ y: [0, -15, 0], x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 2 }} className="absolute bottom-[20%] left-[20%] w-10 h-10 rounded-full shadow-[0_2px_10px_rgba(15,11,10,0.3)]" style={{ background: "radial-gradient(circle at 30% 30%, var(--background) 0%, var(--foreground) 50%)" }} />
        <motion.div animate={{ y: [0, 25, 0], x: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 18, ease: "easeInOut", delay: 1.5 }} className="absolute top-[5%] left-[40%] w-8 h-8 rounded-full shadow-[0_2px_10px_rgba(15,11,10,0.3)]" style={{ background: "radial-gradient(circle at 30% 30%, var(--background) 0%, var(--foreground) 50%)" }} />
      </div>

      <div className="relative z-10 w-full max-w-[450px]">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 font-bold tracking-widest uppercase hover:underline underline-offset-4">
          <ArrowLeft className="h-5 w-5" /> Back to Home
        </Link>
        
        <div className="bg-background border-4 border-foreground shadow-[12px_12px_0_var(--foreground)] p-8 md:p-10 min-h-[550px] flex flex-col justify-center">
          
          <AnimatePresence mode="wait">
            {!pendingVerification && (
              <motion.div 
                key="signup-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8 text-center">
                  <h1 className="font-[family-name:var(--font-black-ops)] uppercase tracking-tighter text-4xl mb-2 text-foreground">Sign Up</h1>
                  <p className="text-muted-foreground text-sm font-medium tracking-wide">Generate your digital identity vault.</p>
                </div>

                <div className="space-y-4 mb-8">
                  <Button 
                    type="button" 
                    onClick={() => handleOAuth("oauth_google")}
                    className="w-full h-12 bg-background text-foreground border-2 border-foreground hover:bg-foreground/5 rounded-none font-bold uppercase tracking-widest shadow-[4px_4px_0_var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--foreground)] transition-all flex items-center justify-center gap-3"
                  >
                    <Globe className="h-5 w-5" /> Continue with Google
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => handleOAuth("oauth_github")}
                    className="w-full h-12 bg-background text-foreground border-2 border-foreground hover:bg-foreground/5 rounded-none font-bold uppercase tracking-widest shadow-[4px_4px_0_var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--foreground)] transition-all flex items-center justify-center gap-3"
                  >
                    <Terminal className="h-5 w-5" /> Continue with GitHub
                  </Button>
                </div>

                <div className="relative flex items-center py-2 mb-8">
                  <div className="flex-grow border-t-2 border-border"></div>
                  <span className="flex-shrink-0 mx-4 text-muted-foreground font-mono text-xs uppercase tracking-widest">or</span>
                  <div className="flex-grow border-t-2 border-border"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-destructive/10 border-l-4 border-destructive p-3 text-destructive font-mono text-xs uppercase font-bold">
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
                      className="rounded-none border-2 border-foreground focus-visible:ring-0 focus-visible:border-foreground h-12 bg-background font-mono"
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
                      className="rounded-none border-2 border-foreground focus-visible:ring-0 focus-visible:border-foreground h-12 bg-background font-mono"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 rounded-none uppercase font-bold tracking-widest shadow-[4px_4px_0_var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--foreground)] transition-all mt-4"
                  >
                    {loading ? "Initializing..." : "Create Account"}
                  </Button>
                </form>

                <div className="mt-8 text-center text-sm font-medium text-muted-foreground">
                  Already exist? <Link href="/sign-in" className="text-foreground font-bold hover:underline underline-offset-4">Log In Here.</Link>
                </div>
              </motion.div>
            )}

            {pendingVerification && (
              <motion.div 
                key="verify-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full justify-center"
              >
                <div className="mb-8 text-center flex flex-col items-center">
                  <KeyRound className="h-12 w-12 text-foreground mb-6" />
                  <h1 className="font-[family-name:var(--font-black-ops)] uppercase tracking-tighter text-3xl mb-4 text-foreground leading-tight">Verify Protocol</h1>
                  <p className="text-muted-foreground text-sm font-medium tracking-wide px-4">
                    An authorization code has been sent to <br/><span className="font-bold text-foreground">{email}</span>
                  </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-6">
                  {error && (
                    <div className="bg-destructive/10 border-l-4 border-destructive p-3 text-destructive font-mono text-xs uppercase font-bold">
                      Error: {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="code" className="uppercase font-bold tracking-widest text-xs">Authorization Code</Label>
                    <Input 
                      id="code" 
                      type="text" 
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                      placeholder="e.g. 123456"
                      className="rounded-none border-2 border-foreground focus-visible:ring-0 focus-visible:border-foreground h-14 bg-background font-mono text-center text-xl tracking-[0.5em]"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 rounded-none uppercase font-bold tracking-widest shadow-[4px_4px_0_var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--foreground)] transition-all mt-4"
                  >
                    {loading ? "Verifying..." : "Confirm Identity"}
                  </Button>
                  
                  <button 
                    type="button"
                    onClick={() => setPendingVerification(false)}
                    className="w-full text-center mt-6 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:underline underline-offset-4"
                  >
                    Back to Setup
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
