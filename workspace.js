(function(){
"use strict";

/* ============================================================
   Ícones dos módulos do Business Case
   ============================================================ */
const ICONS = {
  contexto:'<svg viewBox="0 0 24 24" fill="none"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" stroke="currentColor" stroke-width="1.4"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.4"/></svg>',
  desafio:'<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.4"/><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.4"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>',
  diagnostico:'<svg viewBox="0 0 24 24" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M20 20l-5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  estrategia:'<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.4"/><path d="M15 9l-2 6-6 2 2-6 6-2z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>',
  solucao:'<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.4"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  arquitetura:'<svg viewBox="0 0 24 24" fill="none"><circle cx="6" cy="6" r="2.5" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="6" r="2.5" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="18" r="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M8 7.5L15 16M16 7.5L9 16M8.5 6H15.5" stroke="currentColor" stroke-width="1.3"/></svg>',
  resultados:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 2l2.6 6.9 7.4.4-5.7 4.8 1.9 7.2L12 17.3 5.8 21.3l1.9-7.2L2 9.3l7.4-.4z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>',
  aprendizados:'<svg viewBox="0 0 24 24" fill="none"><path d="M3 5c3-1.5 6-1.5 9 0v14c-3-1.5-6-1.5-9 0V5zM21 5c-3-1.5-6-1.5-9 0v14c3-1.5 6-1.5 9 0V5z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>'
};

const MODULE_IDS = ['contexto','desafio','diagnostico','estrategia','solucao','arquitetura','resultados','aprendizados'];
const DEFAULT_OPEN = ['contexto', 'resultados'];

function t(path){
  if (window.PH_I18N) {
    const v = window.PH_I18N.t(path);
    if (v !== null && v !== undefined) return v;
  }
  return '';
}
function moduleTitle(id){ return t('workspace.modules.' + id) || id; }
function isLive(id){ return id === 'solucao'; }

/* ============================================================
   Renderizadores — todo o texto vem do dicionário i18n ativo
   ============================================================ */
const RENDER = {
  contexto(){
    const c = 'workspace.content.contexto.';
    return `
      <div class="tw-section-title">${t(c+'sectionTitle')}</div>
      <p class="tw-p">${t(c+'p')}</p>
      <div class="tw-kpi-grid">
        <div class="tw-kpi-card"><div class="tw-label">${t(c+'k1l')}</div><div class="tw-value">${t(c+'k1v')}</div><div class="tw-sub">${t(c+'k1s')}</div></div>
        <div class="tw-kpi-card"><div class="tw-label">${t(c+'k2l')}</div><div class="tw-value" style="font-size:15px">${t(c+'k2v')}</div><div class="tw-sub">${t(c+'k2s')}</div></div>
        <div class="tw-kpi-card"><div class="tw-label">${t(c+'k3l')}</div><div class="tw-value" style="font-size:15px">${t(c+'k3v')}</div><div class="tw-sub">${t(c+'k3s')}</div></div>
        <div class="tw-kpi-card"><div class="tw-label">${t(c+'k4l')}</div><div class="tw-value" style="font-size:15px">${t(c+'k4v')}</div><div class="tw-sub">${t(c+'k4s')}</div></div>
      </div>`;
  },
  desafio(){
    const c = 'workspace.content.desafio.';
    return `
      <div class="tw-section-title">${t(c+'sectionTitle')}</div>
      <ul class="tw-node-list">
        <li><span class="tw-n-badge">01</span><div class="tw-n-text"><b>${t(c+'d1t')}</b><span>${t(c+'d1s')}</span></div></li>
        <li><span class="tw-n-badge">02</span><div class="tw-n-text"><b>${t(c+'d2t')}</b><span>${t(c+'d2s')}</span></div></li>
        <li><span class="tw-n-badge">03</span><div class="tw-n-text"><b>${t(c+'d3t')}</b><span>${t(c+'d3s')}</span></div></li>
      </ul>`;
  },
  diagnostico(){
    const c = 'workspace.content.diagnostico.';
    return `
      <div class="tw-section-title">${t(c+'sectionTitle')}</div>
      <p class="tw-p">${t(c+'p')}</p>
      <ul class="tw-node-list">
        <li><span class="tw-n-badge">A</span><div class="tw-n-text"><b>${t(c+'d1t')}</b><span>${t(c+'d1s')}</span></div></li>
        <li><span class="tw-n-badge">B</span><div class="tw-n-text"><b>${t(c+'d2t')}</b><span>${t(c+'d2s')}</span></div></li>
        <li><span class="tw-n-badge">C</span><div class="tw-n-text"><b>${t(c+'d3t')}</b><span>${t(c+'d3s')}</span></div></li>
      </ul>`;
  },
  estrategia(){
    const c = 'workspace.content.estrategia.';
    return `
      <div class="tw-section-title">${t(c+'sectionTitle')}</div>
      <p class="tw-p">${t(c+'p')}</p>
      <div class="tw-section-title">${t(c+'sectionTitle2')}</div>
      <ul class="tw-node-list">
        <li><span class="tw-n-badge">01</span><div class="tw-n-text"><b>${t(c+'d1t')}</b><span>${t(c+'d1s')}</span></div></li>
        <li><span class="tw-n-badge">02</span><div class="tw-n-text"><b>${t(c+'d2t')}</b><span>${t(c+'d2s')}</span></div></li>
        <li><span class="tw-n-badge">03</span><div class="tw-n-text"><b>${t(c+'d3t')}</b><span>${t(c+'d3s')}</span></div></li>
      </ul>`;
  },
  solucao(){
    const c = 'workspace.content.solucao.';
    const dict = window.PH_I18N ? window.PH_I18N.t('workspace.content.solucao.steps') : null;
    const steps = Array.isArray(dict) ? dict : [];
    return `
      <div class="tw-section-title">${t(c+'sectionTitle')}</div>
      <div class="tw-flow-row">${steps.map((s,i)=>`<div class="tw-flow-step"><div class="tw-flow-num">${String(i+1).padStart(2,'0')}</div><div class="tw-flow-text"><b>${s[0]}</b><span>${s[1]}</span></div></div>`).join('')}</div>
      <div class="tw-section-title">${t(c+'sectionTitle2')}</div>
      <div class="tw-badge-row">
        <span class="tw-badge tw-green">INTERESSE</span>
        <span class="tw-badge tw-rose">NEGATIVO</span>
        <span class="tw-badge tw-signal">AUTO_REPLY</span>
        <span class="tw-badge tw-gray">BOUNCE</span>
        <span class="tw-badge tw-rose">SPAM_REPORT</span>
        <span class="tw-badge tw-teal">INDEFINIDO</span>
      </div>
      <div class="tw-section-title">${t(c+'sectionTitle3')}</div>
      <div class="tw-cascade">
        <span class="tw-stage">${t(c+'stageLocal')}</span><span class="tw-arrow">→</span>
        <span class="tw-stage">${t(c+'stageCloud')}</span><span class="tw-arrow">→</span>
        <span class="tw-stage">${t(c+'stageFallback')}</span>
      </div>
      <p class="tw-p">${t(c+'p')}</p>`;
  },
  arquitetura(){
    const c = 'workspace.content.arquitetura.';
    return `
      <div class="tw-section-title">${t(c+'sectionTitle')}</div>
      <div class="tw-diagram-box">${archDiagram()}</div>
      <p class="tw-p">${t(c+'p')}</p>
      <div class="tw-section-title">${t(c+'sectionTitle2')}</div>
      <ul class="tw-node-list">
        <li><span class="tw-n-badge">01</span><div class="tw-n-text"><b>${t(c+'d1t')}</b><span>${t(c+'d1s')}</span></div></li>
        <li><span class="tw-n-badge">02</span><div class="tw-n-text"><b>${t(c+'d2t')}</b><span>${t(c+'d2s')}</span></div></li>
        <li><span class="tw-n-badge">03</span><div class="tw-n-text"><b>${t(c+'d3t')}</b><span>${t(c+'d3s')}</span></div></li>
      </ul>`;
  },
  resultados(){
    const c = 'workspace.content.resultados.';
    const items = [['r1t','r1s'],['r2t','r2s'],['r3t','r3s']];
    return `<div class="tw-section-title">${t(c+'sectionTitle')}</div>${items.map(([kt,ks])=>`<div class="tw-result-item"><div class="tw-result-check"><svg viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div><b>${t(c+kt)}</b><span>${t(c+ks)}</span></div></div>`).join('')}`;
  },
  aprendizados(){
    const c = 'workspace.content.aprendizados.';
    const items = [['a1t','a1s'],['a2t','a2s'],['a3t','a3s']];
    return `<div class="tw-section-title">${t(c+'sectionTitle')}</div>${items.map(([kt,ks])=>`<div class="tw-result-item"><div class="tw-result-check"><svg viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div><b>${t(c+kt)}</b><span>${t(c+ks)}</span></div></div>`).join('')}`;
  }
};

function archDiagram(){
  const c = 'workspace.content.arquitetura.';
  const core = t(c+'diagramCore'), coreSub = t(c+'diagramCoreSub');
  const exec = t(c+'diagramExec'), execSub = t(c+'diagramExecSub');
  const a = t(c+'diagramA'), aSub = t(c+'diagramASub');
  const bc = t(c+'diagramBC'), bcSub = t(c+'diagramBCSub');
  const label = t(c+'diagramLabel');
  return `<svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="twArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#6b6f79"/></marker></defs>
    <line x1="150" y1="150" x2="320" y2="80" stroke="#6b6f79" stroke-width="1.2" marker-end="url(#twArrow)"/>
    <line x1="320" y1="80" x2="150" y2="150" stroke="#6b6f79" stroke-width="1.2" marker-end="url(#twArrow)"/>
    <line x1="320" y1="220" x2="150" y2="150" stroke="#6b6f79" stroke-width="1.2" marker-end="url(#twArrow)"/>
    <line x1="150" y1="150" x2="320" y2="220" stroke="#6b6f79" stroke-width="1.2" marker-end="url(#twArrow)"/>
    <line x1="490" y1="150" x2="320" y2="80" stroke="#6b6f79" stroke-width="1.2" marker-end="url(#twArrow)"/>
    <line x1="320" y1="80" x2="490" y2="150" stroke="#6b6f79" stroke-width="1.2" marker-end="url(#twArrow)"/>
    <line x1="490" y1="150" x2="320" y2="220" stroke="#6b6f79" stroke-width="1.2" marker-end="url(#twArrow)"/>
    <line x1="320" y1="220" x2="490" y2="150" stroke="#6b6f79" stroke-width="1.2" marker-end="url(#twArrow)"/>
    <text x="320" y="150" text-anchor="middle" font-family="IBM Plex Mono" font-size="9.5" fill="#6b6f79">${label}</text>
    <rect x="70" y="122" width="160" height="56" rx="10" fill="#222735" stroke="rgba(255,90,54,.45)" stroke-width="1.2"/>
    <text x="150" y="146" text-anchor="middle" font-family="Fraunces" font-size="13" font-weight="600" fill="#f5f3ec">${core}</text>
    <text x="150" y="163" text-anchor="middle" font-family="IBM Plex Mono" font-size="9.5" fill="#6b6f79">${coreSub}</text>
    <rect x="250" y="52" width="140" height="52" rx="10" fill="#1b1f29" stroke="rgba(255,255,255,.16)" stroke-width="1.2"/>
    <text x="320" y="74" text-anchor="middle" font-family="Fraunces" font-size="12.5" font-weight="600" fill="#f5f3ec">${exec}</text>
    <text x="320" y="90" text-anchor="middle" font-family="IBM Plex Mono" font-size="9" fill="#6b6f79">${execSub}</text>
    <rect x="250" y="194" width="140" height="52" rx="10" fill="#1b1f29" stroke="rgba(255,255,255,.16)" stroke-width="1.2"/>
    <text x="320" y="216" text-anchor="middle" font-family="Fraunces" font-size="12.5" font-weight="600" fill="#f5f3ec">${a}</text>
    <text x="320" y="232" text-anchor="middle" font-family="IBM Plex Mono" font-size="9" fill="#6b6f79">${aSub}</text>
    <rect x="420" y="122" width="150" height="56" rx="10" fill="#1b1f29" stroke="rgba(255,255,255,.16)" stroke-width="1.2"/>
    <text x="495" y="146" text-anchor="middle" font-family="Fraunces" font-size="12.5" font-weight="600" fill="#f5f3ec">${bc}</text>
    <text x="495" y="163" text-anchor="middle" font-family="IBM Plex Mono" font-size="9" fill="#6b6f79">${bcSub}</text>
  </svg>`;
}

/* ============================================================
   Motor de janelas (escopo isolado ao overlay #twOverlay)
   ============================================================ */
function byId(id){ return document.getElementById(id); }

const overlay = byId('twOverlay');
if (overlay) {
  const openBtn = byId('openCaseWorkspace');
  const closeBtn = byId('twClose');
  const dock = byId('twDock');
  const canvas = byId('twCanvas');
  const empty = byId('twEmpty');
  const taskbar = byId('twTaskbar');
  const openCountEl = byId('twOpenCount');

  let zTop = 10;
  const openWindows = new Map();
  let built = false;

  function openWorkspace(){
    overlay.hidden = false;
    requestAnimationFrame(()=> overlay.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    if(!built){ buildDock(); DEFAULT_OPEN.forEach((id,i)=> openWindow(id,i)); built = true; }
  }
  function closeWorkspace(){
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(()=>{ overlay.hidden = true; }, 300);
  }

  if (openBtn) openBtn.addEventListener('click', openWorkspace);
  if (closeBtn) closeBtn.addEventListener('click', closeWorkspace);
  document.addEventListener('keydown', e=>{
    if(e.key === 'Escape' && !overlay.hidden) closeWorkspace();
  });

  function buildDock(){
    dock.innerHTML = MODULE_IDS.map(id=>`
      <button class="tw-dock-btn" data-module="${id}" aria-label="${moduleTitle(id)}">
        ${ICONS[id]}<span class="tw-tip">${moduleTitle(id)}</span>
      </button>`).join('');
    dock.querySelectorAll('.tw-dock-btn').forEach(btn=>{
      btn.addEventListener('click', ()=> toggleWindow(btn.dataset.module));
    });
  }

  function updateEmpty(){ empty.style.display = openWindows.size ? 'none' : 'flex'; }
  function updateCount(){
    const n = openWindows.size;
    const key = n===0 ? 'workspace.windowsOpen0' : n===1 ? 'workspace.windowsOpen1' : 'workspace.windowsOpenN';
    let text = t(key);
    if (n > 1) text = text.replace('{n}', n);
    openCountEl.textContent = text;
  }
  function refreshDock(){
    dock.querySelectorAll('.tw-dock-btn').forEach(b=> b.classList.toggle('is-open', openWindows.has(b.dataset.module)));
  }

  function toggleWindow(id){
    if(openWindows.has(id)){
      const w = openWindows.get(id);
      if(w.minimized){ restoreWindow(id); } else { focusWindow(id); }
    } else {
      openWindow(id);
    }
  }

  function windowInner(id){
    return `
      <div class="tw-win-header">
        <div class="tw-win-header-left">${ICONS[id]}${isLive(id) ? '<span class="tw-live"></span>' : ''}<span>${moduleTitle(id)}</span></div>
        <div class="tw-win-header-right">
          <button class="tw-win-btn tw-min-win" aria-label="Minimizar"><svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>
          <button class="tw-win-btn tw-close-win" aria-label="Fechar"><svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>
        </div>
      </div>
      <div class="tw-win-body">${RENDER[id] ? RENDER[id]() : ''}</div>
    `;
  }

  function openWindow(id, cascadeIndex){
    if(openWindows.has(id)){ restoreWindow(id); focusWindow(id); return; }
    if (MODULE_IDS.indexOf(id) === -1) return;
    const isMobile = window.innerWidth <= 860;
    const idx = cascadeIndex != null ? cascadeIndex : openWindows.size;
    const w = document.createElement('div');
    w.className = 'tw-win';
    w.style.width = '560px';
    w.style.height = '440px';
    const baseX = 30 + (idx % 4) * 30;
    const baseY = 20 + (idx % 4) * 26;
    w.style.transform = `translate(${baseX}px, ${baseY}px)`;
    w.dataset.x = baseX; w.dataset.y = baseY; w.dataset.id = id;
    w.innerHTML = windowInner(id);
    canvas.appendChild(w);
    openWindows.set(id, {el:w, minimized:false});

    w.querySelector('.tw-close-win').addEventListener('click', e=>{ e.stopPropagation(); closeWindow(id); });
    w.querySelector('.tw-min-win').addEventListener('click', e=>{ e.stopPropagation(); minimizeWindow(id); });
    w.addEventListener('pointerdown', ()=> focusWindow(id));
    if(!isMobile) makeDraggable(w, w.querySelector('.tw-win-header'));

    focusWindow(id);
    updateEmpty(); updateCount(); refreshDock();
  }

  function closeWindow(id){
    const w = openWindows.get(id);
    if(!w) return;
    w.el.classList.add('closing');
    setTimeout(()=> w.el.remove(), 200);
    openWindows.delete(id);
    removeChip(id);
    updateEmpty(); updateCount(); refreshDock();
  }

  function minimizeWindow(id){
    const w = openWindows.get(id);
    if(!w || w.minimized) return;
    w.minimized = true;
    w.el.classList.add('minimizing');
    setTimeout(()=>{ w.el.style.display='none'; w.el.classList.remove('minimizing'); }, 300);
    addChip(id);
    updateEmpty();
  }

  function restoreWindow(id){
    const w = openWindows.get(id);
    if(!w) return;
    w.minimized = false;
    w.el.style.display = 'flex';
    removeChip(id);
    focusWindow(id);
    updateEmpty();
  }

  function focusWindow(id){
    const w = openWindows.get(id);
    if(!w) return;
    canvas.querySelectorAll('.tw-win').forEach(el=> el.classList.remove('focused'));
    zTop += 1;
    w.el.style.zIndex = zTop;
    w.el.classList.add('focused');
  }

  function addChip(id){
    if(taskbar.querySelector(`[data-chip="${id}"]`)) return;
    const chip = document.createElement('button');
    chip.className = 'tw-chip';
    chip.dataset.chip = id;
    chip.innerHTML = `<span class="tw-chip-dot"></span><span class="tw-chip-label">${moduleTitle(id)}</span>`;
    chip.addEventListener('click', ()=> restoreWindow(id));
    taskbar.appendChild(chip);
    taskbar.classList.add('has-items');
  }
  function removeChip(id){
    const chip = taskbar.querySelector(`[data-chip="${id}"]`);
    if(chip) chip.remove();
    if(!taskbar.children.length) taskbar.classList.remove('has-items');
  }

  function makeDraggable(win, handle){
    let dragging=false, sx=0, sy=0, ox=0, oy=0;
    handle.addEventListener('pointerdown', e=>{
      if(e.target.closest('.tw-win-btn')) return;
      dragging = true;
      sx = e.clientX; sy = e.clientY;
      ox = parseFloat(win.dataset.x)||0; oy = parseFloat(win.dataset.y)||0;
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener('pointermove', e=>{
      if(!dragging) return;
      const rect = canvas.getBoundingClientRect();
      let nx = ox + (e.clientX - sx);
      let ny = oy + (e.clientY - sy);
      nx = Math.max(-200, Math.min(rect.width - 80, nx));
      ny = Math.max(0, Math.min(rect.height - 40, ny));
      win.style.transform = `translate(${nx}px, ${ny}px)`;
      win.dataset.x = nx; win.dataset.y = ny;
    });
    handle.addEventListener('pointerup', e=>{ dragging=false; try{ handle.releasePointerCapture(e.pointerId); }catch(_){} });
    handle.addEventListener('pointercancel', ()=> dragging=false);
  }

  /* Reagir à troca de idioma: refaz o dock, os títulos das janelas
     abertas, o conteúdo de cada uma, os chips minimizados e o contador. */
  window.addEventListener('languagechange', () => {
    if (built) buildDock();
    openWindows.forEach((w, id) => {
      w.el.innerHTML = windowInner(id);
      w.el.querySelector('.tw-close-win').addEventListener('click', e=>{ e.stopPropagation(); closeWindow(id); });
      w.el.querySelector('.tw-min-win').addEventListener('click', e=>{ e.stopPropagation(); minimizeWindow(id); });
    });
    document.querySelectorAll('.tw-chip').forEach(chip => {
      const label = chip.querySelector('.tw-chip-label');
      if (label) label.textContent = moduleTitle(chip.dataset.chip);
    });
    updateCount();
    refreshDock();
  });
}

})();
