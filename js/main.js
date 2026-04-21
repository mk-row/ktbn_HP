/* =============================================
   KTBN - 血便 Gaming Clan
   Main JavaScript
   ============================================= */

'use strict';

/* ---- Page Loader ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.querySelector('.page-loader');
    if (loader) loader.classList.add('hidden');
  }, 900);
});

/* ---- Particle System ---- */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = Math.random() * -0.6 - 0.2;
      this.alpha = Math.random() * 0.6 + 0.1;
      this.life = Math.random() * 200 + 100;
      this.maxLife = this.life;
      const t = Math.random();
      if (t < 0.5) {
        this.r = 180 + Math.floor(Math.random() * 75);
        this.g = 0;
        this.b = 0;
      } else if (t < 0.8) {
        this.r = 80; this.g = 0; this.b = 0;
      } else {
        this.r = 220; this.g = 220; this.b = 220;
      }
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life--;
      this.alpha = (this.life / this.maxLife) * 0.7;
      if (this.life <= 0 || this.y < -10) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = `rgb(${this.r},${this.g},${this.b})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: 120 }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    // Draw connecting lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 80) * 0.08;
          ctx.strokeStyle = '#8B0000';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
    animId = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  loop();
})();

/* ---- Navigation ---- */
function initNav() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (!navbar || !hamburger || !navMenu) return;

  // Active link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.style.borderBottomColor = window.scrollY > 50
      ? 'rgba(200, 0, 0, 0.5)'
      : 'rgba(139, 0, 0, 0.4)';
  });

  // Mobile menu — use both click and touchend for maximum mobile compatibility
  function toggleMenu(e) {
    e.stopPropagation();
    const isOpen = hamburger.classList.toggle('open');
    navMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close when a nav link is tapped
  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close when tapping outside the menu
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

document.addEventListener('DOMContentLoaded', initNav);

/* ---- Scroll Reveal ---- */
(function initScrollReveal() {
  const items = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, (entry.target.dataset.delay || 0) * 1);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  items.forEach(item => observer.observe(item));
})();

/* ---- Counter Animation ---- */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = target / 60;
        const interval = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = Math.floor(current) + suffix;
          if (current >= target) clearInterval(interval);
        }, 16);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ---- Glitch Text Trigger ---- */
(function initGlitch() {
  document.querySelectorAll('.glitch').forEach(el => {
    el.dataset.text = el.textContent;
  });
})();

/* ---- Member Cards Loader ---- */
async function loadMembers(containerId, limit = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const res = await fetch('data/members.json');
    const members = await res.json();
    const displayed = limit ? members.slice(0, limit) : members;

    container.innerHTML = displayed.map((m, i) => `
      <div class="member-card member-card-full reveal" style="--delay:${i * 50}ms" data-delay="${i * 80}">
        <div class="member-avatar">
          <img src="${m.avatar}" alt="${m.name}" onerror="this.parentElement.innerHTML='<span>${m.name[0]}</span>'">
        </div>
        <div class="member-role">${m.role} · ${m.join_year}年加入</div>
        <div class="member-name glitch" data-text="${m.name}">${m.name}</div>
        <div class="member-games">
          ${m.games.map(g => `<span class="game-tag">${g}</span>`).join('')}
        </div>
        <p class="member-bio">${m.bio}</p>
        <div class="member-sns">
          ${m.sns.twitter ? `<a href="${m.sns.twitter}" class="sns-link" target="_blank" rel="noopener">TW</a>` : ''}
          ${m.sns.youtube ? `<a href="${m.sns.youtube}" class="sns-link" target="_blank" rel="noopener">YT</a>` : ''}
          ${m.sns.twitch ? `<a href="${m.sns.twitch}" class="sns-link" target="_blank" rel="noopener">TW.TV</a>` : ''}
        </div>
      </div>
    `).join('');

    // Trigger scroll reveal for dynamically loaded content
    setTimeout(() => {
      document.querySelectorAll('.reveal:not(.visible)').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 80);
      });
    }, 100);

  } catch (e) {
    container.innerHTML = '<p style="color:#888;text-align:center">メンバーデータを読み込めませんでした</p>';
  }
}

/* ---- History Timeline Loader ---- */
async function loadHistory(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const res = await fetch('data/history.json');
    const items = await res.json();

    container.innerHTML = items.map((item, i) => `
      <div class="timeline-item reveal">
        <div class="timeline-content">
          <span class="timeline-badge badge-${item.type}">${item.type === 'milestone' ? 'MILESTONE' : item.type === 'achievement' ? 'ACHIEVEMENT' : 'EVENT'}</span>
          <div class="timeline-date">${item.year}.${String(item.month).padStart(2, '0')}</div>
          <div class="timeline-title">${item.title}</div>
          <p class="timeline-desc">${item.description}</p>
        </div>
        <div class="timeline-dot">
          <div class="timeline-dot-inner">${item.icon}</div>
        </div>
        <div class="timeline-empty"></div>
      </div>
    `).join('');

    setTimeout(() => {
      document.querySelectorAll('.reveal:not(.visible)').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 100);
      });
    }, 100);

  } catch (e) {
    container.innerHTML = '<p style="color:#888;text-align:center">履歴データを読み込めませんでした</p>';
  }
}

/* ---- News Loader ---- */
async function loadNews(containerId, limit = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const res = await fetch('data/news.json');
    const items = await res.json();
    const displayed = limit ? items.slice(0, limit) : items;

    container.innerHTML = displayed.map((item, i) => `
      <div class="news-item ${item.important ? 'important' : ''} reveal" data-delay="${i * 60}">
        <div class="news-date">${item.date.replace(/-/g, '.')}</div>
        <div class="news-category">${item.category}</div>
        <div class="news-title">
          ${item.title}
          <span class="news-summary">${item.summary}</span>
        </div>
      </div>
    `).join('');

    setTimeout(() => {
      document.querySelectorAll('.reveal:not(.visible)').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 60);
      });
    }, 100);

  } catch (e) {
    container.innerHTML = '<p style="color:#888;text-align:center">ニュースを読み込めませんでした</p>';
  }
}

/* ---- Filter Tabs ---- */
function initFilterTabs(tabsSelector, cardsSelector, attr) {
  const tabs = document.querySelectorAll(tabsSelector);
  const cards = document.querySelectorAll(cardsSelector);
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || (card.dataset[attr] || '').includes(filter)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ---- Smooth Hover Ripple ---- */
document.addEventListener('mousemove', (e) => {
  document.querySelectorAll('.member-card, .shop-card, .credo-card').forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', x + '%');
    card.style.setProperty('--mouse-y', y + '%');
  });
});
