/* =============================================
   KTBN - Shared layout: nav / menu / footer / overlays / icons
   Loaded before main.js on every page.
   ============================================= */

'use strict';

window.KTBN = window.KTBN || {};

(function () {
  const ICONS = {
    drop: '<svg viewBox="0 0 40 55" aria-hidden="true"><path d="M20 1 L36.5 27.5 A18.5 18.5 0 1 1 3.5 27.5 Z"/><text x="20" y="41" text-anchor="middle" font-size="14" textLength="26" lengthAdjust="spacingAndGlyphs">KTBN</text></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 12h16M13 5l7 7-7 7"/></svg>',
    chevL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    chevR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 4v16M4 12h16"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 5h18v14H3z"/><path d="M3 6l9 7 9-7"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6z"/></svg>',
    twitch: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.57 4.71h1.72v5.15h-1.72zm4.72 0H18v5.15h-1.71zM6 0L1.71 4.29v15.42h5.15V24l4.28-4.29h3.43L22.29 12V0zm14.57 11.14l-3.43 3.43h-3.43l-3 3v-3H6.86V1.71h13.71z"/></svg>'
  };
  KTBN.icons = ICONS;

  const PAGES = [
    { href: 'index.html', label: 'TOP' },
    { href: 'members.html', label: 'MEMBERS' },
    { href: 'history.html', label: 'HISTORY' },
    { href: 'philosophy.html', label: 'PHILOSOPHY' },
    { href: 'shop.html', label: 'SHOP' },
    { href: 'news.html', label: 'NEWS' },
    { href: 'contact.html', label: 'CONTACT' }
  ];
  const SNS = [
    { href: 'https://twitter.com/', label: 'X / TWITTER', icon: 'x' },
    { href: 'https://youtube.com/', label: 'YOUTUBE', icon: 'youtube' },
    { href: 'https://twitch.tv/', label: 'TWITCH', icon: 'twitch' }
  ];
  KTBN.pages = PAGES;

  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  const brand = `
    <a href="index.html" class="brand" aria-label="血便 トップへ">
      <span class="brand__mark">${ICONS.drop}</span>
      <span class="brand__text"><span class="brand__jp">血便</span><span class="brand__en">BLOODY STORM</span></span>
    </a>`;

  /* ---- Nav ---- */
  const nav = document.createElement('header');
  nav.className = 'nav';
  nav.innerHTML = `
    ${brand}
    <nav class="nav__links" aria-label="メイン">
      ${PAGES.slice(1).map(p => `
        <a href="${p.href}" class="nav__link${p.href === current ? ' is-active' : ''}">
          <span class="roll"><span data-text="${p.label}">${p.label}</span></span>
        </a>`).join('')}
    </nav>
    <a href="contact.html" class="btn btn--sm nav__cta">JOIN US</a>
    <button class="burger" aria-label="メニューを開く" aria-expanded="false" aria-controls="site-menu"><span></span><span></span></button>`;

  /* ---- Mobile menu ---- */
  const menu = document.createElement('div');
  menu.className = 'menu';
  menu.id = 'site-menu';
  menu.setAttribute('aria-hidden', 'true');
  menu.innerHTML = `
    <ul class="menu__list">
      ${PAGES.map((p, i) => `
        <li class="menu__item"><a href="${p.href}" class="menu__link${p.href === current ? ' is-active' : ''}" style="--i:${i}">${p.label}</a></li>`).join('')}
    </ul>
    <div class="menu__foot">
      <span>BLEED OR GO HOME</span>
      <div class="menu__sns">${SNS.map(s => `<a href="${s.href}" target="_blank" rel="noopener">${s.label.split(' ')[0]}</a>`).join('')}</div>
    </div>`;

  /* ---- Footer ---- */
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="container">
      <div class="footer__top">
        <div class="footer__brand">
          ${brand}
          <a href="contact.html" class="btn btn--ghost">JOIN THE CLAN</a>
        </div>
        <div>
          <p class="footer__head">// SITEMAP</p>
          <div class="footer__nav">${PAGES.map(p => `<a href="${p.href}">${p.label}</a>`).join('')}</div>
        </div>
        <div>
          <p class="footer__head">// FOLLOW</p>
          <div class="footer__sns">${SNS.map(s => `<a href="${s.href}" target="_blank" rel="noopener">${ICONS[s.icon]}${s.label}</a>`).join('')}</div>
        </div>
      </div>
      <div class="footer__word" aria-hidden="true">BLOODY STORM</div>
    </div>
    <div class="footer__bottom container">
      <span>© 2019-${new Date().getFullYear()} BLOODY STORM GAMING. ALL RIGHTS RESERVED.</span>
      <button class="to-top" type="button">BACK TO TOP <span>${ICONS.arrow}</span></button>
    </div>`;

  /* ---- Overlays ---- */
  const extras = document.createDocumentFragment();
  const addEl = (tag, cls, html = '') => {
    const el = document.createElement(tag);
    el.className = cls;
    el.innerHTML = html;
    if (tag !== 'canvas') el.setAttribute('aria-hidden', 'true');
    extras.appendChild(el);
    return el;
  };
  addEl('div', 'scroll-progress');
  addEl('div', 'grain');
  addEl('div', 'cursor');
  addEl('div', 'wipe', '<span></span><span></span>');
  const canvas = document.createElement('canvas');
  canvas.id = 'ember-canvas';
  canvas.setAttribute('aria-hidden', 'true');

  const body = document.body;
  body.prepend(canvas);
  body.prepend(menu);
  body.prepend(nav);
  const main = document.querySelector('main');
  (main || body).after(footer);
  body.appendChild(extras);

  /* ---- Loader content (panels are in the HTML so the cover is instant) ---- */
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.insertAdjacentHTML('beforeend', `
      <div class="loader__line"></div>
      <div class="loader__center">
        <svg class="loader__mark" viewBox="0 0 40 55"><path d="M20 1 L36.5 27.5 A18.5 18.5 0 1 1 3.5 27.5 Z"/></svg>
        <div class="loader__word">BLOODY STORM</div>
        <div class="loader__count">000</div>
      </div>`);
  }

  /* ---- Button enhancement: label roll + arrow + shine ---- */
  KTBN.enhanceButtons = function (root = document) {
    root.querySelectorAll('.btn:not([data-enhanced])').forEach(btn => {
      const text = btn.textContent.trim().replace(/\s*→\s*$/, '');
      const noIcon = btn.hasAttribute('data-no-icon');
      btn.dataset.enhanced = '1';
      btn.innerHTML = `
        <span class="btn__label"><span data-text="${text}">${text}</span></span>
        ${noIcon ? '' : `<span class="btn__icon">${ICONS.arrow}${ICONS.arrow}</span>`}
        <span class="btn__shine"></span>`;
      if (!btn.getAttribute('aria-label')) btn.setAttribute('aria-label', text);
    });
  };
  KTBN.enhanceButtons();
})();
