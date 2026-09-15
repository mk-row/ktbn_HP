/* =============================================
   KTBN - Motion & interaction
   ============================================= */

'use strict';

window.KTBN = window.KTBN || {};

(function () {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  /* =============================================
     Split text  ([data-split])
     ============================================= */
  function splitNode(node, counter) {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const word = document.createElement('span');
          word.className = 'word';
          [...part].forEach(ch => {
            const c = document.createElement('span');
            c.className = 'char';
            c.innerHTML = `<span style="--ci:${counter.i++}"></span>`;
            c.firstChild.textContent = ch;
            word.appendChild(c);
          });
          frag.appendChild(word);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1 && child.tagName !== 'BR') {
        splitNode(child, counter);
      }
    });
  }
  KTBN.split = function (scope = document) {
    scope.querySelectorAll('[data-split]:not(.split)').forEach(el => {
      if (el.classList.contains('glitch')) el.dataset.text = el.textContent.trim();
      el.setAttribute('aria-label', el.textContent.trim());
      splitNode(el, { i: 0 });
      el.classList.add('split');
      el.querySelectorAll('.word').forEach(w => w.setAttribute('aria-hidden', 'true'));
    });
  };
  KTBN.split();

  /* =============================================
     Japanese phrase wrapping fallback
     (browsers without `word-break: auto-phrase`, e.g. Safari)
     ============================================= */
  const PHRASE_SEL = 'h1, h2, h3, .news-row__title, .tl-item__title, .rule__title, .credo__text, .phero__desc, .sec-head__jp, [data-phrase]';
  const needPhrase = !(window.CSS && CSS.supports('word-break', 'auto-phrase')) && 'Segmenter' in Intl;
  const segmenter = needPhrase ? new Intl.Segmenter('ja', { granularity: 'word' }) : null;
  KTBN.phrase = function (scope = document) {
    if (!needPhrase) return;
    const els = scope.matches && scope.matches(PHRASE_SEL) ? [scope] : [];
    els.push(...scope.querySelectorAll(PHRASE_SEL));
    els.forEach(el => {
      if (el.dataset.phrased || el.closest('.split')) return;
      el.dataset.phrased = '1';
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(node => {
        if (node.parentElement.closest('.nb') || !/[぀-ヿ一-鿿]/.test(node.textContent)) return;
        const chunks = [];
        for (const { segment, isWordLike } of segmenter.segment(node.textContent)) {
          const prev = chunks[chunks.length - 1];
          const attach = prev !== undefined && (!isWordLike || /^[ぁ-ゟ]{1,2}$/.test(segment) || /^[ー、。，．」』）)!！?？]/.test(segment) || /[「『（(]$/.test(prev));
          if (attach) chunks[chunks.length - 1] += segment; else chunks.push(segment);
        }
        const frag = document.createDocumentFragment();
        chunks.forEach(c => {
          const s = document.createElement('span');
          s.className = 'nb';
          s.textContent = c;
          frag.appendChild(s);
        });
        node.replaceWith(frag);
      });
    });
  };
  KTBN.phrase();

  /* =============================================
     Reveal on scroll
     ============================================= */
  const REVEAL_SEL = '[data-reveal], .split, .stat, .tl-item, .manifesto, [data-observe]';
  let io = null;
  const pending = new Set();

  function applyStagger(scope) {
    scope.querySelectorAll('[data-stagger]').forEach(group => {
      const step = parseFloat(group.dataset.stagger) || 0.08;
      [...group.children].forEach((child, i) => {
        if (!child.style.getPropertyValue('--d')) child.style.setProperty('--d', `${(i * step).toFixed(2)}s`);
      });
    });
  }

  function onReveal(el) {
    el.classList.add('is-in');
    if (el.matches('[data-count]')) runCounter(el);
    el.querySelectorAll('[data-count]').forEach(runCounter);
    if (el.matches('[data-scramble]')) scramble(el);
  }

  KTBN.observe = function (scope = document) {
    if (scope !== document) KTBN.phrase(scope);
    applyStagger(scope);
    const els = scope.matches && scope.matches(REVEAL_SEL) ? [scope] : [];
    els.push(...scope.querySelectorAll(REVEAL_SEL));
    els.forEach(el => {
      if (el.classList.contains('is-in')) return;
      if (reduced) { onReveal(el); return; }
      if (io) io.observe(el); else pending.add(el);
    });
  };

  function startReveal() {
    io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        onReveal(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
    pending.forEach(el => io.observe(el));
    pending.clear();
    document.querySelectorAll('[data-scramble]:not([data-reveal])').forEach(el => io.observe(el));
  }
  KTBN.observe();

  /* =============================================
     Counters  ([data-count])
     ============================================= */
  function runCounter(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    const target = parseFloat(el.dataset.count);
    const target_el = el.querySelector('.count') || el;
    const dur = 1800;
    const t0 = performance.now();
    const tick = (now) => {
      const t = clamp((now - t0) / dur, 0, 1);
      target_el.textContent = Math.round(target * easeOut(t));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* =============================================
     Scramble text  ([data-scramble])
     ============================================= */
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>';
  function scramble(el) {
    if (el.dataset.scrambled) return;
    el.dataset.scrambled = '1';
    const final = el.textContent;
    const dur = 1100;
    const t0 = performance.now();
    const tick = (now) => {
      const t = clamp((now - t0) / dur, 0, 1);
      const locked = Math.floor(final.length * easeOut(t));
      el.textContent = [...final].map((ch, i) =>
        i < locked || ch === ' ' ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]).join('');
      if (t < 1) requestAnimationFrame(tick); else el.textContent = final;
    };
    requestAnimationFrame(tick);
  }

  /* =============================================
     Glitch pulses
     ============================================= */
  document.querySelectorAll('.glitch').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    if (reduced) return;
    const pulse = () => {
      el.classList.remove('is-glitching');
      void el.offsetWidth;
      el.classList.add('is-glitching');
      setTimeout(pulse, 2600 + Math.random() * 4200);
    };
    setTimeout(pulse, 2400 + Math.random() * 2000);
  });

  /* =============================================
     Marquee: fill the track then duplicate for a seamless loop
     ============================================= */
  document.querySelectorAll('.marquee').forEach(mq => {
    const track = mq.querySelector('.marquee__track');
    if (!track) return;
    const items = [...track.children];
    let guard = 0;
    while (track.scrollWidth < mq.clientWidth * 1.1 && guard++ < 20) {
      items.forEach(it => track.appendChild(it.cloneNode(true)));
    }
    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    mq.appendChild(clone);
  });

  /* =============================================
     Loader → page reveal
     ============================================= */
  const loader = document.querySelector('.loader');
  const wipe = document.querySelector('.wipe');
  const INTRO_KEY = 'ktbn-intro-seen';
  let seen = false;
  try { seen = sessionStorage.getItem(INTRO_KEY) === '1'; } catch (e) { /* storage blocked */ }

  function finishLoading() {
    if (loader) {
      loader.classList.add('is-done');
      setTimeout(() => loader.classList.add('is-gone'), 1100);
    }
    setTimeout(() => {
      root.classList.add('is-loaded');
      startReveal();
    }, seen ? 120 : 380);
    try { sessionStorage.setItem(INTRO_KEY, '1'); } catch (e) { /* ignore */ }
  }

  if (!loader || reduced) {
    finishLoading();
  } else if (seen) {
    loader.classList.add('is-quick');
    requestAnimationFrame(() => setTimeout(finishLoading, 60));
  } else {
    const count = loader.querySelector('.loader__count');
    const t0 = performance.now();
    const minDur = 1500;
    let loaded = document.readyState === 'complete';
    window.addEventListener('load', () => { loaded = true; });
    const tick = (now) => {
      const raw = clamp((now - t0) / minDur, 0, 1);
      const p = loaded ? easeOut(raw) : Math.min(easeOut(raw), 0.9);
      if (count) count.textContent = String(Math.round(p * 100)).padStart(3, '0');
      loader.style.setProperty('--load', p.toFixed(3));
      if (p >= 1) setTimeout(finishLoading, 180);
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // Page transition wipe on internal links
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || reduced || !wipe) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || a.target === '_blank' || a.hasAttribute('download')) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const url = new URL(href, location.href);
    if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
    if (url.pathname === location.pathname && url.hash) return;
    e.preventDefault();
    closeMenu();
    wipe.classList.add('is-active');
    setTimeout(() => { location.href = url.href; }, 680);
  });
  window.addEventListener('pageshow', (e) => {
    if (e.persisted && wipe) wipe.classList.remove('is-active');
  });

  /* =============================================
     Nav: scrolled / hide on scroll down / progress
     ============================================= */
  const nav = document.querySelector('.nav');
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.menu');
  const progress = document.querySelector('.scroll-progress');
  let lastY = scrollY;

  function openMenu() {
    burger.classList.add('is-open');
    menu.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'メニューを閉じる');
    menu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    nav.classList.remove('is-hidden');
  }
  function closeMenu() {
    if (!menu || !menu.classList.contains('is-open')) return;
    burger.classList.remove('is-open');
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'メニューを開く');
    menu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
  }
  KTBN.closeMenu = closeMenu;
  if (burger && menu) {
    burger.addEventListener('click', () => (menu.classList.contains('is-open') ? closeMenu() : openMenu()));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
    matchMedia('(min-width: 1081px)').addEventListener('change', (m) => { if (m.matches) closeMenu(); });
  }

  const ghosts = document.querySelectorAll('.sec-head__ghost');
  const footerWord = document.querySelector('.footer__word');

  function onScroll() {
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    if (nav) {
      nav.classList.toggle('is-scrolled', y > 20);
      const menuOpen = menu && menu.classList.contains('is-open');
      if (!menuOpen) nav.classList.toggle('is-hidden', y > 320 && y > lastY + 2);
      if (y < lastY - 2) nav.classList.remove('is-hidden');
    }
    lastY = y;

    if (!reduced) {
      ghosts.forEach(g => {
        const r = g.parentElement.getBoundingClientRect();
        const t = clamp(1 - (r.top + r.height / 2) / innerHeight, -0.5, 1.5);
        g.style.setProperty('--px', `${(-t * 80).toFixed(1)}px`);
      });
    }
    if (footerWord) {
      const r = footerWord.getBoundingClientRect();
      const t = clamp((innerHeight - r.top) / (r.height + innerHeight * 0.25), 0, 1);
      footerWord.style.setProperty('--fill', `${(t * 100).toFixed(1)}%`);
    }
    if (KTBN.onScroll) KTBN.onScroll.forEach(fn => fn(y));
  }
  KTBN.onScroll = [];
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  const toTop = document.querySelector('.to-top');
  if (toTop) toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));

  /* =============================================
     Cursor follower + magnetic buttons + hero parallax
     ============================================= */
  if (finePointer && !reduced) {
    const cursor = document.querySelector('.cursor');
    let tx = -100, ty = -100, cx = -100, cy = -100;
    addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    document.addEventListener('pointerleave', () => cursor && cursor.classList.add('is-hidden'));
    document.addEventListener('pointerenter', () => cursor && cursor.classList.remove('is-hidden'));
    document.addEventListener('pointerover', (e) => {
      if (!cursor) return;
      cursor.classList.toggle('is-hidden', !!e.target.closest('input, textarea, select'));
      cursor.classList.toggle('is-hover', !!e.target.closest('a, button, label, summary, [data-cursor]'));
    });
    const loop = () => {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      if (cursor) { cursor.style.setProperty('--x', `${cx.toFixed(1)}px`); cursor.style.setProperty('--y', `${cy.toFixed(1)}px`); }
      requestAnimationFrame(loop);
    };
    loop();

    document.addEventListener('pointermove', (e) => {
      const btn = e.target.closest('.btn, .icon-btn');
      document.querySelectorAll('.is-magnet').forEach(b => {
        if (b !== btn) { b.classList.remove('is-magnet'); b.style.translate = ''; }
      });
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      btn.classList.add('is-magnet');
      btn.style.translate = `${(dx * 10).toFixed(1)}px ${(dy * 8).toFixed(1)}px`;
    });

    const hero = document.querySelector('.hero');
    const ghost = document.querySelector('.hero__ghost');
    if (hero && ghost) {
      hero.addEventListener('pointermove', (e) => {
        const x = e.clientX / innerWidth - 0.5;
        const y = e.clientY / innerHeight - 0.5;
        ghost.style.setProperty('--mx', `${(x * -40).toFixed(1)}px`);
        ghost.style.setProperty('--my', `${(y * -30).toFixed(1)}px`);
      });
    }
  }

  /* =============================================
     Embers background
     ============================================= */
  (function embers() {
    const canvas = document.getElementById('ember-canvas');
    if (!canvas || reduced) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    let W = 0, H = 0, parts = [], running = true;

    function resize() {
      W = innerWidth; H = innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = W < 760 ? 26 : 60;
      while (parts.length < n) parts.push(spawn(true));
      parts.length = n;
    }
    function spawn(anywhere) {
      return {
        x: Math.random() * W,
        y: anywhere ? Math.random() * H : H + 10,
        r: Math.random() * 1.6 + 0.4,
        vy: -(Math.random() * 0.5 + 0.15),
        vx: (Math.random() - 0.5) * 0.25,
        a: Math.random() * 0.6 + 0.2,
        w: Math.random() * Math.PI * 2,
        hot: Math.random() < 0.18
      };
    }
    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.w += 0.02;
        p.x += p.vx + Math.sin(p.w) * 0.2;
        p.y += p.vy;
        if (p.y < -20) parts[i] = spawn(false);
        const fade = clamp(p.y / H, 0, 1);
        ctx.globalAlpha = p.a * fade;
        ctx.fillStyle = p.hot ? '#ff6a4a' : '#e0001b';
        ctx.shadowBlur = p.hot ? 12 : 6;
        ctx.shadowColor = '#ff2a3d';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.hot ? p.r * 1.4 : p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    addEventListener('resize', resize);
    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running) requestAnimationFrame(frame);
    });
    resize();
    frame();
  })();

  /* =============================================
     Tabs with sliding ink
     ============================================= */
  KTBN.tabs = function (tabsEl, onChange) {
    if (!tabsEl) return;
    let ink = tabsEl.querySelector('.tabs__ink');
    if (!ink) { ink = document.createElement('span'); ink.className = 'tabs__ink'; tabsEl.appendChild(ink); }
    const move = () => {
      const active = tabsEl.querySelector('.tab.is-active');
      if (!active) return;
      ink.style.width = `${active.offsetWidth}px`;
      ink.style.transform = `translateX(${active.offsetLeft}px)`;
    };
    tabsEl.addEventListener('click', (e) => {
      const tab = e.target.closest('.tab');
      if (!tab || tab.classList.contains('is-active')) return;
      tabsEl.querySelectorAll('.tab').forEach(t => { t.classList.toggle('is-active', t === tab); t.setAttribute('aria-selected', t === tab); });
      move();
      tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduced ? 'auto' : 'smooth' });
      onChange(tab.dataset.filter);
    });
    addEventListener('resize', move);
    if (document.fonts) document.fonts.ready.then(move);
    move();
  };

  /* Replay entrance on filtered items */
  KTBN.replay = function (els) {
    els.forEach((el, i) => {
      el.classList.remove('is-filtering');
      void el.offsetWidth;
      el.style.animationDelay = `${Math.min(i, 12) * 0.05}s`;
      el.classList.add('is-filtering');
    });
  };

  /* =============================================
     Toast
     ============================================= */
  let toastEl, toastTimer;
  KTBN.toast = function (msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    requestAnimationFrame(() => toastEl.classList.add('is-show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-show'), 3200);
  };

  /* =============================================
     Modal (shared shell)
     ============================================= */
  let modal, lastFocus, onCloseCb;
  function ensureModal() {
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="modal__backdrop" data-close></div>
      <div class="modal__panel">
        <button class="icon-btn modal__close" type="button" aria-label="閉じる" data-close>${KTBN.icons.close}</button>
        <div class="modal__media"></div>
        <div class="modal__body"></div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) KTBN.modal.close(); });
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') KTBN.modal.close();
      if (e.key === 'Tab') {
        const f = [...modal.querySelectorAll('button, a[href], input, select, textarea')].filter(x => !x.disabled && x.offsetParent);
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
    return modal;
  }
  KTBN.modal = {
    open({ media, body, label, onClose, onKey }) {
      const m = ensureModal();
      const wasOpen = m.classList.contains('is-open');
      m.querySelector('.modal__media').innerHTML = media;
      const b = m.querySelector('.modal__body');
      b.innerHTML = body;
      b.scrollTop = 0;
      m.querySelector('.modal__panel').scrollTop = 0;
      [...b.children].forEach((c, i) => c.style.setProperty('--i', i));
      KTBN.enhanceButtons(m);
      m.setAttribute('aria-label', label || '');
      onCloseCb = onClose;
      m.onkeydown = onKey || null;
      if (!wasOpen) {
        lastFocus = document.activeElement;
        document.body.classList.add('is-locked');
        requestAnimationFrame(() => m.classList.add('is-open'));
        setTimeout(() => m.querySelector('.modal__close').focus({ preventScroll: true }), 50);
      } else {
        b.classList.remove('is-swap');
        [...b.children].forEach(c => { c.style.transition = 'none'; c.style.opacity = '0'; c.style.transform = 'translateY(20px)'; });
        requestAnimationFrame(() => [...b.children].forEach(c => { c.style.transition = ''; c.style.opacity = ''; c.style.transform = ''; }));
      }
      return m;
    },
    close() {
      if (!modal || !modal.classList.contains('is-open')) return;
      modal.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      if (onCloseCb) onCloseCb();
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }
  };
})();
