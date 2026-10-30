import { z } from "zod";

const colorPattern = /^#[0-9a-f]{6}$/i;
const localPathPattern = /^\/(?!\/)[^\s]*$/;

export const allowedRemoteImageHosts = ["picsum.photos"] as const;

function isInternalOrHttpsUrl(value: string) {
  if (localPathPattern.test(value)) return true;

  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isAllowedAssetSource(value: string) {
  if (localPathPattern.test(value)) return true;

  try {
    const url = new URL(value);
    return url.protocol === "https:" && allowedRemoteImageHosts.includes(url.hostname as (typeof allowedRemoteImageHosts)[number]);
  } catch {
    return false;
  }
}

export const siteLinkSchema = z.string().trim().min(1).refine(isInternalOrHttpsUrl, {
  message: "Expected a local path beginning with / or an HTTPS URL"
});

export const assetSchema = z
  .object({
    src: z.string().trim().min(1).refine(isAllowedAssetSource, {
      message: `Expected a local public path or HTTPS asset hosted by: ${allowedRemoteImageHosts.join(", ")}`
    }),
    alt: z.string().trim().min(1).max(240),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional()
  })
  .strict();

const nullableAssetSchema = assetSchema.nullable().optional();
const colorSchema = z.string().regex(colorPattern, "Expected a six-digit hexadecimal color");

const ctaSchema = z
  .object({
    label: z.string().trim().min(1).max(120),
    href: siteLinkSchema
  })
  .strict();

const pageHeroSchema = z
  .object({
    title: z.string().trim().min(1).max(180),
    description: z.string().trim().min(1).max(600)
  })
  .strict();

export const pageSeoSchema = z
  .object({
    title: z.string().trim().min(1).max(180),
    description: z.string().trim().min(1).max(600),
    ogImage: nullableAssetSchema,
    indexable: z.boolean().default(true)
  })
  .strict();

const baseBlockSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Expected a stable kebab-case block ID"),
  enabled: z.boolean()
});

export const heroBlockSchema = baseBlockSchema
  .extend({
    type: z.literal("hero"),
    config: z
      .object({
        eyebrow: z.string().trim().min(1).max(160),
        title: z.string().trim().min(1).max(240),
        description: z.string().trim().min(1).max(800),
        image: nullableAssetSchema,
        mobileImage: nullableAssetSchema,
        primaryCta: ctaSchema,
        secondaryCta: ctaSchema
      })
      .strict()
  })
  .strict();

export const statisticsBlockSchema = baseBlockSchema
  .extend({
    type: z.literal("statistics"),
    config: z.object({ limit: z.number().int().min(1).max(12).default(4) }).strict()
  })
  .strict();

export const aboutBlockSchema = baseBlockSchema
  .extend({
    type: z.literal("about"),
    config: z
      .object({
        eyebrow: z.string().trim().min(1).max(120),
        title: z.string().trim().min(1).max(240),
        description: z.string().trim().min(1).max(800),
        image: nullableAssetSchema,
        highlights: z.array(z.string().trim().min(1).max(240)).min(1).max(8),
        cta: ctaSchema
      })
      .strict()
  })
  .strict();

function collectionBlockSchema<TType extends string>(type: TType, defaultLimit: number, maxLimit: number) {
  return baseBlockSchema
    .extend({
      type: z.literal(type),
      config: z
        .object({
          title: z.string().trim().min(1).max(240),
          description: z.string().trim().min(1).max(800),
          limit: z.number().int().min(1).max(maxLimit).default(defaultLimit)
        })
        .strict()
    })
    .strict();
}

export const servicesBlockSchema = collectionBlockSchema("services", 6, 12);

export const projectsBlockSchema = baseBlockSchema
  .extend({
    type: z.literal("projects"),
    config: z
      .object({
        title: z.string().trim().min(1).max(240),
        description: z.string().trim().min(1).max(800),
        limit: z.number().int().min(1).max(12).default(4),
        cta: ctaSchema
      })
      .strict()
  })
  .strict();

export const capabilitiesBlockSchema = baseBlockSchema
  .extend({
    type: z.literal("capabilities"),
    config: z
      .object({
        eyebrow: z.string().trim().min(1).max(120),
        title: z.string().trim().min(1).max(240),
        description: z.string().trim().min(1).max(800),
        items: z.array(z.string().trim().min(1).max(240)).min(1).max(8)
      })
      .strict()
  })
  .strict();

export const certificatesBlockSchema = collectionBlockSchema("certificates", 4, 12);
export const newsBlockSchema = collectionBlockSchema("news", 3, 12);
export const partnersBlockSchema = collectionBlockSchema("partners", 8, 16);

export const ctaBlockSchema = baseBlockSchema
  .extend({
    type: z.literal("cta"),
    config: z
      .object({
        title: z.string().trim().min(1).max(240),
        description: z.string().trim().min(1).max(800),
        cta: ctaSchema
      })
      .strict()
  })
  .strict();

export const homeBlockSchema = z.discriminatedUnion("type", [
  heroBlockSchema,
  statisticsBlockSchema,
  aboutBlockSchema,
  servicesBlockSchema,
  projectsBlockSchema,
  capabilitiesBlockSchema,
  certificatesBlockSchema,
  newsBlockSchema,
  partnersBlockSchema,
  ctaBlockSchema
]);

const blockTypes = [
  "hero",
  "statistics",
  "about",
  "services",
  "projects",
  "capabilities",
  "certificates",
  "news",
  "partners",
  "cta"
] as const;

