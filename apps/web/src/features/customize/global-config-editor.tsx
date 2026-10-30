"use client";

import { AssetFields, Checkbox, Field, Panel, TextArea, editorButtonClass } from "@/features/customize/editor-fields";
import type { SiteConfig } from "@/site-config/site.schema";

type PrimaryNavItem = SiteConfig["navigation"]["primary"][number];
type HeaderAction = SiteConfig["navigation"]["headerActions"][number];

function optional(value: string) {
  return value.trim() ? value : undefined;
}

function NavigationRows({
  title,
  items,
  onChange
}: {
  title: string;
  items: PrimaryNavItem[];
  onChange: (items: PrimaryNavItem[]) => void;
}) {
  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-semibold text-slate-800">{title}</h4>
        <button
          className={editorButtonClass}
          type="button"
          onClick={() => onChange([...items, { id: `link-${Date.now()}`, label: "Liên kết mới", href: "/", target: "_self", enabled: true }])}
        >
          Thêm liên kết
        </button>
      </div>
      {items.map((item, index) => (
        <div className="grid gap-2 rounded-md border border-slate-200 p-3" key={item.id}>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Nhãn" value={item.label} onChange={(label) => onChange(items.map((entry, position) => position === index ? { ...entry, label } : entry))} />
            <Field label="Đường dẫn" value={item.href} onChange={(href) => onChange(items.map((entry, position) => position === index ? { ...entry, href } : entry))} />
          </div>
          <div className="flex items-center justify-between">
            <Checkbox label="Hiển thị" checked={item.enabled} onChange={(enabled) => onChange(items.map((entry, position) => position === index ? { ...entry, enabled } : entry))} />
            <button className={editorButtonClass} type="button" onClick={() => onChange(items.filter((_, position) => position !== index))}>Xóa</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function GlobalConfigEditor({ config, onChange }: { config: SiteConfig; onChange: (config: SiteConfig) => void }) {
  const update = <K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) => onChange({ ...config, [key]: value });
  const setCompany = (value: Partial<SiteConfig["company"]>) => update("company", { ...config.company, ...value });
  const setContact = (value: Partial<SiteConfig["contact"]>) => update("contact", { ...config.contact, ...value });
  const setSocial = (value: Partial<SiteConfig["social"]>) => update("social", { ...config.social, ...value });
  const setSeo = (value: Partial<SiteConfig["seo"]>) => update("seo", { ...config.seo, ...value });

  return (
    <div className="grid gap-4">
      <Panel title="Công ty">
        <Field label="Tên công ty" value={config.company.name} onChange={(name) => setCompany({ name })} />
        <Field label="Tên ngắn" value={config.company.shortName} onChange={(shortName) => setCompany({ shortName })} />
        <Field label="Tên tiếng Anh" value={config.company.englishName ?? ""} onChange={(value) => setCompany({ englishName: optional(value) })} />
        <Field label="Khẩu hiệu" value={config.company.tagline ?? ""} onChange={(value) => setCompany({ tagline: optional(value) })} />
        <TextArea label="Mô tả" value={config.company.description} onChange={(description) => setCompany({ description })} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Mã số thuế" value={config.company.taxCode ?? ""} onChange={(value) => setCompany({ taxCode: optional(value) })} />
          <Field label="Năm thành lập" value={config.company.foundedYear ?? ""} onChange={(value) => setCompany({ foundedYear: optional(value) })} />
        </div>
      </Panel>

      <Panel title="Nhận diện thương hiệu">
        <AssetFields label="Logo mặc định" value={config.brand.logo} onChange={(logo) => update("brand", { ...config.brand, logo })} />
        <AssetFields label="Logo nền sáng" value={config.brand.logoLight} onChange={(logoLight) => update("brand", { ...config.brand, logoLight })} />
        <AssetFields label="Logo nền tối" value={config.brand.logoDark} onChange={(logoDark) => update("brand", { ...config.brand, logoDark })} />
        <AssetFields label="Favicon" value={config.brand.favicon} onChange={(favicon) => update("brand", { ...config.brand, favicon })} />
      </Panel>

      <Panel title="Liên hệ">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Điện thoại" value={config.contact.phone ?? ""} onChange={(value) => setContact({ phone: optional(value) })} />
          <Field label="Hotline" value={config.contact.hotline ?? ""} onChange={(value) => setContact({ hotline: optional(value) })} />
          <Field label="Email" type="email" value={config.contact.email ?? ""} onChange={(value) => setContact({ email: optional(value) })} />
          <Field label="Email kinh doanh" type="email" value={config.contact.salesEmail ?? ""} onChange={(value) => setContact({ salesEmail: optional(value) })} />
        </div>
        <TextArea label="Địa chỉ" value={config.contact.address ?? ""} onChange={(value) => setContact({ address: optional(value) })} />
        <Field label="Giờ làm việc" value={config.contact.businessHours ?? ""} onChange={(value) => setContact({ businessHours: optional(value) })} />
        <Field label="Website" type="url" value={config.contact.website ?? ""} onChange={(value) => setContact({ website: optional(value) })} />
        <Field label="Google Maps" type="url" value={config.contact.mapsUrl ?? ""} onChange={(value) => setContact({ mapsUrl: optional(value) })} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Zalo" type="url" value={config.contact.zalo ?? ""} onChange={(value) => setContact({ zalo: optional(value) })} />
          <Field label="WhatsApp" type="url" value={config.contact.whatsapp ?? ""} onChange={(value) => setContact({ whatsapp: optional(value) })} />
        </div>
        <Checkbox label="Hiện nút liên hệ nổi" checked={config.contact.floatingEnabled} onChange={(floatingEnabled) => setContact({ floatingEnabled })} />
      </Panel>

      <Panel title="Mạng xã hội">
        <Field label="Facebook" type="url" value={config.social.facebook ?? ""} onChange={(value) => setSocial({ facebook: optional(value) })} />
        <Field label="YouTube" type="url" value={config.social.youtube ?? ""} onChange={(value) => setSocial({ youtube: optional(value) })} />
        <Field label="LinkedIn" type="url" value={config.social.linkedin ?? ""} onChange={(value) => setSocial({ linkedin: optional(value) })} />
      </Panel>

      <Panel title="Điều hướng">
        <NavigationRows
          title="Menu chính"
          items={config.navigation.primary}
          onChange={(primary) => update("navigation", { ...config.navigation, primary })}
        />
        <NavigationRows
          title="Liên kết chân trang"
          items={config.navigation.footerLegal}
          onChange={(footerLegal) => update("navigation", { ...config.navigation, footerLegal })}
        />
        <div className="grid gap-3">
          <h4 className="font-semibold text-slate-800">Nút đầu trang</h4>
          {config.navigation.headerActions.map((item, index) => (
            <div className="grid grid-cols-2 gap-2 rounded-md border border-slate-200 p-3" key={item.id}>
              <Field label="Nhãn" value={item.label} onChange={(label) => {
                const headerActions = config.navigation.headerActions.map((entry, position) => position === index ? { ...entry, label } : entry) as HeaderAction[];
                update("navigation", { ...config.navigation, headerActions });
              }} />
              <Field label="Đường dẫn" value={item.href} onChange={(href) => {
                const headerActions = config.navigation.headerActions.map((entry, position) => position === index ? { ...entry, href } : entry) as HeaderAction[];
                update("navigation", { ...config.navigation, headerActions });
              }} />
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="SEO mặc định">
        <Field label="Tiêu đề" value={config.seo.defaultTitle} onChange={(defaultTitle) => setSeo({ defaultTitle })} />
        <Field label="Mẫu tiêu đề" value={config.seo.titleTemplate} onChange={(titleTemplate) => setSeo({ titleTemplate })} />
        <TextArea label="Mô tả" value={config.seo.defaultDescription} onChange={(defaultDescription) => setSeo({ defaultDescription })} />
        <Field label="Tên website" value={config.seo.siteName} onChange={(siteName) => setSeo({ siteName })} />
        <AssetFields label="Ảnh Open Graph" value={config.seo.defaultOgImage} onChange={(defaultOgImage) => setSeo({ defaultOgImage })} />
      </Panel>

      <Panel title="Màu sắc giao diện">
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(config.theme) as Array<keyof SiteConfig["theme"]>).map((key) => (
            <Field
              key={key}
              label={key}
              type="color"
              value={config.theme[key]}
              onChange={(value) => update("theme", { ...config.theme, [key]: value })}
            />
          ))}
        </div>
      </Panel>
    </div>
  );
}
