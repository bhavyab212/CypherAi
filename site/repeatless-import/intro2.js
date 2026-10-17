(function () {
  function initReveal() {
    const headings = document.querySelectorAll("[data-intro2-reveal]");
    headings.forEach((h) => {
      if (h.__built) return;
      h.__built = true;
      const words = h.textContent.trim().split(/\s+/);
      h.innerHTML = words
        .map((w) => '<span class="intro2-word">' + w + "</span>")
        .join(" ");

      const spans = h.querySelectorAll(".intro2-word");

      // Robust IntersectionObserver
      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              spans.forEach((span, i) => {
                setTimeout(() => span.classList.add("intro2-word--in"), i * 24);
              });
              observer.unobserve(entry.target);
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px 50px 0px" }
        );
        observer.observe(h);
      } else {
        spans.forEach((span) => span.classList.add("intro2-word--in"));
      }

      // Safety fallback: ensure text is always 100% visible after 800ms
      setTimeout(() => {
        spans.forEach((span) => span.classList.add("intro2-word--in"));
      }, 800);
    });
  }

  window.__rlInitIntro2 = function () {
    initReveal();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReveal);
  } else {
    initReveal();
  }
})();
