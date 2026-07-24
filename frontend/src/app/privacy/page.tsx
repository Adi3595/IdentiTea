import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CustomCursor } from "@/components/cursor";
import { MilkyAurora } from "@/components/milky-aurora";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4 relative overflow-hidden py-8">
      <CustomCursor />
      <MilkyAurora />
      
      <div className="relative z-10 w-full max-w-[800px]">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 font-bold tracking-widest uppercase hover:underline underline-offset-4">
          <ArrowLeft className="h-5 w-5" /> Back to Home
        </Link>
        
        <div className="bg-background border-4 border-foreground shadow-[12px_12px_0_var(--foreground)] p-8 md:p-10 max-h-[80vh] overflow-y-auto">
          <Link href="/" className="flex items-center gap-4 mb-12 cursor-pointer group">
            <div className="bg-foreground p-3 shadow-[4px_4px_0_rgba(15,11,10,1)] group-hover:shadow-[2px_2px_0_rgba(15,11,10,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
              <img src="/logo.svg" alt="IdentiTea Logo" className="w-10 h-10 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="font-[family-name:var(--font-black-ops)] text-3xl md:text-4xl tracking-tighter uppercase text-foreground">
              IdentiTea
            </span>
          </Link>
          <div className="text-center">
            <h1 className="font-[family-name:var(--font-black-ops)] uppercase tracking-tighter text-2xl mb-2 text-foreground">Privacy Policy</h1>
            <p className="text-muted-foreground text-sm font-medium tracking-wide">Last Updated: July 2026</p>
          </div>
          
          <div className="space-y-6 text-foreground font-medium leading-relaxed text-sm">
            <h2 className="font-[family-name:var(--font-black-ops)] text-xl tracking-wide uppercase border-b-2 border-foreground pb-2">1. The Absolute Vault</h2>
            <p>
              At IdentiTea, privacy is not a feature; it is our foundation. We do not sell, rent, or lease your Knowledge Graph to any third party. Your data is your property.
            </p>
            
            <h2 className="font-[family-name:var(--font-black-ops)] text-xl tracking-wide uppercase border-b-2 border-foreground pb-2">2. Data Collection</h2>
            <p>
              We collect only the data you explicitly upload to the platform (PDFs, credentials) for the sole purpose of parsing it into your Knowledge Graph.
            </p>
            
            <h2 className="font-[family-name:var(--font-black-ops)] text-xl tracking-wide uppercase border-b-2 border-foreground pb-2">3. Data Usage & AI Training</h2>
            <p className="font-bold text-destructive">
              WE DO NOT TRAIN LLMs ON YOUR PERSONAL DATA.
            </p>
            <p>
              Your career files are parsed using isolated inference nodes. The vector embeddings generated are stored in your encrypted partition. They are never pooled into a collective dataset to train foundation models.
            </p>
            
            <h2 className="font-[family-name:var(--font-black-ops)] text-xl tracking-wide uppercase border-b-2 border-foreground pb-2">4. Right to Delete</h2>
            <p>
              You maintain the right to nuke your entire Knowledge Graph at any time. Triggering a deletion event instantly purges your nodes, edges, embeddings, and raw files from our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
