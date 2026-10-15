# Metom SEO growth QA — 15 October 2026

Branch: `seo-growth-2026-10-15` (based on `production`). **Do not merge/deploy to production without owner approval.**

## Evidence baseline
- GSC sheet last successful sync: 2026-10-13 08:41 WIB; finalized range 2026-09-12–2026-10-09.
- 28-day totals: 6 clicks / 89 impressions / 6.7% CTR / average position 18.4.
- Sync 14–15 October unconfirmed; troubleshoot Apps Script execution history, time trigger, auth, API quota. Do not treat missing data as zero traffic.
- Highest near-term commercial opportunity: `/custom-furniture-malang/` (22 impressions, 1 click, average position 13.1); sample too small for confident CTR/title decisions.

## QA acceptance checklist (run on staging before production)
1. Crawl homepage, /custom-furniture-malang/, /kitchen-set-malang/, /jasa-desain-interior-malang/, /interior-batu/, /proyek/, /galeri/. Assert HTTP 200, indexable robots, unique descriptive title/meta/H1, canonical HTTPS and valid structured data.
2. Confirm internal links connect service → project → gallery and back; check for broken links and mobile layout overflow.
3. Confirm gallery WebP images have descriptive alt text, sensible dimensions, and image visibility via GSC Search type Image; absence from GSC Pages does not prove deindexing.
4. Test lead capture in staging: fire a successful-lead event **only after backend confirmation**; distinguish WhatsApp click from form submission and from qualified lead. Use synthetic contact data only.
5. Verify NAP, official GBP ownership, and legacy domain redirect mapping with owner before publishing claims or redirects.
6. Review real project photos, permissions, and factual descriptions before replacing any stock photography.
7. Recheck finalized equal 7-day windows weekly and non-overlapping 28-day windows when available. Report nonbrand clicks and qualified inquiries separately.

## Release gate
- Source/staging changes and QA permitted.
- No production merge, GitHub Actions production deployment, DNS changes, GBP changes, or external outreach without explicit approval.
