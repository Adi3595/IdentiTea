import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { CustomCursor } from "@/components/cursor";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4">
      <CustomCursor />
      <div className="max-w-2xl w-full border-4 border-foreground p-8 md:p-12 shadow-[12px_12px_0_rgba(15,11,10,1)] bg-background">
        <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-black-ops)] uppercase tracking-tighter mb-8">Contact Us</h1>
        
        <div className="border-l-4 border-foreground pl-6 mb-8">
          <h3 className="font-bold text-xl mb-2 flex items-center gap-2"><Send className="h-5 w-5"/> Transmission Link Active</h3>
          <p className="text-muted-foreground leading-relaxed">
            Have questions about the Evidence Engine or interested in enterprise integration? Send a raw signal to:
          </p>
          <a href="mailto:hello@identitea.com" className="inline-block mt-4 text-foreground font-mono font-bold tracking-widest hover:underline underline-offset-4 bg-foreground/10 px-4 py-2 border border-foreground">
            hello@identitea.com
          </a>
        </div>
        
        <Link href="/" className="inline-flex items-center gap-2 font-bold tracking-widest uppercase hover:underline underline-offset-4">
          <ArrowLeft className="h-5 w-5" /> Return Home
        </Link>
      </div>
    </div>
  );
}
