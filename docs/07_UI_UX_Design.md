# 07. UI/UX Design

The IdentiTea frontend eschews standard corporate softness for a bold, rigid, and highly opinionated design language.

## Brutalism & Premium Aesthetics
We utilize a modern brutalist aesthetic to convey strength, reliability, and cutting-edge technology.
- **Color Palette**: Strict 2-color monochrome system.
  - Light Theme: Canvas `#f8f9fa`, Ink `#0f0b0a`
  - Dark Theme: Canvas `#0f0b0a`, Ink `#f8f9fa`
  - No tertiary colors (no red, green, blue). The logo and knowledge graph physically invert their colors (e.g., via CSS filters and hex swapping) when the user toggles the theme to enforce this absolute constraint.
- **Typography**: `Black Ops One` is used for all headers and numeric scores to give a mechanical, futuristic feel. `Inter` provides legibility for body text.
- **Shapes**: Sharp corners only (no `rounded-xl`). Heavy 4px solid borders and offset drop-shadows without blur (`shadow-[8px_8px_0_var(--foreground)]`) enforce a sense of physical weight.

## Interactions & Motion
While the visual design is rigid, the interactions are hyper-fluid.
- **Framer Motion**: Elements do not just fade in; they spring into place using physics-based animations (`type: "spring", stiffness: 400, damping: 30`).
- **Hover States**: Buttons physically translate (`hover:translate-x-[2px] hover:translate-y-[2px]`) to simulate pressing a mechanical switch, reducing the shadow offset simultaneously.
- **Custom Cursor**: A custom mechanical crosshair cursor (`<CustomCursor />`) replaces the standard browser pointer, deepening the immersive "terminal" feel.

## Architecture
- **Next.js App Router**: Leverages React Server Components for fast initial loads and SEO, mixed with Client Components for heavy interactivity.
- **ShadCN UI**: Accessible base primitives (Dialogs, Dropdowns) restyled to match the brutalist theme.
