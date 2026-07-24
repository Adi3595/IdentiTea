"use client"
import { Award, ShieldCheck, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  verified_skills: string[];
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCertificates() {
      try {
        const data = await fetchWithAuth("/graph-data/certificates");
        setCertificates(data);
      } catch (err) {
        console.error("Failed to load certificates", err);
      } finally {
        setLoading(false);
      }
    }
    loadCertificates();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="border-b-4 border-foreground pb-6">
        <h1 className="font-[family-name:var(--font-black-ops)] text-4xl tracking-tighter uppercase">Certificates</h1>
        <p className="text-muted-foreground uppercase tracking-widest font-bold text-sm mt-2">Verified Cryptographic Proofs</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-foreground" />
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-foreground bg-foreground/5">
          <p className="font-mono text-muted-foreground">No certificates found in Knowledge Graph.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {certificates.map((cert, i) => (
            <div key={cert.id || i} className="bg-background border-4 border-foreground flex flex-col md:flex-row items-center justify-between p-6 hover:bg-foreground/5 transition-colors group">
              <div className="flex items-center gap-6 mb-4 md:mb-0 w-full md:w-auto">
                <div className="h-16 w-16 bg-foreground flex items-center justify-center shrink-0">
                  <Award className="h-8 w-8 text-background" />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-black-ops)] text-xl uppercase tracking-tighter mb-1">{cert.name}</h3>
                  <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <span>{cert.issuer}</span>
                  </div>
                  {cert.verified_skills && cert.verified_skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {cert.verified_skills.map(skill => (
                        <span key={skill} className="text-[10px] font-bold uppercase tracking-widest border border-foreground bg-background px-2 py-0.5">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-green-500 bg-green-500/10 px-2 py-1 border border-green-500/20">
                  <ShieldCheck className="h-3 w-3" /> Verified
                </div>
                <Button variant="outline" size="icon" className="rounded-none border-2 border-foreground hover:bg-foreground hover:text-background">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