const homeBlocksSchema = z.array(homeBlockSchema).max(blockTypes.length).superRefine((blocks, context) => {
  const ids = new Set<string>();
  const types = new Set<string>();

  blocks.forEach((block, index) => {
    if (ids.has(block.id)) {
      context.addIssue({
        code: "custom",
        message: `Duplicate block ID: ${block.id}`,
        path: [index, "id"]
      });
    }
    ids.add(block.id);

    if (types.has(block.type)) {
      context.addIssue({
        code: "custom",
        message: `Block type ${block.type} can only appear once in SiteConfig V1`,
        path: [index, "type"]
      });
    }
    types.add(block.type);
  });
});

const staticPageSchema = z
  .object({
    hero: pageHeroSchema,
    seo: pageSeoSchema
  })
  .strict();

const navigationItemSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    label: z.string().trim().min(1).max(80),
    href: siteLinkSchema,
    target: z.enum(["_self", "_blank"]).default("_self"),
    enabled: z.boolean().default(true)
  })
  .strict();

const navigationItemsSchema = z.array(navigationItemSchema).max(20).superRefine((items, context) => {
  const ids = new Set<string>();
  items.forEach((item, index) => {
    if (ids.has(item.id)) {
      context.addIssue({ code: "custom", message: `Duplicate navigation ID: ${item.id}`, path: [index, "id"] });
    }
    ids.add(item.id);
  });
});

export const siteConfigSchema = z
  .object({
    version: z.literal(1),
    site: z.object({ locale: z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/) }).strict(),
    company: z
      .object({
        name: z.string().trim().min(1).max(180),
        shortName: z.string().trim().min(1).max(100),
        englishName: z.string().trim().max(180).optional(),
        tagline: z.string().trim().max(240).optional(),
        description: z.string().trim().min(1).max(1200),
        taxCode: z.string().trim().max(40).optional(),
        foundedYear: z.string().regex(/^\d{4}$/).optional()
      })
      .strict(),
    brand: z
      .object({
        logo: nullableAssetSchema,
        logoLight: nullableAssetSchema,
        logoDark: nullableAssetSchema,
        favicon: nullableAssetSchema
      })
      .strict(),
    contact: z
      .object({
        phone: z.string().trim().max(60).optional(),
        hotline: z.string().trim().max(60).optional(),
        email: z.email().optional(),
        salesEmail: z.email().optional(),
        address: z.string().trim().max(400).optional(),
        zalo: z.url({ protocol: /^https$/ }).optional(),
        whatsapp: z.url({ protocol: /^https$/ }).optional(),
        businessHours: z.string().trim().max(240).optional(),
        website: z.url({ protocol: /^https$/ }).optional(),
        mapsUrl: z.url({ protocol: /^https$/ }).optional(),
        floatingEnabled: z.boolean().default(true)
      })
      .strict(),
    social: z
      .object({
        facebook: z.url({ protocol: /^https$/ }).optional(),
        youtube: z.url({ protocol: /^https$/ }).optional(),
        linkedin: z.url({ protocol: /^https$/ }).optional()
      })
      .strict(),
    navigation: z
      .object({
        primary: navigationItemsSchema,
        headerActions: z
          .array(navigationItemSchema.extend({ style: z.enum(["primary", "secondary", "accent"]) }).strict())
          .max(3),
        footerLegal: navigationItemsSchema,
        labels: z
          .object({
            navigation: z.string().trim().min(1).max(80),
            services: z.string().trim().min(1).max(80),
            contact: z.string().trim().min(1).max(80)
          })
          .strict()
      })
      .strict(),
    seo: z
      .object({
        defaultTitle: z.string().trim().min(1).max(180),
        titleTemplate: z.string().trim().includes("%s", { message: "Title template must include %s" }).max(220),
        defaultDescription: z.string().trim().min(1).max(600),
        siteName: z.string().trim().min(1).max(180),
        locale: z.string().trim().min(2).max(20),
        defaultOgImage: nullableAssetSchema,
        googleSiteVerification: z.string().trim().max(240).optional()
      })
      .strict(),
    theme: z
      .object({
        primary: colorSchema,
        secondary: colorSchema,
        accent: colorSchema,
        background: colorSchema,
        foreground: colorSchema,
        surface: colorSchema,
        muted: colorSchema,
        mutedForeground: colorSchema,
        border: colorSchema
      })
      .strict(),
    pages: z
      .object({
        home: z.object({ seo: pageSeoSchema, blocks: homeBlocksSchema }).strict(),
        about: staticPageSchema.extend({
          sections: z
            .object({
              overview: pageHeroSchema,
              history: pageHeroSchema,
              vision: pageHeroSchema,
              values: pageHeroSchema,
              organization: pageHeroSchema,
              facilities: pageHeroSchema
            })
            .strict(),
          team: pageHeroSchema
        }).strict(),
        services: staticPageSchema,
        projects: staticPageSchema,
        capabilities: staticPageSchema.extend({
          certificatesTitle: z.string().trim().min(1).max(180),
          equipmentTitle: z.string().trim().min(1).max(180),
          profileCtaLabel: z.string().trim().min(1).max(120)
        }).strict(),
        news: staticPageSchema,
        gallery: staticPageSchema,
        partners: staticPageSchema,
        contact: staticPageSchema,
        companyProfile: staticPageSchema,
        search: staticPageSchema,
        privacy: staticPageSchema.extend({ content: z.array(z.string().trim().min(1).max(1200)).min(1).max(12) }).strict()
      })
      .strict()
  })
  .strict();

export type AssetConfig = z.infer<typeof assetSchema>;
export type HomeBlock = z.infer<typeof homeBlockSchema>;
export type HomeBlockType = HomeBlock["type"];
export type SiteConfig = z.infer<typeof siteConfigSchema>;

