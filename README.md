# CircuitAhead

Official static website at https://circuitahead.com, hosted by GitHub Pages from `main` and the repository root. `CNAME` retains the custom domain. No build step, framework, third-party scripts or remote fonts are required.

## Pages

- `/`: CircuitAhead and the REMORIQ product preview.
- `/remoriq/`: product features, six real app captures, accessible screen selector and native image dialog.
- `/support/`: support contacts and FAQ.
- `/privacy/`: REMORIQ privacy information.

## Maintain

Keep screenshots in `assets/remoriq-*.jpg`. They are the original 698 × 1536 captures without recompression. The native dialog offers fit, original size, previous/next, Escape and a direct image link. The screen links work without JavaScript.

`js/language.js` chooses IT/EN using a manual selection, browser language or the Europe/Rome timezone. `js/main.js` applies shared navigation and gallery behavior; `js/translations.js` keeps the bilingual copy separate from interaction code. Storage exceptions do not block the page. `?lang=it` and `?lang=en` allow explicit previews. App screenshots remain in their original Italian language.

The shared stylesheet contains the home, support and privacy layouts. Product styles are isolated in `css/remoriq.css`. The home composition is in `css/home.css`: content determines section heights, and its side-by-side desktop layout starts at 860px.

Before publishing:

```sh
python3 scripts/check-site.py
node --check js/language.js
node --check js/main.js
node --check js/translations.js
```

GitHub Actions repeats these checks on pushes and pull requests. Also verify desktop and narrow layouts, both languages, menu keyboard behavior, gallery selection and the image dialog after interface changes.

The HTML includes canonical links, Open Graph metadata and factual structured data. Update `sitemap.xml` when adding a page. The product remains marked in development; add a store link only after release.
