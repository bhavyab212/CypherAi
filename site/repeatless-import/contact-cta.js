/* ============================================================
   Routes every booking / consultation CTA to the custom contact
   form at /contact/.

   Why click interception rather than just rewriting href: the
   footer and hero CTAs are Framer React components whose href is
   re-rendered from bundled props, so an href we write can be
   overwritten at any time (the LinkedIn link behaved exactly that
   way). A capture-phase click listener does not depend on the
   href surviving, so it always wins.

   Deliberately no MutationObserver here — the href rewrite runs on
   a few bounded timers instead. An observer that reacts to every
   mutation on this page has twice caused a main-thread starvation
   freeze, so it is not worth the risk for a cosmetic touch-up.
   ============================================================ */
(function () {
  "use strict";

  var TARGET = "/contact/";

  function isBookingCta(text) {
    var t = (text || "").trim().toLowerCase();
    if (!t || t.length > 60) return false;
    if (t.indexOf("book") === -1) return false;
    return /consultation|intro call|discovery call/.test(t);
  }

  function targetUrl(label) {
    return (
      TARGET +
      "?from=" + encodeURIComponent((label || "").trim().slice(0, 60)) +
      "&path=" + encodeURIComponent(location.pathname)
    );
  }

  // Already on the contact page? Then do nothing at all.
  function onContactPage() {
    return /^\/contact(\/|\/index\.html)?$/.test(location.pathname);
  }

  /* --- authoritative: intercept the click --- */
  function onClick(e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest ? e.target.closest("a,button") : null;
    if (!a) return;
    if (!isBookingCta(a.textContent)) return;
    e.preventDefault();
    window.location.href = targetUrl(a.textContent);
  }

  /* --- cosmetic: point the href at the form so hover, middle-click
         and "copy link address" behave sensibly too --- */
  function rewrite() {
    var links = document.querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      if (!isBookingCta(a.textContent)) continue;
      var want = targetUrl(a.textContent);
      if (a.getAttribute("href") === want) continue;
      a.setAttribute("href", want);
      // these CTAs previously pointed at wa.me / mailto and opened a new tab
      if (a.getAttribute("target")) a.removeAttribute("target");
      if (a.getAttribute("rel")) a.removeAttribute("rel");
    }
  }

  function start() {
    if (onContactPage()) return;
    document.addEventListener("click", onClick, true);
    rewrite();
    // Framer hydrates and re-renders after load; a few bounded passes keep
    // the visible href in sync without watching the DOM continuously.
    [400, 1500, 4000, 9000].forEach(function (ms) { setTimeout(rewrite, ms); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
