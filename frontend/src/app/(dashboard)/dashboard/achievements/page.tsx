"use client"
import { Trophy, Star, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";

interface Achievement {
  id: string;
  title: string;
  event: string;
  description: string;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAchievements() {
      try {
        const data = await fetchWithAuth("/graph-data/achievements");
        setAchievements(data);
      } catch (err) {
        console.error("Failed to load achievements", err);
      } finally {
        setLoading(false);
      }
    }
    loadAchievements();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="border-b-4 border-foreground pb-6">
        <h1 className="font-[family-name:var(--font-black-ops)] text-4xl tracking-tighter uppercase">Achievements</h1>
        <p className="text-muted-foreground uppercase tracking-widest font-bold text-sm mt-2">Notable Milestones</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-foreground" />
        </div>
      ) : achievements.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-foreground bg-foreground/5">
          <p className="font-mono text-muted-foreground">No achievements found in Knowledge Graph.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {achievements.map((ach, i) => (
            <div key={ach.id || i} className="bg-background border-4 border-foreground shadow-[8px_8px_0_var(--foreground)] p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="h-20 w-20 bg-foreground flex items-center justify-center shrink-0">
                <Trophy className="h-10 w-10 text-background" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter mb-2">{ach.title}</h3>
                <p className="font-bold uppercase tracking-widest text-xs text-primary bg-primary/10 inline-block px-2 py-1 mb-4">
                  {ach.event}
                </p>
                <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                  {ach.description}
                </p>
              </div>
              
              <div className="hidden md:block">
                <Star className="h-8 w-8 text-border" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

