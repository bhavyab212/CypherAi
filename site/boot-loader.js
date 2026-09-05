(function () {
  // Runs synchronously at parse time (the <script src> sits right after the
  // loader markup, before Framer's animator/hydration bundles), which is what
  // makes both halves work:
  //
  // 1. HOLD-AND-RELEASE: Framer's appear-animation engine fires Web Animations
  //    API tweens (element.animate) on the very first frame after parse — with
  //    0-1s delays, ~1-2s durations — while this opaque overlay is still up.
  //    Previously those tweens ran (and finished) behind the overlay, so the
  //    hero intro was randomly already done when the loader faded. Every WAAPI
  //    animation created while the loader owns the screen is now paused at
  //    birth and released the moment the loader starts fading, so the intro
  //    always choreographs visibly. Only applies to *page* animations:
  //    loader-internal nodes and offscreen/scroll-driven targets are ignored,
  //    and the patch uninstalls itself on release so runtime behaviour is
  //    untouched afterwards.
  // 2. BLACK-FIRST + LOGO-GATED reveal: the loader content stays invisible
  //    (pure black) until the logo image has actually decoded, so first paint
  //    is never an empty or half-rendered loading screen.
  var HELD = [];
  var loaderEl = document.getElementById('phantom-boot-loader');
  var released = false;
  var nativeAnimate = Element.prototype.animate;

  function insideLoader(node) {
    return !!loaderEl && !!node && (node === loaderEl || loaderEl.contains(node));
  }

  function holdable(anim, target) {
    if (!anim || typeof anim.pause !== 'function') return false;
    if (insideLoader(target)) return false; // loader's own anims stay live
    // Deliberately NO viewport/offscreen check: at parse time layout is
    // incomplete, so a rect test could wrongly skip the hero and reintroduce
    // the intermittent skip. Holding below-fold appear animations too is
    // harmless — they release on the same frame and finish long before the
    // user scrolls to them, exactly as today.
    try {
      if (anim.playState === 'finished' || anim.playState === 'idle') return false;
    } catch (e) {
      return false;
    }
    return true;
  }

  function pauseSoon(anim) {
    // Pause synchronously AND again on the microtask: Framer's engine assigns
    // animation.startTime synchronously right after animate() returns, so the
    // deferred pass guarantees we win regardless of ordering.
    try {
      anim.pause();
    } catch (e) { /* ignore */ }
    Promise.resolve().then(function () {
      if (released || window.__pblReleased) return;
      try {
        if (anim.playState !== 'finished' && anim.playState !== 'idle') anim.pause();
      } catch (e) { /* ignore */ }
    });
  }

  Element.prototype.animate = function () {
    var anim = nativeAnimate.apply(this, arguments);
    if (!released && !window.__pblReleased && holdable(anim, this)) {
      HELD.push(anim);
      pauseSoon(anim);
    }
    return anim;
  };

  // Signal for anything else that needs to know when the page is visible.
  window.__pblReleased = false;

  function releaseHeld() {
    if (released) return;
    released = true;
    window.__pblReleased = true;
    Element.prototype.animate = nativeAnimate;
    // Only resume animations still paused by us. Finished ones are already at
    // their end state (leave them), cancelled/idle ones were taken over by
    // React's handoff (leave them) — touching either would snap visuals back.
    HELD.forEach(function (anim) {
      try {
        if (anim.playState === 'paused') anim.play();
      } catch (e) { /* ignore */ }
    });
    HELD.length = 0;
  }

  // Safety net: never hold the page hostage. If the loader node is gone for
  // any reason, hand everything back.
  setTimeout(function () {
    if (!document.getElementById('phantom-boot-loader')) releaseHeld();
  }, 8000);

  function initLoader() {
    var loader = document.getElementById('phantom-boot-loader');
    var bar = document.getElementById('pbl-progress-bar');
    var text = document.getElementById('pbl-percentage');
    if (!loader || !bar || !text) {
      releaseHeld();
      return;
    }

    // Phase 1 (black-first): reveal the loading screen only once the logo has
    // decoded, so the first visible paint is the complete screen, not black
    // with a popping-in logo. Cached logos resolve near-instantly; the timeout
    // keeps a slow/failed asset from stalling the boot forever.
    var revealed = false;
    function reveal() {
      if (revealed) return;
      revealed = true;
      loader.classList.add('pbl-ready');
    }
    var logo = loader.querySelector('.pbl-logo');
    if (logo) {
      if (logo.complete && logo.naturalWidth > 0) {
        reveal();
      } else {
        logo.addEventListener('load', reveal, { once: true });
        logo.addEventListener('error', reveal, { once: true });
        if (typeof logo.decode === 'function') {
          logo.decode().then(reveal, reveal);
        }
        setTimeout(reveal, 1500);
      }
    } else {
      reveal();
    }

    // Phase 2 (progress): fixed, eased, readable — the bar is a branded beat,
    // not a load meter, so it runs its own clock then hands off.
    var startTime = performance.now();
    var duration = 1600;

    function frame(now) {
      var elapsed = now - startTime;
      var t = Math.min(1, elapsed / duration);
      // easeOutCubic: 1 - Math.pow(1 - t, 3)
      var eased = 1 - Math.pow(1 - t, 3);
      var progress = Math.round(eased * 100);

      bar.style.width = progress + '%';
      text.textContent = progress + '%';

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        setTimeout(function () {
          // Phase 3 (handoff): release held page animations on the SAME frame
          // the fade starts, so the intro choreographs while the veil lifts.
          releaseHeld();
          loader.classList.add('pbl-fade-out');
          setTimeout(function () {
            if (loader.parentNode) {
              loader.parentNode.removeChild(loader);
            }
          }, 650);
        }, 250);
      }
    }

    requestAnimationFrame(frame);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoader);
  } else {
    initLoader();
  }
})();
