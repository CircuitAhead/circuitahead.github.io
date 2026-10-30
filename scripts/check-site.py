"""Dependency-free checks for the static GitHub Pages site. Run with Python 3."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote, parse_qs
import hashlib
import json
import re
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
locations = ET.parse(ROOT / 'sitemap.xml').findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')
PAGES = [ROOT / urlsplit(item.text).path.lstrip('/') / 'index.html' for item in locations]

class Page(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.tags, self.scripts, self.active_script = [], [], None
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append((tag, attrs))
        if tag == 'script' and attrs.get('type') == 'application/ld+json':
            self.active_script = ''
    def handle_endtag(self, tag):
        if tag == 'script' and self.active_script is not None:
            self.scripts.append(self.active_script)
            self.active_script = None
    def handle_data(self, data):
        if self.active_script is not None:
            self.active_script += data

pages = {path: Page(path.read_text(encoding='utf-8')) for path in PAGES}
errors = []
def require(value, message):
    if not value:
        errors.append(message)

for path, page in pages.items():
    label = str(path.relative_to(ROOT))
    ids = [attrs['id'] for _, attrs in page.tags if 'id' in attrs]
    require(len(ids) == len(set(ids)), f'{label}: duplicate IDs')
    require(sum(tag == 'h1' for tag, _ in page.tags) == 1, f'{label}: expected exactly one h1')
    require(any(tag == 'main' and attrs.get('id') == 'main-content' for tag, attrs in page.tags), f'{label}: missing skip target')
    require(any(tag == 'link' and attrs.get('rel') == 'canonical' for tag, attrs in page.tags), f'{label}: missing canonical')
    require(any(tag == 'meta' and attrs.get('property') == 'og:image' for tag, attrs in page.tags), f'{label}: missing sharing image')
    require(len(page.scripts) == 1, f'{label}: missing structured data')
    for structured in page.scripts:
        try:
            require(json.loads(structured).get('@context') == 'https://schema.org', f'{label}: structured-data context')
        except ValueError:
            errors.append(f'{label}: invalid structured data')
    for tag, attrs in page.tags:
        require(not any(re.match(r'^on[a-z]+$', key) for key in attrs), f'{label}: inline event handler')
        if tag == 'img':
            require('alt' in attrs, f'{label}: image missing alt')
            require(all(attrs.get(k, '').isdigit() and int(attrs[k]) > 0 for k in ('width', 'height')), f'{label}: image dimensions missing')
        for key in ('href', 'src'):
            if key not in attrs:
                continue
            value = attrs[key]
            require(bool(value), f'{label}: empty {key}')
            url = urlsplit(value)
            if url.scheme or url.netloc:
                continue
            target = ROOT / unquote(url.path.lstrip('/')) if url.path.startswith('/') else path.parent / unquote(url.path)
            target = target.resolve()
            if target.is_dir():
                target = target / 'index.html'
            require(target.is_file(), f'{label}: missing {value}')
            if target.is_file() and target.suffix in ('.css', '.js'):
                expected_version = hashlib.sha256(target.read_bytes()).hexdigest()[:12]
                version = parse_qs(url.query).get('v', [''])[0]
                require(version == expected_version, f'{label}: stale asset version for {url.path}')
            if url.fragment and target.suffix == '.html' and target in pages:
                require(any(attrs.get('id') == unquote(url.fragment) for _, attrs in pages[target].tags), f'{label}: broken fragment {value}')
    require(not re.search(r'\.b64|onmouseenter|onmouseleave', path.read_text()), f'{label}: obsolete image plumbing')
    galleries = [attrs for _, attrs in page.tags if 'data-gallery' in attrs]
    if galleries:
        shot_links = [attrs for _, attrs in page.tags if 'data-shot' in attrs]
        expected = galleries[0].get('data-gallery-count', '')
        require(expected.isdigit() and int(expected) == len(shot_links) and int(expected) > 0, f'{label}: gallery count does not match its declared screens')
        keys = [attrs['data-shot'] for attrs in shot_links]
        require(len(keys) == len(set(keys)), f'{label}: duplicate gallery keys')
        for _, attrs in page.tags:
            if 'data-preview' in attrs:
                require(attrs['data-preview'] in keys, f'{label}: preview missing from gallery')
    for _, attrs in page.tags:
        if 'data-en' in attrs or 'data-it' in attrs:
            require(bool(attrs.get('data-en')) and bool(attrs.get('data-it')), f'{label}: incomplete bilingual copy')
    if 'body' in [tag for tag, _ in page.tags] and galleries:
        require(any(tag == 'body' and attrs.get('data-product-name') for tag, attrs in page.tags), f'{label}: gallery missing product identity')
for match in re.finditer(r"['\"](\./[a-z0-9.-]+\.js)\?v=([a-f0-9]+)['\"]", (ROOT/'js/main.js').read_text()):
    target = ROOT/'js'/match[1][2:]
    require(hashlib.sha256(target.read_bytes()).hexdigest()[:12] == match[2], f'js/main.js: stale module version for {match[1]}')
for product in json.loads((ROOT/'data/products.json').read_text())['products']:
    landing = ROOT/product['url'].lstrip('/')/'index.html'
    require(landing in pages, f'{product["id"]}: product is missing from sitemap')
    if landing in pages:
        require(any(tag == 'body' and attrs.get('data-product-name') == product['name'] for tag, attrs in pages[landing].tags), f'{product["id"]}: product page identity does not match catalog')
require((ROOT/'CNAME').read_text().strip() == 'circuitahead.com', 'Custom domain changed')
require('circuitahead.com/sitemap.xml' in (ROOT/'robots.txt').read_text(), 'Missing sitemap discovery')
if errors:
    print('\n'.join(errors), file=sys.stderr)
    raise SystemExit(1)
print(f'PASS: {len(pages)} public pages; links, fragments, asset versions, bilingual fields, product galleries, image dimensions, metadata and domain.')
