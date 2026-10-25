// ============================================================
// GameScorer — shared behavior helpers
// Pairs with shared/reset.css. Mark each top-level screen with
// class="screen" (plus class="active" on the one shown first),
// then call showScreen(id) to switch between them.
// GS.* holds the small shared helpers: escaping, persistence,
// and the motion helpers (bump / tween / confetti).
// ============================================================

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(function (s) {
    s.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

var GS = {
  esc: function (s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  },

  // Saved games survive iOS reloading a backgrounded tab.
  save: function (key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
  },
  load: function (key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  },

  bump: function (el) {
    if (!el) return;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
  },

  // Count el's text from `from` to `to` (ease-out), then bump it.
  tween: function (el, from, to, fmt) {
    if (!el) return;
    fmt = fmt || String;
    if (from === to || matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = fmt(to); return; }
    var t0 = performance.now(), dur = 450;
    (function frame(now) {
      var k = Math.min(1, (now - t0) / dur);
      el.textContent = fmt(Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(frame);
    })(t0);
    GS.bump(el);
  },

  // Old digits slide out, new ones spring in (down when the value drops).
  roll: function (el, v) {
    if (!el) return;
    if (!el.classList.contains('roll')) {
      el.classList.add('roll');
      el.innerHTML = '<span>' + GS.esc(el.textContent) + '</span>';
    }
    var old = el.lastElementChild;
    if (old.textContent === String(v)) return;
    var nu = document.createElement('span');
    nu.textContent = v;
    el.appendChild(nu);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { old.remove(); return; }
    var dir = parseFloat(v) < parseFloat(old.textContent) ? -1 : 1;
    var spring = getComputedStyle(document.documentElement).getPropertyValue('--spring').trim() || 'ease-out';
    old.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(' + (-90 * dir) + '%)', opacity: 0 }],
      { duration: 260, easing: 'ease-in', fill: 'forwards' }).onfinish = function () { old.remove(); };
    nu.animate([{ transform: 'translateY(' + (90 * dir) + '%)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }],
      { duration: 560, easing: spring });
  },

  confetti: function (colors) {
    var box = document.createElement('div');
    box.className = 'gs-confetti';
    var html = '';
    for (var i = 0; i < 70; i++) {
      html += '<i style="--x:' + (Math.random() * 100) + 'vw;--dx:' + (Math.random() * 160 - 80) + 'px;' +
        '--r:' + (Math.random() * 900 - 450) + 'deg;--t:' + (1.8 + Math.random() * 1.6) + 's;' +
        '--d:' + (Math.random() * 0.5) + 's;--c:' + colors[i % colors.length] + '"></i>';
    }
    box.innerHTML = html;
    document.body.appendChild(box);
    setTimeout(function () { box.remove(); }, 4200);
  }
};
