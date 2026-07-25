(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.remove('no-js');
  if (reduceMotion) document.documentElement.classList.add('reduce-motion');

  var heroAnimEls = document.querySelectorAll('[data-hero-anim]');
  if (heroAnimEls.length && !reduceMotion && window.gsap) {
    gsap.set(heroAnimEls, { opacity: 1 });
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero-copy .eyebrow', { opacity: 0, y: 14, duration: 0.6 })
      .from('.hero-title-line', { opacity: 0, y: '100%', duration: 0.8, stagger: 0.12 }, '-=0.35')
      .from('.hero-lead', { opacity: 0, y: 16, duration: 0.6 }, '-=0.35')
      .from('.hero-actions', { opacity: 0, y: 16, duration: 0.6 }, '-=0.4')
      .from('#heroCarousel', { opacity: 0, x: 40, duration: 0.9 }, '-=0.5');
  } else if (heroAnimEls.length) {
    heroAnimEls.forEach(function (el) { el.style.opacity = 1; });
  }

  var servicesBgLayers = document.querySelectorAll('#servicesBg .services-bg__layer');
  if (servicesBgLayers.length > 1 && !reduceMotion && window.gsap) {
    var layers = Array.prototype.slice.call(servicesBgLayers);
    var HOLD = 5;
    var FADE = 2.4;
    var pans = [
      { from: { scale: 1.06, xPercent: -2, yPercent: -1 }, to: { scale: 1.18, xPercent: 2, yPercent: 1 } },
      { from: { scale: 1.14, xPercent: 2, yPercent: 1 }, to: { scale: 1.02, xPercent: -2, yPercent: -2 } },
      { from: { scale: 1.02, xPercent: 0, yPercent: -2 }, to: { scale: 1.16, xPercent: -3, yPercent: 1 } },
      { from: { scale: 1.16, xPercent: -1, yPercent: 2 }, to: { scale: 1.04, xPercent: 2, yPercent: -1 } }
    ];

    layers.forEach(function (layer, i) {
      var pan = pans[i % pans.length];
      gsap.set(layer, { opacity: i === 0 ? 1 : 0, transformOrigin: 'center center', force3D: true });
      gsap.fromTo(layer, pan.from, {
        scale: pan.to.scale,
        xPercent: pan.to.xPercent,
        yPercent: pan.to.yPercent,
        duration: HOLD * layers.length * 0.6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
    });

    var kbTl = gsap.timeline({ repeat: -1 });
    layers.forEach(function (layer, i) {
      var next = layers[(i + 1) % layers.length];
      kbTl.to({}, { duration: HOLD })
        .to(layer, { opacity: 0, duration: FADE, ease: 'power1.inOut' }, '<')
        .to(next, { opacity: 1, duration: FADE, ease: 'power1.inOut' }, '<');
    });
  }

  var marqueeTracks = document.querySelectorAll('#servicesMarquee .services-marquee__track');
  if (marqueeTracks.length && !reduceMotion && window.gsap) {
    var mqSpeed = 46;
    gsap.set(marqueeTracks, { xPercent: 0 });
    gsap.to(marqueeTracks, {
      xPercent: -100,
      duration: mqSpeed,
      ease: 'none',
      repeat: -1
    });
  }

  var gemCanvas = document.getElementById('heroGem');
  if (gemCanvas && !reduceMotion && window.THREE && window.matchMedia('(min-width: 901px)').matches) {
    try {
      var renderer = new THREE.WebGLRenderer({ canvas: gemCanvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(0, 0, 9);

      var geometry = new THREE.IcosahedronGeometry(1.35, 0);
      var material = new THREE.MeshPhysicalMaterial({
        color: 0xc9a45e,
        metalness: 0.55,
        roughness: 0.18,
        flatShading: true,
        clearcoat: 0.6,
        clearcoatRoughness: 0.25,
        emissive: 0x2c4a47,
        emissiveIntensity: 0.15
      });
      var gem = new THREE.Mesh(geometry, material);
      scene.add(gem);

      var keyLight = new THREE.DirectionalLight(0xe4c07f, 2.2);
      keyLight.position.set(4, 5, 6);
      scene.add(keyLight);
      var fillLight = new THREE.DirectionalLight(0x3b5d59, 1.4);
      fillLight.position.set(-5, -2, 3);
      scene.add(fillLight);
      scene.add(new THREE.AmbientLight(0xf3eee4, 0.35));

      var mouseX = 0, mouseY = 0;
      var targetRotX = 0, targetRotY = 0;
      window.addEventListener('pointermove', function (e) {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
      }, { passive: true });

      function resizeGem() {
        var w = window.innerWidth, h = window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        gem.position.x = w > 1200 ? 3.6 : 2.6;
        gem.position.y = 0.3;
      }
      resizeGem();
      window.addEventListener('resize', resizeGem);

      var clock = new THREE.Clock();
      function renderGem() {
        var t = clock.getElapsedTime();
        targetRotY += (mouseX * 0.35 - targetRotY) * 0.04;
        targetRotX += (-mouseY * 0.25 - targetRotX) * 0.04;
        gem.rotation.y = t * 0.18 + targetRotY;
        gem.rotation.x = t * 0.09 + targetRotX;
        gem.position.y = 0.3 + Math.sin(t * 0.6) * 0.15;
        renderer.render(scene, camera);
        requestAnimationFrame(renderGem);
      }
      renderGem();
    } catch (e) {
      gemCanvas.style.display = 'none';
    }
  } else if (gemCanvas) {
    gemCanvas.style.display = 'none';
  }

  var header = document.getElementById('siteHeader');
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

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

    var heroGemEl = document.getElementById('heroGem');
    var atmTicking = false;
    function updateAtmosphere() {
      var progress = Math.min(Math.max(window.scrollY / fadeEnd, 0), 1);
      var opacity = String(1 - progress);
      atmosphereImage.style.setProperty('--atm-opacity', opacity);
      atmosphereImage.style.setProperty('--atm-scale', String(1 + progress * 0.06));
      atmosphereImage.style.setProperty('--atm-blur', (progress * 4).toFixed(1) + 'px');
      if (heroGemEl) {
        heroGemEl.style.setProperty('--atm-opacity', opacity);
        heroGemEl.style.visibility = progress >= 1 ? 'hidden' : 'visible';
      }
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
        left: slides[currentIndex].offsetLeft,
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

    var scrollSyncTimer = null;
    track.addEventListener('scroll', function () {
      clearTimeout(scrollSyncTimer);
      scrollSyncTimer = setTimeout(function () {
        var pos = track.scrollLeft;
        var closest = 0;
        var closestDist = Infinity;
        slides.forEach(function (slide, i) {
          var dist = Math.abs(slide.offsetLeft - pos);
          if (dist < closestDist) { closestDist = dist; closest = i; }
        });
        currentIndex = closest;
        setActiveDot(currentIndex);
      }, 120);
    }, { passive: true });

    function startAutoplay() {
      if (reduceMotion) return;
      stopAutoplay();
      autoplayTimer = setInterval(function () { goTo(currentIndex + 1); }, 2800);
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
