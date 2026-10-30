import { createDefaultHomeBlock } from "@/site-config/site.defaults";
import { siteConfigSchema, type HomeBlock, type HomeBlockType, type SiteConfig } from "@/site-config/site.schema";

export type EditorState = {
  draft: SiteConfig;
  selectedPage: "home";
  selectedBlockId: string | null;
  issues: string[];
  dirty: boolean;
};

export type EditorAction =
  | { type: "replace-draft"; draft: SiteConfig; dirty?: boolean }
  | { type: "select-block"; blockId: string | null }
  | { type: "replace-block"; block: HomeBlock }
  | { type: "toggle-block"; blockId: string }
  | { type: "move-block"; blockId: string; direction: -1 | 1 }
  | { type: "remove-block"; blockId: string }
  | { type: "add-block"; blockType: HomeBlockType }
  | { type: "reset-block"; blockId: string }
  | { type: "mark-clean" };

export function getConfigIssues(config: SiteConfig) {
  const result = siteConfigSchema.safeParse(config);
  if (result.success) return [];
  return result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
}

export function createEditorState(config: SiteConfig): EditorState {
  return {
    draft: structuredClone(config),
    selectedPage: "home",
    selectedBlockId: config.pages.home.blocks[0]?.id ?? null,
    issues: getConfigIssues(config),
    dirty: false
  };
}

function withBlocks(state: EditorState, blocks: HomeBlock[], selectedBlockId = state.selectedBlockId): EditorState {
  const draft = {
    ...state.draft,
    pages: {
      ...state.draft.pages,
      home: { ...state.draft.pages.home, blocks }
    }
  };
  return { ...state, draft, selectedBlockId, issues: getConfigIssues(draft), dirty: true };
}

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "replace-draft":
      return {
        ...state,
        draft: action.draft,
        selectedBlockId: action.draft.pages.home.blocks.some((block) => block.id === state.selectedBlockId)
          ? state.selectedBlockId
          : action.draft.pages.home.blocks[0]?.id ?? null,
        issues: getConfigIssues(action.draft),
        dirty: action.dirty ?? true
      };
    case "select-block":
      return { ...state, selectedBlockId: action.blockId };
    case "replace-block":
      return withBlocks(
        state,
        state.draft.pages.home.blocks.map((block) => block.id === action.block.id ? action.block : block)
      );
    case "toggle-block":
      return withBlocks(
        state,
        state.draft.pages.home.blocks.map((block) =>
          block.id === action.blockId ? { ...block, enabled: !block.enabled } : block
        ) as HomeBlock[]
      );
    case "move-block": {
      const blocks = [...state.draft.pages.home.blocks];
      const index = blocks.findIndex((block) => block.id === action.blockId);
      const destination = index + action.direction;
      if (index < 0 || destination < 0 || destination >= blocks.length) return state;
      [blocks[index], blocks[destination]] = [blocks[destination], blocks[index]];
      return withBlocks(state, blocks);
    }
    case "remove-block": {
      const blocks = state.draft.pages.home.blocks.filter((block) => block.id !== action.blockId);
      const selectedBlockId = state.selectedBlockId === action.blockId ? blocks[0]?.id ?? null : state.selectedBlockId;
      return withBlocks(state, blocks, selectedBlockId);
    }
    case "add-block": {
      if (state.draft.pages.home.blocks.some((block) => block.type === action.blockType)) return state;
      const block = createDefaultHomeBlock(action.blockType);
      return withBlocks(state, [...state.draft.pages.home.blocks, block], block.id);
    }
    case "reset-block": {
      const existing = state.draft.pages.home.blocks.find((block) => block.id === action.blockId);
      if (!existing) return state;
      const reset = { ...createDefaultHomeBlock(existing.type), id: existing.id } as HomeBlock;
      return withBlocks(
        state,
        state.draft.pages.home.blocks.map((block) => block.id === action.blockId ? reset : block)
      );
    }
    case "mark-clean":
      return { ...state, dirty: false };
  }
}

