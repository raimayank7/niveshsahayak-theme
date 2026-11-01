/* Shared website credit — Nivesh Sahayak
   Every website Nivesh Sahayak builds loads this one file, so the credit is changed in one place.
   Usage in a theme:  <span data-ns-credit="">Designed &amp; Developed by Nivesh Sahayak</span>
                      <script async src="https://assets.niveshsahayak.in/assets/credit.js"></script>
   The text inside the span is the fallback when this file can't load. */
(function () {
  var CREDIT = {
    before: 'Designed & Developed by ',
    name: 'Nivesh Sahayak',
    url: 'https://www.niveshsahayak.in/p/services.html'
  };
  function fill() {
    var els = document.querySelectorAll('[data-ns-credit]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i], a = document.createElement('a');
      a.href = CREDIT.url; a.textContent = CREDIT.name; a.target = '_blank'; a.rel = 'noopener';
      a.style.color = 'inherit'; a.style.fontWeight = '600';
      el.textContent = CREDIT.before;
      el.appendChild(a);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fill); else fill();
})();
