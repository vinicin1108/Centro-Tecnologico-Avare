document.addEventListener('DOMContentLoaded', function() {
  setupDarkMode();
  setupCourseSlider();
  setupGradeTabs();
  setupCourseFilter();
  setupBurgerMenu();

  setupSmoothScrolling();
  setupScrollReveal();
  setupIntro();
  setupHeroHighlights();
  setupGrowthChart();
  setupStatNumbers();
  setupBackToTop();
  setupReadingProgress();
  setupFaqAccordion();
  setupScrollSpy();
  setupRippleEffect();
  setupTiltCards();
  setupStaggerAnimations();
  setupMouseGlow();
  setupCursorSpotlight();
  setupMagneticButtons();
  setupFlipCards();
  setupParallaxHero();
});

/* ================================
   NOVAS FUNCIONALIDADES JOVENs
   ================================ */

function setupParticles() {
  const container = document.getElementById('particlesContainer');
  if (!container) return;

  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
    particle.style.animationDelay = Math.random() * 5 + 's';
    particle.style.width = particle.style.height = (Math.random() * 4 + 2) + 'px';
    particle.style.opacity = Math.random() * 0.4 + 0.2;
    container.appendChild(particle);
  }
}

function setupCursorSpotlight() {
  const spotlight = document.getElementById('cursorSpotlight');
  if (!spotlight || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    spotlight.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    spotlight.style.opacity = '0';
  });

  function animateSpotlight() {
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;
    spotlight.style.left = currentX + 'px';
    spotlight.style.top = currentY + 'px';
    requestAnimationFrame(animateSpotlight);
  }
  animateSpotlight();
}

function setupMagneticButtons() {
  const buttons = document.querySelectorAll('.magnetic-btn');
  if (window.matchMedia('(pointer: coarse)').matches) return;

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

function setupFlipCards() {
  const cards = document.querySelectorAll('.flip-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });
}

function setupParallaxHero() {
  const hero = document.querySelector('.hero-section');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      hero.style.backgroundPositionY = (scrolled * 0.4) + 'px';
    }
  }, { passive: true });
}

/* ================================
   FUNCIONALIDADES ANTERIORES
   ================================ */

function setupReadingProgress() {
  const progressBar = document.getElementById('readingProgress');
  if (!progressBar) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  if (type === 'error') {
    toast.style.borderLeftColor = '#e74c3c';
  }

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}

// Exposto para uso em atributos onclick no HTML
window.showToast = showToast;


function setupFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      items.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const q = other.querySelector('.faq-question');
          if (q) q.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('active', !isActive);
      question.setAttribute('aria-expanded', String(!isActive));
    });
  });
}

function setupScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  const sidebarLinks = document.querySelectorAll('.sidebar-link[href^="#"]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });

        sidebarLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(section => observer.observe(section));
}

function setupRippleEffect() {
  const buttons = document.querySelectorAll('.btn, .faq-question, .slider-btn, .tab');

  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';

      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

function setupTiltCards() {
  const cards = document.querySelectorAll('.feature-card, .timeline-step, .solution-card, .testimonial-card, .impact-card, .stat-card');

  cards.forEach(card => {
    card.classList.add('tilt-card');
    const content = card.firstElementChild;
    if (content) content.classList.add('tilt-content');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

function setupStaggerAnimations() {
  const grids = document.querySelectorAll('.feature-grid, .timeline-grid, .solution-grid, .testimonials-grid, .stats-grid, .impact-grid, .faq-accordion, .cards-grid');

  grids.forEach(grid => {
    const items = grid.children;
    Array.from(items).forEach((item, index) => {
      item.classList.add('stagger-item');
      item.style.transitionDelay = (index * 0.1) + 's';
    });
  });

  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.stagger-item').forEach(el => staggerObserver.observe(el));
}

function setupMouseGlow() {
  const cards = document.querySelectorAll('.feature-card, .timeline-step, .solution-card, .testimonial-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });
}

function setupBackToTop() {
  const button = document.getElementById('backToTopBtn');
  if (!button) return;

  const toggleButton = () => {
    if (window.scrollY > 450) {
      button.classList.add('visible');
    } else {
      button.classList.remove('visible');
    }
  };

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', toggleButton, { passive: true });
  toggleButton();
}

function setupIntro() {
  const text = "Descubra o curso de Análise e Desenvolvimento de Sistemas na UNEDUVALE. Inovação, prática e empregabilidade aguardam você!";
  const typingText = document.getElementById('typingText');
  if (!typingText) return;

  typingText.classList.add('typing-cursor');
  let i = 0;
  function type() {
    if (i < text.length) {
      typingText.textContent += text.charAt(i);
      i++;
      setTimeout(type, 40);
    }
  }
  type();
  setTimeout(hideIntro, 3200);
}

function hideIntro() {
  const intro = document.getElementById('introScreen');
  if (intro) {
    intro.classList.add('hidden');
    setTimeout(() => {
      intro.style.display = 'none';
    }, 400);
  }
}

// Expondo funções usadas em atributos onclick/onsubmit
window.scrollToSection = scrollToSection;
window.handleForm = handleForm;
window.hideIntro = hideIntro;


function setupHeroHighlights() {
  const highlight = document.getElementById('heroHighlight');
  if (!highlight) return;
  const words = ['Inovação', 'Prática', 'Empregabilidade', 'Tecnologia', 'Sucesso'];
  let current = 0;
  setInterval(() => {
    highlight.style.opacity = '0';
    setTimeout(() => {
      highlight.textContent = words[current];
      highlight.style.opacity = '1';
      current = (current + 1) % words.length;
    }, 300);
  }, 3000);
}

function setupStatNumbers() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const target = parseInt(element.dataset.target, 10);
        let current = 0;
        const increment = Math.max(1, target / 30);
        const suffix = element.classList.contains('percent-number') ? '%' : '';

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            element.textContent = `${target}${suffix}`;
            clearInterval(timer);
          } else {
            element.textContent = `${Math.floor(current)}${suffix}`;
          }
        }, 35);

        observer.unobserve(element);
      }
    });
  }, { threshold: 0.35 });

  document.querySelectorAll('.stat-number, .percent-number').forEach(el => observer.observe(el));
}

