// jjh 블로그 스크립트: 다크 모드, 기록 검색, 코드 복사, 목차

(function () {
  'use strict';

  // 다크 모드
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  function isDark() {
    var t = root.dataset.theme;
    return t ? t === 'dark' : mq.matches;
  }
  function syncToggle() {
    if (!toggle) return;
    toggle.setAttribute('aria-pressed', String(isDark()));
  }
  if (toggle) {
    syncToggle();
    toggle.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncToggle();
    });
    mq.addEventListener && mq.addEventListener('change', syncToggle);
  }

  // 홈: 기록 검색과 스택 필터
  var q = document.getElementById('q');
  if (q) {
    var entries = Array.prototype.slice.call(document.querySelectorAll('.entry'));
    var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
    var count = document.getElementById('count');
    var empty = document.getElementById('empty');
    var stack = '';
    entries.forEach(function (el) {
      var h = el.querySelector('h3');
      var c = el.querySelector('.sub code') || el.querySelector('.sub');
      el._h = h ? h.textContent : '';
      el._c = c ? c.textContent : '';
      el._s = (el.getAttribute('data-search') || '').toLowerCase();
    });

    function esc(s) {
      return s.replace(/[&<>"']/g, function (ch) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
      });
    }
    function mark(text, term) {
      if (!term) return esc(text);
      var i = text.toLowerCase().indexOf(term);
      if (i < 0) return esc(text);
      return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + term.length)) + '</mark>' + esc(text.slice(i + term.length));
    }
    // 긴 에러 로그를 붙여넣어도 찾을 수 있게 단어 단위로도 비교한다.
    function matches(hay, term) {
      if (!term) return true;
      if (hay.indexOf(term) >= 0) return true;
      var words = term.split(/[\s'"`:()\[\]{},;]+/).filter(function (w) { return w.length > 2; });
      if (words.length < 2) return false;
      var hit = words.filter(function (w) { return hay.indexOf(w) >= 0; }).length;
      return hit / words.length >= 0.6;
    }

    function render() {
      var term = q.value.trim().toLowerCase();
      var shown = 0;
      entries.forEach(function (el) {
        var ok = (!stack || el.getAttribute('data-stack') === stack) && matches(el._s, term);
        el.hidden = !ok;
        if (ok) shown++;
        var h = el.querySelector('h3');
        var c = el.querySelector('.sub code') || el.querySelector('.sub');
        if (h) h.innerHTML = mark(el._h, term);
        if (c) c.innerHTML = mark(el._c, term);
      });
      document.querySelectorAll('.month').forEach(function (m) {
        m.hidden = !m.querySelector('.entry:not([hidden])');
      });
      count.textContent = '글 ' + shown + '편';
      empty.hidden = shown > 0;
    }

    q.addEventListener('input', render);
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        stack = chip.getAttribute('data-stack');
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        render();
      });
    });
    document.getElementById('reset').addEventListener('click', function () {
      q.value = '';
      stack = '';
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-stack') === '')); });
      render();
      q.focus();
    });
  }

  // 글: 코드 블록에 언어 이름과 복사 버튼
  document.querySelectorAll('.prose div.highlighter-rouge').forEach(function (block) {
    var lang = (block.className.match(/language-(\S+)/) || [])[1] || '';
    if (lang === 'plaintext') lang = '';
    var wrap = document.createElement('div');
    wrap.className = 'code';
    var bar = document.createElement('div');
    bar.className = 'bar';
    var label = document.createElement('span');
    label.textContent = lang;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = '복사';
    btn.addEventListener('click', function () {
      var text = block.querySelector('pre').innerText;
      var done = function () {
        btn.textContent = '복사됨';
        setTimeout(function () { btn.textContent = '복사'; }, 1500);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
    });
    bar.appendChild(label);
    bar.appendChild(btn);
    block.parentNode.insertBefore(wrap, block);
    wrap.appendChild(bar);
    wrap.appendChild(block);
  });

  // 글: 목차
  var toc = document.getElementById('toc');
  var prose = document.querySelector('.post .prose');
  if (toc && prose) {
    var heads = Array.prototype.slice.call(prose.querySelectorAll('h1, h2'));
    if (heads.length >= 2) {
      var list = toc.querySelector('ol');
      var links = heads.map(function (h, i) {
        if (!h.id) h.id = 'section-' + (i + 1);
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#' + h.id;
        a.textContent = h.textContent;
        li.appendChild(a);
        list.appendChild(li);
        return a;
      });
      toc.hidden = false;
      var ticking = false;
      var update = function () {
        ticking = false;
        var current = 0;
        heads.forEach(function (h, i) {
          if (h.getBoundingClientRect().top < 120) current = i;
        });
        links.forEach(function (a, i) {
          if (i === current) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      };
      window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
      }, { passive: true });
      update();
    }
  }
})();
