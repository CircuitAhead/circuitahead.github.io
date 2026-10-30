# CircuitAhead

Independent apps and games at https://circuitahead.com. GitHub Pages serves the committed static HTML from `main` and the repository root; `CNAME` retains the domain. No framework, third-party runtime, remote fonts or backend is required.

## Product architecture

CircuitAhead is the shared brand. Every product has its own landing page, copy, visual identity, platforms, status, artwork, support and privacy information.

| URL | Role |
| --- | --- |
| `/` | Brand introduction, featured product and additional products |
| `/products/` | Catalog of real apps and games |
| `/help/` | Choose a product for its support and FAQ |
| `/legal/` | Choose a product for its privacy information |
| `/remoriq/` | REMORIQ-specific landing page and real app gallery |
| `/support/` | Existing REMORIQ support URL, retained for compatibility |
| `/privacy/` | Existing REMORIQ privacy policy URL, retained for compatibility |

The source of truth for shared product listings is `data/products.json`. The Python standard-library generator updates the Home product area, the three shared directories and the sitemap:

```sh
python3 scripts/build-catalog.py
```

Generated pages are committed and work without JavaScript. There is no browser-side catalog fetch. Filters appear when the catalog actually contains more than one kind of product. There are no fictitious or placeholder products in the public catalog.

## Add a real product

1. Create its own directory and landing page, for example `/new-product/index.html`. `templates/product-page.html.template` is a product-neutral starting point; replace every token with verified information. App and game pages can use different compositions, images and their own stylesheet.
2. Prepare accurate support and privacy pages for that product, normally `/new-product/support/` and `/new-product/privacy/`. REMORIQ's existing shorter URLs remain valid. Policies must reflect the new product's actual behavior.
3. Add a record to `data/products.json`: unique `id`, `name`, `kind` (`app` or `game`), `status` (`development`, `beta` or `available`), `platforms`, `url`, `support_url`, `privacy_url`, bilingual `summary`, and an `icon` with real file path and dimensions. `description`, `category`, `highlights`, `preview` and `featured` are optional. Preview shape can be `portrait` or `landscape`. At most one product is featured.
4. Run the generator and the checks below. The new product is then included automatically in the catalog, Home, support directory, privacy directory and sitemap. Do not add store links, release claims or prices before they are verified.

The Home's featured slot is selected by `featured: true`; if absent it uses the first product. Other products appear in the additional-products grid. Product-specific design and content remain in the product's own page, rather than becoming conditional code in the Home or shared JavaScript.

## Shared components

`js/language.js` chooses Italian or English from a manual preference, browser language or the Europe/Rome timezone. Common navigation, progressive galleries, optional filters, workflows and native image dialogs live in `js/main.js`. `js/translations.js` contains legacy page-specific copy. The legacy page IDs `remoriq`, `remoriq-support` and `remoriq-privacy` are reserved for those pages.

For any new page, use its own `data-page` value and bilingual `data-en` / `data-it` fields. A bilingual `<title>` updates automatically; meta elements use `data-content-en` / `data-content-it`. Image alternatives use `data-alt-en` / `data-alt-it`. Email subjects use `data-subject-en` / `data-subject-it`. No product name needs to be added to shared JavaScript.

### Galleries

A gallery reads its images, labels and count from that page's HTML. It supports portrait, square and landscape media and different image formats. Supply:

- `data-product-name` on the body.
- One `[data-gallery]` container with `data-gallery-count` declaring the intended number of images.
- A `.screen-choices` element containing `[data-shot]` anchors with unique IDs, real image `href`s, bilingual label spans, `data-title-en` / `data-title-it`, `data-description-en` / `data-description-it`, and image dimensions in `data-width` / `data-height` when they differ between images.
- `#screen-panel`, `#screen-image` with width and height, `#screen-title`, `#screen-description`, and `#screen-count`.
- A `[data-preview]` anchor inside the panel, whose key matches a `data-shot`. Hero previews can use the same keys.

The native dialog supports original dimensions, previous/next, fit, Escape and opening the original file. Its paths and labels come from the product's anchors. Real REMORIQ screenshots remain in `assets/remoriq-*.jpg` as their original 698 × 1536 files.

### Styling and motion

`css/styles.css` supplies shared navigation and the legacy service-page layouts. `css/home.css` controls the Home; `css/catalog.css` supplies the shared directories and neutral product-page basics. REMORIQ keeps `css/remoriq.css` and `css/product-story.css`. A new product can add its own styles without changing REMORIQ.

`js/motion.js` progressively adds entrances and title writing, preserving native text and layout. Reduced-motion preferences are respected. `?motion=on` and `?motion=off` save an explicit browser preference. Keyboard focus reveals pending content immediately. No animation control is added to the header.

## Validate and publish

```sh
python3 scripts/build-catalog.py
python3 scripts/build-catalog.py --check
python3 scripts/test-catalog.py
python3 scripts/check-site.py
node --check js/language.js
node --check js/main.js
node --check js/motion.js
node --check js/translations.js
```

The generator also refreshes shared module and stylesheet fingerprints. The page audit discovers every public page from the sitemap and checks links, fragments, asset versions, metadata, bilingual fields and gallery declarations. GitHub Actions repeats these checks. The catalog regression scenarios cover adding a game alongside an app, product-specific support/privacy routes and a featured landscape game without publishing test products.

Before publishing interaction changes, check desktop and narrow widths, both languages, keyboard navigation, galleries and the image dialog. Commit the generated HTML together with registry and source changes; GitHub Pages serves those committed files directly.
