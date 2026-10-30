import { createDefaultHomeBlock } from "@/site-config/site.defaults";
import type { HomeBlockType } from "@/site-config/site.schema";

export const editorBlockRegistry = [
  { type: "hero", label: "Hero", maxInstances: 1 },
  { type: "statistics", label: "Statistics", maxInstances: 1 },
  { type: "about", label: "About", maxInstances: 1 },
  { type: "services", label: "Services", maxInstances: 1 },
  { type: "projects", label: "Projects", maxInstances: 1 },
  { type: "capabilities", label: "Capabilities", maxInstances: 1 },
  { type: "certificates", label: "Certificates", maxInstances: 1 },
  { type: "news", label: "News", maxInstances: 1 },
  { type: "partners", label: "Partners", maxInstances: 1 },
  { type: "cta", label: "CTA", maxInstances: 1 }
] as const satisfies ReadonlyArray<{ type: HomeBlockType; label: string; maxInstances: 1 }>;

export function getEditorBlockDefinition(type: HomeBlockType) {
  const definition = editorBlockRegistry.find((item) => item.type === type);
  if (!definition) throw new Error(`Missing editor definition for block type: ${type}`);
  return { ...definition, defaults: createDefaultHomeBlock(type) };
}

