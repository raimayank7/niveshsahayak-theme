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


/* WhatsApp icon on every button that leads to WhatsApp (owner, 2026-11-22: "Every and Each Website button should have the
   WhatsApp icon if it's pointing to it in any way"). Same single file as the credit, so every site gets it.
   A button = a link or button element that points to WhatsApp (wa.me, api.whatsapp.com, whatsapp.com/channel, chat.whatsapp.com,
   whatsapp: links, data-wa / data-whatsapp, or a button whose label says WhatsApp) AND looks like a button. Elements that already
   carry an icon (svg / img) are left alone. Opt out with data-noic. Plain text links stay text links. */
(function () {
  if (window.__nsWaIcons) return;
  window.__nsWaIcons = true;
  var PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z';
  var HREF = /^(https?:\/\/)?(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com|chat\.whatsapp\.com|(www\.)?whatsapp\.com)(\/|$|\?)|^whatsapp:/i;
  var CLS = /(^|[\s_-])(btn|button|cta|tbtn|chip|pill|fab|pk-btn)([\s_-]|$)/i;
  var done = 0;
  function pointsToWa(el) {
    var h = el.getAttribute && el.getAttribute('href');
    if (h && HREF.test(h.trim())) return true;
    if (el.hasAttribute && (el.hasAttribute('data-wa') || el.hasAttribute('data-whatsapp') || el.hasAttribute('data-wa-form'))) return true;
    var c = typeof el.className === 'string' ? el.className : '';
    if (el.tagName === 'BUTTON' && !/chip|tab|filter/i.test(c) && /whatsapp/i.test(el.textContent || '')) return true;   // filter chips named "WhatsApp" only filter a list
    return false;
  }
  function looksLikeButton(el) {
    if (el.tagName === 'BUTTON' || el.getAttribute('role') === 'button') return true;
    var c = typeof el.className === 'string' ? el.className : '';
    if (CLS.test(c)) return true;
    var cs = getComputedStyle(el), bg = cs.backgroundColor || '';
    var hasBg = bg && !/^rgba\(\s*0,\s*0,\s*0,\s*0\s*\)$|^transparent$/.test(bg);
    var bd = parseFloat(cs.borderTopWidth) > 0 && parseFloat(cs.borderTopLeftRadius) > 0;
    var pad = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
    return (hasBg || bd) && pad >= 16;
  }
  function icon() {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('focusable', 'false');
    s.setAttribute('data-wa-ico', '');
    s.style.cssText = 'width:1.15em;height:1.15em;flex:none;fill:currentColor;margin-right:.5em;vertical-align:-.2em';
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', PATH);
    s.appendChild(p);
    return s;
  }
  function sweep(root) {
    var list = (root || document).querySelectorAll('a[href], button, [data-wa], [data-whatsapp], [data-wa-form], [role=button]');
    for (var i = 0; i < list.length; i++) {
      var el = list[i];
      if (el.hasAttribute('data-wa-done') || el.hasAttribute('data-noic')) continue;
      if (!pointsToWa(el)) continue;
      el.setAttribute('data-wa-done', '');
      if (el.querySelector('svg, img, i[class*=icon], .fi, .ic')) continue;        // already has an icon
      if (!(el.textContent || '').replace(/\s+/g, '').length) continue;               // icon-only buttons keep their own look
      if (!looksLikeButton(el)) continue;
      el.insertBefore(icon(), el.firstChild);
      done++;
    }
  }
  function start() {
    sweep();
    if (window.MutationObserver && document.body) {
      var t = 0;
      new MutationObserver(function () { clearTimeout(t); t = setTimeout(sweep, 150); }).observe(document.body, { childList: true, subtree: true });
    }
    setTimeout(sweep, 1500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
