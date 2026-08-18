(function () {
  // Inserted after Framer's React tree has hydrated (window "load") so the
  // extra DOM never appears in the server-rendered markup React hydrates
  // against — splicing it in earlier causes a hydration mismatch that Framer
  // "recovers" from by re-rendering the tree and discarding it.
  //
  // Framer's own hydration-recovery pass can itself land *after* "load" on a
  // slower run, and it re-renders the parent container we spliced into,
  // wiping our non-React nodes as collateral damage. A MutationObserver
  // re-inserts once if that happens so this doesn't depend on winning a race.
  let html = null;
  let antimetalHtml = null;
  let whatWeDoHtml = null;
  let intro2Html = null;
  let reinjectedOnce = false;

  function place(markup, antimetalMarkup, whatWeDoMarkup, intro2Markup) {
    const processEl = document.getElementById("process");
    if (processEl && processEl.parentNode) {
      processEl.insertAdjacentHTML("beforebegin", markup);
      processEl.insertAdjacentHTML("beforebegin", antimetalMarkup);
    } else {
      document.body.insertAdjacentHTML("beforeend", markup);
      document.body.insertAdjacentHTML("beforeend", antimetalMarkup);
    }

    // "What We Do" goes between the Globe and Solutions sections, matching
    // its position in the source site (Hero -> Globe -> WhatWeDo -> Solutions).
    const globeEl = document.querySelector(".rl-globe");
    if (globeEl && globeEl.parentNode) {
      globeEl.insertAdjacentHTML("afterend", whatWeDoMarkup);
    }

    // Replacement "Hello!" intro drops in where the native (hidden) #intro sits.
    const introEl = document.getElementById("intro");
    if (introEl && introEl.parentNode) {
      introEl.insertAdjacentHTML("beforebegin", intro2Markup);
    }

    // GSAP pin-spacers must be created in the same top-to-bottom order the
    // sections actually appear in the document. WhatWeDo sits above Solutions
    // on the page, but was being initialized *after* it — so Solutions' pin
    // ScrollTrigger measured its "start" before WhatWeDo's 5100px spacer had
    // been inserted above it, and the later ScrollTrigger.refresh() never
    // reconciled the drift. That's what stalled WhatWeDo's card cycle and
    // left a dead unpinned gap once the Solutions carousel finished.
    if (window.__rlInitIntro2) window.__rlInitIntro2();
    if (window.__rlInitGlobe) window.__rlInitGlobe();
    if (window.__rlInitWhatWeDo) window.__rlInitWhatWeDo();
    if (window.__rlInitSolutions) window.__rlInitSolutions();
    if (window.__rlInitCatalog) window.__rlInitCatalog();
    if (window.__rlInitAntimetal) window.__rlInitAntimetal();

    // The page's native Lenis smooth-scroll only nudges ScrollTrigger via its
    // own "scroll" event, which can lag well behind the real scroll position
    // (it's what caused pinned sections — WhatWeDo's card cycle, the
    // Solutions carousel — to stall or leave a blank gap once un-pinned).
    // Forcing a ScrollTrigger.update() on every GSAP ticker frame keeps every
    // pin's transform locked to the actual current scroll position instead of
    // waiting on Lenis's own event cadence.
    if (window.gsap && window.ScrollTrigger && !window.__rlTickerSynced) {
      window.__rlTickerSynced = true;
      window.gsap.ticker.add(function () {
        window.ScrollTrigger.update();
      });
    }

    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  async function inject() {
    try {
      const [res, res2, res3, res4] = await Promise.all([
        fetch("./repeatless-import/section.html"),
        fetch("./repeatless-import/antimetal-section.html"),
        fetch("./repeatless-import/whatwedo-section.html"),
        fetch("./repeatless-import/intro2-section.html"),
      ]);
      html = await res.text();
      antimetalHtml = await res2.text();
      whatWeDoHtml = await res3.text();
      intro2Html = await res4.text();
    } catch (e) {
      console.error("Failed to fetch repeatless-import section:", e);
      return;
    }
    place(html, antimetalHtml, whatWeDoHtml, intro2Html);

    // Fonts/late-decoding images finishing after the initial refresh can
    // still shift section heights slightly; a couple of follow-up refreshes
    // keep every pin-spacer's reserved scroll distance matched to the DOM.
    setTimeout(function () { if (window.ScrollTrigger) window.ScrollTrigger.refresh(); }, 1200);
    setTimeout(function () { if (window.ScrollTrigger) window.ScrollTrigger.refresh(); }, 3000);

    const observer = new MutationObserver(() => {
      if (reinjectedOnce) return;
      if (
        !document.getElementById("rl-solutions") ||
        !document.getElementById("am-demo-stage") ||
        !document.getElementById("wwd-section") ||
        !document.getElementById("intro2-section")
      ) {
        reinjectedOnce = true;
        observer.disconnect();
        place(html, antimetalHtml, whatWeDoHtml, intro2Html);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    // Stop watching once the page has clearly settled — avoids paying the
    // observer cost for the lifetime of the session.
    setTimeout(() => observer.disconnect(), 15000);
  }

  if (document.readyState === "complete") {
    inject();
  } else {
    window.addEventListener("load", inject);
  }
})();
