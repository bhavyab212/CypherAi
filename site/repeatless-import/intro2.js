(function () {
  function initReveal() {
    const headings = document.querySelectorAll("[data-intro2-reveal]");
    headings.forEach((h) => {
      if (h.__built) return;
      h.__built = true;
      const words = h.textContent.trim().split(/\s+/);
      h.innerHTML = words.map((w) => '<span class="intro2-word">' + w + "</span>").join(" ");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const spans = entry.target.querySelectorAll(".intro2-word");
          spans.forEach((span, i) => {
            setTimeout(() => span.classList.add("intro2-word--in"), i * 35);
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );
    headings.forEach((h) => observer.observe(h));
  }

  window.__rlInitIntro2 = function () {
    initReveal();
  };
})();
