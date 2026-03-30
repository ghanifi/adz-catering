/* ============================================================
   AD'Z CATERING LIMITED — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ===== NAVBAR ===== */
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');

  // Scroll effect
  function handleNavScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Mobile toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      navToggle.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        navToggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active link highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link[href]').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });

  /* ===== SCROLL REVEAL ===== */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -48px 0px' }
    );
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ===== ANIMATED COUNTERS ===== */
  function animateValue(el, end, suffix, duration) {
    let startTime = null;
    const start = 0;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * (end - start) + start) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('.stat-number[data-target]');
  if (counterEls.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            const suffix = el.dataset.suffix || '';
            animateValue(el, target, suffix, 1800);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    counterEls.forEach(el => counterObserver.observe(el));
  }

  /* ===== GALLERY LIGHTBOX ===== */
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lightboxImg    = lightbox.querySelector('.lightbox__img');
    const lightboxClose  = lightbox.querySelector('.lightbox__close');
    const lightboxPrev   = lightbox.querySelector('.lightbox__prev');
    const lightboxNext   = lightbox.querySelector('.lightbox__next');
    const lightboxCount  = lightbox.querySelector('.lightbox__counter');
    const galleryItems   = document.querySelectorAll('.gallery-item');
    const images         = Array.from(galleryItems).map(it => it.querySelector('img').src);
    let current          = 0;

    function openLightbox(idx) {
      current = idx;
      lightboxImg.src = images[current];
      if (lightboxCount) lightboxCount.textContent = `${current + 1} / ${images.length}`;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
    function showPrev() {
      current = (current - 1 + images.length) % images.length;
      lightboxImg.src = images[current];
      if (lightboxCount) lightboxCount.textContent = `${current + 1} / ${images.length}`;
    }
    function showNext() {
      current = (current + 1) % images.length;
      lightboxImg.src = images[current];
      if (lightboxCount) lightboxCount.textContent = `${current + 1} / ${images.length}`;
    }

    galleryItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxPrev?.addEventListener('click', showPrev);
    lightboxNext?.addEventListener('click', showNext);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape')      closeLightbox();
      if (e.key === 'ArrowLeft')   showPrev();
      if (e.key === 'ArrowRight')  showNext();
    });

    // Touch swipe
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) { dx < 0 ? showNext() : showPrev(); }
    });
  }

  /* ===== CONTACT FORM ===== */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = this.querySelector('[type="submit"]');
      const orig = btn.innerHTML;
      btn.innerHTML = '&#10003; Message Sent!';
      btn.style.background = '#2d7a3c';
      btn.style.borderColor = '#2d7a3c';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.disabled = false;
        contactForm.reset();
      }, 3500);
    });
  }

  /* ===== SMOOTH SCROLL (hash links) ===== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ===== NAV SHOWS AFTER SCROLL ON HERO ===== */
  // Always show nav glass effect immediately on inner pages
  if (!document.querySelector('.hero')) {
    nav.classList.add('scrolled');
  }

})();
