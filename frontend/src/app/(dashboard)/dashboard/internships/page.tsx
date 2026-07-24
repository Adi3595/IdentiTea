"use client"
import { Briefcase, Calendar, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";

interface Internship {
  id: string;
  role: string;
  company: string;
  duration: string;
}

export default function InternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInternships() {
      try {
        const data = await fetchWithAuth("/graph-data/internships");
        setInternships(data);
      } catch (err) {
        console.error("Failed to load internships", err);
      } finally {
        setLoading(false);
      }
    }
    loadInternships();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="border-b-4 border-foreground pb-6">
        <h1 className="font-[family-name:var(--font-black-ops)] text-4xl tracking-tighter uppercase">Internships</h1>
        <p className="text-muted-foreground uppercase tracking-widest font-bold text-sm mt-2">Early Career Nodes</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-foreground" />
        </div>
      ) : internships.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-foreground bg-foreground/5">
          <p className="font-mono text-muted-foreground">No internships found in Knowledge Graph.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {internships.map((internship, i) => (
            <div key={internship.id || i} className="bg-background border-4 border-foreground p-8 relative overflow-hidden group">
              {/* Brutalist geometric accent */}
              <div className="absolute -right-10 -top-10 h-32 w-32 bg-foreground/5 rotate-45 group-hover:scale-110 transition-transform" />
              
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="bg-foreground p-3 border-2 border-foreground">
                  <Briefcase className="h-6 w-6 text-background" />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter">{internship.company}</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1 flex items-center gap-2">
                    <Calendar className="h-3 w-3" /> {internship.duration}
                  </p>
                </div>
              </div>
              
              <h4 className="font-bold uppercase tracking-widest text-sm mb-4 border-l-4 border-foreground pl-3">{internship.role}</h4>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

