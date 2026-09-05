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
    initAboutSection();

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

  function initAboutSection() {
    // 0. Update Tag to "About Me" and Heading to "Driven by trust, reliability & uncompromising quality"
    const tagEls = document.querySelectorAll('#about-1 .framer-1w5wt8r, [data-framer-name="about"] .framer-1w5wt8r');
    tagEls.forEach(tag => {
      const em = tag.querySelector('em') || tag;
      em.textContent = 'About Me';
    });

    const headingEls = document.querySelectorAll('#about-1 .framer-baujwo, [data-framer-name="about"] .framer-baujwo');
    headingEls.forEach(heading => {
      if (!heading.querySelector('.cypher-heading-updated')) {
        heading.innerHTML = `<h2 class="framer-text framer-styles-preset-1ytb7ki cypher-heading-updated" data-styles-preset="xe9wrZjxH" style="--framer-text-alignment:center">Driven by trust, reliability &amp; <span style="--framer-text-color:var(--token-cecefbc2-3137-4c31-97a2-c273c08d7ba5, rgba(0, 0, 0, 0.5))" class="framer-text">uncompromising quality</span></h2>`;
      }
    });

    // 1. Target the Text Container on the right of the photo
    const textContainers = document.querySelectorAll('.framer-1ttr2a3, [data-framer-name="Text Container"]');
    textContainers.forEach(container => {
      if (container.querySelector('.cypher-about-grid')) return;
      container.innerHTML = `
        <div class="framer-1xfuprx" data-framer-name="Text Content" style="width:100%">
          <p class="cypher-founder-bio">Priyansh Razz is an AI automation specialist and founder of Cypher Ai, building intelligent AI systems, voice agents, and custom workflows that help businesses automate work and accelerate growth.</p>
        </div>
        <div class="cypher-about-grid">
          <!-- 1. AI Automation -->
          <div class="cypher-about-card">
            <div class="cypher-about-card__icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v2"/>
                <path d="M4 11a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-5z"/>
                <circle cx="9" cy="13" r="1.25" fill="currentColor"/>
                <circle cx="15" cy="13" r="1.25" fill="currentColor"/>
                <path d="M9.5 16.5c.8.6 1.7.9 2.5.9s1.7-.3 2.5-.9"/>
                <path d="M2 13h2M20 13h2"/>
              </svg>
            </div>
            <div class="cypher-about-card__content">
              <h4 class="cypher-about-card__title">AI Automation</h4>
              <p class="cypher-about-card__desc">Intelligent workflows that save time and reduce manual work.</p>
            </div>
          </div>

          <!-- 2. Voice Agents -->
          <div class="cypher-about-card">
            <div class="cypher-about-card__icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="3" width="6" height="11" rx="3"/>
                <path d="M5 10a7 7 0 0 0 14 0"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
              </svg>
            </div>
            <div class="cypher-about-card__content">
              <h4 class="cypher-about-card__title">Voice Agents</h4>
              <p class="cypher-about-card__desc">Human-like voice agents that engage and convert customers.</p>
            </div>
          </div>

          <!-- 3. Custom Workflows -->
          <div class="cypher-about-card">
            <div class="cypher-about-card__icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="3" width="6" height="5" rx="1"/>
                <rect x="4" y="16" width="6" height="5" rx="1"/>
                <rect x="14" y="16" width="6" height="5" rx="1"/>
                <path d="M12 8v4M7 12h10M7 12v4M17 12v4"/>
              </svg>
            </div>
            <div class="cypher-about-card__content">
              <h4 class="cypher-about-card__title">Custom Workflows</h4>
              <p class="cypher-about-card__desc">Tailored automation systems built for your unique business needs.</p>
            </div>
          </div>

          <!-- 4. Business Growth -->
          <div class="cypher-about-card">
            <div class="cypher-about-card__icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                <polyline points="16 7 22 7 22 13"/>
              </svg>
            </div>
            <div class="cypher-about-card__content">
              <h4 class="cypher-about-card__title">Business Growth</h4>
              <p class="cypher-about-card__desc">Automate processes that drive efficiency and accelerate growth.</p>
            </div>
          </div>

          <!-- 5. Reliable & Scalable -->
          <div class="cypher-about-card">
            <div class="cypher-about-card__icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <div class="cypher-about-card__content">
              <h4 class="cypher-about-card__title">Reliable &amp; Scalable</h4>
              <p class="cypher-about-card__desc">Secure, scalable, and built to handle your growing needs.</p>
            </div>
          </div>

          <!-- 6. Innovation First -->
          <div class="cypher-about-card">
            <div class="cypher-about-card__icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <div class="cypher-about-card__content">
              <h4 class="cypher-about-card__title">Innovation First</h4>
              <p class="cypher-about-card__desc">Always exploring new tech to keep you ahead of the curve.</p>
            </div>
          </div>
        </div>
      `;
    });

    // 2. Target the Image Info below Priyansh's photo
    const imageInfoContainers = document.querySelectorAll('.framer-at3twr, [data-framer-name="Image Info"]');
    imageInfoContainers.forEach(info => {
      if (info.querySelector('.cypher-founder-bottom')) return;
      info.innerHTML = `
        <div class="cypher-founder-bottom">
          <div class="cypher-social-links">
            <a href="https://www.instagram.com/thepriyansh06/" target="_blank" rel="noopener noreferrer" class="cypher-social-link" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/priyansh-razz-293154372" target="_blank" rel="noopener noreferrer" class="cypher-social-link" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a href="https://x.com/Priyans90072914" target="_blank" rel="noopener noreferrer" class="cypher-social-link" aria-label="X">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
          <div class="cypher-founder-meta">
            <strong class="cypher-founder-name">Priyansh Razz</strong>
            <span class="cypher-founder-role">Cypher Ai, Founder</span>
          </div>
        </div>
      `;
    });
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
    setTimeout(function () { if (window.ScrollTrigger) window.ScrollTrigger.refresh(); initAboutSection(); }, 1200);
    setTimeout(function () { if (window.ScrollTrigger) window.ScrollTrigger.refresh(); initAboutSection(); }, 3000);

    // initAboutSection() rewrites container innerHTML, so calling it straight
    // from this callback re-triggered the very observer that invoked it — a
    // self-feeding microtask loop that starved rendering and timers, which is
    // what froze the boot loader partway through its progress bar. Coalesce to
    // at most one pass per 250ms so the browser can paint in between, and cap
    // the passes so a tug-of-war with Framer's own re-render can't spin
    // forever if React keeps restoring its version of that container.
    let aboutQueued = false;
    let aboutPasses = 0;
    const observer = new MutationObserver(() => {
      if (!aboutQueued && aboutPasses < 12) {
        aboutQueued = true;
        setTimeout(() => {
          aboutQueued = false;
          aboutPasses += 1;
          initAboutSection();
        }, 250);
      }
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

  // Run initAboutSection as early as possible
  initAboutSection();
  if (document.readyState === "complete") {
    inject();
  } else {
    window.addEventListener("DOMContentLoaded", initAboutSection);
    window.addEventListener("load", inject);
  }
})();

