/* Centro Tecnológico UNEDUVALE — scripts do site */

(function () {
  'use strict';

  const root = document.documentElement;
  root.classList.add('js');

  /* ---------- Tema claro/escuro ---------- */
  function setupThemeToggle() {
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;

    const update = () => {
      const dark = root.dataset.theme === 'dark';
      btn.setAttribute('aria-pressed', String(dark));
      btn.setAttribute('aria-label', dark ? 'Ativar modo claro' : 'Ativar modo escuro');
    };

    btn.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) { /* armazenamento indisponível */ }
      update();
    });

    update();
  }

  /* ---------- Menu mobile ---------- */
  function setupMenu() {
    const btn = document.querySelector('.menu-toggle');
    const nav = document.getElementById('mainNav');
    if (!btn || !nav) return;

    const setOpen = (open) => {
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };

    btn.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }

  /* ---------- Abas (tablist acessível) ---------- */
  function setupTabs() {
    document.querySelectorAll('[role="tablist"]').forEach((list) => {
      const tabs = Array.from(list.querySelectorAll('[role="tab"]'));

      const select = (tab) => {
        tabs.forEach((t) => {
          const selected = t === tab;
          t.setAttribute('aria-selected', String(selected));
          t.tabIndex = selected ? 0 : -1;
          const panel = document.getElementById(t.getAttribute('aria-controls'));
          if (panel) panel.hidden = !selected;
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

  /* ---------- Animação de entrada ---------- */
  function setupReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    items.forEach((el) => observer.observe(el));
  }

  /* ---------- Formulário de contato ----------
     O site não tem servidor; o formulário monta um e-mail
     e abre o aplicativo de e-mail do visitante. */
  function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get('name').trim();
      const subject = `Contato pelo site — ${name}`;
      const body = [
        `Nome: ${name}`,
        `E-mail: ${data.get('email').trim()}`,
        `Curso de interesse: ${data.get('interest').trim() || 'Não informado'}`,
        '',
        data.get('message').trim()
      ].join('\n');

      window.location.href = `mailto:${form.dataset.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      showToast('Abrimos seu aplicativo de e-mail com a mensagem pronta. É só enviar!');
    });
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  /* ---------- Ano no rodapé ---------- */
  function setupYear() {
    document.querySelectorAll('[data-year]').forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    setupMenu();
    setupTabs();
    setupReveal();
    setupContactForm();
    setupYear();
  });
})();