function setupGrowthChart() {
  const canvas = document.getElementById('growthChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Empregabilidade', 'Estágio', 'Satisfação'],
      datasets: [{
        data: [92, 78, 96],
        backgroundColor: ['#ffd900', '#2657a4', '#0f243f'],
        hoverOffset: 20,
        borderColor: '#fff',
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: 'var(--text)',
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        title: {
          display: true,
          text: 'Impacto do ADS em números',
          color: 'var(--primary)',
          padding: { bottom: 12 }
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.label}: ${context.parsed}%`
          }
        }
      }
    }
  });
}

function setupDarkMode() {
  const btn = document.getElementById('darkModeBtn');
  if (!btn) return;
  const stored = localStorage.getItem('darkMode');
  const isDark = stored === 'true';

  if (isDark) {
    document.body.classList.add('dark-mode');
    btn.classList.add('active');
    btn.setAttribute('aria-label', 'Alternar para modo claro');
  } else {
    document.body.classList.remove('dark-mode');
    btn.classList.remove('active');
    btn.setAttribute('aria-label', 'Alternar para modo escuro');
  }

  btn.addEventListener('click', () => {
    const active = document.body.classList.toggle('dark-mode');
    btn.classList.toggle('active', active);
    localStorage.setItem('darkMode', active);
    btn.setAttribute('aria-label', active ? 'Alternar para modo claro' : 'Alternar para modo escuro');
  });
}

function setupCourseSlider() {
  const track = document.getElementById('sliderTrack');
  const dotsContainer = document.getElementById('sliderDots');
  if (!track || !dotsContainer) return;
  const items = document.querySelectorAll('.slide-item');
  let current = 0;

  function switchSlide(idx) {
    current = idx;
    track.style.transform = `translateX(-${idx * 100}%)`;
    Array.from(dotsContainer.children).forEach((dot, index) => {
      dot.classList.toggle('active', index === idx);
    });
  }

  function next() {
    current = (current + 1) % items.length;
    switchSlide(current);
  }

  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      current = (current - 1 + items.length) % items.length;
      switchSlide(current);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      next();
    });
  }

  for (let i = 0; i < items.length; i++) {
    const dot = document.createElement('button');
    dot.classList.add('slider-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => switchSlide(i));
    dotsContainer.appendChild(dot);
  }

  setInterval(next, 6000);
}

function setupGradeTabs() {
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(panel => panel.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.target);
      if (target) target.classList.add('active');
    });
  });
}

function setupCourseFilter() {
  const grid = document.getElementById('courseFilterGrid');
  if (!grid) return;

  const tabs = document.querySelectorAll('[data-course-filter]');
  const items = grid.querySelectorAll('[data-course-category]');
  if (!tabs.length || !items.length) return;

  function applyFilter(filter) {
    items.forEach(item => {
      const cat = item.getAttribute('data-course-category');
      const show = filter === 'todos' || filter === cat;
      item.style.display = show ? '' : 'none';
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      applyFilter(tab.getAttribute('data-course-filter'));
    });
  });

  applyFilter('todos');
}


function setupBurgerMenu() {
  const burger = document.getElementById('burgerBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const links = document.querySelectorAll('.sidebar-link');

  if (!burger || !sidebar || !overlay) return;

  const toggleSidebar = () => {
    sidebar.classList.toggle('open');
    sidebar.classList.toggle('closed');
    overlay.classList.toggle('open');
  };

  burger.addEventListener('click', toggleSidebar);
  overlay.addEventListener('click', toggleSidebar);

  links.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) {
        sidebar.classList.add('closed');
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
      }
    });
  });
}

function setupScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.glass-card, .slide-item, .news-card, .period-card, .feature-card, .timeline-step, .section-heading, .hero-content, .testimonial-card, .stats-grid, .faq-card').forEach(el => {
    el.classList.add('hidden');
    observer.observe(el);
  });
}

function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);

      // Se não existir âncora na página atual, não trava navegação.
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', `#${targetId}`);
    });
  });
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleForm(event) {
  event.preventDefault();
  const { name, email, interest } = event.target.elements;
  showToast(`Obrigado ${name.value}! Recebemos sua mensagem. Em breve entraremos em contato por ${email.value}.`);
  event.target.reset();
}

