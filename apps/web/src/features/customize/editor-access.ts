export function isSiteEditorEnabled(nodeEnv: string | undefined, enabled: string | undefined) {
  return nodeEnv !== "production" && enabled === "true";
}

