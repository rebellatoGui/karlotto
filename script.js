(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Header: solid background after scroll ---- */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Atmosfera: imagem de fundo que dissolve ao rolar ---- */
  var atmosphereImage = document.getElementById('atmosphereImage');
  var trustStrip = document.querySelector('.trust-strip');
  if (atmosphereImage && !reduceMotion) {
    var fadeEnd = 1;
    function computeFadeEnd() {
      var ref = trustStrip || document.querySelector('.hero');
      if (ref) {
        var rect = ref.getBoundingClientRect();
        fadeEnd = Math.max(rect.bottom + window.scrollY, 1);
      }
    }
    computeFadeEnd();
    window.addEventListener('resize', computeFadeEnd);

    var atmTicking = false;
    function updateAtmosphere() {
      var progress = Math.min(Math.max(window.scrollY / fadeEnd, 0), 1);
      atmosphereImage.style.setProperty('--atm-opacity', String(1 - progress));
      atmosphereImage.style.setProperty('--atm-scale', String(1 + progress * 0.06));
      atmosphereImage.style.setProperty('--atm-blur', (progress * 4).toFixed(1) + 'px');
      atmTicking = false;
    }
    document.addEventListener('scroll', function () {
      if (!atmTicking) {
        requestAnimationFrame(updateAtmosphere);
        atmTicking = true;
      }
    }, { passive: true });
    updateAtmosphere();
  }

  /* ---- Reveal-on-scroll ---- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var el = entry.target;
          setTimeout(function () { el.classList.add('is-visible'); }, (i % 4) * 70);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- Carrossel de serviços/máquinas ---- */
  var track = document.getElementById('carouselTrack');
  var prevBtn = document.getElementById('carouselPrev');
  var nextBtn = document.getElementById('carouselNext');
  var dotsWrap = document.getElementById('carouselDots');

  if (track && prevBtn && nextBtn && dotsWrap) {
    var slides = Array.prototype.slice.call(track.children);
    var dots = Array.prototype.slice.call(dotsWrap.children);
    var slideCount = slides.length;
    var currentIndex = 0;
    var autoplayTimer = null;

    function goTo(index) {
      currentIndex = (index + slideCount) % slideCount;
      track.scrollTo({
        left: currentIndex * track.clientWidth,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
      setActiveDot(currentIndex);
    }

    function setActiveDot(index) {
      dots.forEach(function (dot, i) {
        dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
    }

    prevBtn.addEventListener('click', function () { stopAutoplay(); goTo(currentIndex - 1); startAutoplay(); });
    nextBtn.addEventListener('click', function () { stopAutoplay(); goTo(currentIndex + 1); startAutoplay(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { stopAutoplay(); goTo(i); startAutoplay(); });
    });

    track.setAttribute('tabindex', '0');
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { stopAutoplay(); goTo(currentIndex - 1); startAutoplay(); }
      if (e.key === 'ArrowRight') { stopAutoplay(); goTo(currentIndex + 1); startAutoplay(); }
    });

    // Mantém os pontos sincronizados quando o visitante arrasta/swipa manualmente.
    var scrollSyncTimer = null;
    track.addEventListener('scroll', function () {
      clearTimeout(scrollSyncTimer);
      scrollSyncTimer = setTimeout(function () {
        var w = track.clientWidth;
        if (w > 0) {
          currentIndex = Math.round(track.scrollLeft / w);
          setActiveDot(currentIndex);
        }
      }, 120);
    }, { passive: true });

    function startAutoplay() {
      if (reduceMotion) return;
      stopAutoplay();
      autoplayTimer = setInterval(function () { goTo(currentIndex + 1); }, 4500);
    }
    function stopAutoplay() {
      if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
    }

    track.addEventListener('pointerenter', stopAutoplay);
    track.addEventListener('pointerleave', startAutoplay);
    track.addEventListener('focusin', stopAutoplay);
    track.addEventListener('focusout', startAutoplay);

    startAutoplay();
  }

  /* ---- Botão flutuante do WhatsApp ---- */
  var floatWhats = document.getElementById('floatWhats');
  var hero = document.querySelector('.hero');
  if (floatWhats && hero && 'IntersectionObserver' in window) {
    var heroIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        floatWhats.classList.toggle('is-visible', !entry.isIntersecting);
      });
    }, { threshold: 0 });
    heroIO.observe(hero);
  } else if (floatWhats) {
    floatWhats.classList.add('is-visible');
  }
})();
