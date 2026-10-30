# Architecture

```text
Internet
|
Reverse Proxy (Nginx or Caddy)
|
+-------------------+-------------------+
|                                       |
Next.js web                            Directus CMS/Admin
|                                       |
+-------------------+-------------------+
                    |
              PostgreSQL
                    |
              Media storage
```

## Responsibilities and ownership

Next.js renders the public website, SEO metadata, sitemap, robots, contact form UI and server-side content fetching. `apps/web/config/site.config.json` is the versioned source of truth for company identity, branding, contact details, social links, navigation, theme tokens, static page copy/SEO and homepage composition.

Directus remains the source of truth for collection records: services, projects, articles, statistics, certificates, equipment, team members, partners, gallery, company locations, company profiles and contact requests. Successful empty list collections stay empty. `getCompanyProfile()` is an exception: it still returns the demo profile when the collection is empty. Provider request failures use demo seed content, including in production; this policy needs review before deployment.

PostgreSQL is private to Docker/internal network. It is not exposed to the internet.

Media uses Directus local storage in development. The storage boundary is isolated so production can move to S3 or MinIO.

The CMS schema in `infra/directus/collections.json` is a reference, not an executable snapshot or migration. Collection creation, permissions, webhook setup and real-CMS integration still require implementation and verification. This repository is an MVP and is not production-ready; see `docs/AI_HANDOFF.md` for the remaining work.

The public homepage follows a server-first pipeline:

```text
validated SiteConfig
  -> enabled-block data planner
  -> Directus/content facade
  -> typed server page model
  -> exhaustive server block renderer
  -> HTML/RSC
```

The development-only editor at `/customize` keeps draft state in memory, previews through a same-origin iframe and exports validated JSON. It never writes repository files or replaces SiteConfig as the source of truth. Both editor routes are hard-404 in production.

The frontend applies SiteConfig theme colors as CSS variables. Routing remains code-owned and collections never move into SiteConfig.
