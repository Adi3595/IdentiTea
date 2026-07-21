# IdentiTea Design System

## Core Aesthetic
- **Philosophy**: "Do not build a typical dashboard. Build a premium AI SaaS product... intelligent, calm, minimal, futuristic and delightful."
- **Theme**: Strict brutalist 2-color system.
- **Colors**: 
  - Background (White Canvas): `#f8f9fa`
  - Foreground (Ink / Shadow): `#0f0b0a`
- **Typography**: 
  - Brand/Headings: `Black Ops One` (Heavy, industrial, stencil-like).
  - Body: Modern sans-serif (Geist).

## UI/UX Rules
1. **Edge-to-Edge Layout**: Elements should push to the boundaries, avoiding traditional padded boxes.
2. **Sharp Corners**: No `border-radius` on cards or primary layout elements. Keep it brutalist.
3. **No Blurs**: Avoid glassmorphism, milky effects, or backdrop blurs. Rely on sharp contrast and purely solid elements.
4. **Custom Cursor**: The cursor is a geometric lens that inverses the color beneath it (`mix-blend-difference`), enforcing the stark 2-color dynamic.

## Hero Section Anatomy
- **Typography Layout**: Massive typography, flush-left alignment using negative margins to counter built-in side bearings.
- **Shadows**: 3-plane stacked text shadow on the main title for brutalist depth: `[text-shadow:15px_15px_0_rgba(15,11,10,0.15),30px_30px_0_rgba(15,11,10,0.05)]`.
- **Background Sheen**: A subtle angled linear gradient (`135deg`) sweeping across the background to give the white canvas a polished, painted sheen using 3% opacity of the foreground color.
- **The Living Graph (Spheres)**:
  - An organic layout of floating spheres mimicking nodes or physical pearls.
  - Sizing varies drastically (from tiny `w-3` dust to a massive `w-32` anchor sphere) to create 3D depth.
  - Spheres use a 3D specular highlight `radial-gradient` (White fading to Black) to appear as tangible objects catching light.

## Logo
- **Concept**: A stark geometric square overlapping with a circle. The square represents the rigid, outdated structure of "Folders", while the circle represents the dynamic, fluid nature of "The Living Graph".
