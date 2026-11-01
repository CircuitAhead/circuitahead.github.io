'Render the shared product directory as static HTML. Python standard library only.'
from pathlib import Path
from html import escape
import argparse
import hashlib
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
DOMAIN = 'https://circuitahead.com'
KINDS = {
    'app': {'en': 'App', 'it': 'App'},
    'tool': {'en': 'Tool', 'it': 'Strumento'},
    'game': {'en': 'Game', 'it': 'Gioco'},
}
STATUSES = {
    'development': {'en': 'In development', 'it': 'In sviluppo'},
    'beta': {'en': 'Beta', 'it': 'Beta'},
    'available': {'en': 'Available', 'it': 'Disponibile'},
}

def text(tag, copy, attrs=''):
    en, it = copy['en'], copy['it']
    return f'<{tag} data-en="{escape(en, quote=True)}" data-it="{escape(it, quote=True)}"{(" " + attrs) if attrs else ""}>{escape(en)}</{tag}>'

def pair(en, it):
    return {'en': en, 'it': it}

def image(asset, alt, cls=''):
    localized = isinstance(alt, dict)
    extra = f' class="{escape(cls,quote=True)}"' if cls else ''
    if localized:
        extra += f' data-alt-en="{escape(alt["en"],quote=True)}" data-alt-it="{escape(alt["it"],quote=True)}"'
        alt = alt['en']
    return (f'<img src="{escape(asset["src"], quote=True)}" width="{asset["width"]}" height="{asset["height"]}" '
            f'alt="{escape(alt, quote=True)}"{extra} loading="lazy" decoding="async">')

def fingerprint(path):
    return hashlib.sha256((ROOT / path.lstrip('/')).read_bytes()).hexdigest()[:12]

def versioned(path):
    return path + '?v=' + fingerprint(path)

def read_products():
    products = json.loads((ROOT / 'data/products.json').read_text())['products']
    if not products:
        raise ValueError('The catalog must contain at least one real product.')
    ids = set()
    urls = set()
    for product in products:
        slug = product['id']
        if not re.fullmatch(r'[a-z][a-z0-9-]*', slug) or slug in ids:
            raise ValueError(f'Invalid or repeated product ID: {slug}')
        ids.add(slug)
        if not product['name'].strip() or product['kind'] not in KINDS or product['status'] not in STATUSES:
            raise ValueError(f'Invalid product metadata: {slug}')
        if 'icon' not in product:
            raise ValueError(f'Missing product icon: {slug}')
        if product['url'] in urls:
            raise ValueError(f'Repeated product URL: {slug}')
        urls.add(product['url'])
        if not product['platforms'] or not all(isinstance(p, str) and p.strip() for p in product['platforms']):
            raise ValueError(f'Missing platforms: {slug}')
        if 'home_visible' in product and not isinstance(product['home_visible'], bool):
            raise ValueError(f'Invalid home visibility flag: {slug}')
        for field in ('url', 'support_url', 'privacy_url'):
            url = product[field]
            if not re.fullmatch(r'/(?:[a-z0-9-]+/)+', url) or not (ROOT / url.lstrip('/') / 'index.html').is_file():
                raise ValueError(f'Missing or invalid {field}: {slug}: {url}')
        for field in ('summary', 'description', 'category'):
            if field == 'summary' or field in product:
                if not all(product[field].get(lang, '').strip() for lang in ('en', 'it')):
                    raise ValueError(f'Missing bilingual {field}: {slug}')
        for field in ('icon', 'preview', 'catalog_preview'):
            if field not in product:
                continue
            asset = product[field]
            if not re.fullmatch(r'/assets/[a-zA-Z0-9._/-]+', asset['src']) or not (ROOT / asset['src'].lstrip('/')).is_file():
                raise ValueError(f'Missing {field} image: {slug}')
            if not all(isinstance(asset[k], int) and asset[k] > 0 for k in ('width', 'height')):
                raise ValueError(f'Missing {field} dimensions: {slug}')
    if sum(bool(p.get('featured')) for p in products) > 1:
        raise ValueError('Select at most one featured product for the Home.')
    return products

