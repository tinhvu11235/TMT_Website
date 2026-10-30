import { Download, Eye } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Container, Section, SectionTitle } from "@/components/ui/container";
import { ImageFrame } from "@/components/ui/image-frame";
import { PageHero } from "@/components/ui/page-hero";
import { formatDate } from "@/lib/utils/format";
import { getCompanyProfile } from "@/services/content";
import { loadSiteConfig } from "@/site-config/load-site-config";
import { buildStaticPageMetadata } from "@/site-config/static-metadata";

export const generateMetadata = () => buildStaticPageMetadata("companyProfile");

export default async function CompanyProfilePage() {
  const profile = await getCompanyProfile();
  const page = loadSiteConfig().pages.companyProfile;
  return (
    <>
      <PageHero title={page.hero.title} description={page.hero.description} />
      <Section>
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <ImageFrame image={profile.thumbnail} className="aspect-[4/3]" />
          <div>
            <SectionTitle title={profile.title} description={`Phiên bản ${profile.version}, cập nhật ngày ${formatDate(profile.uploadedAt)}`} />
            <div className="flex flex-wrap gap-3">
              <LinkButton href={profile.pdfUrl} variant="primary">
                <Eye size={18} />
                Xem hồ sơ năng lực
              </LinkButton>
              <LinkButton href={profile.pdfUrl} variant="secondary" download>
                <Download size={18} />
                Tải PDF
              </LinkButton>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
