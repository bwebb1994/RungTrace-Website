(() => {
  const config = window.RUNGTRACE_CONFIG || {};
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const toast = $('[data-toast]');
  let toastTimer;

  const trackEvent = (eventName) => {
    if (!eventName) return;
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName);
    } else if (typeof window.plausible === 'function') {
      window.plausible(eventName);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: eventName });
    }
  };

  const showToast = () => {
    if (!toast) return;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3200);
  };

  const setElementLink = (link, url, openInNewTab = true) => {
    if (!link) return;
    if (url && url !== '#') {
      link.href = url;
      link.classList.remove('is-disabled');
      link.removeAttribute('aria-disabled');
      if (openInNewTab && /^https?:\/\//.test(url)) {
        link.target = '_blank';
        link.rel = 'noopener';
      }
      return;
    }
    link.href = '#';
    link.classList.add('is-disabled');
    link.setAttribute('aria-disabled', 'true');
  };

  const setLink = (selector, url) => {
    $$(selector).forEach((link) => {
      if (url && url !== '#') {
        setElementLink(link, url);
      } else {
        setElementLink(link, '');
        link.addEventListener('click', (event) => {
          if (!link.classList.contains('is-disabled')) return;
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

  const formatReleaseDate = (dateValue) => {
    if (!dateValue) return 'Unknown date';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateValue));
  };

  const getInstallerAsset = (release, pattern) => {
    const assets = Array.isArray(release.assets) ? release.assets : [];
    return assets.find((asset) => pattern.test(asset.name)) || null;
  };

  const loadGitHubReleases = async () => {
    const releasesConfig = config.releases || {};
    const owner = releasesConfig.owner || 'bwebb1994';
    const repository = releasesConfig.repository || 'RungTrace-Downloads';
    const setText = (selector, value) => {
      const element = $(selector);
      if (element) element.textContent = value;
    };

    const maximumShown = Math.max(1, Number(releasesConfig.maximumShown) || 1);
    let installerPattern;
    try {
      installerPattern = new RegExp(releasesConfig.installerAssetPattern || '\\.(exe|msi|msix|zip)$', 'i');
    } catch {
      installerPattern = /\.(exe|msi|msix|zip)$/i;
    }

    try {
      const response = await fetch(
        `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/releases?per_page=${maximumShown}`,
        { headers: { Accept: 'application/vnd.github+json' } }
      );
      if (!response.ok) throw new Error(`GitHub returned ${response.status}`);

      const releases = (await response.json())
        .filter((release) => !release.draft)
        .map((release) => ({ release, asset: getInstallerAsset(release, installerPattern) }))
        .filter(({ asset }) => asset);

      if (!releases.length) {
        setText('[data-release-status]', 'Coming soon');
        setText('[data-release-summary]', 'RungTrace is preparing for release. Check back soon for the first Windows download.');
        setText('[data-release-date]', 'Coming soon');
        setText('[data-download-label]', 'Download when available');
        return;
      }

      const [{ release: latestRelease, asset: latestAsset }] = releases;
      const version = latestRelease.tag_name.replace(/^v/i, '');
      $$('[data-version]').forEach((el) => { el.textContent = version; });
      $$('[data-release-date]').forEach((el) => { el.textContent = formatReleaseDate(latestRelease.published_at); });
      setText('[data-release-status]', latestRelease.prerelease ? 'Latest preview release' : 'Latest stable release');
      setText('[data-release-summary]', latestRelease.name || `RungTrace ${latestRelease.tag_name}`);
      setText('[data-download-label]', `Download ${latestRelease.tag_name}`);
      setElementLink($('[data-download]'), latestAsset.browser_download_url, false);
      setElementLink($('[data-release-notes]'), latestRelease.html_url);
    } catch (error) {
      console.error('Unable to load RungTrace releases:', error);
      setText('[data-release-status]', 'Download service unavailable');
      setText('[data-release-summary]', 'We could not check for the latest version. Please try again shortly.');
      setText('[data-download-label]', 'Releases unavailable');
    }
  };

  loadGitHubReleases();

  if (document.body.classList.contains('business-page')) {
    trackEvent('business_purchase_page_viewed');
  }

  $$('[data-analytics-event]').forEach((element) => {
    element.addEventListener('click', () => trackEvent(element.dataset.analyticsEvent));
  });

  const businessForm = $('[data-business-form]');
  if (businessForm) {
    const formStatus = $('[data-business-form] .form-status');
    const submitButton = $('button[type="submit"]', businessForm);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const clearFieldError = (field) => {
      field.removeAttribute('aria-invalid');
      const errorId = field.getAttribute('aria-describedby');
      if (!errorId) return;
      const error = document.getElementById(errorId);
      if (error?.classList.contains('field-error')) error.remove();
      field.removeAttribute('aria-describedby');
    };

    const setFieldError = (field, message) => {
      const existingId = field.getAttribute('aria-describedby');
      if (existingId) {
        const existing = document.getElementById(existingId);
        if (existing?.classList.contains('field-error')) existing.remove();
      }
      const errorId = `${field.id || field.name}-error`;
      const error = document.createElement('p');
      error.className = 'field-error';
      error.id = errorId;
      error.textContent = message;
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', errorId);
      field.closest('.form-row')?.append(error);
    };

    $$('input, select, textarea', businessForm).forEach((field) => {
      field.addEventListener('input', () => clearFieldError(field));
      field.addEventListener('change', () => clearFieldError(field));
    });

    const showFormStatus = (message) => {
      if (!formStatus) return;
      formStatus.textContent = message;
      formStatus.hidden = false;
    };

    const setSubmitting = (isSubmitting) => {
      if (!submitButton) return;
      submitButton.disabled = isSubmitting;
      submitButton.textContent = isSubmitting ? 'Submitting request...' : 'Submit business purchase request';
    };

    businessForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const errors = [];
      const fields = $$('input, select, textarea', businessForm)
        .filter((field) => field.type !== 'hidden' && field.name !== 'bot-field');

      fields.forEach(clearFieldError);
      if (formStatus) {
        formStatus.hidden = true;
        formStatus.textContent = '';
      }

      fields.forEach((field) => {
        const label = businessForm.querySelector(`label[for="${field.id}"]`)?.childNodes[0]?.textContent?.trim() || field.name;
        const value = field.type === 'checkbox' ? field.checked : field.value.trim();
        if (field.required && !value) {
          errors.push({ field, message: `${label} is required.` });
          return;
        }
        if (field.type === 'email' && field.value.trim() && !emailPattern.test(field.value.trim())) {
          errors.push({ field, message: `Enter a valid ${label.toLowerCase()}.` });
        }
        if (field.type === 'number' && field.value) {
          const numericValue = Number(field.value);
          const minimum = Number(field.min || 0);
          const maximum = Number(field.max || Number.MAX_SAFE_INTEGER);
          if (!Number.isInteger(numericValue) || numericValue < minimum || numericValue > maximum) {
            errors.push({ field, message: `${label} must be a whole number between ${minimum} and ${maximum}.` });
          }
        }
        if (field.maxLength > 0 && field.value.length > field.maxLength) {
          errors.push({ field, message: `${label} is too long.` });
        }
      });

      if (errors.length) {
        errors.forEach(({ field, message }) => setFieldError(field, message));
        const countText = errors.length === 1 ? '1 field needs attention.' : `${errors.length} fields need attention.`;
        showFormStatus(`${countText} Please review the highlighted fields and submit again.`);
        errors[0].field.focus();
        return;
      }

      setSubmitting(true);
      try {
        const payload = Object.fromEntries(new FormData(businessForm).entries());
        const response = await fetch(businessForm.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (result.errors) {
            Object.entries(result.errors).forEach(([name, message]) => {
              const field = businessForm.elements[name];
              if (field) setFieldError(field, message);
            });
            const firstInvalid = businessForm.querySelector('[aria-invalid="true"]');
            firstInvalid?.focus();
          }
          showFormStatus(result.message || 'We could not submit the request. Please review the form and try again.');
          return;
        }

        trackEvent('business_purchase_request_submitted');
        window.location.href = businessForm.dataset.successUrl || 'business-purchase-success.html';
      } catch {
        showFormStatus('We could not submit the request. Please check your connection and try again.');
      } finally {
        setSubmitting(false);
      }
    });
  }

  if (document.body.classList.contains('request-success-page')) {
    trackEvent('business_purchase_request_submitted_successfully');
  }

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
