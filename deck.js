(function(){
"use strict";

const deck = document.getElementById('deck');
if (!deck) return;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const cards = Array.from(deck.querySelectorAll('.deck-card'));
const total = cards.length;
const prevBtn = document.getElementById('deckPrev');
const nextBtn = document.getElementById('deckNext');
const progressWrap = document.getElementById('deckProgress');
const bgCanvas = document.getElementById('deckBg');

/* order[0] é a carta ativa (topo); as demais seguem o índice de profundidade */
let order = cards.map((_, i) => i);
let historyStack = []; // cartas descartadas, para permitir "voltar"

/* ============================================================
   Fundo ambiente — partículas suaves que herdam a cor da carta ativa
   ============================================================ */
const bg = (function setupBg(){
  if (!bgCanvas) return { setAccent(){} };
  const ctx = bgCanvas.getContext('2d');
  let W, H, particles = [], raf = null, visible = false, accent = '#ff5a36';

  function hexToRgb(hex){
    const m = hex.replace('#', '');
    const full = m.length === 3 ? m.split('').map(c => c + c).join('') : m;
    const n = parseInt(full, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function resize(){
    const rect = bgCanvas.getBoundingClientRect();
    W = bgCanvas.width = Math.max(1, rect.width) * devicePixelRatio;
    H = bgCanvas.height = Math.max(1, rect.height) * devicePixelRatio;
  }

  function initParticles(){
    const n = reduceMotion ? 0 : 14;
    particles = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: (30 + Math.random() * 50) * devicePixelRatio,
      vx: (Math.random() - 0.5) * 0.12 * devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.12 * devicePixelRatio,
      o: 0.04 + Math.random() * 0.05,
    }));
  }

  function frame(){
    ctx.clearRect(0, 0, W, H);
    const rgb = hexToRgb(accent);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -p.r) p.x = W + p.r; if (p.x > W + p.r) p.x = -p.r;
      if (p.y < -p.r) p.y = H + p.r; if (p.y > H + p.r) p.y = -p.r;
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      grad.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},${p.o})`);
      grad.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    });
    if (visible && !reduceMotion) raf = requestAnimationFrame(frame);
    else raf = null;
  }

  resize(); initParticles();
  window.addEventListener('resize', () => { resize(); initParticles(); });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      visible = entry.isIntersecting;
      if (visible && reduceMotion) frame();
      if (visible && !reduceMotion && !raf) frame();
    });
  }, { threshold: 0.1 });
  observer.observe(bgCanvas);

  return {
    setAccent(hex){ accent = hex; if (reduceMotion) frame(); }
  };
})();

/* ============================================================
   Progresso (bolinhas)
   ============================================================ */
function buildProgress(){
  progressWrap.innerHTML = '';
  cards.forEach(() => {
    const dot = document.createElement('span');
    dot.setAttribute('aria-hidden', 'true');
    progressWrap.appendChild(dot);
  });
}

function updateProgress(){
  const activeOriginalIndex = order[0];
  Array.from(progressWrap.children).forEach((dot, i) => {
    dot.classList.toggle('is-active', i === activeOriginalIndex);
  });
  const template = (window.PH_I18N && window.PH_I18N.t('about.deck.progressLabel')) || 'Cartão {n} de {total}';
  progressWrap.setAttribute('aria-label', template.replace('{n}', activeOriginalIndex + 1).replace('{total}', total));
  prevBtn.disabled = historyStack.length === 0;
}

/* ============================================================
   Layout da pilha
   ============================================================ */
function layout(){
  order.forEach((cardIndex, stackPos) => {
    const card = cards[cardIndex];
    card.style.setProperty('--stack-i', stackPos);
    card.style.setProperty('--accent', card.dataset.accent);
    card.dataset.active = stackPos === 0 ? 'true' : 'false';
    card.tabIndex = stackPos === 0 ? 0 : -1;
  });
  updateProgress();
  bg.setAccent(cards[order[0]].dataset.accent);
}

/* ============================================================
   Avançar (descartar a carta ativa)
   ============================================================ */
function advance(direction){
  if (order.length <= 1) return;
  const cardIndex = order[0];
  const card = cards[cardIndex];
  const dir = direction || { x: 0, y: -1, rot: 0 };

  card.classList.remove('is-dragging');
  card.classList.add('is-leaving');
  card.style.transform = `translate(${dir.x * 620}px, ${dir.y * 620}px) rotate(${dir.rot}deg)`;
  card.style.opacity = '0';

  historyStack.push(cardIndex);
  order = order.slice(1).concat(cardIndex);

  const onEnd = (e) => {
    if (e && e.propertyName && e.propertyName !== 'transform') return;
    card.classList.remove('is-leaving');
    card.style.transform = '';
    card.style.opacity = '';
    card.removeEventListener('transitionend', onEnd);
  };
  card.addEventListener('transitionend', onEnd);
  if (reduceMotion) onEnd();

  layout();
}

/* ============================================================
   Voltar (traz de volta a última carta descartada)
   ============================================================ */
function goBack(){
  if (!historyStack.length) return;
  const cardIndex = historyStack.pop();
  const card = cards[cardIndex];

  order = [cardIndex].concat(order.slice(0, -1));

  card.style.transition = 'none';
  card.style.transform = 'translate(0, -160%) rotate(-8deg)';
  card.style.opacity = '0';
  card.style.setProperty('--stack-i', 0);
  card.dataset.active = 'true';
  card.tabIndex = 0;

  requestAnimationFrame(() => {
    card.style.transition = '';
    card.classList.add('is-entering');
    card.style.transform = '';
    card.style.opacity = '';
  });

  const onEnd = (e) => {
    if (e && e.propertyName && e.propertyName !== 'transform') return;
    card.classList.remove('is-entering');
    card.removeEventListener('transitionend', onEnd);
  };
  card.addEventListener('transitionend', onEnd);
  if (reduceMotion) onEnd();

  layout();
}

/* ============================================================
   Arrastar (Pointer Events cobrem mouse + toque)
   ============================================================ */
function attachDrag(card){
  let startX = 0, startY = 0, dx = 0, dy = 0, dragging = false;
  const THRESHOLD = 110;

  card.addEventListener('pointerdown', (e) => {
    if (card.dataset.active !== 'true') return;
    dragging = true;
    startX = e.clientX; startY = e.clientY; dx = 0; dy = 0;
    card.classList.add('is-dragging');
    card.setPointerCapture(e.pointerId);
  });

  card.addEventListener('pointermove', (e) => {
    if (!dragging || reduceMotion) return;
    dx = e.clientX - startX;
    dy = e.clientY - startY;
    const rot = Math.max(-18, Math.min(18, dx * 0.06));
    card.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
  });

  function endDrag(e){
    if (!dragging) return;
    dragging = false;
    card.classList.remove('is-dragging');
    try { card.releasePointerCapture(e.pointerId); } catch(_){}

    const distance = Math.hypot(dx, dy);
    if (distance > THRESHOLD) {
      const norm = Math.max(Math.abs(dx), 1);
      advance({ x: dx / norm, y: dy / norm, rot: Math.max(-24, Math.min(24, dx * 0.08)) });
    } else if (distance < 6) {
      advance({ x: 0, y: -1, rot: 0 }); // clique simples: descarta pra cima
    } else {
      card.style.transform = ''; // não soltou o suficiente: volta pro centro
    }
  }

  card.addEventListener('pointerup', endDrag);
  card.addEventListener('pointercancel', endDrag);

  card.addEventListener('keydown', (e) => {
    if (card.dataset.active !== 'true') return;
    if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      advance({ x: 0, y: -1, rot: 0 });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goBack();
    }
  });
}

cards.forEach(attachDrag);
nextBtn.addEventListener('click', () => advance({ x: 0, y: -1, rot: 0 }));
prevBtn.addEventListener('click', goBack);

buildProgress();
layout();

window.addEventListener('languagechange', updateProgress);

})();
