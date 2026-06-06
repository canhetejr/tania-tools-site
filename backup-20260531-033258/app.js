/* ========================================
   TANIA — JAVASCRIPT
   ======================================== */

(function () {
  'use strict';

  // ==============================
  // NAVBAR — scroll behavior + hamburger
  // ==============================

  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  function updateNavbar() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  hamburger.addEventListener('click', function () {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // ==============================
  // SCROLL REVEAL
  // ==============================

  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ==============================
  // CAPACIDADES — accordion
  // ==============================

  const accordionItems = document.querySelectorAll('.capabilities__item');

  accordionItems.forEach(function (item) {
    const trigger = item.querySelector('.capabilities__trigger');

    trigger.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      accordionItems.forEach(function (i) {
        i.classList.remove('open');
      });

      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // ==============================
  // PRICING — toggle mensal/anual
  // ==============================

  const toggleBtns = document.querySelectorAll('.pricing__toggle-btn');
  const priceEls = document.querySelectorAll('.pricing-card__price[data-monthly]');

  toggleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      toggleBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      const period = btn.dataset.period;
      const isYearly = period === 'year';

      priceEls.forEach(function (el) {
        const monthly = el.dataset.monthly;
        const yearly = el.dataset.yearly;
        const sup = el.querySelector('sup');
        const span = el.querySelector('span');

        const value = isYearly ? yearly : monthly;
        el.childNodes.forEach(function (node) {
          if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = value;
          }
        });

        // replace text node directly
        const textNodes = Array.from(el.childNodes).filter(
          function (n) { return n.nodeType === Node.TEXT_NODE; }
        );
        if (textNodes.length) {
          textNodes[0].textContent = value;
        }
      });
    });
  });

  // ==============================
  // SMOOTH ACTIVE NAV LINK
  // ==============================

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__nav a[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            link.style.opacity = link.getAttribute('href') === '#' + entry.target.id ? '1' : '';
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  // ==============================
  // STAT COUNTER ANIMATION
  // ==============================

  function animateCounter(el, target, suffix, duration) {
    const start = performance.now();
    const isFloat = target % 1 !== 0;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = isFloat
        ? (eased * target).toFixed(1)
        : Math.round(eased * target);
      el.textContent = (suffix === '%' || suffix === '×' || suffix === '/7')
        ? current + suffix
        : suffix + current;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const statEls = document.querySelectorAll('.hero__stat-value');
  const statData = [
    { target: 98, suffix: '%' },
    { target: 12, suffix: '×' },
    { target: 500, prefix: '+' },
    { target: 24, suffix: '/7' },
  ];

  const statsObserver = new IntersectionObserver(
    function (entries) {
      if (entries[0].isIntersecting) {
        statEls.forEach(function (el, i) {
          const d = statData[i];
          if (!d) return;
          const delay = i * 120;
          setTimeout(function () {
            animateCounter(el, d.target, d.suffix || (d.prefix || ''), 1200);
          }, delay);
        });
        statsObserver.disconnect();
      }
    },
    { threshold: 0.6 }
  );

  if (statEls.length) statsObserver.observe(statEls[0].closest('.hero__stats'));

})();
