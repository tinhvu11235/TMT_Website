export type ImageAsset = {
  id?: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export type SeoFields = {
  seoTitle?: string | null;
  seoDescription?: string | null;
  ogImage?: ImageAsset | null;
};

export type NavItem = {
  id: string;
  label: string;
  url: string;
  parent?: string | null;
  order: number;
  target?: "_self" | "_blank";
  enabled: boolean;
  children?: NavItem[];
};

export type GlobalSettings = {
  companyName: string;
  companyShortName: string;
  companyEnglishName?: string;
  slogan?: string;
  taxCode?: string;
  foundedYear?: string;
  description: string;
  logo?: ImageAsset | null;
  logoDark?: ImageAsset | null;
  logoLight?: ImageAsset | null;
  favicon?: ImageAsset | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  address: string;
  phone: string;
  hotline: string;
  email: string;
  salesEmail?: string;
  zalo?: string;
  workingHours: string;
  website: string;
  googleMapsUrl?: string;
  googleMapsEmbed?: string;
  facebook?: string;
  youtube?: string;
  linkedin?: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultOgImage?: ImageAsset | null;
  googleSiteVerification?: string;
  gaId?: string;
  gtmId?: string;
  floatingContactEnabled: boolean;
};

export type CompanyLocation = {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  mapUrl?: string;
  mapEmbed?: string;
  latitude?: number;
  longitude?: number;
  isHeadOffice: boolean;
  order: number;
  enabled: boolean;
};

export type Statistic = {
  id: string;
  value: string;
  suffix?: string;
  label: string;
  icon?: string;
  order: number;
  enabled: boolean;
};

export type Service = SeoFields & {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  featuredImage?: ImageAsset | null;
  icon?: string;
  category?: string;
  order: number;
  enabled: boolean;
  featured: boolean;
  status?: "draft" | "published" | "archived";
  publishedAt?: string;
  sections?: {
    overview?: string;
    scope?: string[];
    process?: string[];
    capability?: string;
    equipment?: string[];
  };
};

export type ProjectStatus = "planning" | "in_progress" | "completed";

export type Project = SeoFields & {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  content: string;
  featuredImage?: ImageAsset | null;
  gallery: ImageAsset[];
  category: string;
  services: Service[];
  location: string;
  investor?: string;
  startYear?: number;
  completionYear?: number;
  projectScale?: string;
  companyRole?: string;
  status: ProjectStatus;
  publishStatus?: "draft" | "published" | "archived";
  enabled?: boolean;
  featured: boolean;
  order: number;
  publishedAt?: string;
  sections?: {
    introduction?: string;
    scope?: string;
    challenge?: string;
    solution?: string;
    result?: string;
  };
};

export type Article = SeoFields & {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  thumbnail?: ImageAsset | null;
  gallery: ImageAsset[];
  author?: string;
  publishedAt: string;
  featured: boolean;
  status: "draft" | "published" | "archived";
};

export type TeamMember = {
  id: string;
  name: string;
  position: string;
  department?: string;
  avatar?: ImageAsset | null;
  qualification?: string;
  experience?: string;
  bio?: string;
  order: number;
  enabled: boolean;
  showOnWebsite: boolean;
};

export type Certificate = {
  id: string;
  name: string;
  image?: ImageAsset | null;
  organization?: string;
  certificateNumber?: string;
  issuedDate?: string;
  expiredDate?: string;
  description?: string;
  order: number;
  enabled: boolean;
  featured: boolean;
  status: "draft" | "published" | "archived";
};

export type Equipment = {
  id: string;
  name: string;
  slug: string;
  category: string;
  brand?: string;
  model?: string;
  quantity: number;
  image?: ImageAsset | null;
  description?: string;
  specification?: string;
  order: number;
  enabled: boolean;
};

export type Partner = {
  id: string;
  name: string;
  logo?: ImageAsset | null;
  website?: string;
  category?: string;
  featured: boolean;
  order: number;
  enabled: boolean;
};

export type GalleryItem = {
  id: string;
  title: string;
  type: "image" | "video" | "youtube";
  category: string;
  image?: ImageAsset | null;
  videoUrl?: string;
  order: number;
  enabled: boolean;
};

export type CompanyProfile = {
  id: string;
  title: string;
  pdfUrl: string;
  thumbnail?: ImageAsset | null;
  version: string;
  uploadedAt: string;
};

export type PageContent = SeoFields & {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: ImageAsset | null;
  template: "default" | "full_width" | "landing";
  status: "draft" | "published" | "archived";
  publishedAt?: string;
};
