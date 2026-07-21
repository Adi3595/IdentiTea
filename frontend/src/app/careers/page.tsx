import Link from "next/link";
import { ArrowLeft, TerminalSquare } from "lucide-react";
import { CustomCursor } from "@/components/cursor";

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4">
      <CustomCursor />
      <div className="max-w-2xl w-full border-4 border-foreground p-8 md:p-12 shadow-[12px_12px_0_rgba(15,11,10,1)] bg-background">
        <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-black-ops)] uppercase tracking-tighter mb-8">Careers</h1>
        
        <div className="border-l-4 border-foreground pl-6 mb-8">
          <h3 className="font-bold text-xl mb-2 flex items-center gap-2"><TerminalSquare className="h-5 w-5"/> No open roles... yet.</h3>
          <p className="text-muted-foreground leading-relaxed">
            We are currently in private beta and focused heavily on engineering the core graph infrastructure. Check back later!
          </p>
        </div>
        
        <Link href="/" className="inline-flex items-center gap-2 font-bold tracking-widest uppercase hover:underline underline-offset-4">
          <ArrowLeft className="h-5 w-5" /> Return Home
        </Link>
      </div>
    </div>
  );
}
