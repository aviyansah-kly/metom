# Metom — WordPress staging development (26 Sep 2026)

## Environment / non-negotiables
- Production: https://metom.id/ remains the static HTML site served from `production` via `.github/workflows/deploy-cpanel.yml`.
- WordPress preview: https://staging.metom.id/ — **currently locked with 403** via `deploy/staging-lock.htaccess`. Do not remove the lock or expose wp-admin publicly without an authenticated replacement.
- Development code: branch `wordpress/staging-development`, scope `wordpress/metom-theme/` and staging-only deployment configuration.
- Never alter `preview/home-v2/` without explicit client approval. No speculative testimonial content or warranty commitments.
- Do not put staging URLs in production sitemap or enable GA4 conversions from staging.

## Status confirmed
- The repository already contains an early custom WP theme (v0.4.0), including custom post types `metom_project`, `metom_service`, `metom_client`; basic home, project, service, blog templates.
- Its current appearance and homepage copy differ from the **current** approved static production website. The static production homepage is the design source of truth.
- Existing WPVibe account lists `staging.metom.id` but `site_info` currently fails with an authorization error while staging is locked. Do not claim staging is available for deployment until authenticated access is verified.
- No client portfolio photos or final approval for homepage V2 yet.

## Build plan in this branch
1. Refactor WordPress theme to reproduce approved **current** production HTML design system: fonts, colors, sections, desktop/mobile header, logo, WhatsApp CTA, footer; retain existing approved copy and section order. Do not import V2 preview features.
2. CMS model: Projects (cover, gallery, client, type, location, year, scope, challenge, solution, materials, publish approval); Services (fixed SEO slugs, FAQs, related projects); Articles (existing `/blog/` slugs, related services).
3. Import verified static content and images already owned/approved by Metom. Use placeholders marked unpublished for assets pending from client; never publish guessed testimonials or project facts.
4. Match every existing production clean URL, H1, meta title/description, canonical, schema, and internal links. Staging uses `noindex,nofollow`, HTTP authentication and blocked crawlers; the **final live pages must be indexable** after cutover.
5. Set up **staging-only** deployment job with separate SSH secrets and required protected environment. Never use static production deploy action for the WordPress theme.
6. Once protected staging credentials are restored, test visual parity at 390px, 768px, 1440px and interactions (mobile menu, WhatsApp, contact forms). Check PHP syntax and WP logs; compare performance, image payload and Lighthouse metrics against static production.
7. SEO parity matrix for all 20 sitemap URLs including project/blog detail pages and redirects. Prevent canonical URLs pointing to staging and avoid accidental duplication in GSC.
8. Obtain client media and approval. Run content/media QA, forms/GA4, security and backups. Confirm WordPress admin handover is documented.
9. **Single controlled cutover** after client approval: take full cPanel and DB backups; preserve static site as rollback; perform atomic front-controller/router switch while retaining all original `metom.id` URLs. Check redirect/canonical/sitemap and conversion tracking; monitor 404 and errors. Roll back to static router if verification fails.

## Access blocker
Existing production workflow unconditionally re-applies the 403 staging lock on every production deploy. Before restoring staging, design an authenticated replacement (HTTP Basic Auth or VPN/allowlist) and modify production workflow so it does not overwrite it; have owner verify protected preview access. A noindex tag alone is not sufficient access control.
