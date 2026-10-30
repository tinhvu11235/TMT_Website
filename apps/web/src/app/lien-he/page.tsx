import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/features/contact/contact-form";
import { Container, Section, SectionTitle } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { getCompanyLocations, getServices } from "@/services/content";
import { loadSiteConfig } from "@/site-config/load-site-config";
import { getSiteSettings } from "@/site-config/site-config.adapter";
import { buildStaticPageMetadata } from "@/site-config/static-metadata";

export const generateMetadata = () => buildStaticPageMetadata("contact");

export default async function ContactPage() {
  const settings = getSiteSettings();
  const page = loadSiteConfig().pages.contact;
  const [services, locations] = await Promise.all([getServices(), getCompanyLocations()]);
  return (
    <>
      <PageHero title={page.hero.title} description={page.hero.description} />
      <Section>
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionTitle title={settings.companyName} description={settings.workingHours} />
            <div className="grid gap-4">
              {locations.map((location) => (
                <div className="rounded-lg border border-slate-200 bg-white p-5" key={location.id}>
                  <MapPin className="mb-3 text-[var(--color-primary)]" />
                  <h2 className="font-bold">
                    {location.name}
                    {location.isHeadOffice ? " / Trụ sở chính" : ""}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{location.address}</p>
                  {location.phone ? <p className="mt-2 text-sm font-semibold text-slate-700">{location.phone}</p> : null}
                  {location.email ? <p className="mt-1 text-sm text-slate-600">{location.email}</p> : null}
                  {location.mapUrl ? (
                    <a className="mt-3 inline-flex text-sm font-semibold text-[var(--color-primary)]" href={location.mapUrl}>
                      Xem bản đồ
                    </a>
                  ) : null}
                </div>
              ))}
              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <Phone className="mb-3 text-[var(--color-primary)]" />
                <h2 className="font-bold">Hotline</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{settings.hotline}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <Mail className="mb-3 text-[var(--color-primary)]" />
                <h2 className="font-bold">Email</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{settings.email}</p>
                {settings.salesEmail ? <p className="mt-1 text-sm leading-6 text-slate-600">Kinh doanh: {settings.salesEmail}</p> : null}
              </div>
            </div>
          </div>
          <ContactForm services={services} />
        </Container>
      </Section>
    </>
  );
}
