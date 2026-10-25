// ============================================================
// GameScorer — shared behavior helpers
// Pairs with shared/reset.css + shared/glass.css. Mark each
// top-level screen with class="screen" (plus class="active" on
// the one shown first), then call showScreen(id) to switch.
// GS.* holds the small shared helpers: escaping, persistence,
// and the motion engine (transitions, roll, flip, segmented
// thumb, draggable sheets, confetti).
// ============================================================

// iOS Safari only shows :active press states when a touch listener exists.
document.addEventListener('touchstart', function () {}, { passive: true });

function showScreen(id) {
  var screens = Array.prototype.slice.call(document.querySelectorAll('.screen'));
  var next = document.getElementById(id);
  var from = screens.findIndex(function (s) { return s.classList.contains('active'); });
  var to = screens.indexOf(next);
  GS.transition(function () {
    screens.forEach(function (s) { s.classList.remove('active'); });
    next.classList.add('active');
    window.scrollTo(0, 0);
    GS.shiftField(to);
    document.querySelectorAll('.seg').forEach(GS.seg);
  }, to < from);
}

var GS = {
  // <svg> referencing a symbol in shared/icons.svg (path resolved from this script's URL)
  ICONS: document.currentScript.src.replace(/base\.js[^/]*$/, 'icons.svg'),
  icon: function (id, cls) {
    return '<svg class="i' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="' + GS.ICONS + '#' + id + '"/></svg>';
  },

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

  // ── motion primitives ──
  still: function () { return matchMedia('(prefers-reduced-motion: reduce)').matches; },
  spring: function () {
    return getComputedStyle(document.documentElement).getPropertyValue('--spring').trim() || 'ease-out';
  },
  translateY: function (el) {
    var t = getComputedStyle(el).transform;
    return t === 'none' ? 0 : new DOMMatrixReadOnly(t).m42;
  },
  // Past an edge, follow less and less (iOS rubber band).
  rubber: function (x, dim) {
    var c = 0.55;
    return (x * dim * c) / (dim + c * x);
  },

  // Screen change as a push (forward) or pop (back); plain swap where
  // View Transitions are missing, motion is reduced, or the page is still parsing.
  transition: function (update, back) {
    if (!document.startViewTransition || GS.still() || document.readyState === 'loading') { update(); return; }
    var root = document.documentElement;
    root.dataset.nav = back ? 'back' : 'forward';
    var vt = document.startViewTransition(update);
    // a newer transition may interrupt this one; that's expected, not an error
    vt.ready.catch(function () {});
    vt.finished.catch(function () {}).then(function () { delete root.dataset.nav; });
  },

  // The color field drifts to a new spot per screen instead of looping forever
  // (a moving field under glass forces a re-blur every frame).
  FIELD_SPOTS: [[0, 0, 0], [-6, 4, 8], [5, -3, -6], [-3, -5, 4], [4, 5, -3]],
  shiftField: function (i) {
    var f = document.querySelector('.gs-field');
    if (!f) return;
    var s = GS.FIELD_SPOTS[(i < 0 ? 0 : i) % GS.FIELD_SPOTS.length];
    f.style.setProperty('--fx', s[0] + '%');
    f.style.setProperty('--fy', s[1] + '%');
    f.style.setProperty('--fr', s[2] + 'deg');
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
    if (from === to || GS.still()) { el.textContent = fmt(to); return; }
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
    if (GS.still()) { old.remove(); return; }
    var dir = parseFloat(v) < parseFloat(old.textContent) ? -1 : 1;
    old.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(' + (-90 * dir) + '%)', opacity: 0 }],
      { duration: 260, easing: 'ease-in', fill: 'forwards' }).onfinish = function () { old.remove(); };
    nu.animate([{ transform: 'translateY(' + (90 * dir) + '%)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }],
      { duration: 560, easing: GS.spring() });
  },

  // FLIP: items marked data-flip="key" glide from where they were to where
  // `mutate` puts them, instead of jumping.
  flip: function (container, mutate) {
    var first = {};
    container.querySelectorAll('[data-flip]').forEach(function (e) { first[e.dataset.flip] = e.getBoundingClientRect(); });
    mutate();
    if (GS.still()) return;
    container.querySelectorAll('[data-flip]').forEach(function (e) {
      var a = first[e.dataset.flip];
      if (!a) return;
      var b = e.getBoundingClientRect(), dx = a.left - b.left, dy = a.top - b.top;
      if (dx || dy) e.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: 600, easing: GS.spring() });
    });
  },

  // Segmented control: one thumb slides under the selected button.
  seg: function (seg) {
    var thumb = seg.querySelector('.seg-thumb'), fresh = !thumb;
    if (fresh) {
      thumb = document.createElement('span');
      thumb.className = 'seg-thumb';
      seg.insertBefore(thumb, seg.firstChild);
    }
    var on = seg.querySelector('button.on');
    thumb.classList.toggle('tie', !!on && on.classList.contains('tie'));
    if (!on || !on.offsetWidth) { thumb.style.opacity = '0'; return; }
    var jump = fresh || thumb.style.opacity === '0';
    if (jump) thumb.style.transition = 'none';
    thumb.style.opacity = '1';
    thumb.style.width = on.offsetWidth + 'px';
    thumb.style.transform = 'translateX(' + on.offsetLeft + 'px)';
    if (jump) { void thumb.offsetWidth; thumb.style.transition = ''; }
  },

  // Bottom sheet that follows the finger, rubber-bands upward, and is
  // flung away when the release velocity projects it past half its height.
  sheet: function (scrim) {
    var sheet = scrim.firstElementChild, start = null, dragging = false, hist = [];
    sheet.addEventListener('pointerdown', function (e) {
      if (sheet.scrollTop > 0) return;
      // grab it mid-flight: continue from where it is on screen
      var cur = GS.translateY(sheet);
      sheet.getAnimations().forEach(function (a) { a.cancel(); });
      sheet.style.transform = cur ? 'translateY(' + cur + 'px)' : '';
      start = e.clientY - cur;
      dragging = false;
      hist = [[e.timeStamp, cur]];
    });
    sheet.addEventListener('pointermove', function (e) {
      if (start === null) return;
      var dy = e.clientY - start;
      if (!dragging) {
        if (Math.abs(dy) < 8) return; // tap vs drag hysteresis
        dragging = true;
        try { sheet.setPointerCapture(e.pointerId); } catch (err) {}
      }
      var h = sheet.offsetHeight;
      var y = dy >= 0 ? dy : -GS.rubber(-dy, h);
      hist.push([e.timeStamp, y]);
      if (hist.length > 5) hist.shift();
      sheet.style.transform = 'translateY(' + y + 'px)';
      scrim.style.backgroundColor = 'rgba(0,0,0,' + (0.45 * Math.max(0, 1 - y / h)) + ')';
    });
    function end(e) {
      if (start === null) return;
      var was = dragging;
      start = null;
      dragging = false;
      if (!was) return;
      var a = hist[0], b = hist[hist.length - 1];
      var v = (b[1] - a[1]) / Math.max(1, b[0] - a[0]) * 1000; // px/s
      var cur = GS.translateY(sheet), h = sheet.offsetHeight;
      // Apple's momentum projection, deceleration 0.998
      if (e.type === 'pointerup' && cur + (v / 1000) * 0.998 / 0.002 > h / 2) {
        GS.closeSheet(scrim, null, v);
      } else {
        sheet.style.transform = '';
        scrim.style.backgroundColor = '';
        sheet.animate([{ transform: 'translateY(' + cur + 'px)' }, { transform: 'translateY(0)' }], { duration: 550, easing: GS.spring() });
      }
    }
    sheet.addEventListener('pointerup', end);
    sheet.addEventListener('pointercancel', end);
  },

  closeSheet: function (scrim, after, velocity) {
    if (!scrim.classList.contains('open')) return;
    var sheet = scrim.firstElementChild;
    var cur = GS.translateY(sheet), h = sheet.offsetHeight || 1;
    var dur = GS.still() ? 1 : velocity > 0 ? Math.max(160, Math.min(380, (h - cur) / velocity * 1000)) : 300;
    var done = function () {
      scrim.classList.remove('open');
      sheet.style.transform = '';
      scrim.style.backgroundColor = '';
      sheet.getAnimations().forEach(function (an) { an.cancel(); });
      scrim.getAnimations().forEach(function (an) { an.cancel(); });
      if (after) after();
    };
    sheet.getAnimations().forEach(function (an) { an.cancel(); });
    sheet.animate([{ transform: 'translateY(' + cur + 'px)' }, { transform: 'translateY(100%)' }],
      { duration: dur, easing: velocity > 0 ? 'cubic-bezier(0.2, 0.6, 0.4, 1)' : 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' }).onfinish = done;
    scrim.animate([{ backgroundColor: getComputedStyle(scrim).backgroundColor }, { backgroundColor: 'rgba(0,0,0,0)' }],
      { duration: dur, fill: 'forwards' });
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

addEventListener('resize', function () { document.querySelectorAll('.seg').forEach(GS.seg); });
