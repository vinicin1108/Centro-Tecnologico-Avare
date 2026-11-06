/* Centro Tecnológico UNEDUVALE — interações do site */

(function () {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Tema claro/escuro ---------- */
  function setupTheme() {
    const btn = document.querySelector('.theme-switch');
    if (!btn) return;

    const sync = () => {
      const dark = root.dataset.theme === 'dark';
      btn.setAttribute('aria-pressed', String(dark));
      btn.setAttribute('aria-label', dark ? 'Ativar modo claro' : 'Ativar modo escuro');
    };

    btn.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('theme', root.dataset.theme); } catch (e) { /* sem armazenamento */ }
      sync();
    });

    sync();
  }

  /* ---------- Menu mobile (gaveta lateral) ---------- */
  function setupMenu() {
    const btn = document.querySelector('.menu-toggle');
    const nav = document.getElementById('mainNav');
    const overlay = document.querySelector('.nav-overlay');
    if (!btn || !nav) return;

    nav.querySelectorAll('a').forEach((a, i) => a.style.setProperty('--i', i));

    const setOpen = (open) => {
      nav.classList.toggle('open', open);
      if (overlay) overlay.classList.toggle('show', open);
      document.body.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };

    btn.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
    if (overlay) overlay.addEventListener('click', () => setOpen(false));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 1180) setOpen(false); });
  }

  /* ---------- Rolagem: progresso, header, voltar ao topo, linha do tempo ---------- */
  function setupScroll() {
    const progress = document.querySelector('.read-progress');
    const header = document.querySelector('.site-header');
    const toTop = document.querySelector('.to-top');
    const timeline = document.querySelector('.timeline');
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, y / max) : 0;

      if (progress) progress.style.transform = `scaleX(${p})`;
      if (header) header.classList.toggle('scrolled', y > 10);
      if (toTop) {
        toTop.classList.toggle('show', y > 500);
        toTop.style.setProperty('--p', p.toFixed(3));
      }
      if (timeline) {
        const r = timeline.getBoundingClientRect();
        const seen = (window.innerHeight * 0.6 - r.top) / r.height;
        timeline.style.setProperty('--progress', Math.max(0, Math.min(1, seen)).toFixed(3));
      }
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    if (toTop) {
      toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
    }

    update();
  }

  /* ---------- Destaque da seção atual no menu ---------- */
  function setupScrollSpy() {
    const links = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
    if (!links.length || !('IntersectionObserver' in window)) return;

    const map = new Map();
    links.forEach((link) => {
      const section = document.getElementById(link.getAttribute('href').slice(1));
      if (section) map.set(section, link);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => l.classList.remove('active'));
        map.get(entry.target).classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    map.forEach((_, section) => observer.observe(section));
  }

  /* ---------- Entrada ao rolar + números + barras ---------- */
  function setupReveal() {
    document.querySelectorAll('[data-stagger]').forEach((group) => {
      Array.from(group.children).forEach((child, i) => {
        child.classList.add('reveal');
        child.style.setProperty('--d', `${i * 0.09}s`);
      });
    });

    const items = document.querySelectorAll('.reveal, .bars, .period');
    const counters = document.querySelectorAll('[data-count]');

    if (!('IntersectionObserver' in window) || reduceMotion) {
      items.forEach((el) => el.classList.add('visible'));
      counters.forEach((el) => { el.textContent = format(el, Number(el.dataset.count)); });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    items.forEach((el) => observer.observe(el));

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    counters.forEach((el) => counterObserver.observe(el));
  }

  function format(el, value) {
    const n = Math.round(value).toLocaleString('pt-BR');
    return `${el.dataset.prefix || ''}${n}${el.dataset.suffix || ''}`;
  }

  function countUp(el) {
    const target = Number(el.dataset.count);
    const start = Number(el.dataset.from || 0);
    const duration = 1600;
    const t0 = performance.now();

    const step = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = format(el, start + (target - start) * eased);
      if (t < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  /* ---------- Palavra que alterna no hero ---------- */
  function setupRotatingWord() {
    const el = document.querySelector('.rotating-word');
    if (!el || reduceMotion) return;

    const words = (el.dataset.words || '').split(',');
    let i = 0;

    setInterval(() => {
      el.classList.add('swap');
      setTimeout(() => {
        i = (i + 1) % words.length;
        el.textContent = words[i];
        el.classList.remove('swap');
      }, 300);
    }, 3000);
  }

  /* ---------- Efeitos de mouse (somente desktop) ---------- */
  function setupPointerEffects() {
    if (!finePointer || reduceMotion) return;

    // Luz do hero que segue o cursor
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.addEventListener('pointermove', (e) => {
        const r = hero.getBoundingClientRect();
        hero.style.setProperty('--mx', `${e.clientX - r.left}px`);
        hero.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    }

    // Brilho que segue o mouse nos cards
    document.querySelectorAll('.card.glow').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });

    // Inclinação 3D suave
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-6px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });

    // Botões "ímã"
    document.querySelectorAll('[data-magnetic]').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });
  }

  /* ---------- Onda ao clicar nos botões ---------- */
  function setupRipple() {
    if (reduceMotion) return;
    document.addEventListener('pointerdown', (e) => {
      const btn = e.target.closest('.btn');
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height);
      const span = document.createElement('span');
      span.className = 'ripple';
      span.style.width = span.style.height = `${size}px`;
      span.style.left = `${e.clientX - r.left - size / 2}px`;
      span.style.top = `${e.clientY - r.top - size / 2}px`;
      btn.appendChild(span);
      span.addEventListener('animationend', () => span.remove());
    });
  }

  /* ---------- Perguntas frequentes ---------- */
  function setupFaq() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach((item) => {
      const q = item.querySelector('.faq-question');
      q.addEventListener('click', () => {
        const open = !item.classList.contains('open');
        items.forEach((other) => {
          other.classList.remove('open');
          other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });
        item.classList.toggle('open', open);
        q.setAttribute('aria-expanded', String(open));
      });
    });
  }

  /* ---------- Abas ---------- */
  function setupTabs() {
    document.querySelectorAll('[role="tablist"]').forEach((list) => {
      const tabs = Array.from(list.querySelectorAll('[role="tab"]'));

      const select = (tab) => {
        tabs.forEach((t) => {
          const on = t === tab;
          t.setAttribute('aria-selected', String(on));
          t.tabIndex = on ? 0 : -1;
          document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
        });
      };

      tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => select(tab));
        tab.addEventListener('keydown', (e) => {
          const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
          if (!dir) return;
          const next = tabs[(i + dir + tabs.length) % tabs.length];
          select(next);
          next.focus();
        });
      });
    });
  }

  /* ---------- Formulário de contato ----------
     O site não tem servidor: o formulário abre o e-mail
     do visitante com a mensagem pronta. */
  function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name')).trim();
      const body = [
        `Nome: ${name}`,
        `E-mail: ${String(data.get('email')).trim()}`,
        `Curso de interesse: ${String(data.get('interest')).trim() || 'Não informado'}`,
        '',
        String(data.get('message')).trim()
      ].join('\n');

      window.location.href = `mailto:${form.dataset.to}?subject=${encodeURIComponent(`Contato pelo site — ${name}`)}&body=${encodeURIComponent(body)}`;
      showToast(`Obrigado, ${name}! Abrimos seu e-mail com a mensagem pronta. É só enviar.`);
    });
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupTheme();
    setupMenu();
    setupScroll();
    setupScrollSpy();
    setupReveal();
    setupRotatingWord();
    setupPointerEffects();
    setupRipple();
    setupFaq();
    setupTabs();
    setupContactForm();
  });
})();
