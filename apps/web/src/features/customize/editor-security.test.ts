import { describe, expect, it } from "vitest";
import { isSiteEditorEnabled } from "@/features/customize/editor-access";
import { parseStoredPreviewDraft, serializePreviewDraft } from "@/features/customize/preview-draft";
import { createPreviewMessage, parsePreviewMessage } from "@/features/customize/preview-messages";
import { loadSiteConfig } from "@/site-config/load-site-config";

describe("site editor access", () => {
  it("is enabled only by an explicit non-production flag", () => {
    expect(isSiteEditorEnabled("development", "true")).toBe(true);
    expect(isSiteEditorEnabled("test", "true")).toBe(true);
    expect(isSiteEditorEnabled("development", "false")).toBe(false);
    expect(isSiteEditorEnabled("production", "true")).toBe(false);
  });
});

describe("preview messages", () => {
  const origin = "http://localhost:3000";

  it("accepts a same-origin message that passes the shared schema", () => {
    const config = loadSiteConfig();
    expect(parsePreviewMessage(createPreviewMessage(config), origin, origin)).toEqual(config);
  });

  it("rejects foreign origins, unknown message types, and unsafe config", () => {
    const config = loadSiteConfig();
    expect(parsePreviewMessage(createPreviewMessage(config), "https://attacker.example", origin)).toBeNull();
    expect(parsePreviewMessage({ type: "unknown", config }, origin, origin)).toBeNull();

    const unsafe = structuredClone(config);
    unsafe.pages.home.blocks[0] = {
      ...unsafe.pages.home.blocks[0],
      config: { ...unsafe.pages.home.blocks[0].config, image: { src: "https://attacker.example/a.jpg", alt: "unsafe" } }
    } as typeof unsafe.pages.home.blocks[number];
    expect(parsePreviewMessage(createPreviewMessage(unsafe), origin, origin)).toBeNull();
  });
});

describe("standalone preview draft", () => {
  it("round-trips a valid browser-local draft", () => {
    const config = loadSiteConfig();
    expect(parseStoredPreviewDraft(serializePreviewDraft(config))).toEqual(config);
  });

  it("rejects malformed and schema-invalid browser storage", () => {
    expect(parseStoredPreviewDraft("{")) .toBeNull();
    expect(parseStoredPreviewDraft(JSON.stringify({ version: 1 }))).toBeNull();
  });
});
