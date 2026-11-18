/* Shared UI behaviour: mobile navigation, header depth on scroll, and the
   Liquid Glass refraction wiring. No data is stored, nothing leaves the page. */
(function () {
  'use strict';
  var doc = document;

  // ---------------------------------------------------------------- mobile nav
  function initNav() {
    var bar = doc.querySelector('.bar');
    var toggle = doc.querySelector('.nav-toggle');
    if (!bar || !toggle) return;
    var mq = window.matchMedia('(max-width: 819px)');

    function set(open) {
      bar.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    toggle.addEventListener('click', function () { set(!bar.classList.contains('is-open')); });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && bar.classList.contains('is-open')) { set(false); toggle.focus(); }
    });
    doc.addEventListener('click', function (e) {
      if (bar.classList.contains('is-open') && !bar.contains(e.target)) set(false);
    });
    var onChange = function () { set(false); };
    if (mq.addEventListener) mq.addEventListener('change', onChange); else mq.addListener(onChange);
  }

  // ---------------------------------------------------------------- scroll depth
  function initScrollState() {
    var top = doc.querySelector('.top');
    if (!top) return;
    var ticking = false;
    function update() { top.classList.toggle('is-scrolled', window.scrollY > 8); ticking = false; }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  // ---------------------------------------------------------------- refraction
  var instances = [];
  function matches(q) { return window.matchMedia(q).matches; }
  function refractionAllowed() {
    if (!window.liquidGlass || !window.liquidGlass.supported) return false;
    return !(matches('(prefers-reduced-transparency: reduce)') ||
             matches('(prefers-contrast: more)') ||
             matches('(forced-colors: active)'));
  }
  function num(v, d) { var n = parseFloat(v); return isNaN(n) ? d : n; }

  function teardown() {
    instances.forEach(function (g) { g.destroy(); });
    instances = [];
  }
  function applyGlass() {
    teardown();
    if (!refractionAllowed()) return;   // CSS frosted glass stays in charge
    doc.querySelectorAll('[data-glass="refract"]').forEach(function (el) {
      var d = el.dataset;
      var cs = window.getComputedStyle(el);
      instances.push(window.liquidGlass(el, {
        scale: num(d.lgScale, -55),
        chroma: num(d.lgChroma, 4),
        border: num(d.lgBorder, 0.12),
        mapBlur: num(d.lgMapBlur, 8),
        // keep the interior frosted enough for text, scaled from the CSS token
        blur: num(d.lgBlur, num(cs.getPropertyValue('--glass-blur'), 18) * 0.6),
        saturate: num(cs.getPropertyValue('--glass-sat'), 1.7)
      }));
    });
  }
  function watchPreferences() {
    ['(prefers-reduced-transparency: reduce)', '(prefers-contrast: more)', '(forced-colors: active)'].forEach(function (q) {
      var m = window.matchMedia(q);
      if (m.addEventListener) m.addEventListener('change', applyGlass);
    });
  }

  function init() {
    initNav();
    initScrollState();
    applyGlass();
    watchPreferences();
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();
  window.krishGlass = { apply: applyGlass };
})();
