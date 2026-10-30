import { describe, expect, it } from "vitest";
import { createEditorState, editorReducer } from "@/features/customize/editor-reducer";
import { loadSiteConfig } from "@/site-config/load-site-config";

describe("editorReducer", () => {
  it("moves, toggles, removes, and restores singleton blocks", () => {
    const original = loadSiteConfig();
    let state = createEditorState(original);
    const heroId = state.draft.pages.home.blocks[0].id;

    state = editorReducer(state, { type: "move-block", blockId: heroId, direction: 1 });
    expect(state.draft.pages.home.blocks[1].id).toBe(heroId);

    state = editorReducer(state, { type: "toggle-block", blockId: heroId });
    expect(state.draft.pages.home.blocks.find((block) => block.id === heroId)?.enabled).toBe(false);

    state = editorReducer(state, { type: "remove-block", blockId: heroId });
    expect(state.draft.pages.home.blocks.some((block) => block.type === "hero")).toBe(false);

    state = editorReducer(state, { type: "add-block", blockType: "hero" });
    expect(state.draft.pages.home.blocks.filter((block) => block.type === "hero")).toHaveLength(1);

    const unchanged = editorReducer(state, { type: "add-block", blockType: "hero" });
    expect(unchanged).toBe(state);
  });

  it("resets block content while preserving its stable ID", () => {
    const original = loadSiteConfig();
    let state = createEditorState(original);
    const cta = state.draft.pages.home.blocks.find((block) => block.type === "cta");
    expect(cta?.type).toBe("cta");
    if (!cta || cta.type !== "cta") return;

    state = editorReducer(state, {
      type: "replace-block",
      block: { ...cta, config: { ...cta.config, title: "Nội dung tạm" } }
    });
    state = editorReducer(state, { type: "reset-block", blockId: cta.id });

    const reset = state.draft.pages.home.blocks.find((block) => block.id === cta.id);
    expect(reset?.id).toBe(cta.id);
    expect(reset?.type === "cta" && reset.config.title).toBe("Liên hệ với chúng tôi");
  });
});

