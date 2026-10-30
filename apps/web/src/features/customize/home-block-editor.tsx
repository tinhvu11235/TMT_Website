"use client";

import { AssetFields, Checkbox, Field, TextArea, editorButtonClass } from "@/features/customize/editor-fields";
import { editorBlockRegistry, getEditorBlockDefinition } from "@/features/customize/editor-block-registry";
import type { EditorAction, EditorState } from "@/features/customize/editor-reducer";
import type { HomeBlock } from "@/site-config/site.schema";

function positiveInteger(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function CtaFields({
  label,
  value,
  onChange
}: {
  label: string;
  value: { label: string; href: string };
  onChange: (value: { label: string; href: string }) => void;
}) {
  return (
    <fieldset className="grid grid-cols-2 gap-3 rounded-md border border-slate-200 p-3">
      <legend className="px-1 text-sm font-semibold text-slate-700">{label}</legend>
      <Field label="Nhãn" value={value.label} onChange={(nextLabel) => onChange({ ...value, label: nextLabel })} />
      <Field label="Đường dẫn" value={value.href} onChange={(href) => onChange({ ...value, href })} />
    </fieldset>
  );
}

function CollectionFields({
  config,
  onChange
}: {
  config: { title: string; description: string; limit: number };
  onChange: (config: { title: string; description: string; limit: number }) => void;
}) {
  return (
    <>
      <Field label="Tiêu đề" value={config.title} onChange={(title) => onChange({ ...config, title })} />
      <TextArea label="Mô tả" value={config.description} onChange={(description) => onChange({ ...config, description })} />
      <Field label="Số lượng" type="number" value={String(config.limit)} onChange={(value) => onChange({ ...config, limit: positiveInteger(value, config.limit) })} />
    </>
  );
}

function BlockFields({ block, onChange }: { block: HomeBlock; onChange: (block: HomeBlock) => void }) {
  switch (block.type) {
    case "hero":
      return (
        <>
          <Field label="Nhãn phụ" value={block.config.eyebrow} onChange={(eyebrow) => onChange({ ...block, config: { ...block.config, eyebrow } })} />
          <Field label="Tiêu đề" value={block.config.title} onChange={(title) => onChange({ ...block, config: { ...block.config, title } })} />
          <TextArea label="Mô tả" value={block.config.description} onChange={(description) => onChange({ ...block, config: { ...block.config, description } })} />
          <AssetFields label="Ảnh desktop" value={block.config.image} onChange={(image) => onChange({ ...block, config: { ...block.config, image } })} />
          <AssetFields label="Ảnh mobile" value={block.config.mobileImage} onChange={(mobileImage) => onChange({ ...block, config: { ...block.config, mobileImage } })} />
          <CtaFields label="CTA chính" value={block.config.primaryCta} onChange={(primaryCta) => onChange({ ...block, config: { ...block.config, primaryCta } })} />
          <CtaFields label="CTA phụ" value={block.config.secondaryCta} onChange={(secondaryCta) => onChange({ ...block, config: { ...block.config, secondaryCta } })} />
        </>
      );
    case "statistics":
      return <Field label="Số lượng" type="number" value={String(block.config.limit)} onChange={(value) => onChange({ ...block, config: { limit: positiveInteger(value, block.config.limit) } })} />;
    case "about":
      return (
        <>
          <Field label="Nhãn phụ" value={block.config.eyebrow} onChange={(eyebrow) => onChange({ ...block, config: { ...block.config, eyebrow } })} />
          <Field label="Tiêu đề" value={block.config.title} onChange={(title) => onChange({ ...block, config: { ...block.config, title } })} />
          <TextArea label="Mô tả" value={block.config.description} onChange={(description) => onChange({ ...block, config: { ...block.config, description } })} />
          <AssetFields label="Ảnh" value={block.config.image} onChange={(image) => onChange({ ...block, config: { ...block.config, image } })} />
          <TextArea label="Điểm nổi bật (mỗi dòng một mục)" value={block.config.highlights.join("\n")} onChange={(value) => onChange({ ...block, config: { ...block.config, highlights: value.split("\n").filter(Boolean) } })} />
          <CtaFields label="CTA" value={block.config.cta} onChange={(cta) => onChange({ ...block, config: { ...block.config, cta } })} />
        </>
      );
    case "services":
    case "certificates":
    case "news":
    case "partners":
      return <CollectionFields config={block.config} onChange={(config) => onChange({ ...block, config } as HomeBlock)} />;
    case "projects":
      return (
        <>
          <CollectionFields config={block.config} onChange={(config) => onChange({ ...block, config: { ...block.config, ...config } })} />
          <CtaFields label="CTA" value={block.config.cta} onChange={(cta) => onChange({ ...block, config: { ...block.config, cta } })} />
        </>
      );
    case "capabilities":
      return (
        <>
          <Field label="Nhãn phụ" value={block.config.eyebrow} onChange={(eyebrow) => onChange({ ...block, config: { ...block.config, eyebrow } })} />
          <Field label="Tiêu đề" value={block.config.title} onChange={(title) => onChange({ ...block, config: { ...block.config, title } })} />
          <TextArea label="Mô tả" value={block.config.description} onChange={(description) => onChange({ ...block, config: { ...block.config, description } })} />
          <TextArea label="Năng lực (mỗi dòng một mục)" value={block.config.items.join("\n")} onChange={(value) => onChange({ ...block, config: { ...block.config, items: value.split("\n").filter(Boolean) } })} />
        </>
      );
    case "cta":
      return (
        <>
          <Field label="Tiêu đề" value={block.config.title} onChange={(title) => onChange({ ...block, config: { ...block.config, title } })} />
          <TextArea label="Mô tả" value={block.config.description} onChange={(description) => onChange({ ...block, config: { ...block.config, description } })} />
          <CtaFields label="CTA" value={block.config.cta} onChange={(cta) => onChange({ ...block, config: { ...block.config, cta } })} />
        </>
      );
  }
}

export function HomeBlockEditor({ state, dispatch }: { state: EditorState; dispatch: React.Dispatch<EditorAction> }) {
  const blocks = state.draft.pages.home.blocks;
  const selected = blocks.find((block) => block.id === state.selectedBlockId) ?? null;
  const missing = editorBlockRegistry.filter((definition) => !blocks.some((block) => block.type === definition.type));

  return (
    <div className="grid gap-5 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="grid content-start gap-2">
        {blocks.map((block, index) => (
          <div className={`rounded-md border p-2 ${block.id === selected?.id ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white"}`} key={block.id}>
            <button className="w-full text-left text-sm font-semibold text-slate-900" type="button" onClick={() => dispatch({ type: "select-block", blockId: block.id })}>
              {getEditorBlockDefinition(block.type).label}
            </button>
            <div className="mt-2 flex gap-1">
              <button className={editorButtonClass} type="button" disabled={index === 0} onClick={() => dispatch({ type: "move-block", blockId: block.id, direction: -1 })}>↑</button>
              <button className={editorButtonClass} type="button" disabled={index === blocks.length - 1} onClick={() => dispatch({ type: "move-block", blockId: block.id, direction: 1 })}>↓</button>
              <button className={editorButtonClass} type="button" onClick={() => dispatch({ type: "toggle-block", blockId: block.id })}>{block.enabled ? "Ẩn" : "Hiện"}</button>
            </div>
          </div>
        ))}
        {missing.length ? (
          <div className="mt-3 grid gap-2 border-t border-slate-200 pt-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Thêm block</span>
            {missing.map((definition) => (
              <button className={editorButtonClass} key={definition.type} type="button" onClick={() => dispatch({ type: "add-block", blockType: definition.type })}>+ {definition.label}</button>
            ))}
          </div>
        ) : null}
      </aside>

      <section className="grid content-start gap-4 rounded-lg border border-slate-200 bg-white p-4">
        {selected ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-950">{getEditorBlockDefinition(selected.type).label}</h3>
                <p className="text-xs text-slate-500">{selected.id}</p>
              </div>
              <div className="flex gap-2">
                <Checkbox label="Hiển thị" checked={selected.enabled} onChange={() => dispatch({ type: "toggle-block", blockId: selected.id })} />
                <button className={editorButtonClass} type="button" onClick={() => dispatch({ type: "reset-block", blockId: selected.id })}>Đặt lại</button>
                <button className={editorButtonClass} type="button" onClick={() => dispatch({ type: "remove-block", blockId: selected.id })}>Xóa</button>
              </div>
            </div>
            <BlockFields block={selected} onChange={(block) => dispatch({ type: "replace-block", block })} />
          </>
        ) : <p className="text-sm text-slate-600">Chọn hoặc thêm một block để chỉnh sửa.</p>}
      </section>
    </div>
  );
}
