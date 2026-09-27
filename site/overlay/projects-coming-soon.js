// Cypher Ai — Projects "under construction" overlay.
// Standalone layer: never edits the Framer export. It finds the Recent Case
// Studies section (#work), blurs only its project grid, and floats a
// glassmorphic "under construction / will be live soon" notice above it.
// Safe to run repeatedly; re-applies after Framer re-renders.
(function () {
  'use strict';

  var SECTION_ID = 'work';
  var GRID_CLASS = 'framer-26y88a';

  function buildVeil() {
    var veil = document.createElement('div');
    veil.className = 'cypher-soon-veil';
    veil.setAttribute('role', 'status');
    veil.setAttribute('aria-label', 'Projects under construction, will be live soon');
    veil.innerHTML =
      '<div class="cypher-soon-card">' +
        '<span class="cypher-soon-pill"><span class="cypher-soon-dot"></span>Under construction</span>' +
        '<h3>Case studies, coming soon.</h3>' +
        '<p>We are polishing the project area. It will be live soon.</p>' +
      '</div>';
    return veil;
  }

  function apply(section) {
    if (!section || section.dataset.cypherSoon === '1') return;
    var grid = section.querySelector('.' + GRID_CLASS);
    if (!grid) return;
    section.classList.add('cypher-projects-soon');
    section.dataset.cypherSoon = '1';
    // Remove any stale veil (Framer re-render safety), then append fresh.
    var stale = section.querySelector(':scope > .cypher-soon-veil');
    if (stale) stale.remove();
    section.appendChild(buildVeil());
  }

  function scan() {
    var section = document.getElementById(SECTION_ID);
    apply(section);
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(scan);
  window.addEventListener('load', scan);
  // Framer hydrates asynchronously — re-scan a few times, then watch for
  // late section mounts without churning forever.
  [600, 1600, 3500, 7000].forEach(function (ms) { setTimeout(scan, ms); });
  if ('MutationObserver' in window) {
    var ticks = 0;
    var io = new MutationObserver(function () {
      ticks += 1;
      if (ticks > 40) { io.disconnect(); return; }
      scan();
    });
    io.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () { io.disconnect(); }, 15000);
  }
})();