def card(product, heading='h2'):
    name = product['name']
    tags = text('span', KINDS[product['kind']]) + text('span', STATUSES[product['status']])
    platforms = ''.join(f'<span>{escape(platform)}</span>' for platform in product['platforms'])
    preview = product.get('catalog_preview')
    artwork = f'<a class="catalog-preview" href="{product["url"]}">{image(preview, preview["alt"])}</a>' if preview else ''
    return f'''<article class="catalog-card reveal" data-catalog-product data-product-kind="{product['kind']}" data-product-id="{product['id']}">
  <div class="catalog-card-top">{image(product['icon'], name)}<div class="catalog-tags">{tags}</div></div>
  <{heading}>{escape(name)}</{heading}>
{artwork}
  {text('p', product['summary'], 'class="catalog-summary"')}
  <div class="catalog-platforms">{platforms}</div>
  <div class="catalog-card-actions">{text('a', pair(f'Discover {name} →', f'Scopri {name} →'), f'href="{product["url"]}" class="button button-primary"')}</div>
  <div class="catalog-card-links">{text('a', pair('Product support', 'Supporto del prodotto'), f'href="{product["support_url"]}"')}{text('a', pair('Privacy policy', 'Informativa privacy'), f'href="{product["privacy_url"]}"')}</div>
</article>'''

def home_products(products):
    product = next((p for p in products if p.get('featured')), products[0])
    name = product['name']
    highlights = ''.join('<span><i></i>' + text('span', item) + '</span>' for item in product.get('highlights', []))
    preview = product.get('preview')
    artwork = ''
    if preview:
        shape = preview.get('shape', 'landscape')
        artwork = f'<div class="product-art product-art-real" data-preview-shape="{escape(shape)}"><a href="{product["url"]}" class="product-device">{image(preview, preview["alt"])}</a></div>'
    featured = f'''<article class="product-showcase reveal" data-featured-product="{product['id']}">
  <div class="product-content">
    <div class="product-meta">{text('span', STATUSES[product['status']], 'class="product-status"')}<span class="product-number">{products.index(product)+1:02d}</span></div>
    <div class="product-name-row"><div class="product-icon">{image(product['icon'], name)}</div><div>{text('p', product.get('category', KINDS[product['kind']]), 'class="product-type"')}<h3>{escape(name)}</h3></div></div>
    {text('p', product['summary'], 'class="product-description"')}
    {text('p', product.get('description', product['summary']), 'class="product-body"')}
    <div class="product-features">{highlights}</div>
    {text('a', pair(f'Discover {name} ↗', f'Scopri {name} ↗'), f'href="{product["url"]}" class="product-link"')}
  </div>{artwork}
</article>'''
    other = [p for p in products if p['id'] != product['id'] and p.get('home_visible', True)]
    return featured + ('\n<div class="home-product-grid">' + '\n'.join(card(p, 'h3') for p in other) + '</div>' if other else '')

def header():
    links = text('a', pair('Products', 'Prodotti'), 'href="/products/"') + text('a', pair('Support', 'Supporto'), 'href="/help/"') + text('a', pair('About CircuitAhead', 'Chi è CircuitAhead'), 'href="/#about"')
    return f'''<header class="site-header" id="top"><div class="container header-inner">
<a class="brand" href="/" aria-label="CircuitAhead home"><img class="brand-logo" src="/assets/circuitahead-logo.webp" width="724" height="543" alt="CircuitAhead"></a>
<nav class="desktop-nav" aria-label="Main navigation">{links}</nav>
{text('a', pair('Contact ↗', 'Contatti ↗'), 'class="header-contact" href="mailto:contact@circuitahead.com"')}
<button class="menu-button" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="mobile-navigation"><span></span><span></span></button></div>
<nav class="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation">{links}</nav></header>'''

def footer():
    return '<footer class="catalog-footer"><div class="container">' + text('p', pair('Independent apps, tools and games by CircuitAhead.', 'App, strumenti e giochi indipendenti di CircuitAhead.')) + '<nav aria-label="Footer">' + text('a', pair('Products', 'Prodotti'), 'href="/products/"') + text('a', pair('Support', 'Supporto'), 'href="/help/"') + text('a', pair('Product privacy policies', 'Privacy dei prodotti'), 'href="/legal/"') + '</nav><p>© <span id="current-year">2026</span> CircuitAhead.</p></div></footer>'

