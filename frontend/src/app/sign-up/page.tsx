import { SignUp } from "@clerk/nextjs";
import { CustomCursor } from "@/components/cursor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4 relative overflow-hidden py-20">
      <CustomCursor />
      
      {/* Background aesthetics */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ background: "repeating-linear-gradient(45deg, var(--foreground) 0, var(--foreground) 2px, transparent 0, transparent 50%)", backgroundSize: "40px 40px" }} />
      
      <div className="relative z-10 w-full max-w-[400px]">
        <Link href="/" className="inline-flex items-center gap-2 mb-8 font-bold tracking-widest uppercase hover:underline underline-offset-4">
          <ArrowLeft className="h-5 w-5" /> Back to Home
        </Link>
        
        <div className="p-2 bg-background border-4 border-foreground shadow-[12px_12px_0_rgba(15,11,10,1)]">
          <SignUp 
            routing="hash"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-background shadow-none border-none w-full",
                headerTitle: "font-[family-name:var(--font-black-ops)] uppercase tracking-tighter text-4xl text-foreground",
                headerSubtitle: "text-muted-foreground",
                socialButtonsBlockButton: "border-2 border-foreground hover:bg-foreground/5 rounded-none text-foreground font-bold",
                formButtonPrimary: "bg-foreground text-background hover:bg-foreground/90 rounded-none uppercase font-bold tracking-widest h-12 shadow-[4px_4px_0_rgba(15,11,10,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_rgba(15,11,10,1)] transition-all",
                formFieldInput: "border-2 border-foreground bg-background rounded-none focus:ring-0 focus:border-foreground text-foreground",
                formFieldLabel: "uppercase font-bold tracking-widest text-xs text-foreground",
                footerActionLink: "text-foreground font-bold hover:underline",
                dividerLine: "bg-border",
                dividerText: "text-muted-foreground font-mono text-xs uppercase"
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
