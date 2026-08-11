// ============================================================
// GameScorer — shared behavior helpers
// Pairs with the .screen / .screen.active classes in
// shared/base.css. Mark each top-level screen with
// class="screen" (plus class="active" on the one shown first),
// then call showScreen(id) to switch between them.
// ============================================================

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(function (s) {
    s.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}
