import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { CustomCursor } from "@/components/cursor";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4">
      <CustomCursor />
      <div className="max-w-md w-full border-4 border-foreground p-8 md:p-12 shadow-[12px_12px_0_rgba(15,11,10,1)] bg-background text-center">
        <Lock className="h-12 w-12 mx-auto mb-6" />
        <h1 className="text-3xl font-[family-name:var(--font-black-ops)] uppercase tracking-tighter mb-4">Log In</h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Authentication via Clerk is currently being integrated. 
        </p>
        
        <Link href="/" className="inline-flex items-center justify-center w-full h-12 bg-foreground text-background font-bold tracking-widest uppercase hover:bg-foreground/90 transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
