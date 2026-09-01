(function(){
"use strict";

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   Intro: pergunta some via .reveal já existente (script.js).
   Depois de ~900ms, "digita" o subtítulo.
   ============================================================ */
const introEl = document.querySelector('.quem-intro');
const typedEl = document.getElementById('quemTypedText');
let typingDone = false;

function getTypedText(){
  return (window.PH_I18N && window.PH_I18N.t('about.intro.typed')) || 'Talvez a melhor forma seja deixar eu me apresentar.';
}

function typeWriter(el, text, speed){
  return new Promise(resolve => {
    if (reduceMotion) { el.textContent = text; resolve(); return; }
    let i = 0;
    (function step(){
      el.textContent = text.slice(0, i);
      i += 1;
      if (i <= text.length) { setTimeout(step, speed); }
      else resolve();
    })();
  });
}

if (introEl && typedEl && 'IntersectionObserver' in window) {
  let started = false;
  const introObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        setTimeout(() => typeWriter(typedEl, getTypedText(), 26).then(() => { typingDone = true; }), reduceMotion ? 0 : 900);
        introObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  introObserver.observe(introEl);
} else if (typedEl) {
  typedEl.textContent = getTypedText();
  typingDone = true;
}

/* Troca de idioma não deve reiniciar a animação de digitação —
   se já terminou (ou nunca chegou a rodar), só troca o texto na hora. */
window.addEventListener('languagechange', () => {
  if (typedEl && typingDone) typedEl.textContent = getTypedText();
});

/* ============================================================
   Acordeão "Conhecendo um pouco mais" — acessível e animado
   ============================================================ */
document.querySelectorAll('.accordion-trigger').forEach(trigger => {
  const panel = document.getElementById(trigger.getAttribute('aria-controls'));
  if (!panel) return;

  trigger.addEventListener('click', () => {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';

    if (isOpen) {
      panel.style.maxHeight = panel.scrollHeight + 'px';
      requestAnimationFrame(() => { panel.style.maxHeight = '0px'; });
      trigger.setAttribute('aria-expanded', 'false');
      const onEnd = (e) => {
        if (e.propertyName !== 'max-height') return;
        panel.hidden = true;
        panel.removeEventListener('transitionend', onEnd);
      };
      panel.addEventListener('transitionend', onEnd);
    } else {
      panel.hidden = false;
      panel.style.maxHeight = '0px';
      requestAnimationFrame(() => { panel.style.maxHeight = panel.scrollHeight + 'px'; });
      trigger.setAttribute('aria-expanded', 'true');
      const onEnd = (e) => {
        if (e.propertyName !== 'max-height') return;
        panel.style.maxHeight = 'none';
        panel.removeEventListener('transitionend', onEnd);
      };
      panel.addEventListener('transitionend', onEnd);
    }
  });
});

/* ============================================================
   Mensagem final: botão aparece com atraso, depois rola até #projetos
   ============================================================ */
const finalBlock = document.querySelector('.quem-final');
const finalBtn = document.getElementById('quemFinalBtn');

if (finalBlock && finalBtn && 'IntersectionObserver' in window) {
  let triggered = false;
  const finalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        setTimeout(() => {
          finalBtn.hidden = false;
          requestAnimationFrame(() => finalBtn.classList.add('is-visible'));
        }, reduceMotion ? 0 : 1800);
        finalObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  finalObserver.observe(finalBlock);
} else if (finalBtn) {
  finalBtn.hidden = false;
  finalBtn.classList.add('is-visible');
}

if (finalBtn) {
  finalBtn.addEventListener('click', () => {
    const targetValue = finalBtn.dataset.scrollTarget || '';
    if (targetValue.startsWith('#')) {
      const target = document.querySelector(targetValue);
      if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    } else if (targetValue) {
      window.location.href = targetValue;
    }
  });
}

})();
