const year = document.querySelector('#current-year');
if (year) year.textContent = new Date().getFullYear();

const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('#nav-links');

function openLabel(){ return (window.PH_I18N && window.PH_I18N.t('nav.openMenu')) || 'Abrir menu'; }
function closeLabel(){ return (window.PH_I18N && window.PH_I18N.t('nav.closeMenu')) || 'Fechar menu'; }

function closeMenu() {
  if (!toggle || !navLinks) return;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', openLabel());
  navLinks.classList.remove('is-open');
  document.body.classList.remove('nav-open');
}

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    toggle.setAttribute('aria-label', isOpen ? openLabel() : closeLabel());
    navLinks.classList.toggle('is-open', !isOpen);
    document.body.classList.toggle('nav-open', !isOpen);
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('languagechange', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-label', isOpen ? closeLabel() : openLabel());
  });
}

const revealItems = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => observer.observe(item));
}

/* ============================================================
   Barra de progresso de leitura — discreta, no topo da página
   ============================================================ */
(function readingProgress(){
  const bar = document.createElement('div');
  bar.className = 'reading-progress';
  bar.innerHTML = '<span></span>';
  bar.setAttribute('aria-hidden', 'true');
  document.body.prepend(bar);
  const fill = bar.querySelector('span');

  function update(){
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0;
    fill.style.width = pct + '%';
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { update(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
