/* Select the language before deferred scripts run. Storage may be unavailable. */
(() => {
  'use strict';
  let saved;
  try { saved = localStorage.getItem('circuitahead-language'); } catch { /* Use browser preferences. */ }
  const requested = new URLSearchParams(location.search).get('lang');
  let inItaly = false;
  try { inItaly = Intl.DateTimeFormat().resolvedOptions().timeZone === 'Europe/Rome'; } catch { /* Optional hint. */ }
  const italian = Array.from(navigator.languages || [navigator.language || '']).some(value => /^it(?:-|$)/i.test(value));
  const lang = [requested, saved].find(value => value === 'it' || value === 'en') || (italian || inItaly ? 'it' : 'en');
  document.documentElement.lang = lang;
})();
