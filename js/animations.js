/* â”€â”€ Page Loader â”€â”€ */
window.addEventListener('load', function() {
  setTimeout(function() {
    var l = document.getElementById('pageLoader');
    if (l) l.classList.add('hidden');
  }, 1800);
});

/* â”€â”€ Scroll Progress Bar â”€â”€ */
window.addEventListener('scroll', function() {
  var el = document.getElementById('scrollProgress');
  if (!el) return;
  var s = document.documentElement;
  var pct = (s.scrollTop / (s.scrollHeight - s.clientHeight)) * 100;
  el.style.width = pct + '%';
}, {passive: true});

/* â”€â”€ OLD left/top cursor REMOVED â”€â”€ GPU-transform cursor below handles all positioning â”€â”€ */

/* â”€â”€ WhatsApp Proactive Chat (appears after 30s) â”€â”€ */
setTimeout(function() {
  var el = document.getElementById('waChat');
  if (el) el.classList.add('show');
}, 30000);

/* â”€â”€ Stagger reveal for cards â”€â”€ */
(function() {
  if (!window.IntersectionObserver) return;
  var staggerTargets = document.querySelectorAll('.flip-card, .testimonial-card, .pricing-card, .blog-card, .tl-card');
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, {threshold: 0.12});
  staggerTargets.forEach(function(el, i) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity .55s ease ' + (i % 4 * 0.12) + 's, transform .55s ease ' + (i % 4 * 0.12) + 's';
    obs.observe(el);
  });
})();

