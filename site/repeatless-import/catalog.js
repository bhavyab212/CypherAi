(function () {
  const I = window.RL_ICONS;

  // ---------- Spotlight hover (agency-webos: src/features/ui/SpotlightCard.tsx) ----------
  function initSpotlights() {
    document.querySelectorAll('.rl-spotlight-host').forEach((host) => {
      if (host.__rlSpotlightBound) return;
      host.__rlSpotlightBound = true;
      const glow = host.querySelector('.rl-spotlight');
      const color = host.getAttribute('data-spotlight-color') || 'rgba(255,255,255,0.1)';
      host.addEventListener('mousemove', (e) => {
        const rect = host.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        glow.style.background = 'radial-gradient(400px circle at ' + x + 'px ' + y + 'px, ' + color + ', transparent 40%)';
      });
      host.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
      host.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
    });
  }

  // ---------- Modal open/close (spring feel ported from agency-webos AppWindow.tsx) ----------
  let modalOpen = false;

  function getModalEls() {
    return {
      overlay: document.getElementById('rl-modal-overlay'),
      win: document.getElementById('rl-modal-window'),
      content: document.getElementById('rl-modal-content'),
    };
  }

  function openModal(kind) {
    const { overlay, win, content } = getModalEls();
    if (!overlay || !win || !content) return;
    if (kind === 'services') renderServicesList();
    if (kind === 'automations') renderAutomationsList('All');

    overlay.style.display = 'flex';
    modalOpen = true;
    document.body.style.overflow = 'hidden';

    overlay.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: 'ease-out', fill: 'forwards' });
    win.animate(
      [
        { opacity: 0, transform: 'scale(0.85) translateY(40px)' },
        { opacity: 1, transform: 'scale(1) translateY(0)' },
      ],
      { duration: 380, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', fill: 'forwards' }
    );
    content.scrollTop = 0;
  }

  function closeModal() {
    const { overlay, win } = getModalEls();
    if (!overlay || !win || !modalOpen) return;
    modalOpen = false;
    document.body.style.overflow = '';

    const closeWin = win.animate(
      [
        { opacity: 1, transform: 'scale(1) translateY(0)' },
        { opacity: 0, transform: 'scale(0.92) translateY(20px)' },
      ],
      { duration: 200, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' }
    );
    overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'ease-in', fill: 'forwards' });
    closeWin.onfinish = () => { overlay.style.display = 'none'; };
  }

  window.RL_openModal = openModal;
  window.RL_closeModal = closeModal;

  function goToContact() {
    closeModal();
    window.location.href = 'mailto:Aiwithpriyansh@gmail.com';
  }

  // ---------- Services ----------
  function renderServicesList() {
    const content = document.getElementById('rl-modal-content');
    const cards = window.RL_SERVICES.map((s) => (
      '<button class="rl-cat-card magic-card" data-service="' + s.id + '">' +
        '<div class="rl-cat-card__inner">' +
          '<div class="rl-cat-card__top">' +
            window.RL_serviceMark(s.logoType, 'md') +
            '<span class="rl-cat-card__arrow">' + I.arrowRight + '</span>' +
          '</div>' +
          '<h3 class="rl-cat-card__title">' + s.title + '</h3>' +
          '<p class="rl-cat-card__desc">' + s.oneLine + '</p>' +
          '<div class="rl-cat-card__footer">' +
            '<span>' + I.banknote + s.priceLabel + '</span>' +
            '<span>' + I.clock + s.timelineEstimate + '</span>' +
          '</div>' +
        '</div>' +
      '</button>'
    )).join('');

    content.innerHTML =
      '<div class="rl-catalog">' +
        '<h1 class="rl-catalog__title">Our Capabilities</h1>' +
        '<p class="rl-catalog__subtitle">Premium digital solutions focused on business growth, operational efficiency, and cutting-edge technology.</p>' +
        '<div class="rl-cat-grid">' + cards + '</div>' +
      '</div>';

    content.querySelectorAll('[data-service]').forEach((btn) => {
      btn.addEventListener('click', () => renderServiceDetail(btn.getAttribute('data-service')));
    });
  }

  function renderServiceDetail(id) {
    const s = window.RL_SERVICES.find((x) => x.id === id);
    if (!s) return renderServicesList();
    const content = document.getElementById('rl-modal-content');

    const deliverables = s.deliverables.map((d) => (
      '<li class="rl-deliverable"><span class="rl-deliverable__dot"></span>' + d + '</li>'
    )).join('');

    const process = s.process.map((p, i) => (
      '<div class="rl-process-step">' +
        '<div class="rl-process-step__num">' + (i + 1) + '</div>' +
        '<div class="rl-process-step__card"><h4>' + p.title + '</h4><p>' + p.description + '</p></div>' +
      '</div>'
    )).join('');

    const faq = s.faq.map((q) => (
      '<div class="rl-faq-item"><h4>' + q.question + '</h4><p>' + q.answer + '</p></div>'
    )).join('');

    const tech = s.techStack.map((t) => '<span class="rl-chip">' + t + '</span>').join('');

    content.innerHTML =
      '<div class="rl-detail">' +
        '<button class="rl-back" data-back="services">' + I.arrowLeft + ' BACK TO ALL SERVICES</button>' +
        '<div class="rl-detail__head">' +
          window.RL_serviceMark(s.logoType, 'lg') +
          '<div><h1>' + s.title + '</h1><p class="rl-detail__oneline">' + s.oneLine + '</p></div>' +
        '</div>' +
        '<div class="rl-detail__overview"><h3>' + I.target + ' Overview</h3><p>' + s.description + '</p></div>' +
        '<div class="rl-detail__grid">' +
          '<div class="rl-detail__main">' +
            '<div class="rl-detail__section"><h3>' + I.circleCheck + ' What You Get</h3><ul class="rl-deliverables">' + deliverables + '</ul></div>' +
            '<div class="rl-detail__section"><h3>' + I.listOrdered + ' Our Process</h3><div class="rl-process">' + process + '</div></div>' +
            '<div class="rl-detail__section"><h3>' + I.helpCircle + ' Frequently Asked Questions</h3><div class="rl-faq">' + faq + '</div></div>' +
          '</div>' +
          '<div class="rl-detail__side">' +
            '<div class="rl-invest-card">' +
              '<div class="rl-invest-card__row"><span class="rl-invest-card__label">' + I.banknote + ' INVESTMENT</span><div class="rl-invest-card__value">' + s.priceLabel + '</div></div>' +
              '<div class="rl-invest-card__row"><span class="rl-invest-card__label">' + I.clock + ' TIMELINE</span><div class="rl-invest-card__value">' + s.timelineEstimate + '</div></div>' +
              '<button class="rl-cta-btn" data-contact="1">Request this service ' + I.arrowRight + '</button>' +
            '</div>' +
            '<div class="rl-tech-card"><h3>' + I.codeXml + ' Tech Stack</h3><div class="rl-chips">' + tech + '</div></div>' +
          '</div>' +
        '</div>' +
      '</div>';

    content.querySelector('[data-back]').addEventListener('click', renderServicesList);
    content.querySelector('[data-contact]').addEventListener('click', goToContact);
    content.scrollTop = 0;
  }

  // ---------- Automations ----------
  let automationCategory = 'All';

  function filteredAutomations() {
    if (automationCategory === 'All') return window.RL_AUTOMATIONS;
    return window.RL_AUTOMATIONS.filter((e) => e.category.includes(automationCategory) || e.tags.includes(automationCategory));
  }

  function renderAutomationsList(category) {
    automationCategory = category || automationCategory;
    const content = document.getElementById('rl-modal-content');
    const entries = filteredAutomations();

    const pills = window.RL_AUTOMATION_CATEGORIES.map((cat) => (
      '<button class="rl-pill' + (cat === automationCategory ? ' rl-pill--active' : '') + '" data-cat="' + cat + '">' + cat + '</button>'
    )).join('');

    let featured = '';
    let rest = [];
    if (entries.length > 0) {
      const f = entries[0];
      featured =
        '<button class="rl-featured magic-card" data-automation="' + f.id + '">' +
          '<div class="rl-card-clip">' +
            '<div class="rl-featured__image"><img src="' + f.workflowImage + '" alt="Workflow for ' + f.title + '" loading="lazy"></div>' +
            '<div class="rl-featured__info">' +
              window.RL_automationMark(f.logoType, 'lg') +
              '<div class="rl-featured__category">' + f.category + '</div>' +
              '<h2>' + f.title + '</h2>' +
              '<p>' + f.explainer + '</p>' +
              '<div class="rl-chips">' + f.tags.map((t) => '<span class="rl-chip">' + t + '</span>').join('') + '</div>' +
              '<div class="rl-view-link">View workflow ' + I.arrowRight + '</div>' +
            '</div>' +
          '</div>' +
        '</button>';
      rest = entries.slice(1);
    }

    const grid = rest.map((e) => (
      '<button class="rl-auto-card magic-card" data-automation="' + e.id + '">' +
        '<div class="rl-card-clip">' +
          '<div class="rl-auto-card__image"><img src="' + e.workflowImage + '" alt="Workflow for ' + e.title + '" loading="lazy"></div>' +
          '<div class="rl-auto-card__body">' +
            '<div class="rl-auto-card__top">' + window.RL_automationMark(e.logoType, 'sm') + '<span>' + e.category + '</span></div>' +
            '<h3>' + e.title + '</h3>' +
            '<p>' + e.shortDescription + '</p>' +
            '<div class="rl-chips">' + e.tags.slice(0, 2).map((t) => '<span class="rl-chip rl-chip--sm">' + t + '</span>').join('') + '</div>' +
            '<div class="rl-view-link rl-view-link--sm">View workflow ' + I.arrowRight + '</div>' +
          '</div>' +
        '</div>' +
      '</button>'
    )).join('');

    content.innerHTML =
      '<div class="rl-catalog">' +
        '<div class="rl-catalog__eyebrow">AUTOMATION LIBRARY</div>' +
        '<div class="rl-catalog__title-row"><h1 class="rl-catalog__title">Automations</h1><span class="rl-count-badge">' + window.RL_AUTOMATIONS.length + ' workflow systems</span></div>' +
        '<p class="rl-catalog__subtitle">Selected workflow systems designed to remove repetitive work, connect tools, and keep operations moving.</p>' +
        '<div class="rl-pills">' + pills + '</div>' +
        (entries.length ? ('<div class="rl-auto-wrap">' + featured + '<div class="rl-auto-grid">' + grid + '</div></div>') :
          '<div class="rl-empty">No workflows found for the selected category.</div>') +
      '</div>';

    content.querySelectorAll('[data-cat]').forEach((btn) => {
      btn.addEventListener('click', () => renderAutomationsList(btn.getAttribute('data-cat')));
    });
    content.querySelectorAll('[data-automation]').forEach((btn) => {
      btn.addEventListener('click', () => renderAutomationDetail(btn.getAttribute('data-automation')));
    });
  }

  function renderAutomationDetail(id) {
    const e = window.RL_AUTOMATIONS.find((x) => x.id === id);
    if (!e) return renderAutomationsList();
    const content = document.getElementById('rl-modal-content');

    content.innerHTML =
      '<div class="rl-detail">' +
        '<button class="rl-back" data-back="automations">' + I.arrowLeft + ' BACK TO AUTOMATIONS</button>' +
        '<div class="rl-detail__head">' +
          window.RL_automationMark(e.logoType, 'lg') +
          '<div><div class="rl-featured__category">' + e.category + '</div><h1>' + e.title + '</h1></div>' +
        '</div>' +
        '<div class="rl-auto-detail-grid">' +
          '<div class="rl-detail__main">' +
            '<div class="rl-detail__section"><h3>' + I.workflow + ' How this workflow is structured</h3><p>' + e.explainer + '</p></div>' +
            '<div class="rl-detail__section"><h3>' + I.circleCheck + ' Capabilities</h3><div class="rl-chips">' + e.tags.map((t) => '<span class="rl-chip">' + t + '</span>').join('') + '</div></div>' +
            '<div class="rl-detail__section"><h3>Status</h3><span class="rl-status-pill">' + e.status + '</span></div>' +
          '</div>' +
          '<div class="rl-detail__side">' +
            '<div class="rl-auto-canvas"><img src="' + e.workflowImage + '" alt="Workflow for ' + e.title + '"></div>' +
            '<button class="rl-cta-btn" data-contact="1">Discuss a similar system ' + I.arrowRight + '</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    content.querySelector('[data-back]').addEventListener('click', () => renderAutomationsList());
    content.querySelector('[data-contact]').addEventListener('click', goToContact);
    content.scrollTop = 0;
  }

  // ---------- Wiring ----------
  function init() {
    initSpotlights();
    const workCard = document.getElementById('rl-quicklaunch-work');
    const servicesCard = document.getElementById('rl-quicklaunch-services');
    if (workCard) workCard.addEventListener('click', () => openModal('automations'));
    if (servicesCard) servicesCard.addEventListener('click', () => openModal('services'));

    const overlay = document.getElementById('rl-modal-overlay');
    const closeBtn = document.getElementById('rl-modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) {
      overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    }
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modalOpen) closeModal(); });
  }

  window.__rlInitCatalog = init;
})();
