# Metom WordPress Implementation

Domain final: `metom.id`

## Strategy

Website lama tidak dipertahankan, sehingga implementasi dianggap sebagai **new build** di WordPress pada domain baru. Tidak ada ketergantungan pada source code website lama dan tidak ada asumsi bahwa 301 redirect dari domain lama tersedia.

Prototype HTML di root repository tetap menjadi visual baseline. WordPress hanya mengubahnya menjadi sistem dinamis yang mudah dikelola.

## Homepage order

1. Hero
2. Client Logos / Trusted By
3. Selected Projects
4. Services
5. About / Metom
6. SEO Service Section
7. Process
8. Studio
9. Journal / Insights
10. Final CTA

## Content model

### Project (`metom_project`)
- Project title
- Location
- Year
- Category
- Scope
- Challenge
- Solution
- Materials
- Duration
- Featured image
- Gallery
- Testimonial
- Related service

### Service (`metom_service`)
- Service title
- Intro
- Target customer
- Area served
- Benefits / strengths
- Process
- Budget guidance (optional)
- Related projects
- FAQ
- CTA

### Journal
Use native WordPress posts for SEO articles and supporting content.

## Initial service pages

- Jasa Desain Interior Malang
- Interior Rumah Malang
- Kitchen Set Malang
- Interior Kantor Malang
- Design & Build Malang
- Custom Furniture Malang

## SEO approach for metom.id

Because `metom.id` is a new domain, prioritize authority building instead of relying on migration equity:

1. Launch with complete money pages, not an empty brochure site.
2. Publish real project case studies using first-party Metom data and photography.
3. Build topic clusters around each service.
4. Start with approximately 4 strong SEO articles + 2 case studies/month.
5. Connect Google Business Profile, Search Console, and GA4 immediately after launch.
6. Review Search Console queries monthly and optimize pages already earning impressions.

## Asset dependency

Portfolio photos are currently the main content blocker. Client should organize assets as:

`Portfolio / [Project Name] / Cover / Final / Before / Process`

Each project should also have location, year, category, scope, challenge, solution, materials, and publication permission.

## Build sequence

- [ ] Domain `metom.id` access + DNS
- [ ] Hosting/staging access
- [ ] Staging WordPress install + noindex
- [x] Visual HTML prototype available
- [x] Homepage hierarchy updated: Hero > Clients > Projects > Services
- [x] WordPress theme scaffold started
- [ ] Convert static header/footer/global styles into theme
- [ ] Implement front page dynamically
- [ ] Implement Project archive + single template
- [ ] Implement Service archive + single template
- [ ] Implement Journal archive + single post
- [ ] Add custom fields (ACF or native meta)
- [ ] Import organized portfolio + client logos
- [ ] Responsive/browser QA
- [ ] Technical SEO + schema + sitemap
- [ ] GA4 + Search Console + WhatsApp conversion tracking
- [ ] Performance optimization
- [ ] Launch QA + final backup
- [ ] Controlled production launch
- [ ] Post-launch indexing/CWV/lead monitoring
