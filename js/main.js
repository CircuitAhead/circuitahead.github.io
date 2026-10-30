import translations from "./translations.js?v=09c089bf579e";

/* Shared language, navigation and screenshot behavior. No third-party runtime. */
(() => {
  "use strict";
  const root = document.documentElement;
  const page = document.body.dataset.page || 'home';
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
    const subjects = new Map([
      ['Supporto REMORIQ', 'REMORIQ Support'],
      ['REMORIQ - Acquisti', 'REMORIQ - Purchases'],
      ['REMORIQ - Segnalazione problema', 'REMORIQ - Problem report']
    ]);
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
      const url = new URL(link.href);
      const current = url.searchParams.get('subject');
      if (!current) return;
      for (const [it, en] of subjects) {
        if (current === it || current === en) { url.searchParams.set('subject', text(en, it)); link.href = url.href; break; }
      }
    });
    updateMenuLabel();
    updateGalleryText();
    updateDialogText();
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
  const desktop = matchMedia('(min-width: 1021px)');
  desktop.addEventListener('change', () => { if (desktop.matches) closeMenu(); });

  // Screen selection uses the original link targets as its source of truth.
  const gallery = document.querySelector('[data-gallery]');
  const choices = gallery ? [...gallery.querySelectorAll('[data-shot]')] : [];
  const panel = document.getElementById('screen-panel');
  let selected = 0;
  function updateGalleryText() {
    const choice = choices[selected];
    if (!choice) return;
    document.getElementById('screen-title').textContent = choice.dataset[language === 'it' ? 'titleIt' : 'titleEn'];
    document.getElementById('screen-description').textContent = choice.dataset[language === 'it' ? 'descriptionIt' : 'descriptionEn'];
    const image = document.getElementById('screen-image');
    image.alt = 'REMORIQ — ' + choice.querySelector('[data-en]').dataset[language];
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
    const preview = panel.querySelector('[data-preview]');
    preview.href = choice.href; preview.dataset.preview = choice.dataset.shot;
    document.getElementById('screen-count').textContent = `${String(selected + 1).padStart(2, '0')} / 06`;
    updateGalleryText();
    if (moveFocus) choice.focus({preventScroll: true});
  }
  if (gallery) {
    const tablist = gallery.querySelector('.screen-choices');
    tablist.setAttribute('role', 'tablist');
    const smallGallery = matchMedia('(max-width: 700px)');
    const orient = () => tablist.setAttribute('aria-orientation', smallGallery.matches ? 'horizontal' : 'vertical');
    orient(); smallGallery.addEventListener('change', orient);
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
  const screenshots = [["home", "Home", "Home"], ["inbox", "Smart Inbox", "Inbox intelligente"], ["expenses", "Expenses", "Spese"], ["archive", "Archive", "Archivio"], ["profile", "Profile & settings", "Profilo e impostazioni"], ["add-content", "Add content", "Aggiungi contenuto"]];
  let dialog, dialogTitle, dialogImage, originalLink, closeButton, zoomButton, previousButton, nextButton;
  let dialogIndex = 0;
  function updateDialogText() {
    if (!dialog) return;
    const shot = screenshots[dialogIndex];
    const title = shot[language === 'it' ? 2 : 1];
    dialogTitle.textContent = `${title} · ${dialogIndex + 1} / ${screenshots.length}`;
    dialogImage.alt = `REMORIQ — ${title}`;
    closeButton.setAttribute('aria-label', text('Close image', 'Chiudi immagine'));
    zoomButton.textContent = dialog.classList.contains('is-zoomed') ? text('Fit image', 'Adatta immagine') : text('Actual size', 'Dimensione originale');
    originalLink.textContent = text('Open original ↗', 'Apri originale ↗');
    previousButton.setAttribute('aria-label', text('Previous screen', 'Schermata precedente'));
    nextButton.setAttribute('aria-label', text('Next screen', 'Schermata successiva'));
  }
  function showShot(index) {
    dialogIndex = (index + screenshots.length) % screenshots.length;
    const src = `/assets/remoriq-${screenshots[dialogIndex][0]}.jpg`;
    dialogImage.src = src; originalLink.href = src;
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
    dialogImage = document.createElement('img'); dialogImage.width = 698; dialogImage.height = 1536; viewport.append(dialogImage); dialog.append(viewport);
    dialog.addEventListener('close', () => root.classList.remove('modal-open'));
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', event => {
      if (dialog.classList.contains('is-zoomed')) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); showShot(dialogIndex + (event.key === 'ArrowLeft' ? -1 : 1)); }
    });
    document.body.append(dialog);
  }
  if (typeof HTMLDialogElement !== 'undefined') {
    document.querySelectorAll('[data-preview]').forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      if (!dialog) createDialog();
      const index = screenshots.findIndex(shot => shot[0] === link.dataset.preview);
      showShot(index < 0 ? 0 : index);
      root.classList.add('modal-open'); dialog.showModal(); closeButton.focus();
    }));
  }
  document.querySelectorAll('#current-year,#rq-year').forEach(element => { element.textContent = String(new Date().getFullYear()); });
  applyLanguage(language);
})();