def page(slug, title, description, content, structured):
    path = f'/{slug}/'
    return f'''<!doctype html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<script src="{versioned('/js/language.js')}"></script>
{text('title', title)}
<meta name="description" content="{escape(description['en'], quote=True)}" data-content-en="{escape(description['en'], quote=True)}" data-content-it="{escape(description['it'], quote=True)}">
<meta name="theme-color" content="#ffffff"><meta name="referrer" content="strict-origin-when-cross-origin">
<link rel="canonical" href="{DOMAIN+path}"><meta property="og:url" content="{DOMAIN+path}">
<meta property="og:title" content="{escape(title['en'], quote=True)}" data-content-en="{escape(title['en'], quote=True)}" data-content-it="{escape(title['it'], quote=True)}">
<meta property="og:description" content="{escape(description['en'], quote=True)}" data-content-en="{escape(description['en'], quote=True)}" data-content-it="{escape(description['it'], quote=True)}">
<meta property="og:type" content="website"><meta property="og:site_name" content="CircuitAhead"><meta property="og:image" content="{DOMAIN}/assets/circuitahead-logo.webp"><meta name="twitter:card" content="summary">
<link rel="icon" href="/assets/favicon.png"><link rel="apple-touch-icon" href="/assets/circuitahead-logo.png">
<link rel="stylesheet" href="{versioned('/css/styles.css')}"><link rel="stylesheet" href="{versioned('/css/catalog.css')}"><link rel="stylesheet" href="{versioned('/css/motion.css')}">
<link rel="modulepreload" href="{versioned('/js/motion.js')}"><script type="module" src="{versioned('/js/main.js')}"></script>
<script type="application/ld+json">{json.dumps(structured,ensure_ascii=False,separators=(',',':'))}</script>
</head><body class="catalog-page" data-page="{slug}">
{text('a',pair('Skip to content','Vai al contenuto'),'class="skip-link" href="#main-content"')}
{header()}<main id="main-content" tabindex="-1">{content}</main>{footer()}
</body></html>
'''

def directory(products, kind):
    rows = []
    for product in products:
        name = product['name']
        url = product['support_url'] if kind == 'help' else product['privacy_url']
        label = pair(f'Support for {name} →', f'Supporto {name} →') if kind == 'help' else pair(f'{name} privacy policy →', f'Informativa {name} →')
        rows.append('<article class="product-directory-entry reveal">' + image(product['icon'], name) + '<div><h2>' + escape(name) + '</h2>' + text('p', product['summary']) + '</div>' + text('a', label, f'href="{url}" class="button button-secondary"') + '</article>')
    return '<div class="product-directory">' + '\n'.join(rows) + '</div>'

