(function () {
  const ICONS = {
    barChart3: '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    gitBranch: '<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
    bot: '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>',
    sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
    zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    trendingUp: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    link2: '<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" y1="12" x2="16" y2="12"/>',
    arrowDownRight: '<path d="M7 7v10h10"/><path d="M17 7 7 17"/>',
  };
  function icon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICONS[name] + "</svg>";
  }

  const CARDS = [
    { icon: "barChart3", title: "Proven Results", body: "Measured gains from practical automation builds", label: "Proven\nResults", detail: "Real impact for real businesses. Clients across the USA, Canada, and India have reduced manual work, accelerated lead response, and cut operational costs with custom automation." },
    { icon: "gitBranch", title: "n8n Automation", body: "Connected workflows that remove repetitive work", label: "n8n\nAutomation", detail: "Custom automation, maximum efficiency. I design powerful workflows from CRMs to SaaS tools, integrating n8n with Sheets, GHL, Slack, WhatsApp, and more." },
    { icon: "bot", title: "Consultant Approach", body: "Founder-led strategy, build, and iteration", label: "Consultant\nApproach", detail: "Unlike agencies, I work as your dedicated automation consultant, hands-on from strategy to deployment, with ongoing support and optimization as your business scales." },
    { icon: "sparkles", title: "AI Integration", body: "Embedding intelligence directly into your daily operations", label: "AI\nIntegration", detail: "Bringing generative AI directly into your business workflows. From intelligent lead sorting to auto-drafting responses, AI saves countless hours of manual review." },
    { icon: "zap", title: "Workflow Optimization", body: "Streamlining complex processes for maximum speed", label: "Workflow\nOptimization", detail: "We analyze your bottlenecks and re-architect your data flow. By removing redundant steps, we ensure your team spends time on high-value tasks instead of data entry." },
    { icon: "trendingUp", title: "Continuous Scaling", body: "Adapting automations as your business volume grows", label: "Continuous\nScaling", detail: "Automations that grow with you. Our infrastructure is designed to handle 10x the volume without breaking a sweat, ensuring smooth operations during rapid scaling." },
    { icon: "link2", title: "Seamless APIs", body: "Bridging software silos to unify your tech stack", label: "Seamless\nAPIs", detail: "No more disjointed tools. We build custom API connectors to ensure your CRM, marketing platforms, and internal databases communicate flawlessly in real-time." },
  ];

  const THEMES = [
    {
      accent: "#10B981",       // 01 Proven Results - Emerald
      accentLight: "#34D399",
      glow: "rgba(16, 185, 129, 0.32)",
      glowBg: "#051f18",
      stop1: "#072018",
      stop2: "#03100c",
    },
    {
      accent: "#8B5CF6",       // 02 n8n Automation - Electric Violet
      accentLight: "#A78BFA",
      glow: "rgba(139, 92, 246, 0.32)",
      glowBg: "#130a26",
      stop1: "#1a0f33",
      stop2: "#0c0618",
    },
    {
      accent: "#06B6D4",       // 03 Consultant Approach - Cyan Blue
      accentLight: "#38BDF8",
      glow: "rgba(6, 182, 212, 0.32)",
      glowBg: "#041a22",
      stop1: "#09242d",
      stop2: "#030e12",
    },
    {
      accent: "#D946EF",       // 04 AI Integration - Neon Magenta
      accentLight: "#F0ABFC",
      glow: "rgba(217, 70, 239, 0.32)",
      glowBg: "#220729",
      stop1: "#2b0a33",
      stop2: "#120317",
    },
    {
      accent: "#F59E0B",       // 05 Workflow Optimization - Amber Gold
      accentLight: "#FDE047",
      glow: "rgba(245, 158, 11, 0.32)",
      glowBg: "#221404",
      stop1: "#2c1c06",
      stop2: "#130a02",
    },
    {
      accent: "#14B8A6",       // 06 Continuous Scaling - Teal Green
      accentLight: "#5EEAD4",
      glow: "rgba(20, 184, 166, 0.32)",
      glowBg: "#041e1a",
      stop1: "#072822",
      stop2: "#02110e",
    },
    {
      accent: "#6366F1",       // 07 Seamless APIs - Indigo
      accentLight: "#A5B4FC",
      glow: "rgba(99, 102, 241, 0.32)",
      glowBg: "#0b0e2b",
      stop1: "#121538",
      stop2: "#06071a",
    },
  ];

  function esc(s) {
    return s.replace(/\n/g, "<br>");
  }

  function applyTheme(idx) {
    const theme = THEMES[idx] || THEMES[0];
    const section = document.getElementById("wwd-section");
    if (section) {
      section.style.setProperty("--wwd-accent", theme.accent);
      section.style.setProperty("--wwd-accent-light", theme.accentLight);
      section.style.setProperty("--wwd-glow", theme.glow);
      section.style.setProperty("--wwd-glow-bg", theme.glowBg);
    }

    const stop1 = document.getElementById("wwd-stop-1");
    const stop2 = document.getElementById("wwd-stop-2");
    if (stop1) stop1.setAttribute("stop-color", theme.stop1);
    if (stop2) stop2.setAttribute("stop-color", theme.stop2);

    const stop1m = document.getElementById("wwd-stop-1-m");
    const stop2m = document.getElementById("wwd-stop-2-m");
    if (stop1m) stop1m.setAttribute("stop-color", theme.stop1);
    if (stop2m) stop2m.setAttribute("stop-color", theme.stop2);
  }

  function render() {
    const cardsHtml = (active) =>
      CARDS.map(
        (c, i) =>
          '<div class="wwd-orbit__card' + (i === active ? " wwd-orbit__card--active" : "") + '" data-idx="' + i + '">' +
            '<div class="wwd-orbit__card-inner">' +
              '<div class="wwd-orbit__icon">' + icon(c.icon) + '</div>' +
              "<h3>" + c.title + "</h3>" +
              "<p>" + c.body + "</p>" +
            "</div>" +
          "</div>"
      ).join("");

    const desk = document.getElementById("wwd-cards-desktop");
    const mob = document.getElementById("wwd-cards-mobile");
    if (desk) desk.innerHTML = cardsHtml(0);
    if (mob) mob.innerHTML = cardsHtml(0);

    const labelsTrack = document.getElementById("wwd-labels-track");
    if (labelsTrack) {
      labelsTrack.innerHTML = CARDS.map(
        (c) =>
          '<div class="wwd-labels__item"><p><span class="wwd-labels__badge">' +
          icon("arrowDownRight") +
          "</span>" +
          esc(c.label) +
          "</p></div>"
      ).join("");
    }

    const descTrack = document.getElementById("wwd-desc-track");
    if (descTrack) {
      descTrack.innerHTML = CARDS.map(
        (c) => '<div class="wwd-desc__item"><p>' + c.detail + "</p></div>"
      ).join("");
    }

    const descTrackM = document.getElementById("wwd-desc-track-m");
    if (descTrackM) {
      descTrackM.innerHTML =
        '<div class="wwd-mobile__desc-track" style="transition: transform 0.5s ease">' +
        CARDS.map((c) => '<p class="wwd-mobile__desc-item">' + c.detail + "</p>").join("") +
        "</div>";
    }

    const numDigits = (id) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = CARDS.map((_, i) => "<span>" + (i + 1) + "</span>").join("");
    };
    numDigits("wwd-bignum-track");
    numDigits("wwd-bignum-track-m");

    applyTheme(0);
  }

  function initScroll() {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const section = document.getElementById("wwd-section");
    if (!gsap || !ScrollTrigger || !section) return;
    gsap.registerPlugin(ScrollTrigger);

    const total = CARDS.length;
    const progressBars = [document.getElementById("wwd-progress-bar"), document.getElementById("wwd-progress-bar-m")];
    const labelsTrack = document.getElementById("wwd-labels-track");
    const descTrack = document.getElementById("wwd-desc-track");
    const descTrackM = document.querySelector("#wwd-desc-track-m .wwd-mobile__desc-track");
    const bignumTracks = [document.getElementById("wwd-bignum-track"), document.getElementById("wwd-bignum-track-m")];
    const cardSets = [document.getElementById("wwd-cards-desktop"), document.getElementById("wwd-cards-mobile")];

    let lastIdx = -1;

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=" + (total - 1) * 85 + "%",
      scrub: 0.5,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const prog = self.progress;
        progressBars.forEach((el) => el && (el.style.width = prog * 100 + "%"));

        const idx = Math.min(Math.floor(prog * total), total - 1);
        const offset = -((idx * 100) / total) + "%";

        if (labelsTrack) labelsTrack.style.transform = "translateY(" + offset + ")";
        if (descTrack) descTrack.style.transform = "translateY(" + offset + ")";
        if (descTrackM) descTrackM.style.transform = "translateY(" + offset + ")";
        bignumTracks.forEach((el) => el && (el.style.transform = "translateY(" + offset + ")"));

        if (idx !== lastIdx) {
          lastIdx = idx;
          applyTheme(idx);
          cardSets.forEach((set) => {
            if (!set) return;
            set.querySelectorAll(".wwd-orbit__card").forEach((el) => {
              el.classList.toggle("wwd-orbit__card--active", Number(el.dataset.idx) === idx);
            });
          });
        }
      },
    });

    gsap.to(".wwd-orbit-ring", {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=" + (total - 1) * 85 + "%",
        scrub: 0.5,
      },
    });
  }

  window.__rlInitWhatWeDo = function () {
    render();
    initScroll();
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  };
})();
