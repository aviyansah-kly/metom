# Metom SEO execution — 3 November 2026

## Verified measurement baseline
Source: Metom Project Monitoring > SEO Overview, SEO Pages, SEO Queries, SEO Daily; final dates 2026-10-03 through 2026-10-30 (28 days). Last automatic GSC sync 2026-11-03 08:41 WIB.

- 155 impressions; 6 clicks; CTR 3.9%; average position 17.0.
- 17–23 Oct: 50 impressions; 0 clicks. 24–30 Oct: 24 impressions; 1 click. Non-overlapping 7-day impressions declined 52%; small sample, not a stable trend.
- Priority commercial pages (as of 3 Nov): custom furniture 62 impressions/2 clicks; interior design 27/0; interior rumah 21/0.
- Visible non-brand queries have 0 clicks, but GSC suppresses some query rows, so this is not all non-brand traffic.
- Gallery absent in GSC Pages is not proof of non-indexing. URL Inspection is needed.
- Qualified lead reporting requires client validation: repeated contact numbers and GA4 click/submit events are not proof of delivered inquiries.

## Change set (PR #12)
- Clarify Malang-local H1 on Interior Rumah and Kitchen Set.
- Strengthen search-result title/description on Custom Furniture, Kitchen Set and Jasa Desain Interior.
- Link service content to /galeri/ and relevant service pages to aid user discovery.
- Clarify gallery intent and include 17 actual /assets/legacy-projects/*.webp image paths from galeri.html in sitemap.xml's official image extension.
- No invented projects, pricing, client quotes, reviews or ranking claims.
- No canonical, robots, URLs, GA4 lead-generation logic, hosting settings or production deployment changed.

## Release gate
1. Confirm GitHub PR checks, manually inspect responsive layout at desktop/mobile, and verify every contextual link works.
2. Verify all 17 referenced images resolve to 200 on staging or live (source-to-XML path check completed, HTTP validation pending).
3. Check sitemap.xml XML is valid and returns HTTP 200; verify page canonical/indexable and structured data after release.
4. Obtain explicit owner approval, then merge PR #12 to production. GitHub Actions deploys on production pushes.
5. Confirm live page source, gallery and sitemap, then use GSC URL Inspection. Don't count submitted sitemap or indexing requests as guaranteed indexed pages.

## Action-oriented daily operating rhythm
- Every 08:45–09:15 WIB: verify fresh GSC Sync Log SUCCESS plus *advancing finalized date*, compare two non-overlapping completed seven-day windows, and monitor page/query shifts. Never compare overlapping rolling 28-day snapshots as independent growth.
- Every workday: complete and QA one concrete SEO improvement with evidence (page content/UX, project proof, internal links, Search Console indexing diagnosis, GBP validation, or qualified-lead checks); record branch/commit/PR and release status.
- Every week: assess high-impression pages, 7-day non-brand queries, CTR and actual inquiries with unique-contact deduplication.
- When 56 consecutive days of finalized GSC Daily data exist, evaluate independent 28-day windows.
- Obtain client-owned authentic project photos/details, Google Business Profile access/address/hours, and real WhatsApp inquiry outcomes.
- No production deployment without explicit approval.

## Success criteria
Leading indicators: verified indexable gallery, 17 project image paths discoverable via sitemap, accurate page title/intro matching intent, complete internal links, reliable GSC/GA4/lead evidence and published changes.
Lagging indicators: growth in impressions and clicks for *comparable final periods*, non-brand clicks, unique qualified leads, proposals and won projects. No promise of daily ranking or traffic increases.
