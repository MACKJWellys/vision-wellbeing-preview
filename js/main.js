/* ============================================================
   Vision Wellbeing — main.js
   ============================================================ */

(function () {
  'use strict';

  function boot() {


  /* ----------------------------------------------------------
     Lenis smooth scroll
  ---------------------------------------------------------- */
  var lenis;
  try {
    lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      touchMultiplier: 1.5,
      smoothWheel: true
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

  } catch (e) {
    console.warn('Lenis init failed:', e);
  }

  /* ----------------------------------------------------------
     GSAP + ScrollTrigger registration
  ---------------------------------------------------------- */
  gsap.registerPlugin(ScrollTrigger);

  /* ----------------------------------------------------------
     Preloader
  ---------------------------------------------------------- */
  function runPreloader(callback) {
    var preloader = document.getElementById('preloader');
    var fill = document.getElementById('preloader-fill');
    var logo = preloader ? preloader.querySelector('.preloader__logo') : null;

    if (!preloader) {
      callback();
      return;
    }

    var tl = gsap.timeline({
      onComplete: function () {
        preloader.style.display = 'none';
        document.body.classList.add('loaded');
        callback();
      }
    });

    tl.to(logo, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
      .to(fill, { width: '100%', duration: 1, ease: 'power2.inOut' }, '-=0.2')
      .to(preloader, { yPercent: -100, duration: 0.6, ease: 'power2.inOut' }, '+=0.1');
  }

  /* ----------------------------------------------------------
     Hero word rotator
  ---------------------------------------------------------- */
  function initWordRotator() {
    var rotator = document.getElementById('hero-rotator');
    if (!rotator) return;

    var words = ['worry', 'overthinking', 'low mood', 'low motivation', 'self-doubt', 'burnout', 'perfectionism'];
    var index = 0;

    setInterval(function () {
      var current = rotator.querySelector('.hero__rotator-word');
      if (!current) return;

      gsap.to(current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: function () {
          index = (index + 1) % words.length;
          current.textContent = words[index];
          gsap.fromTo(current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
          );
        }
      });
    }, 2500);
  }

  /* ----------------------------------------------------------
     Hero entrance animation
  ---------------------------------------------------------- */
  function animateHero() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.fromTo('.hero__eyebrow',
        { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo('.hero__heading .hero__heading-line',
        { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, '-=0.3')
      .fromTo('.hero__subhead',
        { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
      .fromTo('.hero__ctas',
        { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2')
      .fromTo('.hero__meta',
        { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
      .fromTo('.hero__image-col',
        { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8 }, '-=0.6')
      .fromTo('.credentials__item',
        { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, '-=0.3');
  }

  /* ----------------------------------------------------------
     Scroll reveal animations
  ---------------------------------------------------------- */
  function initScrollReveals() {
    gsap.utils.toArray('.reveal').forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true
          }
        }
      );
    });

    gsap.utils.toArray('.reveal-stagger').forEach(function (group) {
      var children = group.children;
      if (!children.length) return;

      gsap.fromTo(children,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: group,
            start: 'top 85%',
            once: true
          }
        }
      );
    });
  }

  /* ----------------------------------------------------------
     Animated counter
  ---------------------------------------------------------- */
  function initCounters() {
    document.querySelectorAll('[data-target]').forEach(function (counter) {
      var target = parseInt(counter.dataset.target, 10);
      if (isNaN(target)) return;

      ScrollTrigger.create({
        trigger: counter,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          gsap.to(counter, {
            innerText: target,
            duration: 1.5,
            ease: 'power2.out',
            snap: { innerText: 1 },
            onUpdate: function () {
              counter.textContent = Math.round(parseFloat(counter.textContent));
            }
          });
        }
      });
    });
  }

  /* ----------------------------------------------------------
     Navigation
  ---------------------------------------------------------- */
  function initNavigation() {
    var header = document.getElementById('site-header');
    var hamburger = document.querySelector('.nav__hamburger');
    var menu = document.getElementById('nav-menu');
    if (!header || !hamburger || !menu) return;

    hamburger.addEventListener('click', function () {
      var expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      hamburger.classList.toggle('is-active');
      menu.classList.toggle('is-open');
      document.body.classList.toggle('nav-open');

      if (!expanded && lenis) {
        lenis.stop();
      } else if (lenis) {
        lenis.start();
      }
    });

    menu.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.classList.remove('is-active');
        menu.classList.remove('is-open');
        document.body.classList.remove('nav-open');
        if (lenis) lenis.start();
      });
    });

    var lastScroll = 0;
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      if (scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      if (scrollY > lastScroll && scrollY > 300) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }
      lastScroll = scrollY;
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     Sticky mobile CTA
  ---------------------------------------------------------- */
  function initStickyCTA() {
    var sticky = document.getElementById('sticky-cta');
    var hero = document.querySelector('.hero');
    if (!sticky || !hero) return;

    ScrollTrigger.create({
      trigger: hero,
      start: 'bottom top',
      onEnter: function () { sticky.classList.add('is-visible'); },
      onLeaveBack: function () { sticky.classList.remove('is-visible'); }
    });
  }

  /* ----------------------------------------------------------
     Scroll-to-top button
  ---------------------------------------------------------- */
  function initScrollTop() {
    var btn = document.getElementById('scroll-top');
    if (!btn) return;

    ScrollTrigger.create({
      start: 'top -400',
      onUpdate: function () {
        if (window.scrollY > 400) {
          btn.classList.add('is-visible');
        } else {
          btn.classList.remove('is-visible');
        }
      }
    });

    btn.addEventListener('click', function () {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  /* ----------------------------------------------------------
     FAQ Accordion
  ---------------------------------------------------------- */
  function initFAQ() {
    document.querySelectorAll('.faq__question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq__item');
        var answer = item.querySelector('.faq__answer');
        var isOpen = item.classList.contains('is-open');

        var list = item.closest('.faq__list');
        if (list) {
          list.querySelectorAll('.faq__item.is-open').forEach(function (openItem) {
            if (openItem !== item) {
              openItem.classList.remove('is-open');
              openItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
              gsap.to(openItem.querySelector('.faq__answer'), {
                height: 0, duration: 0.3, ease: 'power2.inOut'
              });
            }
          });
        }

        if (isOpen) {
          item.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
          gsap.to(answer, { height: 0, duration: 0.3, ease: 'power2.inOut' });
        } else {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
          gsap.set(answer, { height: 'auto' });
          gsap.from(answer, { height: 0, duration: 0.3, ease: 'power2.inOut' });
        }
      });
    });
  }

  /* ----------------------------------------------------------
     Footer year
  ---------------------------------------------------------- */
  function setFooterYear() {
    var el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------------
     Active nav link
  ---------------------------------------------------------- */
  function setActiveNav() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link').forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === path || (path === '' && href === '/')) {
        link.classList.add('is-active');
      }
    });
  }

  /* ----------------------------------------------------------
     Barba.js page transitions
  ---------------------------------------------------------- */
  function initBarba() {
    if (typeof barba === 'undefined') return;

    barba.init({
      preventRunning: true,
      transitions: [{
        name: 'fade',
        leave: function (data) {
          return gsap.to(data.current.container, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.inOut'
          });
        },
        enter: function (data) {
          window.scrollTo(0, 0);
          if (lenis) lenis.scrollTo(0, { immediate: true });

          return gsap.from(data.next.container, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.inOut'
          });
        },
        afterEnter: function () {
          reinitPage();
        }
      }]
    });
  }

  /* ----------------------------------------------------------
     Reinitialize after Barba transition
  ---------------------------------------------------------- */
  function reinitPage() {
    ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
    ScrollTrigger.refresh();

    initScrollReveals();
    initCounters();
    initStickyCTA();
    initScrollTop();
    initFAQ();
    initWordRotator();
    initContactForm();
    setFooterYear();
    setActiveNav();

    if (document.querySelector('.hero')) {
      animateHero();
    }
  }

  /* ----------------------------------------------------------
     Contact form handling
  ---------------------------------------------------------- */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      setTimeout(function () {
        btn.textContent = 'Sent — thank you!';
        btn.classList.add('sent');
        form.reset();
        setTimeout(function () {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.classList.remove('sent');
        }, 3000);
      }, 1200);
    });
  }

  /* ----------------------------------------------------------
     Boot sequence
  ---------------------------------------------------------- */
  initNavigation();
  setFooterYear();
  setActiveNav();
  initContactForm();
  initFAQ();


  runPreloader(function () {

    animateHero();
    initWordRotator();
    initScrollReveals();
    initCounters();
    initStickyCTA();
    initScrollTop();
    initBarba();
  });

  } // end boot

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
