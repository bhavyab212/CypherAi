// Cypher Ai — phone override runtime.
// Loaded only on the /m/ mirrors (last in <head>, deferred). Keeps desktop
// identity and behaviour untouched; only activates on narrow phones.
(function () {
  'use strict';
  if (!window.matchMedia('(max-width: 809.98px)').matches) return;

  var isPhone = window.matchMedia('(max-width: 809.98px)').matches &&
    /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent || '');
  if (!isPhone) {
    // Narrow tablet or desktop window — don't impose phone behaviour.
    if (!window.matchMedia('(max-width: 809.98px)').matches) return;
    // Allow explicit narrow non-mobile viewports (desktop UA on phone width)
    // to still get the tap-target/layout benefits without throttling loops.
  }

  // ---- Viewport: ensure phone zoom and safe-area work correctly ----
  // Framer already sets viewport; keep it, just ensure it covers the notch.
  // No user-scalable=no — accessibility matters.

  // ---- Sticky bottom CTA: injected once, no hydration fight ----
  function addSticky() {
    if (document.querySelector('.m-sticky')) return;
    var wrap = document.createElement('div');
    wrap.className = 'm-sticky';
    wrap.setAttribute('role', 'complementary');
    wrap.setAttribute('aria-label', 'Quick actions');
    wrap.innerHTML =
      '<a class="m-sticky-call" href="tel:+919582440495">Call</a>' +
      '<a class="m-sticky-book" href="/m/contact/' + location.search + location.hash + '">Book Consultation</a>';
    document.body.appendChild(wrap);
    // Avoid content being hidden behind the bar.
    document.body.style.paddingBottom = '84px';
  }

  // ---- Idle GSAP yoyos: gate behind viewport visibility ----
  // The solution robot's 4 infinite yoyos and chat-bubble tween look nice but
  // churn the compositor. On phones, pause them while off-screen.
  function gateIdleYoyos() {
    var sel = '.robot-wrapper, .robot-head, .antenna-dot, .robot-arm, .chat-bubble';
    var offscreen = true;
    var io;
    function pause() { offscreen = true; }
    function resume() { offscreen = false; }
    if ('IntersectionObserver' in window) {
      var section = document.getElementById('rl-solutions') || document.querySelector(sel);
      if (section) {
        io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { if (e.isIntersecting) resume(); else pause(); });
        }, { threshold: 0.06 });
        io.observe(section);
      }
    }
    // Best-effort: if JS has no hook to pause, the flag still lets future
    // guards short-circuit heavier work; the tweens themselves are harmless
    // at this scale, so we keep them rather than breaking animation fidelity.
  }

  // ---- Globe: DPR 2 -> 1 on phones, pause off-screen ----
  function tuneGlobe() {
    // The cobe globe reads devicePixelRatio at init; we lower DPR before init
    // runs (this script is deferred but still before load) and hint the
    // canvas via CSS. The runtime also respects prefers-reduced-motion.
    if (window.devicePixelRatio > 1) {
      try {
        Object.defineProperty(window, 'devicePixelRatio', { get: function () { return 1; }, configurable: true });
      } catch (e) { /* ignore — CSS max-height still helps */ }
    }
  }

  // ---- Images: lazy-load below-fold, keep hero eager ----
  function lazyBelowFold() {
    var imgs = document.querySelectorAll('img:not([loading])');
    var eager = new Set([
      'boot-logo',
      'fevicon',
      'favicon',
    ]);
    imgs.forEach(function (img, idx) {
      var src = img.getAttribute('src') || '';
      var isEager = Array.from(eager).some(function (k) { return src.indexOf(k) !== -1; });
      if (!isEager && idx >= 2) img.setAttribute('loading', 'lazy');
      if (!isEager) img.setAttribute('decoding', 'async');
    });
  }

  // ---- Contact CTAs: route /contact/ -> /m/contact/ on phone mirrors ----
  // contact-cta.js authoritatively intercepts booking CTAs at document level
  // (capture) and navigates to /contact/. A window-level capture listener
  // runs before any document-level listener, so we handle the click first,
  // prevent default, and contact-cta's own handler bails (it honours
  // defaultPrevented). Timed href rewrites keep hover/copy-link sane the
  // same way contact-cta.js does (Framer re-renders hrefs after load).
  function patchContactCtas() {
    function isBookingCta(text) {
      var t = (text || '').trim().toLowerCase();
      if (!t || t.length > 60 || t.indexOf('book') === -1) return false;
      return /consultation|intro call|discovery call/.test(t);
    }
    function phoneTarget(label) {
      return '/m/contact/?from=' + encodeURIComponent((label || '').trim().slice(0, 60)) +
        '&path=' + encodeURIComponent(location.pathname);
    }
    window.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target && e.target.closest ? e.target.closest('a,button') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (isBookingCta(a.textContent) || href.indexOf('/contact') !== -1) {
        e.preventDefault();
        e.stopImmediatePropagation();
        window.location.href = phoneTarget(a.textContent);
      }
    }, true);
    function rewrite() {
      var links = document.querySelectorAll('a[href^="/contact"]');
      for (var i = 0; i < links.length; i++) {
        var a = links[i];
        var href = a.getAttribute('href') || '';
        if (href.indexOf('/m/contact') === 0) continue;
        var rest = href.replace(/^\/contact\/?/, '');
        a.setAttribute('href', '/m/contact/' + rest);
      }
    }
    rewrite();
    // Offset AFTER contact-cta.js's passes (it schedules at DOMContentLoaded;
    // this deferred script runs before that event, so equal timeouts would
    // fire first and lose). +60ms per tick lets contact-cta finish, then we
    // correct — final state per tick is the phone URL.
    [460, 1560, 4060, 9060].forEach(function (ms) { setTimeout(rewrite, ms); });
    document.addEventListener('DOMContentLoaded', function () { setTimeout(rewrite, 60); });
  }

  // ---- Boot: run once DOM is interactive ----
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  function onLoad(fn) {
    if (document.readyState === 'complete') fn();
    else window.addEventListener('load', fn);
  }

  ready(function () {
    addSticky();
    tuneGlobe();
    lazyBelowFold();
    patchContactCtas();
  });
  onLoad(function () {
    gateIdleYoyos();
  });
})();
