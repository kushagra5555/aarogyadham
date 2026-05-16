(function() {
  var canvas = document.getElementById('sparkleCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W = canvas.width  = window.innerWidth;
  var H = canvas.height = window.innerHeight;
  window.addEventListener('resize', function() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  /* ── Particle pool ── */
  var particles = [];
  var mouseX = W/2, mouseY = H/2;
  var lastMouseX = mouseX, lastMouseY = mouseY;
  var lastScrollY = window.scrollY;
  var frameCount = 0;

  /* ── Section color map ── */
  var GOLD   = ['#E5B842','#C8952A','#FFF0A0','#FFD700'];
  var GREEN  = ['#1B5E3B','#2E7D52','#A8E6C0','#4CAF80'];
  var WHITE  = ['#ffffff','#f0faf5','#E5B842','#fff8e7'];
  var currentPalette = GOLD;

  function getPalette() {
    var sy = window.scrollY;
    var sections = [
      { id:'top',         pal: WHITE  },
      { id:'stats',       pal: WHITE  },
      { id:'conditions',  pal: GREEN  },
      { id:'about',       pal: GOLD   },
      { id:'how',         pal: GREEN  },
      { id:'results',     pal: GREEN  },
      { id:'pricing',     pal: GOLD   },
      { id:'book',        pal: WHITE  },
      { id:'compare',     pal: GREEN  }
    ];
    for (var i = sections.length - 1; i >= 0; i--) {
      var el = document.getElementById(sections[i].id);
      if (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top <= H * 0.5) { return sections[i].pal; }
      }
    }
    return GOLD;
  }

  /* ── Particle constructor ── */
  function Particle(x, y, type) {
    var pal = currentPalette;
    this.x = x + (Math.random() - 0.5) * 12;
    this.y = y + (Math.random() - 0.5) * 12;
    this.color = pal[Math.floor(Math.random() * pal.length)];
    this.alpha = 0.7 + Math.random() * 0.3;
    this.size  = type === 'scroll' ? (2 + Math.random() * 5) : (1.5 + Math.random() * 3.5);
    this.vx = (Math.random() - 0.5) * (type === 'scroll' ? 3 : 1.8);
    this.vy = (type === 'scroll') ? (-2 - Math.random() * 4) : (-1.5 - Math.random() * 2.5);
    this.gravity = 0.07;
    this.decay   = type === 'scroll' ? 0.016 : 0.022;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.15;
    this.type = type || 'cursor';
    /* shape: 0=star, 1=circle, 2=diamond */
    this.shape = type === 'scroll' ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 2);
  }

  Particle.prototype.update = function() {
    this.x  += this.vx;
    this.y  += this.vy;
    this.vy += this.gravity;
    this.vx *= 0.97;
    this.rotation += this.rotSpeed;
    this.alpha -= this.decay;
  };

  Particle.prototype.draw = function(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    if (this.shape === 0) {
      /* 4-point star */
      var s = this.size, i = s * 0.4;
      ctx.beginPath();
      ctx.moveTo(0, -s); ctx.lineTo(i, -i);
      ctx.lineTo(s, 0);  ctx.lineTo(i, i);
      ctx.lineTo(0, s);  ctx.lineTo(-i, i);
      ctx.lineTo(-s, 0); ctx.lineTo(-i, -i);
      ctx.closePath(); ctx.fill();
    } else if (this.shape === 1) {
      /* circle */
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      /* diamond */
      var d = this.size;
      ctx.beginPath();
      ctx.moveTo(0, -d); ctx.lineTo(d*0.6, 0);
      ctx.lineTo(0, d);  ctx.lineTo(-d*0.6, 0);
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  };

  /* ── Emit on mouse move ── */
  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX; mouseY = e.clientY;
    var dx = mouseX - lastMouseX;
    var dy = mouseY - lastMouseY;
    var speed = Math.sqrt(dx*dx + dy*dy);
    /* Only emit if moving fast enough */
    if (speed > 8 && frameCount % 4 === 0) {
      var count = Math.min(2, Math.floor(speed / 12));
      for (var i = 0; i < count; i++) {
        particles.push(new Particle(mouseX, mouseY, 'cursor'));
      }
    }
    lastMouseX = mouseX; lastMouseY = mouseY;
  }, { passive: true });

  /* Scroll and hover bursts disabled — cursor-only sparkles */
  window.addEventListener('scroll', function() {
    lastScrollY = window.scrollY;
    currentPalette = getPalette();
  }, { passive: true });

  /* ── Render loop ── */
  function animate() {
    frameCount++;
    ctx.clearRect(0, 0, W, H);
    for (var i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(ctx);
      if (particles[i].alpha <= 0) particles.splice(i, 1);
    }
    /* Cap particle count for performance */
    if (particles.length > 200) particles.splice(0, particles.length - 200);
    requestAnimationFrame(animate);
  }
  animate();
})();
