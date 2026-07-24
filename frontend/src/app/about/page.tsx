import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CustomCursor } from "@/components/cursor";
import { MilkyAurora } from "@/components/milky-aurora";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4 relative overflow-hidden py-8">
      <CustomCursor />
      <MilkyAurora />
      
      <div className="relative z-10 w-full max-w-[600px]">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 font-bold tracking-widest uppercase hover:underline underline-offset-4">
          <ArrowLeft className="h-5 w-5" /> Back to Home
        </Link>
        
        <div className="bg-background border-4 border-foreground shadow-[12px_12px_0_var(--foreground)] p-8 md:p-10">
          <Link href="/" className="flex items-center gap-4 mb-12 cursor-pointer group justify-center">
            <div className="bg-foreground p-3 shadow-[4px_4px_0_rgba(15,11,10,1)] group-hover:shadow-[2px_2px_0_rgba(15,11,10,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
              <img src="/logo.svg" alt="IdentiTea Logo" className="w-10 h-10 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="font-[family-name:var(--font-black-ops)] text-3xl md:text-4xl tracking-tighter uppercase text-foreground">
              IdentiTea
            </span>
          </Link>
          <div className="text-center">
            <h1 className="font-[family-name:var(--font-black-ops)] uppercase tracking-tighter text-2xl mb-2 text-foreground">About Us</h1>
            <p className="text-muted-foreground text-sm font-medium tracking-wide">Decentralizing professional identity.</p>
          </div>
          
          <div className="space-y-6 text-foreground font-medium leading-relaxed">
            <p>
              IdentiTea was founded on a simple premise: the modern resume is fundamentally broken. It is a static, unverifiable document in an era where work is dynamic, distributed, and continuous.
            </p>
            <p>
              We believe that your professional identity should not be gatekept by a single PDF or a proprietary social network. It should be a living, mathematical graph of your skills, experiences, and verifiable achievements.
            </p>
            <p>
              Our team consists of engineers, data scientists, and designers who are obsessed with truth, privacy, and brutalist efficiency. We don't train models on your personal data. We don't sell your graph to recruiters without your permission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
