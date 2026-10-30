"use client";

import type { AssetConfig } from "@/site-config/site.schema";

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "url" | "number" | "color";
  placeholder?: string;
}) {
  return (
    <label className="grid gap-1 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input
        className={inputClass}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 4
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="grid gap-1 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <textarea className={inputClass} rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

export function AssetFields({
  label,
  value,
  onChange
}: {
  label: string;
  value?: AssetConfig | null;
  onChange: (value: AssetConfig | null) => void;
}) {
  function updateSource(src: string) {
    onChange(src ? { src, alt: value?.alt || label } : null);
  }

  return (
    <fieldset className="grid gap-3 rounded-md border border-slate-200 p-3">
      <legend className="px-1 text-sm font-semibold text-slate-700">{label}</legend>
      <Field label="Đường dẫn ảnh" value={value?.src ?? ""} onChange={updateSource} placeholder="/images/example.webp" />
      {value ? <Field label="Alt text" value={value.alt} onChange={(alt) => onChange({ ...value, alt })} /> : null}
    </fieldset>
  );
}

export function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="rounded-lg border border-slate-200 bg-white" open>
      <summary className="cursor-pointer px-4 py-3 font-semibold text-slate-900">{title}</summary>
      <div className="grid gap-4 border-t border-slate-100 p-4">{children}</div>
    </details>
  );
}

export const editorButtonClass =
  "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40";
