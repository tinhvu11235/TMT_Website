"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { SiteConfig } from "@/site-config/site.schema";
import type { GlobalSettings, NavItem } from "@/types/content";

function Logo({ settings }: { settings: GlobalSettings }) {
  return (
    <Link href="/" className="focus-ring flex items-center gap-3 rounded-md" aria-label="Trang chủ">
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--color-primary)] text-sm font-bold text-white">
        {(settings.logoDark ?? settings.logo)?.src ? (
          <Image src={(settings.logoDark ?? settings.logo)?.src ?? ""} alt={(settings.logoDark ?? settings.logo)?.alt || settings.companyName} width={40} height={40} className="h-full w-full rounded-md object-contain" />
        ) : (
          settings.companyShortName.slice(0, 3).toUpperCase()
        )}
      </span>
      <span className="hidden leading-tight sm:block">
        <span className="block text-sm font-bold text-[var(--color-secondary)]">{settings.companyShortName}</span>
        <span className="block text-xs text-[var(--color-muted-foreground)]">{settings.slogan ?? "Engineering consultancy"}</span>
      </span>
    </Link>
  );
}

export function Header({
  menu,
  settings,
  actions
}: {
  menu: NavItem[];
  settings: GlobalSettings;
  actions: SiteConfig["navigation"]["headerActions"];
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/94 backdrop-blur">
      <Container className="flex h-20 items-center justify-between gap-5 transition-all">
        <Logo settings={settings} />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Điều hướng chính">
          {menu.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              target={item.target}
              className="focus-ring rounded-md px-3 py-2 text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-primary)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {actions.filter((action) => action.enabled).map((action) => (
            <LinkButton href={action.href} target={action.target} variant={action.style} key={action.id}>
              {action.label}
            </LinkButton>
          ))}
        </div>

        <button
          className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] lg:hidden"
          onClick={() => setOpen(true)}
          aria-label="Mở menu"
          type="button"
        >
          <Menu size={22} />
        </button>
      </Container>

      {open ? (
        <div className="fixed inset-0 z-50 bg-slate-950/30 lg:hidden" role="dialog" aria-modal="true">
          <div className="ml-auto flex h-[100dvh] w-full max-w-sm flex-col bg-[var(--color-surface)] p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <Logo settings={settings} />
              <button
                className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--color-border)]"
                onClick={() => setOpen(false)}
                aria-label="Đóng menu"
                type="button"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="mt-8 grid gap-2" aria-label="Menu mobile">
              {menu.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  target={item.target}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-base font-semibold text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto grid gap-3 border-t border-[var(--color-border)] pt-5">
              <LinkButton href={`tel:${settings.hotline}`} className="w-full" variant="accent">
                <Phone size={18} />
                Gọi ngay
              </LinkButton>
              {settings.zalo ? (
                <LinkButton href={settings.zalo} className="w-full" variant="secondary">
                  Zalo
                </LinkButton>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
