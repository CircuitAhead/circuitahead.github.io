/* Optional, dependency-free motion. The original text and layout stay intact. */
export function createMotion() {
  const root = document.documentElement;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const storageKey = 'circuitahead-motion';
  const requested = new URLSearchParams(location.search).get('motion');
  const validChoice = value => value === 'on' || value === 'off';
  let choice = null;
  try {
    const saved = localStorage.getItem(storageKey);
    if (validChoice(saved)) choice = saved;
  } catch { /* Use the device preference when storage is unavailable. */ }
  if (validChoice(requested)) {
    choice = requested;
    try { localStorage.setItem(storageKey, choice); } catch { /* Page-local choice. */ }
  }
  const reduced = () => choice === 'off' || (choice !== 'on' && preference.matches);
  const records = new Map();
  const imageTokens = new WeakMap();
  let observer;
  let scrollFrame = 0;
  let resizeFrame = 0;
  const canAnimate = typeof IntersectionObserver === 'function' && typeof Element.prototype.animate === 'function';
  const canClip = typeof CSS !== 'undefined' && CSS.supports('clip-path', 'path("M0 0H10V10H0Z")');
  const segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter(undefined, {granularity: 'grapheme'}) : null;
  const listenMedia = (query, listener) => {
    if (query.addEventListener) query.addEventListener('change', listener);
    else query.addListener?.(listener);
  };

  function finish(record) {
    record.cancel?.();
    record.cancel = null;
    record.element.dataset.motionState = 'complete';
  }

  function finishAll() {
    records.forEach(record => {
      record.started = true;
      finish(record);
      observer?.unobserve(record.element);
    });
  }

  function visible(element) {
    const rect = element.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < innerHeight && rect.width > 0 && rect.height > 0;
  }

  function rise(record, delay = 0) {
    const element = record.element;
    const frames = [
      {opacity: 0, translate: '0 22px'},
      {opacity: 1, translate: '0 0'}
    ];
    if (record.kind === 'visual') {
      frames[0].scale = '.985';
      frames[1].scale = '1';
    }
    const animation = element.animate(frames, {
      duration: record.kind === 'visual' ? 780 : 620,
      delay, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'both'
    });
    const cancel = () => {
      record.cancel = null;
      element.dataset.motionState = 'complete';
      animation.cancel();
    };
    record.cancel = cancel;
    animation.finished.then(() => {
      if (record.cancel === cancel) cancel();
    }, () => {});
  }

  // Measure native grapheme boxes once. Clipping the heading preserves kerning,
  // gradients, wrapping, accessibility and every text node used by translations.
  function characterBoxes(element) {
    const origin = element.getBoundingClientRect();
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    const boxes = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const value = node.nodeValue;
      const segments = segmenter
        ? [...segmenter.segment(value)].map(item => ({value: item.segment, index: item.index}))
        : (() => { let index = 0; return Array.from(value, value => { const item = {value, index}; index += value.length; return item; }); })();
      for (const segment of segments) {
        if (/^[\r\n\t]+$/.test(segment.value)) continue;
        range.setStart(node, segment.index);
        range.setEnd(node, segment.index + segment.value.length);
        const rect = range.getBoundingClientRect();
        if (rect.width < .2 || rect.height < 1) continue;
        boxes.push({x: rect.left - origin.left, y: rect.top - origin.top, right: rect.right - origin.left, bottom: rect.bottom - origin.top});
      }
    }
    return boxes;
  }

  function clipPath(boxes, count) {
    const lines = [];
    for (let i = 0; i < count; i++) {
      const box = boxes[i];
      let line = lines.find(line => Math.abs(line.y - box.y) < 3);
      if (!line) { line = {...box}; lines.push(line); }
      else {
        line.x = Math.min(line.x, box.x);
        line.right = Math.max(line.right, box.right);
        line.bottom = Math.max(line.bottom, box.bottom);
      }
    }
    const number = value => Math.round(value * 10) / 10;
    const path = lines.map(line => `M${number(line.x - .5)} ${number(line.y - 2)}H${number(line.right + .5)}V${number(line.bottom + 2)}H${number(line.x - .5)}Z`).join('');
    return path ? `path("${path}")` : 'inset(0 100% 0 0)';
  }

  function writeTitle(record, delay = 0) {
    const element = record.element;
    if (!canClip) { rise(record, delay); return; }
    const boxes = characterBoxes(element);
    if (!boxes.length || boxes.length > 180) { rise(record, delay); return; }
    const original = element.style.getPropertyValue('clip-path');
    const priority = element.style.getPropertyPriority('clip-path');
    let frame = 0;
    let previous = -1;
    // Start on a rendered frame: a busy desktop's first paint may arrive long
    // after initialization, and must not consume the entire typing duration.
    let start = null;
    const duration = Math.min(1250, Math.max(560, boxes.length * 18));
    const cancel = () => {
      cancelAnimationFrame(frame);
      if (original) element.style.setProperty('clip-path', original, priority);
      else element.style.removeProperty('clip-path');
      record.cancel = null;
      element.dataset.motionState = 'complete';
    };
    record.cancel = cancel;
    element.style.clipPath = 'inset(0 100% 0 0)';
    const tick = now => {
      if (start === null) start = now + delay;
      const fraction = Math.min(1, Math.max(0, (now - start) / duration));
      const count = Math.floor(fraction * boxes.length);
      if (count !== previous) {
        element.style.clipPath = clipPath(boxes, count);
        previous = count;
      }
      if (fraction >= 1) cancel();
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  }

  function play(record) {
    if (record.started || reduced()) { if (reduced()) finish(record); return; }
    record.started = true;
    observer?.unobserve(record.element);
    record.element.dataset.motionState = 'running';
    try {
      if (record.kind === 'type') writeTitle(record, record.delay);
      else rise(record, record.delay);
    } catch {
      finish(record);
    }
  }

  function collect() {
    const candidates = new Map();
    document.querySelectorAll('main h1, main h2').forEach(element => {
      if (!element.closest('.privacy-summary-card,.privacy-policy-block')) candidates.set(element, 'type');
    });
    const entrances = [
      'main .reveal', 'main .section-eyebrow', '.section-side-copy', '.support-faq-item',
      '.rq-kicker', '.rq-product', '.rq-lead', '.rq-badges', '.rq-actions',
      '.rq-hero .rq-device-button', '.rq-feature', '.rq-sub', '.rq-eyebrow',
      '.screen-choices', '.screen-description', '.screen-panel', '.rq-note',
      '.rq-privacy p', '.rq-privacy ul', '.support-check-list > div',
      '.support-security-card p', '.support-report-card p', '.support-report-actions',
      '.statement-card > p', '.footer-main', '.footer-bottom', '.rq-footer-inner',
      '.fp-kicker', '.fp-product', '.fp-lead', '.fp-badges', '.fp-actions',
      '.fp-status-note', '.fp-hero-preview', '.fp-eyebrow', '.fp-sub',
      '.fp-feature', '.fp-role', '.fp-principle', '.fp-preview-note',
      '.fp-contact-card', '.fp-beta-copy > p', '.product-directory-entry--text p'
    ].join(',');
    document.querySelectorAll(entrances).forEach(element => {
      if (candidates.has(element) || [...element.querySelectorAll('h1,h2')].some(heading => candidates.has(heading))) return;
      const visual = element.matches('.hero-visual,.support-hero-visual,.privacy-hero-visual,.rq-device-button,.screen-panel,.fp-hero-preview');
      candidates.set(element, visual ? 'visual' : 'rise');
    });
    // Only one entrance effect per branch; nested text is revealed by its card.
    for (const [element, kind] of candidates) {
      let parent = element.parentElement;
      let nested = false;
      while (parent && parent !== document.body) {
        if (candidates.has(parent)) { nested = true; break; }
        parent = parent.parentElement;
      }
      if (nested) continue;
      const siblings = [...element.parentElement.children].filter(sibling => candidates.has(sibling));
      const stagger = Math.min(3, Math.max(0, siblings.indexOf(element))) * 70;
      let delay = kind === 'type' ? 70 : stagger;
      if (element.matches('.hero-actions,.rq-actions,.support-hero-actions')) delay = 240;
      if (element.matches('.hero-notes')) delay = 320;
      if (element.matches('h1')) delay = 100;
      element.dataset.motion = kind;
      records.set(element, {element, kind, delay, started: false, cancel: null});
    }
  }

  function observe() {
    if (!canAnimate || reduced()) { finishAll(); return; }
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) play(records.get(entry.target));
      });
    }, {threshold: .04, rootMargin: '0px 0px -32px 0px'});
    records.forEach(record => {
      if (record.started) return;
      const rect = record.element.getBoundingClientRect();
      if (rect.bottom < 0) { record.started = true; finish(record); return; }
      record.element.dataset.motionState = 'waiting';
      observer.observe(record.element);
    });
  }

  function refreshLanguage() {
    records.forEach(record => {
      const wasStarted = record.started;
      if (record.cancel) finish(record);
      if (record.kind === 'type' && wasStarted && visible(record.element) && !reduced()) {
        record.started = false;
        play(record);
      }
    });
  }

  async function transitionImage(image) {
    if (reduced() || !canAnimate) return;
    const token = {};
    imageTokens.set(image, token);
    try { await image.decode(); } catch { return; }
    if (imageTokens.get(image) !== token || reduced()) return;
    image.animate([{opacity: .45}, {opacity: 1}], {duration: 240, easing: 'ease-out'});
  }

  function syncMotion() {
    observer?.disconnect();
    finishAll();
    root.dataset.motion = reduced() ? 'reduced' : 'enabled';
    root.dataset.motionSource = choice ? 'visitor' : 'system';
    if (!reduced()) {
      records.forEach(record => { record.started = false; });
      try { observe(); } catch { finishAll(); observer?.disconnect(); }
    }
  }
  collect();
  syncMotion();
  listenMedia(preference, syncMotion);
  addEventListener('storage', event => {
    if (event.key !== storageKey && event.key !== null) return;
    choice = validChoice(event.newValue) ? event.newValue : null;
    syncMotion();
  });
  document.addEventListener('focusin', event => {
    for (const record of records.values()) {
      if (record.element.contains(event.target)) { record.started = true; finish(record); observer?.unobserve(record.element); }
    }
  });
  document.addEventListener('pointerdown', event => {
    const title = event.target.closest('[data-motion="type"]');
    if (title && records.has(title)) { records.get(title).started = true; finish(records.get(title)); }
  });
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f') finishAll();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) records.forEach(record => { if (record.cancel) finish(record); });
  });
  addEventListener('pagehide', finishAll);
  // Back/forward restores a cached document on many desktop browsers. Re-arm
  // the visible and upcoming entrances, keeping content above the viewport done.
  addEventListener('pageshow', event => { if (event.persisted) syncMotion(); });
  addEventListener('resize', () => {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      records.forEach(record => { if (record.kind === 'type' && record.cancel) finish(record); });
    });
  }, {passive: true});

  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  const header = document.querySelector('.site-header');
  function updateScroll() {
    scrollFrame = 0;
    const distance = root.scrollHeight - root.clientHeight;
    const ratio = distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0;
    progress.style.transform = `scaleX(${ratio})`;
    header?.classList.toggle('scrolled', scrollY > 12);
  }
  addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  }, {passive: true});
  updateScroll();
  return {refreshLanguage, transitionImage};
}
