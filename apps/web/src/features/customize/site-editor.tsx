"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { parseImportedSiteConfig, serializeSiteConfig } from "@/features/customize/config-transfer";
import { editorButtonClass } from "@/features/customize/editor-fields";
import { createEditorState, editorReducer } from "@/features/customize/editor-reducer";
import { GlobalConfigEditor } from "@/features/customize/global-config-editor";
import { HomeBlockEditor } from "@/features/customize/home-block-editor";
import { previewDraftStorageKey, serializePreviewDraft } from "@/features/customize/preview-draft";
import { createPreviewMessage } from "@/features/customize/preview-messages";
import type { SiteConfig } from "@/site-config/site.schema";

type EditorTab = "global" | "home" | "transfer";
type Viewport = "mobile" | "tablet" | "desktop";

const viewportWidths: Record<Viewport, string> = {
  mobile: "390px",
  tablet: "768px",
  desktop: "100%"
};

function downloadConfig(config: SiteConfig) {
  const blob = new Blob([serializeSiteConfig(config)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "site.config.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

export function SiteEditor({ initialConfig }: { initialConfig: SiteConfig }) {
  const [state, dispatch] = useReducer(editorReducer, initialConfig, createEditorState);
  const [tab, setTab] = useState<EditorTab>("global");
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [importSource, setImportSource] = useState("");
  const [transferMessage, setTransferMessage] = useState("");
  const [previewMessage, setPreviewMessage] = useState("Đang khởi tạo preview…");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const sendPreview = useCallback((config: SiteConfig) => {
    iframeRef.current?.contentWindow?.postMessage(createPreviewMessage(config), window.location.origin);
  }, []);

  const syncPreview = useCallback((config: SiteConfig) => {
    const serialized = serializePreviewDraft(config);
    if (!serialized) {
      setPreviewMessage("Preview đang giữ phiên bản hợp lệ gần nhất.");
      return false;
    }

    let persisted = true;
    try {
      window.localStorage.setItem(previewDraftStorageKey, serialized);
    } catch {
      persisted = false;
    }
    sendPreview(config);
    setPreviewMessage(persisted
      ? "Đã đồng bộ live preview."
      : "Không thể lưu draft vào trình duyệt; iframe vẫn được đồng bộ.");
    return persisted;
  }, [sendPreview]);

  useEffect(() => {
    const timeout = window.setTimeout(() => syncPreview(state.draft), 80);
    return () => window.clearTimeout(timeout);
  }, [state.draft, syncPreview]);

  useEffect(() => {
    function receiveReady(event: MessageEvent<unknown>) {
      if (
        event.origin === window.location.origin &&
        event.source === iframeRef.current?.contentWindow &&
        typeof event.data === "object" &&
        event.data !== null &&
        (event.data as { type?: unknown }).type === "site-config-preview-ready"
      ) {
        syncPreview(state.draft);
      }
    }

    window.addEventListener("message", receiveReady);
    return () => window.removeEventListener("message", receiveReady);
  }, [state.draft, syncPreview]);

  function importConfig(source: string) {
    try {
      const draft = parseImportedSiteConfig(source);
      dispatch({ type: "replace-draft", draft });
      setImportSource(serializeSiteConfig(draft));
      setTransferMessage("Đã nhập cấu hình hợp lệ. Dữ liệu chỉ tồn tại trong phiên chỉnh sửa này.");
    } catch (error) {
      setTransferMessage(error instanceof Error ? error.message : "Không thể nhập cấu hình");
    }
  }

  async function readImportFile(file: File | undefined) {
    if (!file) return;
    const source = await file.text();
    setImportSource(source);
    importConfig(source);
  }

  const tabClass = (value: EditorTab) =>
    `rounded-md px-3 py-2 text-sm font-semibold ${tab === value ? "bg-blue-700 text-white" : "bg-white text-slate-700 hover:bg-slate-100"}`;

  return (
    <main data-site-editor className="min-h-screen bg-slate-100 text-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">Site Customizer</h1>
              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">Local only</span>
              {state.dirty ? <span className="text-xs font-medium text-blue-700">Có thay đổi chưa xuất</span> : null}
            </div>
            <p className="text-xs text-slate-500">Không ghi file, không có API lưu và không khả dụng ở production.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className={editorButtonClass} type="button" onClick={() => dispatch({ type: "replace-draft", draft: structuredClone(initialConfig), dirty: false })}>Khôi phục toàn bộ</button>
            <button className={editorButtonClass} type="button" disabled={state.issues.length > 0} onClick={() => downloadConfig(state.draft)}>Xuất JSON</button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1800px] gap-4 p-4 xl:grid-cols-[minmax(34rem,0.9fr)_minmax(32rem,1.1fr)]">
        <section className="min-w-0">
          <nav className="mb-4 flex gap-2" aria-label="Khu vực cấu hình">
            <button className={tabClass("global")} type="button" onClick={() => setTab("global")}>Cấu hình chung</button>
            <button className={tabClass("home")} type="button" onClick={() => setTab("home")}>Trang chủ</button>
            <button className={tabClass("transfer")} type="button" onClick={() => setTab("transfer")}>Nhập / xuất</button>
          </nav>

          {state.issues.length ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
              <p className="font-bold">Cấu hình hiện có {state.issues.length} lỗi. Preview giữ phiên bản hợp lệ gần nhất.</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {state.issues.slice(0, 8).map((issue) => <li key={issue}>{issue}</li>)}
              </ul>
            </div>
          ) : null}

          {tab === "global" ? (
            <GlobalConfigEditor config={state.draft} onChange={(draft) => dispatch({ type: "replace-draft", draft })} />
          ) : null}
          {tab === "home" ? <HomeBlockEditor state={state} dispatch={dispatch} /> : null}
          {tab === "transfer" ? (
            <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Nhập từ file JSON
                <input type="file" accept="application/json,.json" onChange={(event) => void readImportFile(event.target.files?.[0])} />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Hoặc dán JSON
                <textarea className="min-h-80 rounded-md border border-slate-300 p-3 font-mono text-xs" value={importSource} onChange={(event) => setImportSource(event.target.value)} />
              </label>
              <div className="flex flex-wrap gap-2">
                <button className={editorButtonClass} type="button" onClick={() => importConfig(importSource)}>Kiểm tra và nhập</button>
                <button className={editorButtonClass} type="button" disabled={state.issues.length > 0} onClick={() => {
                  setImportSource(serializeSiteConfig(state.draft));
                  setTransferMessage("Đã tạo JSON chuẩn hóa trong ô văn bản.");
                }}>Đưa cấu hình hiện tại vào ô</button>
              </div>
              {transferMessage ? <p className="text-sm text-slate-700" role="status">{transferMessage}</p> : null}
            </div>
          ) : null}
        </section>

        <section className="min-w-0 xl:sticky xl:top-24 xl:h-[calc(100vh-7rem)]">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold">Live preview</h2>
              <p className="text-xs text-slate-500" role="status">{previewMessage}</p>
            </div>
            <div className="flex flex-wrap justify-end gap-1">
              <button className={editorButtonClass} type="button" disabled={state.issues.length > 0} onClick={() => syncPreview(state.draft)}>Đồng bộ ngay</button>
              <button
                className={editorButtonClass}
                type="button"
                disabled={state.issues.length > 0}
                onClick={() => {
                  if (syncPreview(state.draft)) window.open("/customize/preview?standalone=1", "site-config-preview");
                }}
              >
                Mở tab lớn ↗
              </button>
              {(["mobile", "tablet", "desktop"] as const).map((value) => (
                <button className={editorButtonClass} type="button" key={value} aria-pressed={viewport === value} onClick={() => setViewport(value)}>{value}</button>
              ))}
            </div>
          </div>
          <div className="flex h-[calc(100%-2.75rem)] justify-center overflow-hidden rounded-lg bg-slate-300 p-2">
            <iframe
              ref={iframeRef}
              title="Xem trước website"
              src="/customize/preview"
              sandbox="allow-scripts allow-same-origin"
              className="h-full border-0 bg-white shadow-xl transition-[width]"
              style={{ width: viewportWidths[viewport], maxWidth: "100%" }}
              onLoad={() => syncPreview(state.draft)}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
