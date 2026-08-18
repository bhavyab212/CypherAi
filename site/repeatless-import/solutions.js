(function () {
  function syncScrollTriggerWithLenis(ScrollTrigger) {
    if (window.lenis) {
      window.lenis.on("scroll", ScrollTrigger.update);
      return;
    }
    let attempts = 0;
    const iv = setInterval(() => {
      attempts += 1;
      if (window.lenis) {
        window.lenis.on("scroll", ScrollTrigger.update);
        clearInterval(iv);
      } else if (attempts > 80) {
        clearInterval(iv);
      }
    }, 100);
  }

  function initLottie() {
    const container = document.getElementById("rl-tailored-ai-lottie");
    if (!container || !window.lottie) return;
    fetch("./repeatless-import/assets/ai-intelligence.json")
      .then((res) => res.json())
      .then((animationData) => {
        window.lottie.loadAnimation({
          container,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData,
          rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
        });
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      })
      .catch(() => {});
  }

  function initSolutions() {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const section = document.getElementById("rl-solutions");
    const track = document.getElementById("rl-solutions-track");
    if (!gsap || !ScrollTrigger || !section || !track) return;

    gsap.registerPlugin(ScrollTrigger);
    syncScrollTriggerWithLenis(ScrollTrigger);

    const panels = Array.from(track.querySelectorAll(".rl-solutions__panel"));
    const isMobile = window.matchMedia("(max-width: 900px)").matches;

    // Chatbot idle float + wave loops run regardless of viewport so the
    // character stays alive even when the pinned scroller is disabled on mobile.
    gsap.to(".robot-wrapper", { y: -15, duration: 2, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to(".robot-head", { rotation: 3, x: 2, duration: 2.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to(".antenna-dot", { y: -5, duration: 1.5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.5 });
    gsap.to(".robot-arm", { rotation: -10, transformOrigin: "right center", duration: 1.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.set(".chat-bubble", { scale: 0, transformOrigin: "bottom right" });
    const chatbot = section.querySelector(".rl-chatbot");
    if (chatbot) {
      gsap
        .timeline({ scrollTrigger: { trigger: chatbot, start: "top 80%" } })
        .to(".chat-bubble", { scale: 1, duration: 0.6, ease: "back.out(1.5)" })
        .to(".chat-bubble", { y: -8, duration: 2, ease: "sine.inOut", yoyo: true, repeat: -1 }, "+=0");
    }

    if (isMobile) return;

    const ctx = gsap.context(() => {
      const slideDistance = track.scrollWidth - window.innerWidth;

      const drawPaths = section.querySelectorAll(".draw-path");
      const portDots = section.querySelectorAll(".port-dot");
      const nodeContents = section.querySelectorAll(".node-content");

      gsap.set(drawPaths, { strokeDasharray: 1500, strokeDashoffset: 1500 });
      gsap.set(portDots, { scale: 0, transformOrigin: "center center" });
      gsap.set(nodeContents, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${slideDistance + 1000}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const prog = self.progress;
            const panelCount = panels.length;
            const panelIdx = Math.min(Math.max(Math.floor(prog * panelCount), 0), panelCount - 1);

            panels.forEach((panel, i) => {
              const textEl = panel.querySelector("[data-htext]");
              const maskEl = panel.querySelector("[data-imagemask]");
              if (!textEl) return;

              if (i === panelIdx) {
                gsap.to(textEl, { opacity: 1, y: 0, duration: 0.4 });
                if (maskEl) {
                  gsap.to(maskEl, {
                    clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
                    duration: 0.5,
                    ease: "power2.out",
                  });
                }
              } else {
                gsap.to(textEl, { opacity: 0.28, y: 34, duration: 0.4 });
                if (maskEl) {
                  gsap.to(maskEl, {
                    clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
                    duration: 0.5,
                    ease: "power2.in",
                  });
                }
              }
            });
          },
        },
      });

      tl.to(track, { x: -slideDistance, ease: "none", duration: 5.0 }, 0);

      tl.to(drawPaths, { strokeDashoffset: 0, duration: 0.25, ease: "power1.inOut" }, 0);

      tl.to(portDots, { scale: 1, duration: 0.1, ease: "back.out(2)", stagger: 0.005 }, 0.15);

      tl.to(nodeContents, { opacity: 1, duration: 0.15, ease: "power2.out" }, 0.2);

      const firstPanelTextContainer = panels[0] && panels[0].querySelector("[data-htext]");
      if (firstPanelTextContainer && firstPanelTextContainer.children.length > 0) {
        gsap.from(firstPanelTextContainer.children, {
          y: -40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.5)",
          scrollTrigger: { trigger: section, start: "top 75%" },
        });
      }
    }, section);

    window.addEventListener("beforeunload", () => ctx.revert());
  }

  window.__rlInitSolutions = () => {
    initLottie();
    initSolutions();
  };
})();
