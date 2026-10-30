import Link from "next/link";
import Image from "next/image";
import { Facebook, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { Container } from "@/components/ui/container";
import type { SiteConfig } from "@/site-config/site.schema";
import type { GlobalSettings, NavItem, Service } from "@/types/content";

export function Footer({
  settings,
  menu,
  services,
  navigation
}: {
  settings: GlobalSettings;
  menu: NavItem[];
  services: Service[];
  navigation: SiteConfig["navigation"];
}) {
  return (
    <footer className="bg-[var(--color-secondary)] py-14 text-white">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-sm font-bold text-[var(--color-primary)]">
                {settings.logoLight?.src || settings.logo?.src ? (
                  <Image
                    src={(settings.logoLight ?? settings.logo)?.src ?? ""}
                    alt={(settings.logoLight ?? settings.logo)?.alt || settings.companyName}
                    width={44}
                    height={44}
                    className="h-full w-full rounded-md object-contain"
                  />
                ) : (
                  settings.companyShortName.slice(0, 3).toUpperCase()
                )}
              </span>
              <div>
                <p className="font-semibold">{settings.companyName}</p>
                <p className="text-sm text-white/65">{settings.companyEnglishName}</p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-7 text-white/70">{settings.description}</p>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-white/70">{navigation.labels.navigation}</h2>
            <ul className="grid gap-3 text-sm text-white/75">
              {menu.map((item) => (
                <li key={item.id}>
                  <Link href={item.url} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
              {navigation.footerLegal.filter((item) => item.enabled).map((item) => (
                <li key={item.id}>
                  <Link href={item.href} target={item.target} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-white/70">{navigation.labels.services}</h2>
            <ul className="grid gap-3 text-sm text-white/75">
              {services.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <Link href={`/dich-vu/${service.slug}`} className="hover:text-white">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-white/70">{navigation.labels.contact}</h2>
            <ul className="grid gap-3 text-sm text-white/75">
              <li className="flex gap-2">
                <MapPin aria-hidden="true" size={17} className="mt-1 shrink-0" />
                {settings.address}
              </li>
              <li className="flex gap-2">
                <Phone aria-hidden="true" size={17} />
                {settings.hotline}
              </li>
              <li className="flex gap-2">
                <Mail aria-hidden="true" size={17} />
                {settings.email}
              </li>
            </ul>
            <div className="mt-5 flex gap-2">
              {settings.facebook ? (
                <Link className="rounded-md bg-white/10 p-2 hover:bg-white/20" href={settings.facebook} aria-label="Facebook">
                  <Facebook size={18} />
                </Link>
              ) : null}
              {settings.youtube ? (
                <Link className="rounded-md bg-white/10 p-2 hover:bg-white/20" href={settings.youtube} aria-label="YouTube">
                  <Youtube size={18} />
                </Link>
              ) : null}
              {settings.linkedin ? (
                <Link className="rounded-md bg-white/10 p-2 hover:bg-white/20" href={settings.linkedin} aria-label="LinkedIn">
                  <Linkedin size={18} />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/55">
          © {new Date().getFullYear()} {settings.companyShortName}. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
