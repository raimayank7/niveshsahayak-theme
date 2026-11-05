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
  /* "Want a site like this?" after the badge (owner, 2026-11-05): leads to the website design showroom.
     Not on the showroom itself. */
  var WANT = { text: 'Want a site like this?', url: 'https://designs.niveshsahayak.in/' };
  var SHOW_WANT = !/(^|\.)designs\.niveshsahayak\.in$/.test(location.hostname);
  /* the teal NS emblem: gold N for light footers, silver N for dark ones (picked from the footer's text colour, see tone()) */
  var BRAND = 'https://assets.niveshsahayak.in/assets/brand/credit-mark-';
  /* quiet by design: it takes the footer's own colour and font, only the name is bold with a thin amber underline */
  var CSS = '.ns-credit{display:inline-flex;align-items:center;gap:6px;color:inherit!important;text-decoration:none!important;font:inherit;vertical-align:middle;white-space:nowrap}' +
    '.ns-credit img{width:auto!important;height:24px!important;max-width:none;flex:none;margin:0!important;border:0!important;box-shadow:none!important;background:none!important}' +
    '.ns-credit b{font-weight:700;background:linear-gradient(#F5A524,#F5A524) 0 100%/100% 1.5px no-repeat;padding-bottom:1px;transition:background-size .2s}' +
    '.ns-credit:hover b,.ns-credit:focus-visible b{background-size:100% 100%;color:#0B3B5B}' +
    '.ns-credit:focus-visible{outline:2px solid #F5A524;outline-offset:3px;border-radius:4px}' +
    '@media (max-width:380px){.ns-credit{white-space:normal}}' +
    '.ns-want{color:inherit!important;font:inherit;font-size:.92em;opacity:.85;text-decoration:underline dotted!important;text-underline-offset:3px;margin-left:.6em;white-space:nowrap}' +
    '.ns-want:hover,.ns-want:focus-visible{opacity:1;text-decoration-style:solid!important}' +
    '@media (prefers-reduced-motion:reduce){.ns-credit b{transition:none}}';

  function badge() {
    var a = document.createElement('a');
    a.className = 'ns-credit'; a.href = CREDIT.url; a.target = '_blank'; a.rel = 'noopener';
    a.title = 'Website designed & developed by Nivesh Sahayak';
    a.innerHTML = '<img alt="" width="34" height="24" decoding="async"><span>' + CREDIT.before + ' <b>' + CREDIT.name + '</b></span>';
    return a;
  }
  function want() {
    var w = document.createElement('a');
    w.className = 'ns-want'; w.href = WANT.url; w.target = '_blank'; w.rel = 'noopener'; w.textContent = WANT.text;
    return w;
  }
  /* light text = dark footer → silver-N picture; dark text = light footer → gold-N picture */
  function tone() {
    [].forEach.call(document.querySelectorAll('.ns-credit img'), function (img) {
      var c = (getComputedStyle(img.parentNode).color.match(/[\d.]+/g) || [0, 0, 0]).map(Number);
      var src = BRAND + ((0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) > 140 ? 'dark' : 'light') + '.webp';
      if (img.getAttribute('src') !== src) img.setAttribute('src', src);
    });
  }
  function style() {
    if (document.getElementById('ns-credit-css')) return;
    var st = document.createElement('style'); st.id = 'ns-credit-css'; st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }
  function fill(root) {
    var done = false;
    [].forEach.call((root || document).querySelectorAll('[data-ns-credit]:not([data-ns-done])'), function (el) {
      el.setAttribute('data-ns-done', ''); el.textContent = ''; el.appendChild(badge()); if (SHOW_WANT) el.appendChild(want()); done = true;
    });
    [].forEach.call((root || document).querySelectorAll('a[href*="niveshsahayak.in"]:not(.ns-credit)'), function (a) {
      var t = a.previousSibling;
      if (!t || t.nodeType !== 3 || !RE.test(t.nodeValue) || (a.closest && a.closest('.ns-credit'))) return;
      t.nodeValue = t.nodeValue.replace(RE, '');
      var b = badge(); a.parentNode.replaceChild(b, a);
      if (SHOW_WANT) b.parentNode.insertBefore(want(), b.nextSibling);
      done = true;
    });
    if (done) style();
    tone();
  }
  function start() {
    fill();
    /* footers drawn later by a site's own script (apps, loaders) get the badge too */
    if (window.MutationObserver && document.body) {
      var t = 0;
      new MutationObserver(function () { clearTimeout(t); t = setTimeout(fill, 120); }).observe(document.body, { childList: true, subtree: true });
      /* light/dark switch: sites flip a class or data-theme on <html>/<body>; wait for their colour transition */
      var later = function () { tone(); setTimeout(tone, 450); };
      var mo = new MutationObserver(later), at = { attributes: true, attributeFilter: ['class', 'data-theme', 'style'] };
      mo.observe(document.documentElement, at); mo.observe(document.body, at);
    }
    if (window.matchMedia) {
      var mq = matchMedia('(prefers-color-scheme: dark)');
      if (mq.addEventListener) mq.addEventListener('change', function () { setTimeout(tone, 450); });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
