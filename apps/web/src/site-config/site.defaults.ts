import type { HomeBlock, HomeBlockType } from "@/site-config/site.schema";

export function createDefaultHomeBlock(type: HomeBlockType): HomeBlock {
  switch (type) {
    case "hero":
      return {
        id: "home-hero",
        type,
        enabled: true,
        config: {
          eyebrow: "Giới thiệu",
          title: "Tiêu đề trang chủ",
          description: "Mô tả trang chủ",
          image: null,
          mobileImage: null,
          primaryCta: { label: "Tìm hiểu thêm", href: "/gioi-thieu" },
          secondaryCta: { label: "Liên hệ", href: "/lien-he" }
        }
      };
    case "statistics":
      return { id: "home-statistics", type, enabled: true, config: { limit: 4 } };
    case "about":
      return {
        id: "home-about",
        type,
        enabled: true,
        config: {
          eyebrow: "Giới thiệu",
          title: "Về chúng tôi",
          description: "Giới thiệu doanh nghiệp",
          image: null,
          highlights: ["Năng lực chuyên môn"],
          cta: { label: "Tìm hiểu thêm", href: "/gioi-thieu" }
        }
      };
    case "services":
      return { id: "home-services", type, enabled: true, config: { title: "Dịch vụ", description: "Dịch vụ của chúng tôi", limit: 6 } };
    case "projects":
      return {
        id: "home-projects",
        type,
        enabled: true,
        config: { title: "Dự án", description: "Dự án tiêu biểu", limit: 4, cta: { label: "Xem tất cả", href: "/du-an" } }
      };
    case "capabilities":
      return {
        id: "home-capabilities",
        type,
        enabled: true,
        config: { eyebrow: "Năng lực", title: "Năng lực", description: "Năng lực doanh nghiệp", items: ["Năng lực chuyên môn"] }
      };
    case "certificates":
      return { id: "home-certificates", type, enabled: true, config: { title: "Chứng chỉ", description: "Chứng chỉ năng lực", limit: 4 } };
    case "news":
      return { id: "home-news", type, enabled: true, config: { title: "Tin tức", description: "Tin tức mới nhất", limit: 3 } };
    case "partners":
      return { id: "home-partners", type, enabled: true, config: { title: "Đối tác", description: "Đối tác của chúng tôi", limit: 8 } };
    case "cta":
      return {
        id: "home-cta",
        type,
        enabled: true,
        config: { title: "Liên hệ với chúng tôi", description: "Trao đổi về dự án của bạn", cta: { label: "Liên hệ", href: "/lien-he" } }
      };
  }
}

