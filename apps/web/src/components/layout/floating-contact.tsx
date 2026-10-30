import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import type { GlobalSettings } from "@/types/content";

export function FloatingContact({ settings }: { settings: GlobalSettings }) {
  if (!settings.floatingContactEnabled) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-3 gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-xl md:left-auto md:right-5 md:grid-cols-1">
      <Link className="flex items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] px-3 py-2 text-sm font-semibold text-white" href={`tel:${settings.hotline}`}>
        <Phone size={16} />
        Gọi
      </Link>
      {settings.zalo ? (
        <Link className="flex items-center justify-center gap-2 rounded-md bg-[var(--color-muted)] px-3 py-2 text-sm font-semibold text-[var(--color-foreground)]" href={settings.zalo}>
          <MessageCircle size={16} />
          Zalo
        </Link>
      ) : null}
      <Link className="flex items-center justify-center gap-2 rounded-md bg-[var(--color-muted)] px-3 py-2 text-sm font-semibold text-[var(--color-foreground)]" href={`mailto:${settings.email}`}>
        <Mail size={16} />
        Email
      </Link>
    </div>
  );
}
