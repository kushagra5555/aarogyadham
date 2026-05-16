(function () {
  'use strict';

  if (!document.body || !document.body.classList.contains('preview-build')) {
    return;
  }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarsePointer = window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches;

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function addSequentialDelays(nodes, maxCycle) {
    nodes.forEach(function (node, index) {
      node.classList.add('pm-item');
      node.classList.add('pm-delay-' + ((index % (maxCycle || 6)) + 1));
    });
  }

  function injectRevealStyles() {
    if (document.getElementById('previewMotionOverrides')) return;
    var style = document.createElement('style');
    style.id = 'previewMotionOverrides';
    style.textContent = [
      'body.preview-build .pm-item{opacity:0 !important;}',
      'body.preview-build .pm-item.pm-visible{opacity:1 !important;animation:pmRiseIn 820ms cubic-bezier(0.16,1,0.3,1) both !important;}',
      '@keyframes pmRiseIn{0%{opacity:0;transform:translate3d(0,26px,0) scale(.985);filter:blur(10px)}100%{opacity:1;transform:translate3d(0,0,0) scale(1);filter:blur(0)}}'
    ].join('');
    document.head.appendChild(style);
  }

  function markStaticGroups() {
    addSequentialDelays(qsa('.hero-trust-item, .hero-mini-stat, .hero-cert-strip .cert-item'), 6);
    addSequentialDelays(qsa('.pain-card'), 2);
    addSequentialDelays(qsa('.answer-card'), 3);
    addSequentialDelays(qsa('.how-card'), 3);
    addSequentialDelays(qsa('.stats .stat'), 4);
    addSequentialDelays(qsa('.haridwar-card'), 2);
    addSequentialDelays(qsa('.g-cell'), 6);
    addSequentialDelays(qsa('.pbfaq-item'), 3);
    addSequentialDelays(qsa('.faq-item'), 6);
    addSequentialDelays(qsa('.blog-card'), 5);
    addSequentialDelays(qsa('.footer-grid > *'), 4);
  }

  function initRevealSystem() {
    var selectors = [
      '.hero-badge', '.hero-pain-hook', '.hero-eyebrow', '.hero-title', '.hero-divider', '.hero-sub', '.hero-body',
      '.hero-mini-stats', '.hero-cta', '.hero-urgency', '.hero-social-proof', '.hero-right', '.hero-trust',
      '.hero-cert-strip .cert-item', '.trust-bar', '.pain .pain-header', '.pain-card', '.conditions-header',
      '.cat-grid-wrap', '.cat-subview', '.answer-card', '.how-card', '.stats .stat', '.founder .eyebrow',
      '.founder .section-heading', '.founder-name', '.founder-role', '.founder-meta', '.founder-story', '.founder-quals',
      '.founder-cta', '.founder-images', '.depth-badge', '.haridwar-header', '.haridwar-card', '.gallery-header', '.g-cell',
      '.gallery-foot', '.consult-grid > div', '.pbfaq-item', '.faq-header', '.faq-item', '.booking-left',
      '.booking-form-wrap', '.blog-header', '.blog-card', '.footer-grid > *'
    ];

    var targets = qsa(selectors.join(','));
    targets.forEach(function (el) { el.classList.add('pm-item'); });

    if (!window.IntersectionObserver || reduceMotion) {
      targets.forEach(function (el) { el.classList.add('pm-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('pm-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

    targets.forEach(function (el) { observer.observe(el); });
  }

  function initNavPolish() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    function onScroll() {
      nav.classList.toggle('preview-scrolled', window.scrollY > 22);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function initHeroParallax() {
    var hero = document.querySelector('.hero');
    if (!hero || reduceMotion) return;

    var layers = [
      { el: hero.querySelector('.hero-pattern-layer'), speed: 10, axis: 'both' },
      { el: hero.querySelector('.hero-lotus-bg'), speed: 18, axis: 'both' },
      { el: hero.querySelector('.hero-mandala'), speed: 14, axis: 'x' },
      { el: hero.querySelector('.hero-om-watermark'), speed: 12, axis: 'y' },
      { el: hero.querySelector('.hero-left'), speed: 8, axis: 'both' },
      { el: hero.querySelector('.hero-right'), speed: 12, axis: 'both' }
    ].filter(function (layer) { return layer.el; });

    var ticking = false;

    function render() {
      ticking = false;
      var rect = hero.getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top + rect.height / 2;
      var offsetX = (window.innerWidth / 2 - centerX) / window.innerWidth;
      var offsetY = (window.innerHeight / 2 - centerY) / window.innerHeight;

      layers.forEach(function (layer) {
        var tx = layer.axis === 'y' ? 0 : offsetX * layer.speed;
        var ty = layer.axis === 'x' ? 0 : offsetY * layer.speed;
        layer.el.style.transform += '';
        if (layer.el.classList.contains('hero-left')) {
          layer.el.style.transform = 'translate3d(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px,0) rotateX(1.2deg)';
        } else if (layer.el.classList.contains('hero-right')) {
          layer.el.style.transform = 'translate3d(' + (tx * -0.8).toFixed(2) + 'px,' + ty.toFixed(2) + 'px,0) rotateY(-4deg)';
        } else {
          layer.el.style.transform = 'translate3d(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px,0)';
        }
      });
    }

    function requestRender() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(render);
      }
    }

    window.addEventListener('scroll', requestRender, { passive: true });
    window.addEventListener('resize', requestRender);
    requestRender();
  }

  function initCounterAnimation() {
    if (reduceMotion) return;
    var counters = qsa('.stats .stat-num[data-count]');
    if (!counters.length || !window.IntersectionObserver) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        var node = entry.target;
        var target = parseInt(node.getAttribute('data-count'), 10) || 0;
        var suffix = node.getAttribute('data-suffix') || '';
        var duration = 1600;
        var start = performance.now();

        function tick(now) {
          var progress = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var current = Math.round(target * eased);
          node.textContent = current + suffix;
          if (progress < 1) {
            requestAnimationFrame(tick);
          }
        }

        requestAnimationFrame(tick);
      });
    }, { threshold: 0.45 });

    counters.forEach(function (counter) { observer.observe(counter); });
  }

  function initConditionTilt() {
    if (reduceMotion || coarsePointer) return;
    qsa('.flip-card').forEach(function (card) {
      card.addEventListener('mousemove', function (event) {
        var rect = card.getBoundingClientRect();
        var relX = (event.clientX - rect.left) / rect.width;
        var relY = (event.clientY - rect.top) / rect.height;
        var rotateY = ((relX - 0.5) * 12).toFixed(2) + 'deg';
        var rotateX = ((0.5 - relY) * 10).toFixed(2) + 'deg';
        card.style.setProperty('--pm-rotate-x', rotateX);
        card.style.setProperty('--pm-rotate-y', rotateY);
        card.classList.add('pm-tilting');
      });
      card.addEventListener('mouseleave', function () {
        card.classList.remove('pm-tilting');
        card.style.removeProperty('--pm-rotate-x');
        card.style.removeProperty('--pm-rotate-y');
      });
    });
  }

  function initFooterMapReveal() {
    var frames = qsa('.footer-contact-item iframe');
    frames.forEach(function (frame, index) {
      frame.classList.add('pm-delay-' + ((index % 3) + 1));
    });
  }

  function initPointerDepth() {
    if (reduceMotion || coarsePointer) return;

    var interactive = qsa('.consult-image-inner, .hero-frame-outer, .gallery-grid figure, .how-card, .pain-card, .answer-card, .haridwar-card, .blog-card');
    interactive.forEach(function (node) {
      node.addEventListener('mousemove', function (event) {
        var rect = node.getBoundingClientRect();
        var relX = (event.clientX - rect.left) / rect.width - 0.5;
        var relY = (event.clientY - rect.top) / rect.height - 0.5;
        var rotateX = (-relY * 5).toFixed(2);
        var rotateY = (relX * 6).toFixed(2);

        if (node.classList.contains('consult-image-inner')) {
          node.style.transform = 'perspective(1200px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)';
        } else if (node.classList.contains('hero-frame-outer')) {
          node.style.transform = 'rotateY(' + rotateY + 'deg) rotateX(' + rotateX + 'deg) translateY(-8px) scale(1.012)';
        } else {
          node.style.transform = 'perspective(1200px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)';
        }
      });

      node.addEventListener('mouseleave', function () {
        node.style.transform = '';
      });
    });
  }

  function initFormSuccessPolish() {
    var success = document.getElementById('formSuccess');
    if (!success) return;

    var observer = new MutationObserver(function () {
      if (success.style.display === 'block') {
        success.classList.add('pm-visible');
      }
    });

    observer.observe(success, { attributes: true, attributeFilter: ['style', 'class'] });
  }

  markStaticGroups();
  injectRevealStyles();
  initRevealSystem();
  initNavPolish();
  initHeroParallax();
  initCounterAnimation();
  initFooterMapReveal();
  initFormSuccessPolish();
})();
