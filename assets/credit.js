/* Shared website credit — Nivesh Sahayak
   Every website Nivesh Sahayak builds loads this one file, so the credit's wording, link and look change in one place.
   It turns into a badge: the Nivesh Sahayak mark + "Designed & Developed by: Nivesh Sahayak ↗", linked to the website.
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
  var CSS = '.ns-credit{display:inline-flex;align-items:center;gap:9px;margin:4px 0;padding:6px 14px 6px 6px;border-radius:999px;position:relative;overflow:hidden;isolation:isolate;' +
    'background:linear-gradient(135deg,#0B3B5B,#124d74 60%,#0B3B5B);border:1px solid rgba(245,165,36,.55);box-shadow:0 4px 16px -6px rgba(11,59,91,.6),inset 0 1px 0 rgba(255,255,255,.08);' +
    'color:#dbe7f0!important;text-decoration:none!important;font:500 12.5px/1.2 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;letter-spacing:.2px;white-space:nowrap;vertical-align:middle;transition:transform .2s,box-shadow .2s,border-color .2s}' +
    '.ns-credit:hover,.ns-credit:focus-visible{transform:translateY(-2px);border-color:#F5A524;box-shadow:0 8px 24px -8px rgba(245,165,36,.65),inset 0 1px 0 rgba(255,255,255,.1);color:#fff!important}' +
    '.ns-credit:focus-visible{outline:2px solid #F5A524;outline-offset:2px}' +
    '.ns-credit svg{width:26px;height:26px;flex:none;border-radius:8px;box-shadow:0 0 0 1px rgba(255,255,255,.12)}' +
    '.ns-credit b{font-weight:800;font-size:13.5px;letter-spacing:.3px;background:linear-gradient(90deg,#FFD27A,#F5A524);-webkit-background-clip:text;background-clip:text;color:transparent}' +
    '.ns-credit i{font-style:normal;color:#F5A524;font-weight:700;transition:transform .2s}.ns-credit:hover i{transform:translate(2px,-2px)}' +
    '.ns-credit::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,.16) 50%,transparent 65%);transform:translateX(-120%);animation:ns-shine 6s ease-in-out 1.5s infinite}' +
    '@keyframes ns-shine{0%,70%{transform:translateX(-120%)}100%{transform:translateX(120%)}}' +
    '@media (max-width:380px){.ns-credit{white-space:normal;text-align:left}}' +
    '@media (prefers-reduced-motion:reduce){.ns-credit,.ns-credit i{transition:none}.ns-credit::after{animation:none;display:none}}';

  function badge() {
    var a = document.createElement('a');
    a.className = 'ns-credit'; a.href = CREDIT.url; a.target = '_blank'; a.rel = 'noopener';
    a.title = 'Website designed & developed by Nivesh Sahayak';
    a.innerHTML = MARK + '<span>' + CREDIT.before + ' <b>' + CREDIT.name + '</b></span><i aria-hidden="true">↗</i>';
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
