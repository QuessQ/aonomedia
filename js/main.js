/* ============================================================
   Aono Media — hero video scrub, reveals, parallax, lightbox
   ============================================================ */
(function () {
  'use strict';

  var track = document.querySelector('.hero-track');
  var stage = document.querySelector('.hero-stage');
  var video = document.getElementById('hero-video');
  var fallback = document.getElementById('hero-fallback');
  var title = document.querySelector('.hero-title');
  var hint = document.querySelector('.hero-hint');
  var hintFill = document.querySelector('.hint-fill');

  /* ---------- hero scroll progress (0..1 across the track) ---------- */
  function heroProgress() {
    var total = track.offsetHeight - window.innerHeight;
    if (total <= 0) return 1;
    return Math.min(1, Math.max(0, -track.getBoundingClientRect().top / total));
  }

  /* ---------- video scrubbing ----------
     Scroll position maps to video time; a rAF loop eases the video's
     currentTime toward the target so scrubbing feels weighted rather
     than steppy. If Camera_Hero.mp4 is missing, a generated fallback
     animation keeps the hero presentable. */
  var videoReady = false;
  var targetTime = 0;

  video.addEventListener('loadedmetadata', function () { videoReady = true; });
  video.addEventListener('error', useFallback, true);
  if (video.querySelector('source')) {
    video.querySelector('source').addEventListener('error', useFallback);
  }
  // The source's error event can fire during HTML parsing, before these
  // listeners exist — so also poll the media state after load.
  function checkVideoState() {
    if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) useFallback();
  }
  window.addEventListener('load', function () {
    checkVideoState();
    setTimeout(checkVideoState, 1500);
  });

  var usingFallback = false;
  function useFallback() {
    if (usingFallback) return;
    usingFallback = true;
    stage.classList.add('use-fallback');
    sizeFallback();
  }

  function sizeFallback() {
    fallback.width = stage.clientWidth;
    fallback.height = stage.clientHeight;
  }
  window.addEventListener('resize', function () { if (usingFallback) sizeFallback(); });

  /* Fallback: slow drifting light field suggesting a lens, driven by
     the same scroll progress the video would use. */
  function drawFallback(p) {
    var ctx = fallback.getContext('2d');
    var w = fallback.width, h = fallback.height;
    if (!w || !h) return;
    ctx.fillStyle = '#0e0e0f';
    ctx.fillRect(0, 0, w, h);
    var cx = w * (0.5 + 0.18 * Math.sin(p * Math.PI * 2));
    var cy = h * (0.46 + 0.1 * Math.cos(p * Math.PI));
    var r = Math.max(w, h) * (0.28 + 0.5 * p);
    var g = ctx.createRadialGradient(cx, cy, r * 0.05, cx, cy, r);
    g.addColorStop(0, 'rgba(190,175,150,' + (0.34 - 0.18 * p) + ')');
    g.addColorStop(0.4, 'rgba(90,84,74,0.16)');
    g.addColorStop(1, 'rgba(14,14,15,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    // concentric aperture rings
    ctx.strokeStyle = 'rgba(236,231,222,0.07)';
    for (var i = 1; i <= 4; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.22 * i * (0.6 + 0.4 * p), 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  var lastApplied = -1;
  function tick() {
    var p = heroProgress();

    if (usingFallback) {
      drawFallback(p);
    } else if (videoReady && video.duration) {
      targetTime = p * Math.max(0, video.duration - 0.05);
      // ease toward the target for weighted, non-steppy scrubbing
      var t = video.currentTime + (targetTime - video.currentTime) * 0.22;
      if (Math.abs(t - lastApplied) > 1 / 120) {
        video.currentTime = t;
        lastApplied = t;
      }
    }

    title.classList.toggle('on', p > 0.62);
    hint.classList.toggle('off', p > 0.9);
    hintFill.style.width = (p * 100) + '%';

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  /* ---------- scroll reveals ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* ---------- gentle parallax drift on grid items ---------- */
  var drifters = Array.prototype.slice.call(document.querySelectorAll('[data-drift]'));
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && drifters.length) {
    window.addEventListener('scroll', function () {
      drifters.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        var mid = r.top + r.height / 2 - window.innerHeight / 2;
        el.style.transform = 'translateY(' + (-mid * parseFloat(el.dataset.drift)) + 'px)';
      });
    }, { passive: true });
  }

  /* ---------- missing-photo fallback ---------- */
  document.querySelectorAll('.item img, .portrait img').forEach(function (img) {
    img.addEventListener('error', function () {
      img.classList.add('missing');
      img.removeAttribute('src');
      img.alt = '';
    });
  });

  /* ---------- lightbox ---------- */
  var lb = document.getElementById('lightbox');
  var lbImg = lb.querySelector('img');
  var lbCap = lb.querySelector('.lb-caption');
  document.querySelectorAll('.item img').forEach(function (img) {
    img.addEventListener('click', function () {
      if (!img.getAttribute('src')) return;
      lbImg.src = img.src;
      var cap = img.closest('figure').querySelector('figcaption');
      lbCap.textContent = cap ? cap.textContent : '';
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
    });
  });
  function closeLb() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
  }
  lb.addEventListener('click', closeLb);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });

  /* ---------- inquiry form (no backend yet: composes an email) ---------- */
  document.getElementById('inquiry').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('f-name').value.trim();
    var email = document.getElementById('f-email').value.trim();
    var msg = document.getElementById('f-message').value.trim();
    var body = msg + '\n\n— ' + name + ' (' + email + ')';
    window.location.href = 'mailto:hello@aonomedia.com'
      + '?subject=' + encodeURIComponent('Commission inquiry — ' + name)
      + '&body=' + encodeURIComponent(body);
  });
})();
