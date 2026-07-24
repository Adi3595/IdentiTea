"use client"
import { Clock, Briefcase, GraduationCap, ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";

interface TimelineEvent {
  id: string;
  event_type: string;
  title: string;
  description: string;
  date: string;
}

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTimeline() {
      try {
        const data = await fetchWithAuth("/timeline/");
        setEvents(data);
      } catch (err) {
        console.error("Failed to load timeline", err);
      } finally {
        setLoading(false);
      }
    }
    loadTimeline();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b-4 border-foreground pb-6 flex justify-between items-end">
        <div>
          <h1 className="font-[family-name:var(--font-black-ops)] text-4xl tracking-tighter uppercase">Career Timeline</h1>
          <p className="text-muted-foreground uppercase tracking-widest font-bold text-sm mt-2">Chronological Career Vector</p>
        </div>
        <div className="font-[family-name:var(--font-black-ops)] text-2xl text-muted-foreground/30">
          T-0
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-foreground" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-foreground bg-foreground/5">
          <p className="font-mono text-muted-foreground">No events found in timeline.</p>
        </div>
      ) : (
        <div className="relative pl-8 border-l-4 border-foreground space-y-12 py-4">
          {events.map((event, i) => (
            <div key={event.id || i} className="relative group">
              {/* Node */}
              <div className="absolute -left-[42px] top-0 h-6 w-6 bg-background border-4 border-foreground group-hover:bg-foreground transition-colors" />
              
              <div className="bg-background border-2 border-foreground shadow-[4px_4px_0_var(--foreground)] p-6 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--foreground)] transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {event.event_type === 'work' ? <Briefcase className="h-5 w-5" /> : <GraduationCap className="h-5 w-5" />}
                    <h3 className="font-[family-name:var(--font-black-ops)] text-xl uppercase tracking-tighter">{event.title}</h3>
                  </div>
                  <div className="bg-foreground text-background font-bold px-3 py-1 text-xs uppercase tracking-widest">
                    {event.date}
                  </div>
                </div>
                <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-xs text-muted-foreground mb-4">
                  <span>Logged via Engine</span>
                  <ArrowRight className="h-3 w-3" />
                  <span className="text-green-500">Extracted</span>
                </div>
                <p className="font-mono text-sm leading-relaxed border-l-2 border-muted-foreground/30 pl-4 py-1">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