def render(products):
    intros = {
        'products': (pair('Products | CircuitAhead', 'Prodotti | CircuitAhead'), pair('Apps, tools and games. Each with its own identity.', 'App, strumenti e giochi. Ognuno con la propria identità.'), pair('Explore CircuitAhead products: features, images, platforms and availability to find what interests you.', 'Esplora i prodotti CircuitAhead: funzioni, immagini, piattaforme e disponibilità, per trovare quello che ti interessa.')),
        'help': (pair('Product support | CircuitAhead', 'Supporto prodotti | CircuitAhead'), pair('Choose the product. Find the right help.', 'Scegli il prodotto. Trova il supporto giusto.'), pair('Support, frequently asked questions and contacts are organized by product. Start with the app, tool or game you are using.', 'Assistenza, domande frequenti e contatti sono organizzati per prodotto. Parti dall’app, dallo strumento o dal gioco che stai usando.')),
        'legal': (pair('Product privacy policies | CircuitAhead', 'Privacy dei prodotti | CircuitAhead'), pair('The right information for each product.', 'Le informazioni giuste per ogni prodotto.'), pair('Each product has its own privacy information. Features, permissions and services can differ between apps, tools and games: choose the product you want to learn about.', 'Ogni prodotto ha le proprie informazioni sulla privacy. Funzioni, permessi e servizi possono essere diversi tra app, strumenti e giochi: scegli il prodotto che ti interessa.')),
    }
    result = {}
    for slug, (title, heading, description) in intros.items():
        intro = '<section class="catalog-intro"><div class="container">' + text('p', pair('CIRCUITAHEAD', 'CIRCUITAHEAD'), 'class="section-eyebrow reveal"') + text('h1', heading, 'class="reveal"') + text('p', description, 'class="catalog-intro-copy reveal"') + '</div></section>'
        if slug == 'products':
            controls = ''
            present = {p['kind'] for p in products}
            if len(present) > 1:
                labels = {'app': pair('Apps','App'), 'tool': pair('Tools','Strumenti'), 'game': pair('Games','Giochi')}
                filter_defs = [('all', pair('All','Tutti'))] + [(key, labels[key]) for key in KINDS if key in present]
                controls = '<div class="catalog-filters" role="group" aria-label="Product categories" data-aria-en="Product categories" data-aria-it="Categorie di prodotti">' + ''.join(text('button', label, f'type="button" data-product-filter="{key}" hidden aria-pressed="{str(key=="all").lower()}"') for key, label in filter_defs) + '</div>'
            body = '<section class="catalog-section"><div class="container" data-catalog>' + controls + '<p class="catalog-count" data-catalog-status role="status"></p><div class="catalog-grid" data-count="' + str(len(products)) + '">' + '\n'.join(card(p) for p in products) + '</div></div></section>'
        else:
            body = '<section class="catalog-section"><div class="container">' + directory(products, slug) + text('p', pair('For general questions about CircuitAhead, write to ', 'Per domande generali su CircuitAhead, scrivi a '), 'class="catalog-contact"') + '<a class="catalog-email" href="mailto:contact@circuitahead.com">contact@circuitahead.com</a></div></section>'
        structured = {'@context':'https://schema.org','@type':'CollectionPage','name':title['en'],'url':DOMAIN+'/'+slug+'/'}
        if slug == 'products':
            structured['mainEntity'] = {'@type':'ItemList','itemListElement':[{'@type':'ListItem','position':i+1,'name':p['name'],'url':DOMAIN+p['url']} for i,p in enumerate(products)]}
        result[f'{slug}/index.html'] = page(slug, title, description, intro+body, structured)
    return result

def refresh_imports():
    path = ROOT / 'js/main.js'
    source = path.read_text()
    source = re.sub(r'(\./[a-z0-9.-]+\.js)\?v=[a-f0-9]+', lambda m: m[1]+'?v='+fingerprint('/js/'+m[1][2:]), source)
    path.write_text(source)

def refresh_html(source):
    return re.sub(r'(["\'])(/(?:css|js)/[a-z0-9.-]+\.(?:css|js))(?:\?v=[a-f0-9]+)?(?=["\'])', lambda m:m[1]+versioned(m[2]), source)

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Report stale generated files without changing them.')
    args = parser.parse_args()
    products = read_products()
    if not args.check:
        refresh_imports()
    outputs = render(products)
    source = (ROOT/'index.html').read_text()
    pattern = r'(?s)(<!-- catalog:home:start -->\n).*?(\n<!-- catalog:home:end -->)'
    if len(re.findall(pattern, source)) != 1:
        raise ValueError('The Home must contain one catalog marker pair.')
    outputs['index.html'] = re.sub(pattern, lambda m:m[1]+home_products(products)+m[2], source)
    routes = {'/', '/products/', '/help/', '/legal/'}
    for product in products:
        routes.update(product[k] for k in ('url','support_url','privacy_url'))
    outputs['sitemap.xml'] = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(f'  <url><loc>{DOMAIN+url}</loc></url>\n' for url in sorted(routes)) + '</urlset>\n'
    for route in routes:
        rel = route.lstrip('/')+'index.html'
        outputs[rel] = refresh_html(outputs.get(rel, (ROOT/rel).read_text() if (ROOT/rel).is_file() else ''))
    stale = [rel for rel, content in outputs.items() if not (ROOT/rel).is_file() or (ROOT/rel).read_text() != content]
    if args.check and stale:
        raise ValueError('Run python3 scripts/build-catalog.py. Stale files: '+', '.join(stale))
    if not args.check:
        for rel, content in outputs.items():
            (ROOT/rel).parent.mkdir(parents=True, exist_ok=True)
            (ROOT/rel).write_text(content)
    print(f'PASS: {len(products)} product(s); static catalog, Home, support directory, privacy directory and sitemap '+('are current.' if args.check else 'updated.'))

if __name__ == '__main__':
    try:
        main()
    except (ValueError, KeyError, OSError) as error:
        print(error, file=sys.stderr)
        raise SystemExit(1)
