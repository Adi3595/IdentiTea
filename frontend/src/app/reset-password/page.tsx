"use client"
import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CustomCursor } from "@/components/cursor";
import { MilkyAurora } from "@/components/milky-aurora";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ResetPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [loadingForm, setLoadingForm] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingForm(true);
    setError("");
    setMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Check your inbox for further instructions.");
    } catch (err: any) {
      console.error("Password Reset Error:", err);
      setError(err?.message || "Failed to reset password.");
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4 relative overflow-hidden py-8">
      <CustomCursor />
      <MilkyAurora />

      <div className="relative z-10 w-full max-w-[450px]">
        <Link href="/sign-in" className="inline-flex items-center gap-2 mb-4 font-bold tracking-widest uppercase hover:underline underline-offset-4">
          <ArrowLeft className="h-5 w-5" /> Back to Sign In
        </Link>
        
        <AnimatePresence mode="wait">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="bg-background border-4 border-foreground shadow-[12px_12px_0_var(--foreground)] p-8 md:p-10"
          >
            <div className="text-center mb-8">
              <h1 className="font-[family-name:var(--font-black-ops)] uppercase tracking-tighter text-2xl mb-2 text-foreground">Reset Password</h1>
              <p className="text-muted-foreground text-sm font-medium tracking-wide">Enter your email to receive a password reset link.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-destructive/10 border-l-4 border-destructive p-3 text-destructive font-mono text-xs uppercase font-bold leading-tight">
                  Error: {error}
                </div>
              )}
              {message && (
                <div className="bg-green-500/10 border-l-4 border-green-500 p-3 text-green-500 font-mono text-xs uppercase font-bold leading-tight">
                  {message}
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

              <Button 
                type="submit" 
                disabled={loadingForm}
                className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 rounded-none uppercase font-bold tracking-widest shadow-[4px_4px_0_var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--foreground)] transition-all mt-4"
              >
                {loadingForm ? "Sending..." : "Reset Password"}
              </Button>
            </form>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
