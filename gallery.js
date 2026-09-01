(function(){
"use strict";

/* ============================================================
   CARROSSEL + FILTROS DE PLATAFORMA
   ============================================================ */
const track = document.getElementById('carTrack');
const dotsWrap = document.getElementById('carDots');
const prevBtn = document.getElementById('carPrev');
const nextBtn = document.getElementById('carNext');
const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));

if (track) {
  const allSlides = Array.from(track.querySelectorAll('.slide'));

  function visibleSlides(){
    return allSlides.filter(s => !s.classList.contains('is-hidden'));
  }

  function buildDots(){
    dotsWrap.innerHTML = '';
    visibleSlides().forEach((slide, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Ir para o slide ${i + 1}`);
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', () => {
        slide.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
      dotsWrap.appendChild(dot);
    });
  }

  function updateActiveDot(){
    const visible = visibleSlides();
    if (!visible.length) return;
    const trackRect = track.getBoundingClientRect();
    const center = trackRect.left + trackRect.width / 2;
    let closest = 0, closestDist = Infinity;
    visible.forEach((slide, i) => {
      const r = slide.getBoundingClientRect();
      const dist = Math.abs((r.left + r.width / 2) - center);
      if (dist < closestDist) { closestDist = dist; closest = i; }
    });
    Array.from(dotsWrap.children).forEach((dot, i) => dot.classList.toggle('is-active', i === closest));
  }

  function applyFilter(filter){
    allSlides.forEach(slide => {
      const match = filter === 'all' || slide.dataset.platform === filter;
      slide.classList.toggle('is-hidden', !match);
    });
    track.scrollLeft = 0;
    buildDots();
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      applyFilter(btn.dataset.filter);
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', () => {
    const slide = visibleSlides()[0];
    const step = slide ? slide.getBoundingClientRect().width + 16 : 300;
    track.scrollBy({ left: -step, behavior: 'smooth' });
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    const slide = visibleSlides()[0];
    const step = slide ? slide.getBoundingClientRect().width + 16 : 300;
    track.scrollBy({ left: step, behavior: 'smooth' });
  });

  let scrollTimeout;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveDot, 80);
  }, { passive: true });

  buildDots();
}

/* ============================================================
   LIGHTBOX — abre em tela cheia ao clicar em qualquer imagem do carrossel
   ============================================================ */
const overlay = document.getElementById('galOverlay');
if (overlay) {
  const imageEl = document.getElementById('galImage');
  const tagEl = document.getElementById('galTag');
  const titleEl = document.getElementById('galTitle');
  const counterEl = document.getElementById('galCounter');
  const closeBtn = document.getElementById('galClose');
  const prevLightboxBtn = document.getElementById('galPrev');
  const nextLightboxBtn = document.getElementById('galNext');

  const triggers = Array.from(document.querySelectorAll('[data-gallery-trigger]'));
  const slides = triggers.map(btn => {
    const card = btn.closest('.slide');
    const img = btn.querySelector('img');
    return {
      src: img ? img.getAttribute('src') : '',
      alt: img ? img.getAttribute('alt') : '',
      tag: card ? (card.querySelector('.slide-tag')?.textContent || '') : '',
      title: card ? (card.querySelector('h3')?.textContent || '') : '',
    };
  });

  let current = 0;

  function render(){
    const s = slides[current];
    if(!s) return;
    imageEl.src = s.src;
    imageEl.alt = s.alt;
    tagEl.textContent = s.tag;
    titleEl.textContent = s.title;
    counterEl.textContent = `${current + 1} / ${slides.length}`;
  }

  function open(index){
    current = index;
    render();
    overlay.hidden = false;
    requestAnimationFrame(()=> overlay.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close(){
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(()=>{ overlay.hidden = true; }, 260);
  }

  function next(){ current = (current + 1) % slides.length; render(); }
  function prev(){ current = (current - 1 + slides.length) % slides.length; render(); }

  triggers.forEach((btn, i) => {
    btn.addEventListener('click', () => open(i));
  });

  closeBtn.addEventListener('click', close);
  nextLightboxBtn.addEventListener('click', next);
  prevLightboxBtn.addEventListener('click', prev);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', e => {
    if (overlay.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  let touchStartX = null;
  overlay.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, {passive:true});
  overlay.addEventListener('touchend', e => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { dx > 0 ? prev() : next(); }
    touchStartX = null;
  }, {passive:true});
}

})();