/* â”€â”€ Fix FAQ accordion (JS height instead of max-height) â”€â”€ */
(function() {
  document.querySelectorAll('.faq-question').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = btn.closest('.faq-item');
      var ans = item.querySelector('.faq-answer');
      var isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(function(o) {
        o.classList.remove('open');
        var a = o.querySelector('.faq-answer');
        if (a) { a.style.height = '0'; a.style.opacity = '0'; }
        var q = o.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen && ans) {
        item.classList.add('open');
        ans.style.height = ans.scrollHeight + 'px';
        ans.style.opacity = '1';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
  // Init: close all answers
  document.querySelectorAll('.faq-answer').forEach(function(a) {
    a.style.overflow = 'hidden';
    a.style.height = '0';
    a.style.opacity = '0';
    a.style.transition = 'height .35s ease, opacity .3s ease';
  });
})();

/* ── 3. Premium Section-Aware Cursor ── */
  if (window.matchMedia("(hover: hover)").matches) {
    var dot   = document.getElementById("cursorDot");
    var ring  = document.getElementById("cursorRing");
    var label = document.getElementById("cursorLabel");
    var rx = 0, ry = 0, mx = 0, my = 0;

    if (dot && ring) {
      document.body.classList.add("cursor-enhanced");
      /* Dot: GPU transform — zero layout cost, perfectly instant */
      document.addEventListener("mousemove", function(e) {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = "translate(" + (mx - 3) + "px," + (my - 3) + "px)";
        if (label) { label.style.transform = "translate(" + (mx - 3) + "px," + (my + 18) + "px)"; }
      }, { passive: true });

      /* Ring: GPU transform lerp — single loop, no layout thrash */
      (function lerpRing() {
        rx += (mx - rx) * 0.20;
        ry += (my - ry) * 0.20;
        ring.style.transform = "translate(" + (rx - 18) + "px," + (ry - 18) + "px)";
        requestAnimationFrame(lerpRing);
      })();

      /* Click feedback */
      document.addEventListener("mousedown", function() { document.body.classList.add("cursor-clicked"); });
      document.addEventListener("mouseup",   function() { document.body.classList.remove("cursor-clicked"); });

      /* Section-aware color themes */
      var sectionThemes = [
        { sel: ".hero",         color: "#fff",    ring: "rgba(255,255,255,0.5)", size: "44px" },
        { sel: ".stats",        color: "#E5B842", ring: "rgba(229,184,66,0.5)",  size: "40px" },
        { sel: ".pain",         color: "#1B5E3B", ring: "rgba(27,94,59,0.4)",    size: "36px" },
        { sel: ".conditions",   color: "#2E7D52", ring: "rgba(46,125,82,0.45)",  size: "38px" },
        { sel: ".iyengar",      color: "#C8952A", ring: "rgba(200,149,42,0.45)", size: "42px" },
        { sel: ".founder",      color: "#C8952A", ring: "rgba(200,149,42,0.45)", size: "40px" },
        { sel: ".testimonials", color: "#1B5E3B", ring: "rgba(27,94,59,0.35)",   size: "38px" },
        { sel: ".pricing",      color: "#C8952A", ring: "rgba(200,149,42,0.5)",  size: "40px" },
        { sel: ".booking",      color: "#fff",    ring: "rgba(255,255,255,0.4)", size: "44px" },
        { sel: ".compare-section", color: "#1B5E3B", ring: "rgba(27,94,59,0.4)", size: "36px" },
        { sel: ".faq",          color: "#1B5E3B", ring: "rgba(27,94,59,0.35)",   size: "36px" }
      ];

      function applyTheme(color, ringColor, size) {
        document.documentElement.style.setProperty("--cursor-color", color);
        document.documentElement.style.setProperty("--ring-color",   ringColor);
        document.documentElement.style.setProperty("--ring-size",    size);
      }

      if (window.IntersectionObserver) {
        sectionThemes.forEach(function(t) {
          var el = document.querySelector(t.sel);
          if (!el) return;
          new IntersectionObserver(function(entries) {
            if (entries[0].isIntersecting) applyTheme(t.color, t.ring, t.size);
          }, { threshold: 0.4 }).observe(el);
        });
      }

      /* Element-level cursor label reactions */
      var labelMap = [
        { sel: ".btn-gold, .btn-primary",    lbl: "Book Now",  size: "52px" },
        { sel: "a[href*=whatsapp], .wap-cta",lbl: "WhatsApp",  size: "52px" },
        { sel: ".flip-card",                 lbl: "Explore",   size: "48px" },
        { sel: ".pricing-card",              lbl: "Choose",    size: "48px" },
        { sel: ".testimonial-card",          lbl: "Story",     size: "44px" },
        { sel: ".blog-card, .blog-thumb",    lbl: "Read",      size: "44px" },
        { sel: ".gallery-img, .gallery-item",lbl: "View",      size: "50px" },
        { sel: "nav a, .nav-link",           lbl: "",          size: "28px" }
      ];
      labelMap.forEach(function(m) {
        document.querySelectorAll(m.sel).forEach(function(el) {
          el.addEventListener("mouseenter", function() {
            document.documentElement.style.setProperty("--ring-size", m.size);
            if (label && m.lbl) {
              label.textContent = m.lbl;
              document.body.classList.add("cursor-label-show");
            }
          });
          el.addEventListener("mouseleave", function() {
            document.documentElement.style.setProperty("--ring-size", "36px");
            document.body.classList.remove("cursor-label-show");
          });
        });
      });
    }
  }


(function() {
  'use strict';
  var io = window.IntersectionObserver;

  /* â”€â”€ Core observer â”€â”€ */
  function watch(el, cb, thresh) {
    if (!el) return;
    if (!io) { cb(el); return; }
    new IntersectionObserver(function(ents, obs) {
      if (ents[0].isIntersecting) { cb(el); obs.unobserve(el); }
    }, { threshold: thresh || 0.12 }).observe(el);
  }

  function watchAll(sel, cb, thresh) {
    document.querySelectorAll(sel).forEach(function(el) { watch(el, cb, thresh); });
  }

  /* â”€â”€ Split text into animated words â”€â”€ */
  function splitText(sel) {
    document.querySelectorAll(sel).forEach(function(el) {
      if (el.dataset.split) return;
      el.dataset.split = '1';
      var text = el.innerHTML;
      // Only split plain text nodes (skip if has child elements beyond spans)
      if (el.querySelectorAll('*').length > 2) return;
      var words = el.textContent.split(/\s+/).filter(Boolean);
      el.innerHTML = words.map(function(w,i) {
        return '<span class="word-wrap"><span class="word-inner d' + Math.min(i+1,8) + '">' + w + '</span></span>';
      }).join(' ');
      watch(el, function() {
        el.querySelectorAll('.word-inner').forEach(function(wi) { wi.classList.add('vis'); });
      }, 0.3);
    });
  }

  /* â”€â”€ Add class + observe â”€â”€ */
  function anim(el, cls, delay) {
    if (!el) return;
    el.classList.add(cls);
    if (delay) el.style.transitionDelay = delay + 's';
    watch(el, function() { el.classList.add('vis'); });
  }

  function animAll(sel, cls, stagger) {
    document.querySelectorAll(sel).forEach(function(el, i) {
      el.classList.add(cls);
      var d = stagger ? (i % 8) * stagger : 0;
      if (d) el.style.transitionDelay = d + 's';
      watch(el, function() { el.classList.add('vis'); });
    });
  }

  /* â•â•â•â•â•â•â•â•â•â• SECTION-BY-SECTION ANIMATIONS â•â•â•â•â•â•â•â•â•â• */

  /* HERO â€” section headings + sub (already has CSS fadeUp) */
  splitText('.hero .hero-tagline, .hero .hero-sub, .hero-eyebrow');
  animAll('.hero .btn', 'au-pop', 0.12);

  /* STATS */
  document.querySelectorAll('.stat').forEach(function(el, i) {
    el.classList.add('au-pop');
    el.style.transitionDelay = (i * 0.1) + 's';
    watch(el, function() {
      el.classList.add('vis');
      var num = el.querySelector('.stat-num');
      if (num) setTimeout(function() { num.classList.add('stat-num-glow'); }, 400);
    }, 0.1);
  });

  /* PAIN */
  anim(document.querySelector('.pain-header'), 'au-up');
  /* Pain columns: find the two-column layout */
  var painCols = document.querySelectorAll('.pain .pain-grid > div, .pain .two-col > div, .pain .pain-content > div');
  if (painCols.length >= 2) {
    painCols[0].classList.add('au-left'); watch(painCols[0], function() { painCols[0].classList.add('vis'); });
    painCols[1].classList.add('au-right'); painCols[1].style.transitionDelay = '.15s'; watch(painCols[1], function() { painCols[1].classList.add('vis'); });
  } else {
    /* fallback: animate all direct children of pain container */
    document.querySelectorAll('.pain .container > *').forEach(function(el,i) {
      el.classList.add(i % 2 === 0 ? 'au-left' : 'au-right');
      el.style.transitionDelay = (i * 0.12) + 's';
      watch(el, function() { el.classList.add('vis'); });
    });
  }

  /* CONDITIONS */
  anim(document.querySelector('.conditions-header, .conditions .container > .section-heading'), 'au-up');
  /* Category buttons */
  animAll('.condition-cat, .cat-btn, .conditions .tabs button, .conditions .filter-btn', 'au-pop', 0.08);
  /* Flip cards */
  document.querySelectorAll('.flip-card').forEach(function(el, i) {
    el.classList.add('au-pop');
    el.style.transitionDelay = (i % 6 * 0.09) + 's';
    watch(el, function() { el.classList.add('vis'); });
  });

  /* IYENGAR */
  var iyGrid = document.querySelector('.iyengar-grid');
  if (iyGrid) {
    var iyPortrait = iyGrid.querySelector('.iyengar-portrait');
    var iyContent  = iyGrid.children[iyGrid.children.length - 1]; /* last child = text side */
    if (iyPortrait) { anim(iyPortrait, 'au-clip'); }
    if (iyContent && iyContent !== iyPortrait) { anim(iyContent, 'au-right', 0.3); }
  }
  animAll('.iyengar .feature-item, .iyengar .iy-point, .iyengar li', 'au-left', 0.08);

  /* HOW IT WORKS */
  document.querySelectorAll('.how-card').forEach(function(el, i) {
    el.classList.add('au-pop');
    el.style.transitionDelay = (i * 0.18) + 's';
    watch(el, function() {
      el.classList.add('vis');
      var icon = el.querySelector('.how-img, .how-icon, img');
      if (icon) setTimeout(function() { icon.classList.add('icon-bounce'); }, i * 180 + 200);
    }, 0.15);
  });

  /* PROGRESS / TIMELINE / RESULTS */
  anim(document.querySelector('.progress-header, .progress .section-heading'), 'au-up');
  document.querySelectorAll('.tl-card, .week-card, .timeline-item, .result-card').forEach(function(el, i) {
    el.classList.add(i % 2 === 0 ? 'au-left' : 'au-right');
    el.style.transitionDelay = (i * 0.12) + 's';
    watch(el, function() { el.classList.add('vis'); });
  });

  /* FOUNDER */
  var founderImages = document.querySelector('.founder-images');
  var founderContent = document.querySelector('.founder-content, .founder-bio, .founder-grid > div:last-child');
  if (founderImages) { anim(founderImages, 'au-clip'); }
  if (founderContent) { anim(founderContent, 'au-right', 0.3); }
  animAll('.founder .founder-stat, .founder .founder-credential', 'au-pop', 0.1);

  /* TESTIMONIALS */
  document.querySelectorAll('.test-card, .testimonial-card, .review-card').forEach(function(el, i) {
    el.classList.add('au-pop');
    el.style.transitionDelay = (i * 0.14) + 's';
    watch(el, function() { el.classList.add('vis'); }, 0.1);
  });

  /* GALLERY */
  document.querySelectorAll('.g-cell, .gallery-item, .gallery img').forEach(function(el, i) {
    el.classList.add('au-pop');
    el.style.transitionDelay = (i * 0.07) + 's';
    watch(el, function() { el.classList.add('vis'); }, 0.08);
  });

  /* BLOG */
  document.querySelectorAll('.blog-card').forEach(function(el, i) {
    el.classList.add('au-pop');
    el.style.transitionDelay = (i * 0.13) + 's';
    watch(el, function() { el.classList.add('vis'); });
  });

  /* PRICING */
  document.querySelectorAll('.price-card').forEach(function(el, i) {
    el.classList.add('au-pop');
    el.style.transitionDelay = (i * 0.15) + 's';
    watch(el, function() { el.classList.add('vis'); });
  });

  /* CONSULT */
  anim(document.querySelector('.consult-title-1'), 'au-up');
  anim(document.querySelector('.consult-title-2'), 'au-up', 0.1);
  animAll('.consult-check, .consult-point', 'au-left', 0.08);
  animAll('.consult .btn, .consult .cta-btn', 'au-pop', 0.15);

  /* BOOKING */
  anim(document.querySelector('.booking-left'), 'au-left');
  anim(document.querySelector('.booking-right, .booking-form, .booking-inner > div:last-child'), 'au-right', 0.15);
  animAll('.cal-slot', 'au-pop', 0.04);

  /* FAQ */
  document.querySelectorAll('.faq-item').forEach(function(el, i) {
    el.classList.add('au-left');
    el.style.transitionDelay = (i * 0.07) + 's';
    watch(el, function() { el.classList.add('vis'); });
  });

  /* COMPARE TABLE */
  document.querySelectorAll('.compare-table tbody tr').forEach(function(el, i) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity .5s ease, transform .5s cubic-bezier(.16,1,.3,1)';
    el.style.transitionDelay = (i * 0.07) + 's';
    watch(el, function() { el.style.opacity = '1'; el.style.transform = 'none'; });
  });

  /* FOOTER */
  document.querySelectorAll('.footer-col, .footer-grid > div').forEach(function(el, i) {
    el.classList.add('au-up');
    el.style.transitionDelay = (i * 0.1) + 's';
    watch(el, function() { el.classList.add('vis'); });
  });

  /* â•â•â•â•â•â•â•â•â•â• SECTION HEADING LINES â•â•â•â•â•â•â•â•â•â• */
  document.querySelectorAll('.section-heading, .section-title').forEach(function(el) {
    if (el.dataset.lined) return;
    el.dataset.lined = '1';
    var line = document.createElement('span');
    line.className = 'sec-line';
    el.after(line);
    watch(line, function() { line.classList.add('vis'); }, 0.3);
  });

  /* â•â•â•â•â•â•â•â•â•â• MAGNETIC BUTTONS â•â•â•â•â•â•â•â•â•â• */
  document.querySelectorAll('.btn-gold, .btn-primary, .book-btn, .consult-cta').forEach(function(btn) {
    btn.classList.add('btn-mag');
    btn.addEventListener('mousemove', function(e) {
      var r = btn.getBoundingClientRect();
      var x = (e.clientX - r.left - r.width  / 2) * 0.22;
      var y = (e.clientY - r.top  - r.height / 2) * 0.22;
      btn.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(1.04)';
    });
    btn.addEventListener('mouseleave', function() { btn.style.transform = ''; });
  });

  /* â•â•â•â•â•â•â•â•â•â• COUNTER ANIMATION (stat-num) â•â•â•â•â•â•â•â•â•â• */
  document.querySelectorAll('.stat-num').forEach(function(el) {
    var raw = el.textContent.trim();
    var num = parseInt(raw.replace(/\D/g, ''), 10);
    if (!num) return;
    var suffix = raw.replace(/[\d,]/g, '');
    var animated = false;
    watch(el, function() {
      if (animated) return; animated = true;
      var t0 = null;
      (function tick(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / 1600, 1);
        var ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(ease * num).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else { el.textContent = raw; el.classList.add('count-glow'); }
      })(0);
      requestAnimationFrame(function(ts) {});
    }, 0.4);
  });

})();

