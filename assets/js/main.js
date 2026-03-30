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

  /* ===== CONTACT FORM → WHATSAPP ===== */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const val = id => (document.getElementById(id)?.value || '').trim();

      const firstName = val('firstName');
      const lastName  = val('lastName');
      const email     = val('email');
      const phone     = val('phone');
      const company   = val('company');
      const service   = val('service');
      const workers   = val('workers');
      const startDate = val('startDate');
      const message   = val('message');

      const serviceLabels = {
        cafeteria: 'On-Site Cafeteria Installation',
        truck:     'Mobile Food Truck',
        vending:   'Vending Machines',
        cabin:     'Food Cabin',
        meeting:   'Meeting Catering',
        office:    'Office Provisions',
        other:     'Other / Not Sure'
      };

      let text = `Hello Ad'z Catering! 👋\n\n`;
      text += `*New Enquiry from Website*\n`;
      text += `─────────────────────\n`;
      text += `*Name:* ${firstName} ${lastName}\n`;
      if (email)     text += `*Email:* ${email}\n`;
      if (phone)     text += `*Phone:* ${phone}\n`;
      if (company)   text += `*Company:* ${company}\n`;
      if (service)   text += `*Service Needed:* ${serviceLabels[service] || service}\n`;
      if (workers)   text += `*No. of Workers:* ${workers}\n`;
      if (startDate) text += `*Start Date:* ${startDate}\n`;
      if (message) {
        text += `─────────────────────\n`;
        text += `*Message:*\n${message}\n`;
      }
      text += `─────────────────────\n`;
      text += `_Sent via adzcatering.co.uk_`;

      const waUrl = `https://wa.me/447384583976?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
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
