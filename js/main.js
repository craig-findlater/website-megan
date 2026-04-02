/**
 * main.js — Megan Findlater Home-Based Childcare Website
 *
 * Responsibilities:
 *  1. Mobile nav toggle (hamburger open / close)
 *  2. Nav hide on scroll-down, show on scroll-up
 *  3. Intersection Observer — fade-up scroll animations
 *  4. Smooth-scroll for anchor links (polyfill for browsers without CSS support)
 *  5. EmailJS form submission with loading / success / error states
 */

/* ─────────────────────────────────────────────────────────────
   TODO (Phase 2 — EmailJS setup):
   1. Sign up at https://www.emailjs.com and note your Public Key.
   2. Create an Email Service (e.g. Gmail) and note the Service ID.
   3. Create an Email Template and note the Template ID.
   4. Replace the three placeholder strings below with your real values.
   5. Update "EMAIL_ADDRESS_HERE" in the hidden form field in index.html
      (or set the recipient in your EmailJS template directly).
   ───────────────────────────────────────────────────────────── */
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // TODO: replace
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // TODO: replace
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // TODO: replace

/* ── 1. Initialise EmailJS ─────────────────────────────────── */
(function initEmailJS() {
  if (typeof emailjs === 'undefined') return;
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
})();

/* ── 2. Mobile Nav Toggle ──────────────────────────────────── */
(function initNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  function openMenu() {
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close menu');
    navLinks.classList.add('nav--open');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  }

  function closeMenu() {
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
    navLinks.classList.remove('nav--open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    const isOpen = hamburger.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  // Close menu on outside click
  document.addEventListener('click', function (e) {
    if (
      navLinks.classList.contains('nav--open') &&
      !hamburger.contains(e.target) &&
      !navLinks.contains(e.target)
    ) {
      closeMenu();
    }
  });
})();

/* ── 3. Nav Hide / Show on Scroll ──────────────────────────── */
(function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', function () {
    const current = window.scrollY;

    // Add scrolled class for shadow
    if (current > 10) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }

    // Hide on scroll-down, show on scroll-up
    // Don't hide if the mobile menu is open
    const isMenuOpen = document.getElementById('navLinks')?.classList.contains('nav--open');
    if (!isMenuOpen) {
      if (current > lastScrollY && current > 80) {
        nav.classList.add('nav--hidden');
      } else {
        nav.classList.remove('nav--hidden');
      }
    }

    lastScrollY = current;
  }, { passive: true });
})();

/* ── 4. Scroll Animations (Intersection Observer) ──────────── */
(function initScrollAnimations() {
  const targets = document.querySelectorAll('.fade-up');
  if (!targets.length) return;

  // If browser doesn't support IntersectionObserver, just show everything
  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once only
        }
      });
    },
    {
      threshold: 0.12,  // trigger when 12% of element is visible
      rootMargin: '0px 0px -40px 0px'
    }
  );

  targets.forEach(function (el) { observer.observe(el); });
})();

/* ── 5. Smooth Scroll (anchor links) ──────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      // CSS scroll-behavior: smooth handles most browsers,
      // but this JS path ensures consistent offset handling.
      e.preventDefault();
      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
        10
      ) || 68;

      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── 6. Contact Form — EmailJS ─────────────────────────────── */
(function initContactForm() {
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const successEl = document.getElementById('formSuccess');
  const errorEl   = document.getElementById('formError');

  if (!form) return;

  // Helper: collect checked days
  function getSelectedDays() {
    const checked = form.querySelectorAll('input[name="days"]:checked');
    return Array.from(checked).map(function (cb) { return cb.value; }).join(', ') || 'None specified';
  }

  // Helper: basic client-side validation
  function validate() {
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(function (field) {
      if (!field.value.trim()) {
        field.style.borderColor = 'var(--coral)';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });
    return valid;
  }

  function setLoading(isLoading) {
    const label   = submitBtn.querySelector('.btn__label');
    const loading = submitBtn.querySelector('.btn__loading');
    submitBtn.disabled = isLoading;
    if (isLoading) {
      label.setAttribute('hidden', '');
      loading.removeAttribute('hidden');
    } else {
      label.removeAttribute('hidden');
      loading.setAttribute('hidden', '');
    }
  }

  function showSuccess() {
    successEl.removeAttribute('hidden');
    errorEl.setAttribute('hidden', '');
    form.reset();
    successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function showError() {
    errorEl.removeAttribute('hidden');
    successEl.setAttribute('hidden', '');
    errorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Hide previous status messages
    successEl.setAttribute('hidden', '');
    errorEl.setAttribute('hidden', '');

    if (!validate()) return;

    // Check EmailJS is configured
    if (
      EMAILJS_PUBLIC_KEY  === 'YOUR_PUBLIC_KEY' ||
      EMAILJS_SERVICE_ID  === 'YOUR_SERVICE_ID' ||
      EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID'
    ) {
      console.warn(
        '[EmailJS] Placeholder credentials detected. ' +
        'Update EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, and EMAILJS_TEMPLATE_ID in main.js.'
      );
      // In development, show success for UI testing
      showSuccess();
      return;
    }

    if (typeof emailjs === 'undefined') {
      console.error('[EmailJS] SDK not loaded.');
      showError();
      return;
    }

    // Build template parameters — keys must match your EmailJS template variables
    const templateParams = {
      from_name:   form.fullName.value.trim(),
      from_phone:  form.phone.value.trim(),
      child_name:  form.childName.value.trim(),
      child_dob:   form.childDob.value,
      days:        getSelectedDays(),
      message:     form.message.value.trim(),
      to_email:    form.to_email.value,
    };

    setLoading(true);

    emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(function () {
        setLoading(false);
        showSuccess();
      })
      .catch(function (err) {
        console.error('[EmailJS] Send failed:', err);
        setLoading(false);
        showError();
      });
  });

  // Clear field-level error styling on input
  form.querySelectorAll('input, textarea').forEach(function (field) {
    field.addEventListener('input', function () {
      this.style.borderColor = '';
    });
  });
})();
