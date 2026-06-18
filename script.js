(() => {
  const config = window.RUNGTRACE_CONFIG || {};
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const toast = $('[data-toast]');
  let toastTimer;

  const showToast = () => {
    if (!toast) return;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3200);
  };

  const setLink = (selector, url) => {
    $$(selector).forEach((link) => {
      if (url && url !== '#') {
        link.href = url;
        if (/^https?:\/\//.test(url)) {
          link.target = '_blank';
          link.rel = 'noopener';
        }
      } else {
        link.href = '#';
        link.addEventListener('click', (event) => {
          event.preventDefault();
          showToast();
        });
      }
    });
  };

  $$('[data-version]').forEach((el) => { el.textContent = config.version || '1.0.0'; });
  $$('[data-release-date]').forEach((el) => { el.textContent = config.releaseDate || 'Coming soon'; });
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  ['engineer', 'team'].forEach((plan) => {
    const planConfig = config.pricing?.[plan] || {};
    $$(`[data-price="${plan}"]`).forEach((el) => { el.textContent = planConfig.price || '$—'; });
    $$(`[data-price-note="${plan}"]`).forEach((el) => { el.textContent = planConfig.note || 'Pricing coming soon'; });
    setLink(`[data-checkout="${plan}"]`, planConfig.checkoutUrl);
  });

  setLink('[data-download]', config.downloadUrl);
  setLink('[data-release-notes]', config.releaseNotesUrl);
  setLink('[data-documentation]', config.documentationUrl);
  setLink('[data-license-portal]', config.licensePortalUrl);

  const setEmail = (selector, email, subject) => {
    $$(selector).forEach((link) => {
      link.href = email ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : '#';
      if (!email) {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          showToast();
        });
      }
    });
  };

  setEmail('[data-sales-email]', config.salesEmail, 'RungTrace site licensing');
  setEmail('[data-support-email]', config.supportEmail, 'RungTrace support');

  const header = $('[data-header]');
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 18);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const menuButton = $('[data-menu-button]');
  const mobileNav = $('[data-mobile-nav]');
  menuButton?.addEventListener('click', () => {
    const open = !mobileNav.classList.contains('open');
    mobileNav.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  });
  $$('a', mobileNav).forEach((link) => link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  $$('.reveal').forEach((el) => revealObserver.observe(el));

  const tilt = $('[data-tilt]');
  const canTilt = window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (tilt && canTilt) {
    const stage = tilt.parentElement;
    stage.addEventListener('mousemove', (event) => {
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      tilt.style.transform = `rotateY(${x * 5 - 3}deg) rotateX(${-y * 4 + 1}deg)`;
    });
    stage.addEventListener('mouseleave', () => {
      tilt.style.transform = 'rotateY(-4deg) rotateX(1deg)';
    });
  }
})();