(function() {
  var io = window.IntersectionObserver;
  function watch(el, cb, thresh) {
    if (!el) return;
    if (!io) { cb(el); return; }
    new IntersectionObserver(function(ents, obs) {
      if (ents[0].isIntersecting) { cb(el); obs.unobserve(el); }
    }, { threshold: thresh || 0.12 }).observe(el);
  }

  /* ══ 1. STATS — smooth odometer count-up + shimmer ══ */
  document.querySelectorAll('.stat').forEach(function(card, i) {
    watch(card, function() {
      /* Stagger the card entrance */
      card.style.animationDelay = (i * 0.12) + 's';
      card.classList.add('anim-in');

      /* Odometer count-up */
      var numEl = card.querySelector('.stat-num');
      if (!numEl || numEl.dataset.animated) return;
      numEl.dataset.animated = '1';
      var raw    = numEl.textContent.trim();
      var target = parseInt(raw.replace(/\D/g,''), 10);
      if (!target) return;
      var suffix = raw.replace(/[0-9,]/g,'');
      var dur = 1800, t0 = null;
      function tick(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        /* Ease out cubic */
        var ease = 1 - Math.pow(1 - p, 3);
        numEl.textContent = Math.floor(ease * target).toLocaleString() + suffix;
        if (p < 1) {
          requestAnimationFrame(tick);
        } else {
          numEl.textContent = raw;
          numEl.classList.add('stat-num-shimmer');
          setTimeout(function() { numEl.classList.remove('stat-num-shimmer'); }, 1400);
        }
      }
      setTimeout(function() { requestAnimationFrame(tick); }, i * 120);
    }, 0.2);
  });

  /* ══ 2. CONDITIONS CARDS — stagger + 3D tilt hover ══ */
  var condCards = document.querySelectorAll('.flip-card');
  condCards.forEach(function(card, i) {
    /* Stagger entrance */
    watch(card, function() {
      card.style.animationDelay = (i % 3 * 0.14) + 's';
      card.classList.add('cond-card-anim');
    }, 0.1);

    /* tilt removed — handled by pure CSS hover below for smooth GPU performance */
  });

  /* ══ 3. TESTIMONIAL CARDS — stagger entrance + hover lift ══ */
  document.querySelectorAll('.test-card').forEach(function(card, i) {
    watch(card, function() {
      card.style.animationDelay = (i * 0.15) + 's';
      card.classList.add('anim-in');
    }, 0.1);
  });

  /* ══ 4. BLOG CARDS — 3D tilt + stagger entrance ══ */
  document.querySelectorAll('.blog-card').forEach(function(card, i) {
    watch(card, function() {
      card.style.animationDelay = (i * 0.13) + 's';
      card.classList.add('anim-in');
    }, 0.1);

    /* 3D tilt handled by RAF-based blog-cursor-fix script below — no duplicate listener */
  });

  /* ══ 5. CONSULT SECTION — floating image ══ */
  /* Find the consult section image and apply float */
  var consultImgs = document.querySelectorAll('.consult img, .consult-visual img, .consult-image, .consult-photo, .consult-img');
  if (consultImgs.length === 0) {
    /* Try finding any image in consult section */
    var consultSec = document.querySelector('.consult');
    if (consultSec) {
      var imgs = consultSec.querySelectorAll('img');
      imgs.forEach(function(img) { img.classList.add('consult-img-float'); });
    }
  } else {
    consultImgs.forEach(function(img) { img.classList.add('consult-img-float'); });
  }

  /* ══ 6. ENHANCED STAT CARD HOVER ══ */
  document.querySelectorAll('.stat').forEach(function(card) {
    card.style.cursor = 'default';
    card.addEventListener('mouseenter', function() {
      card.style.transform = 'translateY(-8px) scale(1.04)';
      card.style.transition = 'transform .3s cubic-bezier(.34,1.56,.64,1)';
      card.style.boxShadow = '0 20px 40px rgba(0,0,0,.2)';
    });
    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
      card.style.boxShadow = '';
      card.style.transition = 'transform .4s cubic-bezier(.34,1.56,.64,1), box-shadow .4s ease';
    });
  });

})();

