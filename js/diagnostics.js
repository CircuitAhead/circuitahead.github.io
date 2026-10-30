/* Separate, unlinked support page. Inspect the normal site without changing it. */
(() => {
  'use strict';
  const frame = document.getElementById('preview');
  const report = document.getElementById('report');
  const verdict = document.getElementById('verdict');
  const retry = document.getElementById('retry');
  const copy = document.getElementById('copy');
  const copyStatus = document.getElementById('copy-status');
  let generation = 0;
  let observer;
  let timer;
  let timeout;
  let samples = 0;
  let clipFrames = 0;
  let moving = new Set();
  let previousClips = new Map();
  let resourceChecks = [];
  const yes = value => value ? 'sì' : 'no';

  function inspect(done = false) {
    const doc = frame.contentDocument;
    const win = frame.contentWindow;
    if (!doc?.querySelector('main')) return;
    const mode = doc.documentElement.dataset.motion || 'non avviato';
    const source = doc.documentElement.dataset.motionSource || 'non disponibile';
    const reduced = win.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let saved = 'nessuna';
    try { saved = win.localStorage.getItem('circuitahead-motion') || 'nessuna'; } catch { saved = 'memoria locale non accessibile'; }
    const elements = [...doc.querySelectorAll('[data-motion-state]')];
    elements.forEach(element => {
      if (element.dataset.motionState === 'running') moving.add(element);
      const clip = element.style.clipPath;
      if (clip && previousClips.get(element) !== clip) clipFrames++;
      previousClips.set(element, clip);
    });
    const main = doc.querySelector('script[src*="/js/main.js"]');
    const preload = doc.querySelector('link[rel="modulepreload"][href*="/js/motion.js"]');
    const name = url => url ? new URL(url).pathname + new URL(url).search : 'non presente';
    const states = state => elements.filter(element => element.dataset.motionState === state).length;
    report.textContent = [
      'CircuitAhead — verifica animazioni',
      `Browser: ${win.navigator.userAgent}`,
      `Preferenza di sistema “riduci movimento”: ${yes(reduced)}`,
      `Preferenza salvata sul sito: ${saved}`,
      `Motore animazioni: ${mode}`,
      `Origine della scelta: ${source}`,
      `Lingua/menu inizializzati: ${yes(Boolean(doc.documentElement.dataset.siteLanguage))}`,
      `IntersectionObserver disponibile: ${yes(typeof win.IntersectionObserver === 'function')}`,
      `Web Animations disponibile: ${yes(typeof win.Element.prototype.animate === 'function')}`,
      `Clip dei titoli disponibile: ${yes(Boolean(win.CSS?.supports('clip-path', 'path("M0 0H10V10H0Z")')))}`,
      `Visibilità della pagina: ${doc.visibilityState}`,
      `Dimensioni anteprima: ${win.innerWidth} × ${win.innerHeight}`,
      `Elementi: ${elements.length}; in attesa: ${states('waiting')}; in esecuzione: ${states('running')}; completati: ${states('complete')}`,
      `Elementi osservati in animazione: ${moving.size}; cambiamenti di scrittura: ${clipFrames}`,
      `Script principale: ${name(main?.src)}`,
      `Modulo animazioni: ${name(preload?.href)}`,
      ...resourceChecks,
      `Verifica: ${done ? 'completata' : 'in corso'}`
    ].join('\n');
    if (done) {
      if (mode === 'reduced' && saved === 'off') verdict.textContent = 'In questo browser risulta salvata la disattivazione delle animazioni.';
      else if (mode === 'reduced' && reduced) verdict.textContent = 'Il sistema richiede di ridurre il movimento e il sito disattiva gli effetti per questa preferenza.';
      else if (mode === 'non avviato') verdict.textContent = 'Il motore delle animazioni non si è avviato. Il risultato qui sotto aiuta a individuare il caricamento che non è riuscito.';
      else if (moving.size || clipFrames) verdict.textContent = 'Il motore ha avviato gli effetti. Copi il risultato per confrontarlo con ciò che vede sullo schermo.';
      else verdict.textContent = 'Il motore risulta inizializzato, ma durante il controllo non sono stati osservati effetti in esecuzione. Copi il risultato per approfondire.';
      copy.disabled = false;
      retry.disabled = false;
    }
  }

  async function checkResources(current) {
    const doc = frame.contentDocument;
    const urls = [doc.querySelector('script[src*="/js/main.js"]')?.src, doc.querySelector('link[rel="modulepreload"][href*="/js/motion.js"]')?.href].filter(Boolean);
    const results = await Promise.allSettled(urls.map(async url => {
      const response = await fetch(url, {cache: 'no-store'});
      return `Caricamento ${new URL(url).pathname}: HTTP ${response.status}; tipo ${response.headers.get('content-type') || 'non indicato'}`;
    }));
    if (generation !== current) return;
    resourceChecks = results.map(result => result.status === 'fulfilled' ? result.value : 'Un file JavaScript non è raggiungibile da questo browser.');
  }

  frame.addEventListener('load', () => {
    if (!frame.contentDocument?.querySelector('main')) return;
    const current = generation;
    observer = new MutationObserver(() => inspect());
    observer.observe(frame.contentDocument.querySelector('main'), {subtree: true, attributes: true, attributeFilter: ['data-motion-state', 'style']});
    inspect();
    checkResources(current);
    timer = setInterval(() => {
      if (generation !== current) return;
      inspect(++samples >= 20);
      if (samples >= 20) { clearInterval(timer); clearTimeout(timeout); observer.disconnect(); }
    }, 200);
  });

  function start() {
    generation++;
    clearInterval(timer);
    clearTimeout(timeout);
    observer?.disconnect();
    samples = 0; clipFrames = 0; moving = new Set(); previousClips = new Map(); resourceChecks = [];
    copy.disabled = true; retry.disabled = true;
    verdict.textContent = 'Verifica in corso…'; copyStatus.textContent = '';
    report.textContent = 'Caricamento del sito dall’indirizzo normale…';
    frame.src = '/';
    timeout = setTimeout(() => {
      if (frame.contentDocument?.querySelector('main')) inspect(true);
      else {
        verdict.textContent = 'La Home non si è caricata nell’anteprima. Comunichi questo messaggio nella conversazione.';
        report.textContent = `Home non caricata; browser: ${navigator.userAgent}`;
        copy.disabled = false; retry.disabled = false;
      }
      clearInterval(timer); observer?.disconnect();
    }, 12000);
  }
  retry.addEventListener('click', start);
  copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(report.textContent); copyStatus.textContent = 'Risultato copiato. Può incollarlo nella conversazione.'; }
    catch {
      const range = document.createRange(); range.selectNodeContents(report);
      const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range);
      copyStatus.textContent = 'Il risultato è selezionato: usi il comando Copia del browser.';
    }
  });
  start();
})();
