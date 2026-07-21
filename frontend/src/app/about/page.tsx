import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CustomCursor } from "@/components/cursor";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4">
      <CustomCursor />
      <div className="max-w-2xl w-full border-4 border-foreground p-8 md:p-12 shadow-[12px_12px_0_rgba(15,11,10,1)] bg-background">
        <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-black-ops)] uppercase tracking-tighter mb-8">About IdentiTea</h1>
        <p className="text-xl text-muted-foreground leading-relaxed mb-8">
          We are building the definitive Knowledge Graph for professional identities. 
          By replacing static PDFs with cryptographically verifiable skills, we're returning the power of career data back to the individual.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 font-bold tracking-widest uppercase hover:underline underline-offset-4">
          <ArrowLeft className="h-5 w-5" /> Return Home
        </Link>
      </div>
    </div>
  );
}
