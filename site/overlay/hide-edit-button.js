// Cypher Ai — hide Framer's editor affordance (belt & braces).
// The CSS (hide-edit-button.css, loaded via <link> in <head>) handles the
// static case, but Framer injects the editorbar nodes + its own <style>
// client-side at runtime (chunk-3SWZZEDP.mjs), so late mounts can beat a
// pure-CSS rule. This script re-removes the nodes whenever they appear:
// on DOMContentLoaded/load, a few timed re-scans (Framer hydrates async),
// plus a MutationObserver (capped: 60 ticks / 20s) that strips the nodes
// and their injected <style> the moment they mount. Idempotent, no-op
// when the bar is absent. Never touches the Framer export on disk.
(function () {
  'use strict';

  var IDS = [
    '__framer-editorbar-container',
    '__framer-editorbar',
    '__framer-editorbar-button',
    '__framer-editorbar-label',
    '__framer-editorbar-loading-spinner'
  ];

  function kill() {
    var i, el;
    for (i = 0; i < IDS.length; i++) {
      el = document.getElementById(IDS[i]);
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }
    // Nuke Framer's runtime-injected editorbar <style> (contains the
    // "#__framer-editorbar-container" selector text) so it can't revive
    // stacking/z-index for any re-mounted node.
    var styles = document.querySelectorAll('style');
    for (i = 0; i < styles.length; i++) {
      var css = styles[i].textContent || '';
      if (css.indexOf('#__framer-editorbar-container') !== -1 &&
          css.indexOf('__framer-loading-spin') !== -1) {
        if (styles[i].parentNode) styles[i].parentNode.removeChild(styles[i]);
      }
    }
    // Clear the localStorage flag that opts the browser into the bar, so a
    // refresh doesn't re-arm it (the export checks
    // __framer_force_showing_editorbar_since in <head>).
    try {
      localStorage.removeItem('__framer_force_showing_editorbar_since');
      localStorage.removeItem('__framer_editor_button_position');
    } catch (e) { /* private mode — ignore */ }
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(kill);
  window.addEventListener('load', kill);
  [400, 1200, 3000, 6000].forEach(function (ms) { setTimeout(kill, ms); });

  if ('MutationObserver' in window) {
    var ticks = 0;
    var io = new MutationObserver(function () {
      ticks += 1;
      if (ticks > 60) { io.disconnect(); return; }
      kill();
    });
    io.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () { io.disconnect(); }, 20000);
  }
})();
