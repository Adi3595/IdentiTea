"use client"
import { AppWindow, ExternalLink, GitBranch, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await fetchWithAuth("/graph-data/projects");
        setProjects(data);
      } catch (err) {
        console.error("Failed to load projects", err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="border-b-4 border-foreground pb-6">
        <h1 className="font-[family-name:var(--font-black-ops)] text-4xl tracking-tighter uppercase">Deployed Projects</h1>
        <p className="text-muted-foreground uppercase tracking-widest font-bold text-sm mt-2">Verified Builder Portfolio</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-foreground" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-foreground bg-foreground/5">
          <p className="font-mono text-muted-foreground">No projects found in Knowledge Graph.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <div key={project.id || i} className="bg-background border-4 border-foreground shadow-[8px_8px_0_var(--foreground)] flex flex-col justify-between group hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0_var(--foreground)] transition-all">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <AppWindow className="h-8 w-8 text-foreground" />
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none border-2 border-transparent hover:border-foreground">
                      <GitBranch className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none border-2 border-transparent hover:border-foreground">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter mb-2">{project.title}</h3>
                <p className="font-mono text-sm text-muted-foreground leading-relaxed mb-6">{project.description}</p>
              </div>
              
              {project.technologies && project.technologies.length > 0 && (
                <div className="border-t-2 border-foreground p-4 bg-foreground/5 flex flex-wrap gap-2">
                  {project.technologies.map(tag => (
                    <span key={tag} className="text-[10px] font-bold uppercase tracking-widest border border-foreground bg-background px-2 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