(function() {
'use strict';

/* ───────────────────────────────────────────────────────────────────────
   P5-1  WORD-BY-WORD HEADING REVEALS
   ─────────────────────────────────────────────────────────────────────── */
function initWordReveals() {
  function wrapWords(h2) {
    if (h2.dataset.wordWrap) return;
    if (h2.closest('.modal, [id*="modal"], .article-modal')) return;
    h2.dataset.wordWrap = '1';

    // Walk child nodes, wrap text-node words in spans
    function walk(node) {
      if (node.nodeType === 3) {
        var words = node.textContent.split(/(\s+)/);
        if (words.length <= 1) return; // single word, skip
        var frag = document.createDocumentFragment();
        words.forEach(function(w) {
          if (!w) return;
          if (/^\s+$/.test(w)) {
            frag.appendChild(document.createTextNode(w));
          } else {
            var s = document.createElement('span');
            s.className = 'wr';
            s.textContent = w;
            frag.appendChild(s);
          }
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === 1 && node.tagName !== 'BR') {
        // process children (em, strong, etc.) too
        Array.from(node.childNodes).forEach(walk);
      }
    }

    Array.from(h2.childNodes).forEach(walk);
  }

  var headings = document.querySelectorAll('h2.section-heading');
  headings.forEach(wrapWords);

  if (!('IntersectionObserver' in window)) {
    // Fallback: show all immediately
    headings.forEach(function(h) { h.classList.add('words-in'); });
    return;
  }

  var wordObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      var h2 = entry.target;
      var spans = h2.querySelectorAll('.wr');
      spans.forEach(function(s, i) {
        s.style.transitionDelay = (i * 0.065) + 's';
      });
      h2.classList.add('words-in');
      wordObs.unobserve(h2);
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -40px 0px' });

  headings.forEach(function(h) { wordObs.observe(h); });
}

/* ───────────────────────────────────────────────────────────────────────
   P5-2  MAGNETIC CTA BUTTONS
   ─────────────────────────────────────────────────────────────────────── */
function initMagneticButtons() {
  // Only on non-touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  var sel = '.btn, .btn-primary, .btn-gold, .cta-btn, .wa-float, .booking-btn';
  var btns = document.querySelectorAll(sel);

  btns.forEach(function(btn) {
    btn.addEventListener('mousemove', function(e) {
      var r   = this.getBoundingClientRect();
      var cx  = r.left + r.width  / 2;
      var cy  = r.top  + r.height / 2;
      var dx  = (e.clientX - cx) * 0.28;
      var dy  = (e.clientY - cy) * 0.28;
      // clamp to ±14px
      dx = Math.max(-14, Math.min(14, dx));
      dy = Math.max(-10, Math.min(10, dy));
      this.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      this.style.transition = 'transform 0.1s ease';
    });

    btn.addEventListener('mouseleave', function() {
      this.style.transform = '';
      this.style.transition = 'transform 0.45s cubic-bezier(0.23,1,0.32,1)';
    });
  });
}

/* ───────────────────────────────────────────────────────────────────────
   P5-3  SCROLL-LINKED HERO PARALLAX
   ─────────────────────────────────────────────────────────────────────── */
function initHeroParallax() {
  // Reduced motion check
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Mobile skip (too cramped)
  if (window.matchMedia('(max-width: 767px)').matches) return;

  var hero     = document.querySelector('section.hero, .hero');
  var heroBg   = document.getElementById('heroBg');
  var heroLotus= document.querySelector('.hero-lotus-bg');
  var heroLeft = document.querySelector('.hero-left');
  var heroRight= document.querySelector('.hero-right');
  var heroRays = document.querySelector('.hero-rays');

  if (!hero) return;

  var heroVisible = true;
  new IntersectionObserver(function(entries) {
    heroVisible = entries[0].isIntersecting;
    // reset when hero re-enters view
    if (heroVisible) tick();
  }, { threshold: 0 }).observe(hero);

  var rafId = null;
  var lastSY = -1;

  function tick() {
    var sy = window.scrollY || window.pageYOffset;
    if (sy === lastSY) return;
    lastSY = sy;

    if (heroBg)    heroBg.style.transform    = 'translateY(' + (sy * 0.45) + 'px)';
    if (heroLotus) heroLotus.style.transform = 'translateY(' + (sy * 0.38) + 'px) rotate(' + (sy * 0.01) + 'deg)';
    if (heroRays)  heroRays.style.transform  = 'translateY(' + (sy * 0.3)  + 'px)';
    if (heroLeft)  heroLeft.style.transform  = 'translateY(' + (sy * 0.13) + 'px)';
    if (heroRight) heroRight.style.transform = 'translateY(' + (sy * 0.18) + 'px)';
  }

  var scrollPending = false;
  window.addEventListener('scroll', function() {
    if (!heroVisible) return;
    if (!scrollPending) {
      scrollPending = true;
      requestAnimationFrame(function() {
        tick();
        scrollPending = false;
      });
    }
  }, { passive: true });
}

/* ───────────────────────────────────────────────────────────────────────
   P5-5  HORIZONTAL SCROLL TIMELINE — progress bar + keyboard/arrow nav
   ─────────────────────────────────────────────────────────────────────── */
function initTimelineScroll() {
  var scroller = document.getElementById('tlHScroll');
  var fill     = document.getElementById('tlProgressFill');
  var prev     = document.getElementById('tlPrev');
  var next     = document.getElementById('tlNext');

  if (!scroller || !fill) return;

  // Only activate on desktop
  if (window.matchMedia('(max-width: 767px)').matches) return;

  // Rearrange items into the scroller (they're still inside .timeline inside .timeline-h-scroll)
  // The HTML already puts .timeline inside .timeline-h-scroll, so we just need to move
  // .tl-item elements directly under .timeline-h-scroll for proper flex layout
  var innerTimeline = scroller.querySelector('.timeline');
  if (innerTimeline) {
    var items = Array.from(innerTimeline.querySelectorAll('.tl-item'));
    items.forEach(function(item) {
      item.classList.add('tl-h-item');
      scroller.appendChild(item);
    });
    // Remove the now-empty inner .timeline div
    innerTimeline.remove();
  }

  function updateProgress() {
    var maxScroll = scroller.scrollWidth - scroller.clientWidth;
    if (maxScroll <= 0) return;
    var pct = (scroller.scrollLeft / maxScroll) * 100;
    fill.style.width = Math.round(pct) + '%';
  }

  scroller.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // Card-width navigation
  function getCardWidth() {
    var firstItem = scroller.querySelector('.tl-item');
    return firstItem ? firstItem.offsetWidth : 300;
  }

  if (prev) prev.addEventListener('click', function() {
    scroller.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
  });
  if (next) next.addEventListener('click', function() {
    scroller.scrollBy({ left:  getCardWidth(), behavior: 'smooth' });
  });

  // Keyboard support when focused
  scroller.setAttribute('tabindex', '0');
  scroller.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight') scroller.scrollBy({ left:  getCardWidth(), behavior: 'smooth' });
    if (e.key === 'ArrowLeft')  scroller.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
  });
}

/* ── Bootstrap all ────────────────────────────────────────────────────── */
function init() {
  initWordReveals();
  initMagneticButtons();
  initHeroParallax();
  initTimelineScroll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();

