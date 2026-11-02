/* Shared website credit — Nivesh Sahayak
   Every website Nivesh Sahayak builds loads this one file, so the credit's wording, link and look change in one place.
   It shows the small Nivesh Sahayak mark + "Designed & Developed by: Nivesh Sahayak" in the footer's own colours, linked to the website.
   Usage in a theme:  <span data-ns-credit="">Designed &amp; Developed by: Nivesh Sahayak</span>
                      <script async src="https://assets.niveshsahayak.in/assets/credit.js"></script>
   Older footers (text "Designed & Developed by" / "Built by" followed by a link to niveshsahayak.in) are upgraded too.
   The text in the theme is the fallback when this file can't load. */
(function () {
  if (window.__nsCredit) return;
  window.__nsCredit = true;
  var CREDIT = {
    before: 'Designed & Developed by:',
    name: 'Nivesh Sahayak',
    url: 'https://www.niveshsahayak.in/'
  };
  var RE = /(designed\s*&\s*developed|built)\s+by:?\s*$/i;
  var MARK = '<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="16" fill="#0B3B5B"/>' +
    '<rect x="14" y="38" width="8" height="12" rx="2" fill="#fff" opacity=".35"/><rect x="28" y="31" width="8" height="19" rx="2" fill="#fff" opacity=".55"/>' +
    '<rect x="42" y="24" width="8" height="26" rx="2" fill="#fff" opacity=".85"/>' +
    '<path d="M12 36L25 25L33 31L49 15M40 15H49V24" fill="none" stroke="#F5A524" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  /* quiet by design: it takes the footer's own colour and font, only the name is bold with a thin amber underline */
  var CSS = '.ns-credit{display:inline-flex;align-items:center;gap:6px;color:inherit!important;text-decoration:none!important;font:inherit;vertical-align:middle;white-space:nowrap}' +
    '.ns-credit svg{width:16px;height:16px;flex:none;border-radius:4px}' +
    '.ns-credit b{font-weight:700;background:linear-gradient(#F5A524,#F5A524) 0 100%/100% 1.5px no-repeat;padding-bottom:1px;transition:background-size .2s}' +
    '.ns-credit:hover b,.ns-credit:focus-visible b{background-size:100% 100%;color:#0B3B5B}' +
    '.ns-credit:focus-visible{outline:2px solid #F5A524;outline-offset:3px;border-radius:4px}' +
    '@media (max-width:380px){.ns-credit{white-space:normal}}' +
    '@media (prefers-reduced-motion:reduce){.ns-credit b{transition:none}}';

  function badge() {
    var a = document.createElement('a');
    a.className = 'ns-credit'; a.href = CREDIT.url; a.target = '_blank'; a.rel = 'noopener';
    a.title = 'Website designed & developed by Nivesh Sahayak';
    a.innerHTML = MARK + '<span>' + CREDIT.before + ' <b>' + CREDIT.name + '</b></span>';
    return a;
  }
  function style() {
    if (document.getElementById('ns-credit-css')) return;
    var st = document.createElement('style'); st.id = 'ns-credit-css'; st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }
  function fill(root) {
    var done = false;
    [].forEach.call((root || document).querySelectorAll('[data-ns-credit]:not([data-ns-done])'), function (el) {
      el.setAttribute('data-ns-done', ''); el.textContent = ''; el.appendChild(badge()); done = true;
    });
    [].forEach.call((root || document).querySelectorAll('a[href*="niveshsahayak.in"]:not(.ns-credit)'), function (a) {
      var t = a.previousSibling;
      if (!t || t.nodeType !== 3 || !RE.test(t.nodeValue) || (a.closest && a.closest('.ns-credit'))) return;
      t.nodeValue = t.nodeValue.replace(RE, '');
      a.parentNode.replaceChild(badge(), a); done = true;
    });
    if (done) style();
  }
  function start() {
    fill();
    /* footers drawn later by a site's own script (apps, loaders) get the badge too */
    if (window.MutationObserver && document.body) {
      var t = 0;
      new MutationObserver(function () { clearTimeout(t); t = setTimeout(fill, 120); }).observe(document.body, { childList: true, subtree: true });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
