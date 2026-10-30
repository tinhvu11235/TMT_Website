import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_CMS_URL: z.url().default("http://localhost:8055"),
  CMS_INTERNAL_URL: z.url().optional(),
  DIRECTUS_STATIC_TOKEN: z.string().optional(),
  CONTACT_RATE_LIMIT_WINDOW_MS: z.coerce.number().positive().default(60000),
  CONTACT_RATE_LIMIT_MAX: z.coerce.number().positive().default(5),
  REVALIDATION_SECRET: z.string().optional(),
  ENABLE_SITE_EDITOR: z.enum(["true", "false"]).default("false")
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_CMS_URL: process.env.NEXT_PUBLIC_CMS_URL,
  CMS_INTERNAL_URL: process.env.CMS_INTERNAL_URL,
  DIRECTUS_STATIC_TOKEN: process.env.DIRECTUS_STATIC_TOKEN,
  CONTACT_RATE_LIMIT_WINDOW_MS: process.env.CONTACT_RATE_LIMIT_WINDOW_MS,
  CONTACT_RATE_LIMIT_MAX: process.env.CONTACT_RATE_LIMIT_MAX,
  REVALIDATION_SECRET: process.env.REVALIDATION_SECRET,
  ENABLE_SITE_EDITOR: process.env.ENABLE_SITE_EDITOR
});

export const cmsUrl = env.CMS_INTERNAL_URL ?? env.NEXT_PUBLIC_CMS_URL;
