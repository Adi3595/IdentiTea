import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { CustomCursor } from "@/components/cursor";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4 py-20">
      <CustomCursor />
      <div className="max-w-3xl w-full border-4 border-foreground p-8 md:p-12 shadow-[12px_12px_0_rgba(15,11,10,1)] bg-background">
        <div className="flex items-center gap-4 mb-8">
          <ShieldCheck className="h-12 w-12" />
          <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-black-ops)] uppercase tracking-tighter">Privacy Policy</h1>
        </div>
        
        <div className="space-y-6 text-muted-foreground leading-relaxed mb-12">
          <p>
            <strong>Your Data is Yours.</strong> At IdentiTea, we believe your professional identity should not be harvested for ad-targeting or unauthorized LLM training.
          </p>
          <p>
            When you upload a document to the Evidence Engine, it is securely processed and stored in a private bucket. The extracted Knowledge Graph is owned exclusively by you and can be permanently deleted at any time.
          </p>
          <p>
            We do not sell your data. We do not expose your graph to recruiters unless you explicitly generate a public share link.
          </p>
        </div>
        
        <Link href="/" className="inline-flex items-center gap-2 font-bold tracking-widest uppercase hover:underline underline-offset-4 text-foreground">
          <ArrowLeft className="h-5 w-5" /> Return Home
        </Link>
      </div>
    </div>
  );
}
