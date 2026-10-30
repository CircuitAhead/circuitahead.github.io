import translations from "./translations.js?v=7c9feab8c778";

/* Shared language, navigation and screenshot behavior. No third-party runtime. */
(() => {
  "use strict";
  const root = document.documentElement;
  const page = document.body.dataset.page || 'home';
  const listenMedia = (query, listener) => {
    if (query.addEventListener) query.addEventListener('change', listener);
    else query.addListener?.(listener);
  };
  let motion = null;
  let language = root.lang === 'it' ? 'it' : 'en';
  const normalize = value => value.replace(/\s+/g, ' ').trim();
  const pairs = [...translations.commonPairs, ...(translations.pagePairs[page] || [])];
  const byEnglish = new Map(pairs);
  const byItalian = new Map(pairs.map(([en, it]) => [it, en]));
  const records = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      return parent && !parent.closest('script,style,noscript,code,pre,[data-en],[data-i18n-ignore]') && normalize(node.nodeValue)
        ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const raw = node.nodeValue;
    const key = normalize(raw);
    const en = byEnglish.has(key) ? key : byItalian.get(key);
    if (en) records.push({node, en, it: byEnglish.get(en), leading: raw.match(/^\s*/)[0], trailing: raw.match(/\s*$/)[0]});
  }
  const attributes = [];
  document.querySelectorAll('[aria-label],[title],[alt]').forEach(element => {
    for (const attr of ['aria-label', 'title', 'alt']) {
      const raw = element.getAttribute(attr);
      if (!raw) continue;
      const en = byEnglish.has(raw) ? raw : byItalian.get(raw);
      if (en) attributes.push({element, attr, en, it: byEnglish.get(en)});
    }
  });
  const textElements = [...document.querySelectorAll('[data-en][data-it]')];
  const text = (en, it) => language === 'it' ? it : en;
  const setMeta = (selector, value) => {
    const element = document.querySelector(selector);
    if (element && value) element.content = value;
  };
  function applyLanguage(lang) {
    language = lang;
    root.lang = lang;
    root.dataset.siteLanguage = lang;
    records.forEach(record => { record.node.nodeValue = record.leading + record[lang] + record.trailing; });
    attributes.forEach(record => record.element.setAttribute(record.attr, record[lang]));
    textElements.forEach(element => { element.textContent = element.dataset[lang]; });
    document.querySelectorAll('meta[data-content-en][data-content-it]').forEach(element => {
      element.content = element.dataset[lang === 'it' ? 'contentIt' : 'contentEn'];
    });
    document.querySelectorAll('[data-alt-en][data-alt-it]').forEach(element => {
      element.alt = element.dataset[lang === 'it' ? 'altIt' : 'altEn'];
    });
    document.querySelectorAll('[data-aria-en]').forEach(element => element.setAttribute('aria-label', element.dataset[lang === 'it' ? 'ariaIt' : 'ariaEn']));
    document.querySelectorAll('[data-language]').forEach(button => {
      const active = button.dataset.language === lang;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const meta = translations.pageMeta[page]?.[lang];
    if (meta) {
      document.title = meta.title;
      setMeta('meta[name="description"]', meta.description);
      setMeta('meta[property="og:title"]', meta.ogTitle || meta.title);
      setMeta('meta[property="og:description"]', meta.ogDescription || meta.description);
    }
    document.querySelectorAll('[data-subject-en][data-subject-it]').forEach(link => {
      const url = new URL(link.href);
      url.searchParams.set('subject', link.dataset[lang === 'it' ? 'subjectIt' : 'subjectEn']);
      url.search = '?' + url.searchParams.toString().replace(/\+/g, '%20');
      link.href = url.href;
    });
    document.querySelectorAll('[data-contact-status]').forEach(status => { status.textContent = ''; });
    updateMenuLabel();
    updateGalleryText();
    updateDialogText();
    updateCatalog();
    motion?.refreshLanguage();
  }

  // Keep a single, consistent language control in the header on every screen size.
  const switcher = document.createElement('div');
  switcher.className = 'site-language-switcher';
  switcher.setAttribute('role', 'group');
  switcher.setAttribute('aria-label', 'Language / Lingua');
  switcher.dataset.i18nIgnore = '';
  for (const [lang, label] of [['it', 'Italiano'], ['en', 'English']]) {
    const button = document.createElement('button');
    button.type = 'button'; button.dataset.language = lang;
    button.textContent = lang.toUpperCase(); button.setAttribute('aria-label', label);
    button.addEventListener('click', () => {
      try { localStorage.setItem('circuitahead-language', lang); } catch { /* Selection still works for this page. */ }
      // Preserve an explicit language query without adding one to ordinary visits.
      const url = new URL(location.href);
      if (url.searchParams.has('lang')) { url.searchParams.set('lang', lang); history.replaceState(null, '', url); }
      applyLanguage(lang);
    });
    switcher.append(button);
  }
  const headerInner = document.querySelector('.header-inner');
  headerInner?.insertBefore(switcher, headerInner.querySelector('.menu-button'));

  const menuButton = document.querySelector('.menu-button');
  const mobileNav = document.querySelector('.mobile-nav');
  function updateMenuLabel() {
    menuButton?.setAttribute('aria-label', menuButton.getAttribute('aria-expanded') === 'true'
      ? text('Close navigation', 'Chiudi navigazione') : text('Open navigation', 'Apri navigazione'));
  }
  function closeMenu(restoreFocus = false) {
    if (!menuButton || !mobileNav) return;
    const wasOpen = menuButton.getAttribute('aria-expanded') === 'true';
    mobileNav.classList.remove('open'); menuButton.classList.remove('active');
    menuButton.setAttribute('aria-expanded', 'false'); mobileNav.inert = true;
    updateMenuLabel();
    if (restoreFocus && wasOpen) menuButton.focus();
  }
  if (mobileNav) mobileNav.inert = true;
  menuButton?.addEventListener('click', () => {
    if (!mobileNav) return;
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.classList.toggle('active', open); mobileNav.classList.toggle('open', open);
    mobileNav.inert = !open; updateMenuLabel();
  });
  mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(true); });
  const desktop = matchMedia(page === 'home' ? '(min-width: 860px)' : '(min-width: 1021px)');
  listenMedia(desktop, () => { if (desktop.matches) closeMenu(); });

  // A progressive, illustrative walkthrough. The original anchors and all
  // three steps remain usable when JavaScript is unavailable.
  const workflow = document.querySelector('[data-workflow]');
  if (workflow) {
    const steps = [...workflow.querySelectorAll('[data-workflow-step]')];
    const panels = steps.map(step => document.getElementById(step.hash.slice(1)));
    const nav = workflow.querySelector('[data-workflow-nav]');
    nav.setAttribute('role', 'tablist');
    const horizontalSteps = matchMedia('(max-width: 920px)');
    const orientSteps = () => nav.setAttribute('aria-orientation', horizontalSteps.matches ? 'horizontal' : 'vertical');
    orientSteps(); listenMedia(horizontalSteps, orientSteps);
    [...nav.children].forEach(item => item.setAttribute('role', 'presentation'));
    workflow.dataset.enhanced = 'true';
    function selectStep(index, focus = false) {
      const selected = (index + steps.length) % steps.length;
      steps.forEach((step, i) => {
        step.setAttribute('role', 'tab');
        step.setAttribute('aria-selected', String(i === selected));
        step.setAttribute('aria-controls', panels[i].id);
        step.tabIndex = i === selected ? 0 : -1;
        panels[i].hidden = i !== selected;
        panels[i].setAttribute('role', 'tabpanel');
        panels[i].setAttribute('aria-labelledby', step.id);
        panels[i].tabIndex = 0;
      });
      if (focus) steps[selected].focus({preventScroll: true});
    }
    steps.forEach((step, index) => {
      step.addEventListener('click', event => { event.preventDefault(); selectStep(index); });
      step.addEventListener('keydown', event => {
        const target = {'ArrowRight': index + 1, 'ArrowDown': index + 1, 'ArrowLeft': index - 1, 'ArrowUp': index - 1, 'Home': 0, 'End': steps.length - 1, ' ': index}[event.key];
        if (target !== undefined) { event.preventDefault(); selectStep(target, true); }
      });
    });
    const selectHash = () => {
      const index = steps.findIndex(step => step.hash === location.hash);
      if (index >= 0) selectStep(index);
    };
    selectStep(Math.max(0, steps.findIndex(step => step.hash === location.hash)));
    addEventListener('hashchange', selectHash);
  }

  document.querySelectorAll('[data-copy-email]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', async () => {
    const contact = button.closest('.launch-contact');
    const status = contact.querySelector('[data-contact-status]');
    try {
      await navigator.clipboard.writeText(button.dataset.copyEmail);
      status.textContent = text('Email address copied.', 'Indirizzo email copiato.');
    } catch {
      const range = document.createRange();
      range.selectNodeContents(contact.querySelector('[data-email-address]'));
      const selection = getSelection();
      selection.removeAllRanges(); selection.addRange(range);
      status.textContent = text('The address is selected. Use your browser’s Copy command.', 'L’indirizzo è selezionato. Usa il comando Copia del browser.');
    }
    });
  });

  // A static catalog remains readable without scripting. Filters appear only
  // when more than one product category is actually present.
  const catalog = document.querySelector('[data-catalog]');
  let catalogKind = 'all';
  function updateCatalog() {
    if (!catalog) return;
    const cards = [...catalog.querySelectorAll('[data-catalog-product]')];
    let count = 0;
    cards.forEach(card => {
      card.hidden = catalogKind !== 'all' && card.dataset.productKind !== catalogKind;
      if (!card.hidden) count++;
    });
    catalog.querySelectorAll('[data-product-filter]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.productFilter === catalogKind));
    });
    const status = catalog.querySelector('[data-catalog-status]');
    if (status) status.textContent = text(`${count} ${count === 1 ? 'product' : 'products'}`, `${count} ${count === 1 ? 'prodotto' : 'prodotti'}`);
  }
  catalog?.querySelectorAll('[data-product-filter]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => { catalogKind = button.dataset.productFilter; updateCatalog(); });
  });

  // Screen selection uses the original link targets as its source of truth.
  const gallery = document.querySelector('[data-gallery]');
  const productName = document.body.dataset.productName || 'CircuitAhead';
  const choices = gallery ? [...gallery.querySelectorAll('[data-shot]')] : [];
  const shotLabel = choice => choice.querySelector('[data-en][data-it]')?.dataset[language] || choice.textContent.trim();
  const panel = document.getElementById('screen-panel');
  let selected = 0;
  function updateGalleryText() {
    const choice = choices[selected];
    if (!choice) return;
    document.getElementById('screen-title').textContent = choice.dataset[language === 'it' ? 'titleIt' : 'titleEn'];
    document.getElementById('screen-description').textContent = choice.dataset[language === 'it' ? 'descriptionIt' : 'descriptionEn'];
    const image = document.getElementById('screen-image');
    image.alt = productName + ' — ' + shotLabel(choice);
  }
  function selectScreen(index, moveFocus = false) {
    selected = (index + choices.length) % choices.length;
    const choice = choices[selected];
    choices.forEach((element, i) => {
      element.setAttribute('aria-selected', String(i === selected));
      element.tabIndex = i === selected ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', choice.id);
    const image = document.getElementById('screen-image');
    image.src = choice.href;
    motion?.transitionImage(image);
    const preview = panel.querySelector('[data-preview]');
    preview.href = choice.href; preview.dataset.preview = choice.dataset.shot;
    document.getElementById('screen-count').textContent = `${String(selected + 1).padStart(2, '0')} / ${String(choices.length).padStart(2, '0')}`;
    updateGalleryText();
    if (moveFocus) choice.focus({preventScroll: true});
  }
  if (gallery) {
    const tablist = gallery.querySelector('.screen-choices');
    tablist.setAttribute('role', 'tablist');
    const smallGallery = matchMedia('(max-width: 700px)');
    const orient = () => tablist.setAttribute('aria-orientation', smallGallery.matches ? 'horizontal' : 'vertical');
    orient(); listenMedia(smallGallery, orient);
    panel.setAttribute('role', 'tabpanel'); panel.tabIndex = 0;
    choices.forEach((choice, index) => {
      choice.setAttribute('role', 'tab'); choice.setAttribute('aria-controls', 'screen-panel');
      choice.addEventListener('click', event => { event.preventDefault(); selectScreen(index); });
      choice.addEventListener('keydown', event => {
        let target;
        if (['ArrowRight', 'ArrowDown'].includes(event.key)) target = index + 1;
        if (['ArrowLeft', 'ArrowUp'].includes(event.key)) target = index - 1;
        if (event.key === 'Home') target = 0;
        if (event.key === 'End') target = choices.length - 1;
        if (event.key === ' ') target = index;
        if (target !== undefined) { event.preventDefault(); selectScreen(target, true); }
      });
    });
    selectScreen(0);
  }

  // Native dialog provides modal semantics, focus containment, Escape and focus restoration.
  const screenshots = choices;
  let dialog, dialogTitle, dialogImage, originalLink, closeButton, zoomButton, previousButton, nextButton;
  let dialogIndex = 0;
  function updateDialogText() {
    if (!dialog) return;
    const shot = screenshots[dialogIndex];
    const title = shotLabel(shot);
    dialogTitle.textContent = `${title} · ${dialogIndex + 1} / ${screenshots.length}`;
    dialogImage.alt = `${productName} — ${title}`;
    closeButton.setAttribute('aria-label', text('Close image', 'Chiudi immagine'));
    zoomButton.textContent = dialog.classList.contains('is-zoomed') ? text('Fit image', 'Adatta immagine') : text('Actual size', 'Dimensione originale');
    originalLink.textContent = text('Open original ↗', 'Apri originale ↗');
    previousButton.setAttribute('aria-label', text('Previous screen', 'Schermata precedente'));
    nextButton.setAttribute('aria-label', text('Next screen', 'Schermata successiva'));
  }
  function showShot(index) {
    dialogIndex = (index + screenshots.length) % screenshots.length;
    const shot = screenshots[dialogIndex];
    const sourceImage = document.getElementById('screen-image');
    dialogImage.width = Number(shot.dataset.width) || Number(sourceImage.getAttribute('width'));
    dialogImage.height = Number(shot.dataset.height) || Number(sourceImage.getAttribute('height'));
    dialog.style.setProperty('--image-width', `${dialogImage.width}px`);
    dialogImage.src = shot.href; originalLink.href = shot.href;
    motion?.transitionImage(dialogImage);
    dialog.classList.remove('is-zoomed'); zoomButton.setAttribute('aria-pressed', 'false');
    updateDialogText();
  }
  function createDialog() {
    dialog = document.createElement('dialog'); dialog.className = 'image-dialog';
    dialog.setAttribute('aria-labelledby', 'image-dialog-title');
    const toolbar = document.createElement('div'); toolbar.className = 'image-dialog-toolbar';
    dialogTitle = document.createElement('h2'); dialogTitle.id = 'image-dialog-title'; toolbar.append(dialogTitle);
    const actions = document.createElement('div'); actions.className = 'image-dialog-actions';
    const button = (label, handler) => { const el = document.createElement('button'); el.type = 'button'; el.textContent = label; el.addEventListener('click', handler); actions.append(el); return el; };
    previousButton = button('←', () => showShot(dialogIndex - 1));
    nextButton = button('→', () => showShot(dialogIndex + 1));
    zoomButton = button('', () => { const zoomed = dialog.classList.toggle('is-zoomed'); zoomButton.setAttribute('aria-pressed', String(zoomed)); updateDialogText(); });
    originalLink = document.createElement('a'); originalLink.target = '_blank'; originalLink.rel = 'noopener noreferrer'; actions.append(originalLink);
    closeButton = button('×', () => dialog.close()); closeButton.className = 'image-dialog-close';
    toolbar.append(actions); dialog.append(toolbar);
    const viewport = document.createElement('div'); viewport.className = 'image-dialog-viewport';
    dialogImage = document.createElement('img'); viewport.append(dialogImage); dialog.append(viewport);
    dialogImage.addEventListener('load', () => {
      dialog.style.setProperty('--image-width', `${dialogImage.naturalWidth}px`);
    });
    dialog.addEventListener('close', () => root.classList.remove('modal-open'));
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', event => {
      if (dialog.classList.contains('is-zoomed')) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); showShot(dialogIndex + (event.key === 'ArrowLeft' ? -1 : 1)); }
    });
    document.body.append(dialog);
  }
  if (typeof HTMLDialogElement !== 'undefined' && screenshots.length) {
    document.querySelectorAll('[data-preview]').forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      if (!dialog) createDialog();
      const index = screenshots.findIndex(shot => shot.dataset.shot === link.dataset.preview);
      showShot(index < 0 ? 0 : index);
      root.classList.add('modal-open'); dialog.showModal(); closeButton.focus();
    }));
  }
  document.querySelectorAll('#current-year,#rq-year').forEach(element => { element.textContent = String(new Date().getFullYear()); });
  applyLanguage(language);
  // Animation loading must never block translation, navigation or app previews.
  import('./motion.js?v=566dda1c863f').then(({createMotion}) => {
    motion = createMotion();
  }).catch(() => { /* Core content and interactions remain available. */ });
})();
