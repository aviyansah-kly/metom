#!/usr/bin/env python3
"""Inventory and download legacy Metom images for manual review. Does not publish."""
import csv, hashlib, json, os, re, sys, time
from collections import deque
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse, urldefrag
from urllib.request import Request, urlopen

BASE = "https://www.metomdesign.com/"
DEST = Path("legacy-review")
UA = "MetomMigrationAudit/1.0 (+asset migration for same owner)"
MAX_PAGES = 70
EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif")

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.images, self.links = [], []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ("img", "source"):
            for k in ("src", "data-src", "data-lazy-src", "data-original", "data-bg", "data-background"):
                if a.get(k): self.images.append((a[k], a.get("alt", ""), k))
            for k in ("srcset", "data-srcset"):
                if a.get(k):
                    for entry in a[k].split(","):
                        self.images.append((entry.strip().split(" ")[0], a.get("alt", ""), k))
        if a.get("style"):
            for image in re.findall(r"url\(([^)]+)\)", a["style"]):
                self.images.append((image.strip().strip(chr(34)).strip(chr(39)), "", "style"))
        if tag == "meta" and a.get("property") in ("og:image", "twitter:image") and a.get("content"):
            self.images.append((a["content"], "", "meta"))
        if tag == "a" and a.get("href"): self.links.append(a["href"])

def fetch(url):
    req = Request(url, headers={"User-Agent": UA})
    with urlopen(req, timeout=20) as r:
        return r.geturl(), r.headers.get("Content-Type", ""), r.read()

def same_site(u):
    return urlparse(u).hostname in ("metomdesign.com", "www.metomdesign.com")

def normalize(u, page):
    u, _ = urldefrag(urljoin(page, u.strip()))
    return u

def category(page, alt):
    s = (page + " " + alt).lower()
    for words, cat in [
        (("izzah", "al-izzah"), "al-izzah"),
        (("iibs", "laboratorium", "lab-putri"), "iibs"),
        (("dian",), "bu-dr-dian"),
        (("endang", "buffet"), "bu-endang"),
        (("bromo", "pak-adi"), "pak-adi-bromo"),
        (("kitchen", "dapur"), "kitchen-set"),
        (("kantor",), "kantor"),
        (("sekolah",), "pendidikan"),
    ]:
        if any(x in s for x in words): return cat
    return "unclassified"

def main():
    DEST.mkdir(exist_ok=True)
    q = deque([BASE, urljoin(BASE, "/layanan/"), urljoin(BASE, "/portofolio/"),
               urljoin(BASE, "/tentang-kami/"), urljoin(BASE, "/blog/")])
    seen, images, errors = set(), {}, []
    while q and len(seen) < MAX_PAGES:
        page = q.popleft()
        if page in seen or not same_site(page): continue
        seen.add(page)
        try:
            resolved, typ, body = fetch(page)
            if "html" not in typ.lower(): continue
            p = PageParser(); p.feed(body.decode("utf-8", "replace"))
            for raw, alt, source in p.images:
                u = normalize(raw, resolved)
                if not u.startswith(("http://", "https://")) or u.startswith("data:"): continue
                if u not in images: images[u] = {"source_url":u, "first_seen_page":resolved,
                    "alt":alt, "source_attribute":source, "proposed_category":category(resolved, alt)}
            for href in p.links:
                u = normalize(href, resolved)
                z = urlparse(u)
                if same_site(u) and not any(z.path.lower().endswith(e) for e in EXTENSIONS):
                    if u not in seen and len(q) < 250: q.append(u)
        except Exception as e:
            errors.append({"url":page,"error":str(e)})
        time.sleep(0.12)
    records = []
    for url, item in images.items():
        try:
            _, typ, data = fetch(url)
            if not typ.startswith("image/") or len(data) < 1500:
                item.update({"status":"skipped_not_image_or_too_small", "bytes":len(data)})
            else:
                ext = { "image/jpeg":".jpg", "image/png":".png", "image/webp":".webp",
                    "image/gif":".gif", "image/avif":".avif"}.get(typ.split(";")[0], ".img")
                digest = hashlib.sha256(data).hexdigest()[:12]
                slug = re.sub(r"[^a-z0-9]+", "-", urlparse(url).path.rsplit("/",1)[-1].lower()).strip("-")[:55] or "legacy"
                folder = DEST / "assets" / item["proposed_category"]
                folder.mkdir(parents=True,exist_ok=True)
                path = folder / f"{slug}-{digest}{ext}"
                path.write_bytes(data)
                item.update({"status":"downloaded_pending_visual_review", "file":str(path), "bytes":len(data)})
        except Exception as e:
            item.update({"status":"download_failed", "error":str(e)})
        records.append(item)
    keys = ["source_url","first_seen_page","alt","source_attribute","proposed_category","status","file","bytes","error"]
    with (DEST / "media-manifest.csv").open("w",newline="",encoding="utf-8") as f:
        writer=csv.DictWriter(f,fieldnames=keys,extrasaction="ignore")
        writer.writeheader();writer.writerows(records)
    report={"pages_checked":len(seen),"media_found":len(images),
        "downloaded":sum(r["status"]=="downloaded_pending_visual_review" for r in records),"errors":errors}
    (DEST/"audit-summary.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
    print(json.dumps(report,indent=2,ensure_ascii=False))
    if not records or report["downloaded"]==0: sys.exit(2)

if __name__ == "__main__": main()
