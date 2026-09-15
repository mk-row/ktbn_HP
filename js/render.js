/* =============================================
   KTBN - Data rendering: members / news / history / shop
   ============================================= */

'use strict';

window.KTBN = window.KTBN || {};

(function () {
  const I = KTBN.icons;
  const cache = {};
  const getJSON = (url) => (cache[url] = cache[url] || fetch(url).then(r => {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  }));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const yen = (n) => '¥' + Number(n).toLocaleString('ja-JP');
  const fail = (el, msg) => { el.innerHTML = `<p style="color:var(--muted)">${msg}</p>`; };

  /* =============================================
     MEMBERS
     ============================================= */
  const ROLE_EN = { 'リーダー': 'LEADER', '副リーダー': 'SUB LEADER', 'メンバー': 'PLAYER' };
  const GENRES = [
    { key: 'shooter', label: 'SHOOTER', games: ['VALORANT', 'CS2', 'Rainbow Six Siege', 'Overwatch 2', 'CoD MW3', 'Escape from Tarkov', 'Splatoon 3'] },
    { key: 'br', label: 'BATTLE ROYALE', games: ['Apex Legends', 'Fortnite', 'PUBG'] },
    { key: 'moba', label: 'MOBA / STRATEGY', games: ['League of Legends', 'DOTA2', 'Teamfight Tactics'] },
    { key: 'fighting', label: 'FIGHTING', games: ['鉄拳8', 'ストリートファイター6', 'グラブルVS'] },
    { key: 'rpg', label: 'RPG / ACTION', games: ['原神', 'FF14', 'モンスターハンター', 'エルデンリング', 'ダークソウル3', 'SEKIRO'] },
    { key: 'casual', label: 'CASUAL', games: ['マインクラフト', 'テラリア', 'Stardew Valley', 'モンスト', 'Racket League', 'Rocket League'] }
  ];
  const genresOf = (m) => GENRES.filter(g => m.games.some(game => g.games.includes(game))).map(g => g.key);

  function hash(str) {
    let h = 2166136261;
    for (const ch of str) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  // Stylised player silhouette used until a real photo exists at m.avatar
  function portrait(m, uid) {
    const seed = hash(m.name);
    const gear = seed % 4;
    const initial = (m.name.match(/[A-Za-z0-9]/) || [m.name[0]])[0].toUpperCase();
    const id = `pt${uid}`;
    const tilt = 20 + (seed % 50);
    const glowX = 30 + (seed % 40);
    const hood = gear === 2 ? `<path d="M84 310 C66 206 98 124 150 124 C202 124 234 206 216 310 Z" fill="#111112" stroke="#e0001b" stroke-opacity=".35"/>` : '';
    const gearSvg = [
      `<path d="M92 204 C92 124 208 124 208 204" fill="none" stroke="#2a2a2c" stroke-width="10"/><rect x="82" y="186" width="20" height="44" rx="6" fill="#e0001b"/><rect x="198" y="186" width="20" height="44" rx="6" fill="#e0001b"/><path d="M90 226 C92 252 112 264 136 264" stroke="#3a3a3c" stroke-width="4" fill="none"/><circle cx="137" cy="264" r="5" fill="#e0001b"/>`,
      `<path d="M96 192 C96 128 204 128 204 192 Z" fill="#161618" stroke="#e0001b" stroke-opacity=".55" stroke-width="1.5"/><path d="M96 190 L236 198 L232 210 L98 204 Z" fill="#0b0b0c" stroke="#e0001b" stroke-opacity=".4"/>`,
      '',
      `<path d="M96 186 L204 186 L200 214 L100 214 Z" fill="#e0001b" fill-opacity=".9"/><path d="M104 196 H196" stroke="#fff" stroke-opacity=".45" stroke-width="2"/>`
    ][gear];
    const eyes = gear === 3 ? '' : `<path d="M122 202 h20 M158 202 h20" stroke="#ff2a3d" stroke-width="3.5" stroke-linecap="round"/>`;
    return `
<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(m.name)}">
  <defs>
    <linearGradient id="${id}bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#32040a"/><stop offset=".55" stop-color="#0e0e0f"/><stop offset="1" stop-color="#050505"/></linearGradient>
    <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#222224"/><stop offset="1" stop-color="#060606"/></linearGradient>
    <radialGradient id="${id}g" cx="${glowX}%" cy="42%" r="55%"><stop offset="0" stop-color="#e0001b" stop-opacity=".55"/><stop offset="1" stop-color="#e0001b" stop-opacity="0"/></radialGradient>
    <pattern id="${id}s" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(${tilt})"><rect width="1" height="9" fill="#fff" fill-opacity=".04"/></pattern>
    <pattern id="${id}l" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="#000" fill-opacity=".25"/></pattern>
  </defs>
  <rect width="300" height="400" fill="url(#${id}bg)"/>
  <rect width="300" height="400" fill="url(#${id}s)"/>
  <text x="150" y="350" text-anchor="middle" font-family="Bebas Neue, Impact, sans-serif" font-size="400" fill="none" stroke="#e0001b" stroke-opacity=".2" stroke-width="1.5">${esc(initial)}</text>
  <rect width="300" height="400" fill="url(#${id}g)"/>
  ${hood}
  <path d="M36 400 C42 318 88 286 150 286 C212 286 258 318 264 400 Z" fill="url(#${id}b)" stroke="#e0001b" stroke-opacity=".65" stroke-width="1.5"/>
  <path d="M128 248 L128 292 C138 300 162 300 172 292 L172 248 Z" fill="#0f0f10"/>
  <ellipse cx="150" cy="204" rx="52" ry="62" fill="url(#${id}b)" stroke="#e0001b" stroke-opacity=".75" stroke-width="1.5"/>
  ${eyes}
  ${gearSvg}
  <path d="M150 330 L162 350 A14 14 0 1 1 138 350 Z" fill="#e0001b"/>
  <rect width="300" height="400" fill="url(#${id}l)"/>
</svg>`;
  }

  // Swap the silhouette for a real photo when members.json has "photo": "images/avatars/xxx.jpg"
  function tryPhoto(container, m) {
    if (!m.photo || !container) return;
    const img = new Image();
    img.onload = () => {
      container.innerHTML = '';
      img.alt = m.name;
      container.appendChild(img);
    };
    img.src = m.photo;
  }

  function playerCard(m, i, { captain = false } = {}) {
    const role = ROLE_EN[m.role] || m.role;
    const lead = m.role !== 'メンバー';
    return `
      <button type="button" class="player${captain ? ' player--captain' : ''}" data-member="${i}" data-genres="${genresOf(m).join(' ')}" aria-label="${esc(m.name)} のプロフィールを見る">
        <div class="player__frame">
          <div class="player__art">${portrait(m, `${captain ? 'c' : 'g'}${i}`)}</div>
          <span class="player__no">${pad(i + 1)}</span>
          <span class="player__role${lead ? ' is-lead' : ''}">${esc(role)}</span>
          <div class="player__info">
            <p class="player__year">SINCE ${esc(m.join_year)}</p>
            <h3 class="player__name">${esc(m.name)}</h3>
            ${captain ? `<p class="player__bio">${esc(m.bio)}</p>` : ''}
            <div class="player__games">${m.games.map(g => `<span class="chip">${esc(g)}</span>`).join('')}</div>
            <span class="player__view"><i></i>VIEW PROFILE</span>
          </div>
        </div>
      </button>`;
  }

  function hydratePhotos(scope, members) {
    scope.querySelectorAll('.player[data-member]').forEach(card => {
      tryPhoto(card.querySelector('.player__art'), members[+card.dataset.member]);
    });
  }

  function openProfile(members, index, order) {
    const list = order || members.map((_, i) => i);
    let pos = list.indexOf(index);
    const show = () => {
      const i = list[pos];
      const m = members[i];
      const sns = [
        m.sns.twitter && `<a class="btn btn--sm btn--ghost" href="${esc(m.sns.twitter)}" target="_blank" rel="noopener">X / TWITTER</a>`,
        m.sns.youtube && `<a class="btn btn--sm btn--ghost" href="${esc(m.sns.youtube)}" target="_blank" rel="noopener">YOUTUBE</a>`,
        m.sns.twitch && `<a class="btn btn--sm btn--ghost" href="${esc(m.sns.twitch)}" target="_blank" rel="noopener">TWITCH</a>`
      ].filter(Boolean).join('');
      const modal = KTBN.modal.open({
        label: `${m.name} プロフィール`,
        media: `<div class="player__art" style="filter:none">${portrait(m, `m${i}`)}</div>`,
        body: `
          <p class="profile__kicker">No.${pad(i + 1)} — ${esc(ROLE_EN[m.role] || m.role)}</p>
          <h2 class="profile__name">${esc(m.name)}</h2>
          <dl class="profile__meta">
            <div><dt>ROLE</dt><dd>${esc(m.role)}</dd></div>
            <div><dt>JOINED</dt><dd>${esc(m.join_year)}</dd></div>
            <div><dt>TITLES</dt><dd>${m.games.length}</dd></div>
          </dl>
          <p class="profile__label">// MAIN GAMES</p>
          <div class="profile__games">${m.games.map((g, gi) => `<span class="chip${gi === 0 ? ' chip--red' : ''}">${esc(g)}</span>`).join('')}</div>
          <p class="profile__bio">${esc(m.bio)}</p>
          ${sns ? `<p class="profile__label">// FOLLOW</p><div class="profile__sns">${sns}</div>` : ''}
          <div class="profile__nav">
            <span>${pad(pos + 1)} / ${pad(list.length)}</span>
            <div>
              <button class="icon-btn" type="button" data-step="-1" aria-label="前のメンバー">${I.chevL}</button>
              <button class="icon-btn" type="button" data-step="1" aria-label="次のメンバー">${I.chevR}</button>
            </div>
          </div>`,
        onKey: (e) => {
          if (e.key === 'ArrowRight') step(1);
          if (e.key === 'ArrowLeft') step(-1);
        }
      });
      tryPhoto(modal.querySelector('.modal__media .player__art'), m);
      modal.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => step(+b.dataset.step)));
    };
    const step = (d) => { pos = (pos + d + list.length) % list.length; show(); };
    show();
  }

  // Index: horizontal rail of featured players
  KTBN.renderMemberRail = async function (railEl, barEl) {
    if (!railEl) return;
    try {
      const members = await getJSON('data/members.json');
      railEl.innerHTML = members.map((m, i) => `<div data-reveal="up" style="--d:${Math.min(i, 5) * 0.08}s">${playerCard(m, i)}</div>`).join('');
      hydratePhotos(railEl, members);
      railEl.addEventListener('click', (e) => {
        const card = e.target.closest('.player');
        if (card) openProfile(members, +card.dataset.member);
      });
      KTBN.observe(railEl);

      if (barEl) {
        const thumb = barEl.querySelector('.rail-bar__thumb');
        const prev = barEl.querySelector('[data-rail="-1"]');
        const next = barEl.querySelector('[data-rail="1"]');
        const update = () => {
          const max = railEl.scrollWidth - railEl.clientWidth;
          const ratio = railEl.clientWidth / railEl.scrollWidth;
          const track = thumb.parentElement.clientWidth;
          const p = max > 0 ? railEl.scrollLeft / max : 0;
          thumb.style.setProperty('--w', `${ratio * 100}%`);
          thumb.style.setProperty('--x', `${p * track * (1 - ratio)}px`);
          prev.disabled = railEl.scrollLeft < 4;
          next.disabled = railEl.scrollLeft > max - 4;
        };
        const stepBy = (d) => {
          const card = railEl.firstElementChild;
          const w = card ? card.getBoundingClientRect().width + 16 : 300;
          railEl.scrollBy({ left: d * w * Math.max(1, Math.floor(railEl.clientWidth / w) - 1), behavior: 'smooth' });
        };
        prev.addEventListener('click', () => stepBy(-1));
        next.addEventListener('click', () => stepBy(1));
        railEl.addEventListener('scroll', update, { passive: true });
        addEventListener('resize', update);
        update();
      }
    } catch (e) {
      fail(railEl, 'メンバーデータを読み込めませんでした');
    }
  };

  // Members page: captains + filterable grid
  KTBN.renderMembersPage = async function ({ captainsEl, gridEl, tabsEl, countEl }) {
    try {
      const members = await getJSON('data/members.json');
      const idx = members.map((_, i) => i);
      const captainIdx = idx.filter(i => members[i].role !== 'メンバー');
      const restIdx = idx.filter(i => members[i].role === 'メンバー');

      captainsEl.innerHTML = captainIdx.map((i, k) => `<div data-reveal="curtain" style="--d:${k * 0.15}s">${playerCard(members[i], i, { captain: true })}</div>`).join('');
      gridEl.innerHTML = restIdx.map(i => `<div class="player-cell" data-genres="${genresOf(members[i]).join(' ')}" data-reveal="up">${playerCard(members[i], i)}</div>`).join('');
      [...gridEl.children].forEach((c, k) => c.style.setProperty('--d', `${(k % 4) * 0.08}s`));
      hydratePhotos(captainsEl, members);
      hydratePhotos(gridEl, members);

      const counts = { all: members.length };
      GENRES.forEach(g => { counts[g.key] = members.filter(m => genresOf(m).includes(g.key)).length; });
      tabsEl.innerHTML = [{ key: 'all', label: 'ALL' }, ...GENRES].filter(g => counts[g.key])
        .map((g, k) => `<button type="button" role="tab" class="tab${k === 0 ? ' is-active' : ''}" aria-selected="${k === 0}" data-filter="${g.key}">${g.label}<sup>${pad(counts[g.key])}</sup></button>`).join('');

      let order = idx;
      const setCount = (n) => { if (countEl) countEl.textContent = `${pad(n)} PLAYERS`; };
      setCount(members.length);

      KTBN.tabs(tabsEl, (filter) => {
        const show = (genres) => filter === 'all' || genres.split(' ').includes(filter);
        const visibleCells = [];
        [...captainsEl.children, ...gridEl.children].forEach(cell => {
          const genres = cell.dataset.genres || cell.querySelector('.player').dataset.genres;
          const ok = show(genres);
          cell.hidden = !ok;
          if (ok) { visibleCells.push(cell); cell.classList.add('is-in'); }
        });
        captainsEl.hidden = ![...captainsEl.children].some(c => !c.hidden);
        order = visibleCells.map(c => +c.querySelector('.player').dataset.member);
        setCount(order.length);
        KTBN.replay(visibleCells);
      });

      const onClick = (e) => {
        const card = e.target.closest('.player');
        if (card) openProfile(members, +card.dataset.member, order);
      };
      captainsEl.addEventListener('click', onClick);
      gridEl.addEventListener('click', onClick);
      KTBN.observe(captainsEl);
      KTBN.observe(gridEl);
    } catch (e) {
      fail(gridEl, 'メンバーデータを読み込めませんでした');
    }
  };

  /* =============================================
     NEWS
     ============================================= */
  KTBN.renderNews = async function (listEl, { limit = null, tabsEl = null, countEl = null } = {}) {
    if (!listEl) return;
    try {
      const all = await getJSON('data/news.json');
      const items = limit ? all.slice(0, limit) : all;
      listEl.innerHTML = items.map((n, i) => `
        <button type="button" class="news-row" data-cat="${esc(n.category)}" aria-expanded="false" data-reveal="up" style="--d:${Math.min(i, 8) * 0.06}s">
          <span class="news-row__date">${esc(n.date.replace(/-/g, '.'))}</span>
          <span class="news-row__cat">${esc(n.category)}</span>
          <span class="news-row__title">
            ${n.important ? '<span class="news-row__pick">PICK UP</span>' : ''}${esc(n.title)}
            <span class="news-row__summary"><p>${esc(n.summary)}</p></span>
          </span>
          <span class="news-row__arrow">${I.arrow}</span>
        </button>`).join('');

      listEl.addEventListener('click', (e) => {
        const row = e.target.closest('.news-row');
        if (!row) return;
        const open = row.classList.toggle('is-open');
        row.setAttribute('aria-expanded', open);
      });
      KTBN.observe(listEl);

      const setCount = (n) => { if (countEl) countEl.textContent = `${pad(n)} ARTICLES`; };
      setCount(items.length);
      if (tabsEl) {
        const cats = [...new Set(items.map(n => n.category))];
        tabsEl.innerHTML = ['ALL', ...cats].map((c, k) => {
          const n = k === 0 ? items.length : items.filter(x => x.category === c).length;
          return `<button type="button" role="tab" class="tab${k === 0 ? ' is-active' : ''}" aria-selected="${k === 0}" data-filter="${k === 0 ? 'all' : esc(c)}">${esc(c)}<sup>${pad(n)}</sup></button>`;
        }).join('');
        KTBN.tabs(tabsEl, (filter) => {
          const visible = [];
          listEl.querySelectorAll('.news-row').forEach(row => {
            const ok = filter === 'all' || row.dataset.cat === filter;
            row.hidden = !ok;
            if (ok) { visible.push(row); row.classList.add('is-in'); }
          });
          setCount(visible.length);
          KTBN.replay(visible);
        });
      }
    } catch (e) {
      fail(listEl, 'ニュースを読み込めませんでした');
    }
  };

  /* =============================================
     HISTORY
     ============================================= */
  const TYPE_EN = { milestone: 'MILESTONE', achievement: 'ACHIEVEMENT', event: 'EVENT' };

  KTBN.renderHistory = async function (tlEl) {
    if (!tlEl) return;
    try {
      const items = await getJSON('data/history.json');
      const years = [...new Set(items.map(x => x.year))];
      tlEl.innerHTML = `<span class="tl__fill"></span>` + years.map(y => {
        const list = items.filter(x => x.year === y);
        return `
          <section class="tl-year" data-year="${y}">
            <div class="tl-year__label">
              <div class="tl-year__sticky">
                <span class="tl-year__num">${y}</span>
                <p class="tl-year__count">${pad(list.length)} ${list.length > 1 ? 'EVENTS' : 'EVENT'}</p>
              </div>
            </div>
            <div class="tl-year__items">
              ${list.map(x => `
                <article class="tl-item" data-reveal="right">
                  <span class="tl-item__dot"></span>
                  <div class="tl-item__card">
                    <p class="tl-item__month">${pad(x.month)}<small>MONTH</small></p>
                    <span class="tl-item__type tl-item__type--${esc(x.type)}">${TYPE_EN[x.type] || esc(x.type)}</span>
                    <h3 class="tl-item__title">${esc(x.title)}</h3>
                    <p class="tl-item__desc">${esc(x.description)}</p>
                    <span class="tl-item__icon" aria-hidden="true">${esc(x.icon)}</span>
                  </div>
                </article>`).join('')}
            </div>
          </section>`;
      }).join('');
      KTBN.observe(tlEl);

      const fill = tlEl.querySelector('.tl__fill');
      const yearEls = [...tlEl.querySelectorAll('.tl-year')];
      const update = () => {
        const r = tlEl.getBoundingClientRect();
        const mid = innerHeight * 0.55;
        const p = Math.min(1, Math.max(0, (mid - r.top) / r.height));
        fill.style.setProperty('--p', p.toFixed(4));
        let current = null;
        yearEls.forEach(el => { if (el.getBoundingClientRect().top < mid) current = el; });
        yearEls.forEach(el => el.classList.toggle('is-current', el === current));
      };
      KTBN.onScroll.push(update);
      addEventListener('resize', update);
      update();
    } catch (e) {
      fail(tlEl, '沿革データを読み込めませんでした');
    }
  };

  /* =============================================
     SHOP
     ============================================= */
  const CAT_LABEL = { apparel: 'APPAREL', accessories: 'ACCESSORIES', limited: 'LIMITED' };

  function openProduct(p) {
    const sizes = p.sizes ? `
      <p class="profile__label">// SIZE</p>
      <div class="sizes" role="radiogroup" aria-label="サイズ">
        ${p.sizes.map((s, i) => `<label class="size"><input type="radio" name="size" value="${esc(s)}"${i === Math.min(2, p.sizes.length - 1) ? ' checked' : ''}><span>${esc(s)}</span></label>`).join('')}
      </div>` : '';
    const modal = KTBN.modal.open({
      label: p.name,
      media: `<div class="studio pd__media"><img src="${esc(p.image)}" alt="${esc(p.name)}"></div>`,
      body: `
        <p class="profile__kicker">${p.category.map(c => CAT_LABEL[c] || c).join(' / ')}</p>
        <h2 class="profile__name">${esc(p.name)}</h2>
        <p class="pd__price">${yen(p.price)}<small>税込 / ${esc(p.unit)}</small></p>
        <p class="pd__desc">${esc(p.description)}</p>
        ${sizes}
        <div class="pd__buy">
          <div class="qty"><button type="button" data-qty="-1" aria-label="数量を減らす">−</button><output>1</output><button type="button" data-qty="1" aria-label="数量を増やす">＋</button></div>
          <button type="button" class="btn${p.soldOut ? ' is-disabled' : ''}" data-add>${p.soldOut ? 'SOLD OUT' : 'ADD TO CART'}</button>
        </div>
        <dl class="pd__specs">${Object.entries(p.specs || {}).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`
    });
    const out = modal.querySelector('.qty output');
    modal.querySelectorAll('[data-qty]').forEach(b => b.addEventListener('click', () => {
      out.textContent = Math.min(9, Math.max(1, +out.textContent + +b.dataset.qty));
    }));
    const add = modal.querySelector('[data-add]');
    if (add) add.addEventListener('click', () => KTBN.toast('デモサイトのため購入はできません。'));
  }

  KTBN.renderShop = async function ({ featureEl, gridEl, tabsEl }) {
    try {
      const products = await getJSON('data/shop.json');
      const feat = products.find(p => p.featured) || products[0];

      if (featureEl && feat) {
        featureEl.innerHTML = `
          <div class="feature__media studio" data-reveal="curtain">
            <span class="feature__tag">FEATURED</span>
            <img src="${esc(feat.image)}" alt="${esc(feat.name)}">
          </div>
          <div class="feature__body" data-stagger=".08">
            <p class="feature__kicker" data-reveal="up">WINTER COLLECTION 2024</p>
            <h2 class="feature__title" data-reveal="up">${esc(feat.name)}</h2>
            <p class="feature__text" data-reveal="up">${esc(feat.description)}</p>
            <p class="feature__price" data-reveal="up">${yen(feat.price)}<small>税込</small></p>
            <div class="feature__actions" data-reveal="up">
              <button type="button" class="btn" data-open="${esc(feat.id)}">VIEW DETAIL</button>
            </div>
          </div>`;
        KTBN.enhanceButtons(featureEl);
        KTBN.observe(featureEl);
      }

      gridEl.innerHTML = products.map((p, i) => `
        <article class="product${p.soldOut ? ' is-soldout' : ''}" data-cat="${p.category.join(' ')}" data-reveal="up" style="--d:${(i % 4) * 0.08}s">
          <button type="button" class="product__media studio" data-open="${esc(p.id)}" aria-label="${esc(p.name)} の詳細">
            <span class="product__badges">${p.badges.map(b => `<span class="badge${b === 'LIMITED' ? ' badge--white' : ''}">${esc(b)}</span>`).join('')}</span>
            <img src="${esc(p.image)}" alt="" loading="lazy">
            ${p.soldOut ? '<span class="soldout-stamp">SOLD OUT</span>' : ''}
            <span class="product__quick">QUICK VIEW ${I.plus}</span>
          </button>
          <div class="product__info">
            <p class="product__cat">${p.category.map(c => CAT_LABEL[c] || c).join(' / ')}</p>
            <h3 class="product__name">${esc(p.name)}</h3>
            <p class="product__price">${yen(p.price)}<small>/${esc(p.unit)}</small></p>
          </div>
        </article>`).join('');
      KTBN.observe(gridEl);

      document.addEventListener('click', (e) => {
        const t = e.target.closest('[data-open]');
        if (!t) return;
        const p = products.find(x => x.id === t.dataset.open);
        if (p) openProduct(p);
      });

      if (tabsEl) {
        const cats = ['all', 'apparel', 'accessories', 'limited'];
        tabsEl.innerHTML = cats.map((c, k) => {
          const n = c === 'all' ? products.length : products.filter(p => p.category.includes(c)).length;
          return `<button type="button" role="tab" class="tab${k === 0 ? ' is-active' : ''}" aria-selected="${k === 0}" data-filter="${c}">${c === 'all' ? 'ALL' : CAT_LABEL[c]}<sup>${pad(n)}</sup></button>`;
        }).join('');
        KTBN.tabs(tabsEl, (filter) => {
          const visible = [];
          gridEl.querySelectorAll('.product').forEach(el => {
            const ok = filter === 'all' || el.dataset.cat.split(' ').includes(filter);
            el.classList.toggle('is-filtered-out', !ok);
            if (ok) { visible.push(el); el.classList.add('is-in'); }
          });
          KTBN.replay(visible);
        });
      }
    } catch (e) {
      fail(gridEl, '商品データを読み込めませんでした');
    }
  };
})();
