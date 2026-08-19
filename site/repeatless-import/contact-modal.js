(function () {
  const EMAIL = "Aiwithpriyansh@gmail.com";
  const PHONE = "+91 9582440495";
  const TELEGRAM = "@priyanshu143b";
  const WHATSAPP_URL = "https://wa.me/919582440495";
  const TELEGRAM_URL = "https://t.me/priyanshu143b";
  const LINKEDIN_URL = "https://www.linkedin.com/in/priyansh-razz-293154372";
  const INSTAGRAM_URL = "https://www.instagram.com/thepriyansh06/";
  const X_URL = "https://x.com/Priyans90072914";
  const THREADS_URL = "https://www.threads.net/@thepriyansh06";

  const COPY_SVG =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
  const CHECK_SVG =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  const EXTERNAL_SVG =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

  // Build and inject modal
  function injectModal() {
    if (document.getElementById("chypher-contact-modal")) return;

    const modalHtml = `
      <div class="cm-overlay" id="chypher-contact-modal" role="dialog" aria-modal="true" aria-label="Direct Contact">
        <div class="cm-dialog">
          <button class="cm-close" id="cm-close-btn" aria-label="Close modal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <div class="cm-header">
            <div class="cm-badge"><span class="cm-badge-dot"></span> Available For Work</div>
            <h3 class="cm-title">Direct Contact</h3>
            <p class="cm-subtitle">Connect directly with Priyansh Razz / Chypher Ai for automation & AI projects.</p>
          </div>

          <div class="cm-list">
            <!-- Email Item -->
            <div class="cm-card">
              <div class="cm-card-left">
                <div class="cm-icon-box cm-icon-email">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/></svg>
                </div>
                <div class="cm-card-info">
                  <span class="cm-card-label">Email Address</span>
                  <span class="cm-card-value">${EMAIL}</span>
                </div>
              </div>
              <div class="cm-card-actions">
                <button class="cm-btn-copy" data-copy="${EMAIL}" aria-label="Copy Email">
                  ${COPY_SVG} <span>Copy</span>
                </button>
                <a href="mailto:${EMAIL}" class="cm-btn-open" aria-label="Send Email" title="Send Email">
                  ${EXTERNAL_SVG}
                </a>
              </div>
            </div>

            <!-- Phone / WhatsApp Item -->
            <div class="cm-card">
              <div class="cm-card-left">
                <div class="cm-icon-box cm-icon-phone">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div class="cm-card-info">
                  <span class="cm-card-label">WhatsApp / Phone</span>
                  <span class="cm-card-value">${PHONE}</span>
                </div>
              </div>
              <div class="cm-card-actions">
                <button class="cm-btn-copy" data-copy="${PHONE}" aria-label="Copy Phone Number">
                  ${COPY_SVG} <span>Copy</span>
                </button>
                <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" class="cm-btn-open" aria-label="Chat on WhatsApp" title="Chat on WhatsApp">
                  ${EXTERNAL_SVG}
                </a>
              </div>
            </div>

            <!-- Telegram Item -->
            <div class="cm-card">
              <div class="cm-card-left">
                <div class="cm-icon-box cm-icon-telegram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </div>
                <div class="cm-card-info">
                  <span class="cm-card-label">Telegram</span>
                  <span class="cm-card-value">${TELEGRAM}</span>
                </div>
              </div>
              <div class="cm-card-actions">
                <button class="cm-btn-copy" data-copy="${TELEGRAM}" aria-label="Copy Telegram Handle">
                  ${COPY_SVG} <span>Copy</span>
                </button>
                <a href="${TELEGRAM_URL}" target="_blank" rel="noopener noreferrer" class="cm-btn-open" aria-label="Open Telegram" title="Open Telegram">
                  ${EXTERNAL_SVG}
                </a>
              </div>
            </div>
          </div>

          <div class="cm-footer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>Fastest response within 2 hours • Worldwide client availability</span>
          </div>
        </div>
      </div>

      <div class="cm-toast" id="cm-toast">Copied to clipboard!</div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHtml);

    // Event listeners
    const modal = document.getElementById("chypher-contact-modal");
    const closeBtn = document.getElementById("cm-close-btn");

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    // Copy buttons
    document.querySelectorAll(".cm-btn-copy").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const text = btn.getAttribute("data-copy");
        if (text) copyToClipboard(text, btn);
      });
    });
  }

  function showToast(msg) {
    const toast = document.getElementById("cm-toast");
    if (!toast) return;
    toast.textContent = msg || "Copied to clipboard!";
    toast.classList.add("cm-toast-show");
    setTimeout(() => {
      toast.classList.remove("cm-toast-show");
    }, 2200);
  }

  function copyToClipboard(text, btn) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => onCopied(btn)).catch(() => fallbackCopy(text, btn));
    } else {
      fallbackCopy(text, btn);
    }
  }

  function fallbackCopy(text, btn) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      onCopied(btn);
    } catch (e) {
      console.error("Copy failed:", e);
    }
    document.body.removeChild(ta);
  }

  function onCopied(btn) {
    if (btn) {
      const span = btn.querySelector("span");
      const origText = span ? span.textContent : "Copy";
      btn.classList.add("copied");
      btn.innerHTML = `${CHECK_SVG} <span>Copied!</span>`;
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.innerHTML = `${COPY_SVG} <span>${origText}</span>`;
      }, 2200);
    }
    showToast("Copied to clipboard!");
  }

  function openModal() {
    injectModal();
    const modal = document.getElementById("chypher-contact-modal");
    if (modal) {
      modal.classList.add("cm-open");
      document.body.style.overflow = "hidden";
    }
  }

  function closeModal() {
    const modal = document.getElementById("chypher-contact-modal");
    if (modal) {
      modal.classList.remove("cm-open");
      document.body.style.overflow = "";
    }
  }

  window.openChypherContactModal = openModal;
  window.closeChypherContactModal = closeModal;

  // Intercept all clicks on @ / email / contact buttons and fix external links
  function enhanceSocialLinks() {
    document.querySelectorAll("a").forEach((a) => {
      const href = a.getAttribute("href") || "";

      // 1. Email links -> trigger popup
      if (
        href.startsWith("mailto:") ||
        href.includes("Aiwithpriyansh") ||
        a.textContent.trim() === "@" ||
        a.getAttribute("data-framer-name") === "Variant 4" && href.includes("@")
      ) {
        a.setAttribute("data-social", "email");
        if (!a.__cmAttached) {
          a.__cmAttached = true;
          a.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            openModal();
          });
        }
      }

      // 2. LinkedIn -> ensure absolute user profile URL
      if (href.includes("linkedin.com") || a.getAttribute("data-social") === "linkedin") {
        a.setAttribute("data-social", "linkedin");
        a.setAttribute("href", LINKEDIN_URL);
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      }

      // 3. Instagram
      if (href.includes("instagram.com")) {
        a.setAttribute("data-social", "instagram");
        a.setAttribute("href", INSTAGRAM_URL);
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      }

      // 4. X / Twitter
      if (href.includes("x.com") || href.includes("twitter.com")) {
        a.setAttribute("data-social", "x");
        a.setAttribute("href", X_URL);
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      }

      // 5. Threads
      if (href.includes("threads.net")) {
        a.setAttribute("data-social", "threads");
        a.setAttribute("href", THREADS_URL);
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      }

      // 6. Telegram
      if (href.includes("t.me") || href.includes("telegram")) {
        a.setAttribute("data-social", "telegram");
        a.setAttribute("href", TELEGRAM_URL);
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      }
    });
  }

  // Init
  function init() {
    injectModal();
    enhanceSocialLinks();

    // Re-check periodically or on DOM changes (Framer hydration)
    const observer = new MutationObserver(enhanceSocialLinks);
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(enhanceSocialLinks, 500);
    setTimeout(enhanceSocialLinks, 1500);
    setTimeout(enhanceSocialLinks, 3000);
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
