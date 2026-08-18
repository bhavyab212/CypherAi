(function () {
  const TICKER_ICONS = {
    folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  };

  function buildTicker() {
    const track = document.getElementById("am-ticker-track");
    if (!track || track.__built) return;
    track.__built = true;
    const sequence = ["folder", "mail", "user"];
    let html = "";
    for (let rep = 0; rep < 6; rep++) {
      sequence.forEach((key) => {
        html += '<div class="am-ticker-icon">' + TICKER_ICONS[key] + "</div>";
      });
    }
    track.innerHTML = html + html; // duplicate for seamless loop
  }

  function buildSpinner(el, size) {
    if (!el || el.__built) return;
    el.__built = true;
    const arms = 8;
    let html = '<div class="am-spinner__ring"></div>';
    for (let i = 0; i < arms; i++) {
      const rotation = (360 / arms) * i;
      const delay = (i / arms) * 1.2;
      html +=
        '<div class="am-spinner__arm" style="transform: translate(-50%, 0) rotate(' +
        rotation +
        "deg); animation-delay: -" +
        delay.toFixed(2) +
        's"></div>';
    }
    el.innerHTML = html;
  }

  // ---------- Word-by-word scroll reveal (ported visual from Framer's per-word appear effect) ----------
  function initRevealHeadings() {
    const headings = document.querySelectorAll("[data-am-reveal]");
    headings.forEach((h) => {
      if (h.__revealBuilt) return;
      h.__revealBuilt = true;
      const words = h.textContent.trim().split(/\s+/);
      h.innerHTML = words
        .map((w) => '<span class="am-word">' + w + "</span>")
        .join(" ");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const spans = entry.target.querySelectorAll(".am-word");
          spans.forEach((span, i) => {
            setTimeout(() => span.classList.add("am-word--in"), i * 45);
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );
    headings.forEach((h) => observer.observe(h));
  }

  // ---------- AI demo cycle (ported from the "AI Automation" Framer code component) ----------
  const DEMO_TEXT =
    "English Premier League Arsenal match, crowded stadium stands. The person sits casually, not posing, looking toward the field.";

  function runDemo() {
    const stage = document.getElementById("am-demo-stage");
    const typedEl = document.getElementById("am-demo-typed");
    if (!stage || !typedEl) return;

    stage.dataset.phase = "input";
    stage.removeAttribute("data-revealed");
    typedEl.textContent = "";

    let charIndex = 0;
    let typingTimer = null;

    function typeNext() {
      if (charIndex <= DEMO_TEXT.length) {
        typedEl.textContent = DEMO_TEXT.slice(0, charIndex);
        charIndex++;
        typingTimer = setTimeout(typeNext, 25);
      }
    }

    setTimeout(() => {
      stage.dataset.phase = "input";
      typeNext();
    }, 300);

    setTimeout(() => {
      clearTimeout(typingTimer);
      stage.dataset.phase = "processing";
    }, 2300);

    setTimeout(() => {
      stage.dataset.phase = "image";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          stage.dataset.revealed = "1";
        });
      });
    }, 6300);
  }

  function initDemoOnView() {
    const stage = document.getElementById("am-demo-stage");
    if (!stage) return;
    let played = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !played) {
            played = true;
            runDemo();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(stage);
  }

  window.__rlInitAntimetal = function () {
    buildTicker();
    buildSpinner(document.getElementById("am-demo-spinner"));
    buildSpinner(document.getElementById("am-how-spinner"));
    initRevealHeadings();
    initDemoOnView();
  };
})();
