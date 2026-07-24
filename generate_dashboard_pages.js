const fs = require('fs');
const path = require('path');

const tabs = [
  "identity",
  "timeline",
  "graph", // Check if exists? Let's overwrite it for consistency
  "documents",
  "skills",
  "projects",
  "certificates",
  "internships",
  "achievements",
  "integrations",
  "portfolio",
  "career-ai",
  "settings"
];

const toPascalCase = (str) => {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

const template = (name) => `import { CustomCursor } from "@/components/cursor";
import { MilkyAurora } from "@/components/milky-aurora";

export default function ${toPascalCase(name)}Page() {
  return (
    <div className="relative min-h-[calc(100vh-8rem)] w-full overflow-hidden border-4 border-foreground shadow-[12px_12px_0_var(--foreground)] bg-background">
      <CustomCursor />
      <MilkyAurora />
      <div className="relative z-10 p-10 md:p-16 h-full flex flex-col justify-center items-center text-center">
        <h1 className="font-[family-name:var(--font-black-ops)] text-4xl md:text-6xl uppercase tracking-tighter mb-6">
          ${name.toUpperCase()}
        </h1>
        <p className="text-foreground font-bold tracking-widest uppercase text-xs border-2 border-foreground px-4 py-2 bg-foreground/5 shadow-[4px_4px_0_var(--foreground)]">
          Module Pending Initialization
        </p>
      </div>
    </div>
  );
}
`;

const baseDir = path.join(__dirname, 'frontend', 'src', 'app', '(dashboard)', 'dashboard');

tabs.forEach(tab => {
  const dirPath = path.join(baseDir, tab);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const filePath = path.join(dirPath, 'page.tsx');
  fs.writeFileSync(filePath, template(tab), 'utf8');
  console.log(`Generated ${tab}/page.tsx`);
});
