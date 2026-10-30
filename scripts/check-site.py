"""Dependency-free checks for the static GitHub Pages site. Run with Python 3."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
PAGES = [ROOT / p for p in ('index.html', 'remoriq/index.html', 'support/index.html', 'privacy/index.html')]

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
            if url.fragment and target.suffix == '.html' and target in pages:
                require(any(attrs.get('id') == unquote(url.fragment) for _, attrs in pages[target].tags), f'{label}: broken fragment {value}')
    require(not re.search(r'\.b64|onmouseenter|onmouseleave', path.read_text()), f'{label}: obsolete image plumbing')

product = pages[ROOT / 'remoriq/index.html']
shot_links = [(tag, attrs) for tag, attrs in product.tags if 'data-shot' in attrs]
require(len(shot_links) == 6, 'Product gallery must contain all six screenshots')
for _, attrs in shot_links:
    asset = ROOT / attrs['href'].lstrip('/')
    require(asset.read_bytes().startswith(b'\xff\xd8\xff'), f'{asset.name}: invalid JPEG')
require((ROOT/'CNAME').read_text().strip() == 'circuitahead.com', 'Custom domain changed')
require('circuitahead.com/sitemap.xml' in (ROOT/'robots.txt').read_text(), 'Missing sitemap discovery')
if errors:
    print('\n'.join(errors), file=sys.stderr)
    raise SystemExit(1)
print(f'PASS: {len(pages)} pages; local links and fragments, image dimensions, all 6 screenshots, metadata, structured data and domain.')
