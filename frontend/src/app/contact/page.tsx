import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CustomCursor } from "@/components/cursor";
import { MilkyAurora } from "@/components/milky-aurora";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4 relative overflow-hidden py-8">
      <CustomCursor />
      <MilkyAurora />
      
      <div className="relative z-10 w-full max-w-[600px]">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 font-bold tracking-widest uppercase hover:underline underline-offset-4">
          <ArrowLeft className="h-5 w-5" /> Back to Home
        </Link>
        
        <div className="bg-background border-4 border-foreground shadow-[12px_12px_0_var(--foreground)] p-8 md:p-10">
            <Link href="/" className="flex items-center gap-4 mb-12 cursor-pointer group">
              <div className="bg-foreground p-3 shadow-[4px_4px_0_rgba(15,11,10,1)] group-hover:shadow-[2px_2px_0_rgba(15,11,10,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
                <img src="/logo.svg" alt="IdentiTea Logo" className="w-10 h-10 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <span className="font-[family-name:var(--font-black-ops)] text-3xl md:text-4xl tracking-tighter uppercase text-foreground">
                IdentiTea
              </span>
            </Link>
            <div className="text-center">
              <h1 className="font-[family-name:var(--font-black-ops)] uppercase tracking-tighter text-2xl mb-2 text-foreground">Contact</h1>
              <p className="text-muted-foreground text-sm font-medium tracking-wide">Get in touch with us.</p>
            </div>
          </div>
          
          <div className="space-y-6 text-foreground font-medium leading-relaxed">
            <p>
              Have a question about our Evidence Engine? Want to explore an enterprise integration? Or just want to say hi?
            </p>
            
            <div className="border-t border-b border-border py-4 my-6">
              <p className="font-bold uppercase tracking-widest text-sm mb-2">General Inquiries</p>
              <a href="mailto:hello@identitea.com" className="text-muted-foreground hover:text-foreground hover:underline">hello@identitea.com</a>
            </div>

            <div className="border-b border-border pb-4 my-6">
              <p className="font-bold uppercase tracking-widest text-sm mb-2">Support</p>
              <a href="mailto:support@identitea.com" className="text-muted-foreground hover:text-foreground hover:underline">support@identitea.com</a>
            </div>
            
            <div className="pt-4 text-center">
               <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <Button variant="outline" className="rounded-none border-2 border-foreground uppercase font-bold tracking-widest shadow-[4px_4px_0_var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--foreground)] transition-all">
                  DM us on X
                </Button>
               </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
