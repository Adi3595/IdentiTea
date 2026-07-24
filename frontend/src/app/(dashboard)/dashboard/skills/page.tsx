"use client"
import { BrainCircuit, Star, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";

interface Skill {
  id: string;
  name: string;
  confidence: number;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSkills() {
      try {
        const data = await fetchWithAuth("/graph-data/skills");
        setSkills(data);
      } catch (err) {
        console.error("Failed to load skills", err);
      } finally {
        setLoading(false);
      }
    }
    loadSkills();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="border-b-4 border-foreground pb-6">
        <h1 className="font-[family-name:var(--font-black-ops)] text-4xl tracking-tighter uppercase">Skill Matrix</h1>
        <p className="text-muted-foreground uppercase tracking-widest font-bold text-sm mt-2">Extracted Competency Vectors</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-foreground" />
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-foreground bg-foreground/5">
          <p className="font-mono text-muted-foreground">No verified skills found in Knowledge Graph.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill, i) => {
            const level = Math.round(skill.confidence * 100);
            const verified = skill.confidence > 0.5;
            return (
            <div key={skill.id || i} className="bg-background border-2 border-foreground p-4 flex items-center justify-between hover:bg-foreground/5 transition-colors group">
              <div className="flex flex-col">
                <span className="font-[family-name:var(--font-black-ops)] text-xl tracking-wide uppercase">{skill.name}</span>
                <span className="font-mono text-xs text-muted-foreground mt-1 flex items-center gap-2">
                  {verified ? (
                     <span className="text-green-500 flex items-center gap-1"><BrainCircuit className="h-3 w-3"/> Verified by Evidence</span>
                  ) : (
                     <span className="text-yellow-500 flex items-center gap-1"><Star className="h-3 w-3"/> Self-Reported</span>
                  )}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-[family-name:var(--font-black-ops)] text-3xl group-hover:text-primary transition-colors">{level}</span>
                <div className="w-24 h-1.5 bg-border mt-2 overflow-hidden">
                  <div className="h-full bg-foreground" style={{ width: `${level}%` }} />
                </div>
              </div>
            </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

