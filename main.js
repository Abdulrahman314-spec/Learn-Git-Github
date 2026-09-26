document.addEventListener('DOMContentLoaded', function () {

  // 1) copy
  document.querySelectorAll('.mono').forEach(function (el) {
    if (!el.textContent.trim()) return;
    el.style.cursor = 'pointer';
    el.title = 'Click to copy';
    el.addEventListener('click', function (e) {
      e.stopPropagation();
      var text = el.innerText.replace(/\s+/g, ' ').trim();
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(text).then(function () {
        var original = el.style.color;
        el.style.color = '#ffffff';
        setTimeout(function () { el.style.color = original; }, 300);
      }).catch(function () {});
    });
  });

  // 2) Progress checklist for the 5 "start a new project" steps
  var STORE_KEY = 'git-flow-progress';
  var steps = document.querySelectorAll('.step-card[data-step]');
  var label = document.getElementById('progressLabel');
  var done = {};
  try { done = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { done = {}; }

  function updateLabel() {
    var count = Object.keys(done).filter(function (k) { return done[k]; }).length;
    label.textContent = count + ' / ' + steps.length + ' done \u00b7 click a step to check it off';
  }

  steps.forEach(function (card) {
    var id = card.getAttribute('data-step');
    if (done[id]) card.classList.add('done');
    card.addEventListener('click', function () {
      done[id] = !done[id];
      card.classList.toggle('done', done[id]);
      localStorage.setItem(STORE_KEY, JSON.stringify(done));
      updateLabel();
    });
  });
  updateLabel();

  // 3) تأثيرات loop
  var playBtn = document.getElementById('playLoop');
  var loopSteps = document.querySelectorAll('#loopRow .loop-step');
  if (playBtn) {
    playBtn.addEventListener('click', function () {
      playBtn.disabled = true;
      var i = 0;
      loopSteps.forEach(function (s) { s.classList.remove('active'); });
      var timer = setInterval(function () {
        loopSteps.forEach(function (s) { s.classList.remove('active'); });
        if (i < loopSteps.length) {
          loopSteps[i].classList.add('active');
          i++;
        } else {
          clearInterval(timer);
          loopSteps.forEach(function (s) { s.classList.remove('active'); });
          playBtn.disabled = false;
        }
      }, 550);
    });
  }

  // 4) تحويل الالوان صفحة 
  var toggle = document.getElementById('themeToggle');
  if (toggle) {
    var THEME_KEY = 'git-flow-theme';
    var themes = {
      navy: { accent: '#1e3a8a', bright: '#3b6ff0', soft: '#9fb6f5' },
      red:  { accent: '#b91c1c', bright: '#ef4444', soft: '#fca5a5' }
    };
    function applyTheme(name) {
      var t = themes[name] || themes.navy;
      document.documentElement.style.setProperty('--accent', t.accent);
      document.documentElement.style.setProperty('--accent-bright', t.bright);
      document.documentElement.style.setProperty('--accent-soft', t.soft);
      toggle.querySelectorAll('.swatch').forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-theme') === name);
      });
      localStorage.setItem(THEME_KEY, name);
    }
    toggle.querySelectorAll('.swatch').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyTheme(btn.getAttribute('data-theme'));
      });
    });
    var saved = localStorage.getItem(THEME_KEY);
    if (saved) applyTheme(saved);
  }
});