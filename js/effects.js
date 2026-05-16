(function() {
'use strict';

/* ───────────────────────────────────────────────────────────────────────
   P6-1  FLIP CARD TILT-HOVER (gyroscopic pre-flip feel)
   On desktop, cards tilt toward cursor before flipping
   ─────────────────────────────────────────────────────────────────────── */
function initFlipTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.flip-card').forEach(function(card) {
    var inner = card.querySelector('.flip-inner');
    if (!inner) return;

    card.addEventListener('mouseenter', function() {
      card.classList.add('tilting');
    });

    card.addEventListener('mousemove', function(e) {
      // Don't tilt when flipped
      if (card.classList.contains('flipped')) return;
      var r  = card.getBoundingClientRect();
      var cx = r.left + r.width  / 2;
      var cy = r.top  + r.height / 2;
      var rx = ((e.clientY - cy) / (r.height / 2)) * -8;  // tilt X axis
      var ry = ((e.clientX - cx) / (r.width  / 2)) *  8;  // tilt Y axis
      inner.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
    });

    card.addEventListener('mouseleave', function() {
      card.classList.remove('tilting');
      inner.style.transform = '';
      inner.style.transition = '';
    });

    // On click flip, remove tilt
    card.addEventListener('click', function() {
      inner.style.transform = '';
      inner.style.transition = '';
      card.classList.remove('tilting');
    });
  });
}

/* ───────────────────────────────────────────────────────────────────────
   P6-3  MOUSE-PARALLAX HERO DIORAMA
   Different hero layers shift at different depths on mousemove
   ─────────────────────────────────────────────────────────────────────── */
function initHeroMouseParallax() {
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(max-width: 767px)').matches) return;

  var hero      = document.querySelector('section.hero, .hero');
  var heroBg    = document.getElementById('heroBg');
  var heroLotus = document.querySelector('.hero-lotus-bg');
  var heroRays  = document.querySelector('.hero-rays');
  var heroRight = document.querySelector('.hero-right');
  var heroLeft  = document.querySelector('.hero-left');

  if (!hero) return;

  // Spring lerp state for each layer
  var layers = [
    { el: heroBg,    mx: 0, my: 0, tx: 0, ty: 0, strength: 0.012 },
    { el: heroLotus, mx: 0, my: 0, tx: 0, ty: 0, strength: 0.028 },
    { el: heroRays,  mx: 0, my: 0, tx: 0, ty: 0, strength: 0.018 },
    { el: heroRight, mx: 0, my: 0, tx: 0, ty: 0, strength: 0.022 },
    { el: heroLeft,  mx: 0, my: 0, tx: 0, ty: 0, strength: 0.006 }
  ].filter(function(l) { return l.el; });

  var mouseX = 0, mouseY = 0;
  var heroActive = false;
  var rafRunning = false;

  hero.addEventListener('mouseenter', function() { heroActive = true;  startRAF(); });
  hero.addEventListener('mouseleave', function() {
    heroActive = false;
    // Ease back to center
    mouseX = 0; mouseY = 0;
  });

  hero.addEventListener('mousemove', function(e) {
    var r  = hero.getBoundingClientRect();
    mouseX = e.clientX - r.left - r.width  / 2;
    mouseY = e.clientY - r.top  - r.height / 2;
  });

  var LERP = 0.08; // spring factor

  function startRAF() {
    if (rafRunning) return;
    rafRunning = true;
    loop();
  }

  function loop() {
    var anyMoving = false;

    layers.forEach(function(l) {
      var tx = mouseX * l.strength * 120;  // target X in px
      var ty = mouseY * l.strength * 80;   // target Y in px (less Y movement)

      // Clamp max travel
      tx = Math.max(-20, Math.min(20, tx));
      ty = Math.max(-14, Math.min(14, ty));

      l.mx += (tx - l.mx) * LERP;
      l.my += (ty - l.my) * LERP;

      if (Math.abs(l.mx) > 0.05 || Math.abs(l.my) > 0.05) anyMoving = true;

      // Combine with existing scroll parallax translateY (from P5-3)
      // We use a separate CSS var approach — just add mouse offset via dataset
      var scrollY = parseFloat(l.el.dataset.scrollTY || 0);
      l.el.style.transform = 'translateY(' + scrollY + 'px) translateX(' + l.mx.toFixed(2) + 'px) translateY(' + l.my.toFixed(2) + 'px)';
    });

    if (heroActive || anyMoving) {
      requestAnimationFrame(loop);
    } else {
      rafRunning = false;
    }
  }
}

/* ───────────────────────────────────────────────────────────────────────
   P6-4  FOUNDER DEPTH BADGE MOUSE TILT
   Badges shift slightly on mousemove over founder section for depth
   ─────────────────────────────────────────────────────────────────────── */
function initFounderDepth() {
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(max-width: 900px)').matches) return;

  var section = document.getElementById('founderImages');
  if (!section) return;

  var badges = section.querySelectorAll('.depth-badge');
  if (!badges.length) return;

  var depthFactors = [0.04, -0.03, 0.05]; // each badge moves differently

  section.addEventListener('mousemove', function(e) {
    var r  = section.getBoundingClientRect();
    var cx = e.clientX - r.left - r.width  / 2;
    var cy = e.clientY - r.top  - r.height / 2;

    badges.forEach(function(badge, i) {
      var f  = depthFactors[i] || 0.03;
      var dx = cx * f;
      var dy = cy * f;
      badge.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px)';
      badge.style.transition = 'transform 0.15s ease';
    });
  });

  section.addEventListener('mouseleave', function() {
    badges.forEach(function(badge) {
      badge.style.transform = '';
      badge.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1)';
    });
  });
}

/* ── Bootstrap ─────────────────────────────────────────────────────────── */
function init() {
  initFlipTilt();
  initHeroMouseParallax();
  initFounderDepth();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
