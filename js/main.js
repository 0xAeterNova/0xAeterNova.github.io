import { PortfolioWorld } from './world.js';
import { projects, skills } from './data.js';

const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

const els = {
  canvas: $('#world'), boot: $('#boot'), enter: $('#enterWorld'), hud: $('#hud'), telemetry: $('#telemetry'),
  controls: $('#controls'), mobileControls: $('#mobileControls'), quality: $('#qualityButton'), speed: $('#speedValue'),
  sector: $('#sectorValue'), interaction: $('#interaction'), interactionText: $('#interactionText'), transition: $('#routeTransition'),
  projectCards: $('#projectCards'), skillMatrix: $('#skillMatrix'), projectDetail: $('#projectDetail'), toast: $('#toast'),
  map: $('#mapOverlay'), mapButton: $('#mapButton'), mapClose: $('#mapClose'), mapPlayer: $('#mapPlayer')
};

let entered = false;
let currentPanel = null;
let routing = false;
let nearZone = null;
let toastTimer = null;
let mapOpen = false;

const world = new PortfolioWorld(els.canvas, {
  onSectorChange: sector => els.sector.textContent = sector,
  onNearZone: zone => {
    nearZone = zone;
    if (!entered || currentPanel || !zone) {
      els.interaction.classList.add('is-hidden');
      return;
    }
    els.interactionText.textContent = zone.id === 'home' ? 'OPEN HOME' : zone.id === 'security' ? 'OPEN CYBER' : zone.id.toUpperCase().replace('-', ' ');
    els.interaction.classList.remove('is-hidden');
  }
});
world.start();

function escapeHTML(str='') {
  return str.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

function renderProjects() {
  els.projectCards.innerHTML = projects.map(p => `
    <article class="project-card" tabindex="0" role="button" data-project="${p.slug}" style="--accent:${p.color}">
      <div class="project-card__visual">
        <canvas width="620" height="330" data-project-canvas="${p.slug}" aria-hidden="true"></canvas>
        <span class="project-card__index">PROJECT // ${p.index}</span>
        <span class="project-card__status">${escapeHTML(p.status)}</span>
      </div>
      <div class="project-card__body">
        <small>${escapeHTML(p.kicker)}</small>
        <h3>${escapeHTML(p.name)}</h3>
        <p>${escapeHTML(p.short)}</p>
      </div>
      <div class="project-card__footer"><span>${p.year} · ${p.stack.slice(0,2).join(' + ')}</span><b>↗</b></div>
    </article>
  `).join('');
  $$('[data-project]').forEach(card => {
    const open = () => openProject(card.dataset.project);
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    card.addEventListener('pointermove', e => {
      if (matchMedia('(pointer:coarse)').matches) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      card.style.transform = `translateY(-9px) perspective(900px) rotateX(${(-y*3.8).toFixed(2)}deg) rotateY(${(x*4.8).toFixed(2)}deg)`;
    });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  });
  initProjectCanvases();
}

function renderSkills() {
  els.skillMatrix.innerHTML = skills.map(s => `<div class="skill-group"><h4>${escapeHTML(s.group)}</h4><p>${s.items.map(escapeHTML).join(' · ')}</p></div>`).join('');
}

function initProjectCanvases() {
  const items = $$('[data-project-canvas]').map(canvas => ({ canvas, ctx: canvas.getContext('2d'), p: projects.find(p=>p.slug===canvas.dataset.projectCanvas) }));
  const draw = t => {
    for (const {canvas,ctx,p} of items) {
      if (!canvas.isConnected) continue;
      const w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);
      const grad=ctx.createRadialGradient(w*.5,h*.58,12,w*.5,h*.58,w*.55);grad.addColorStop(0,p.color+'33');grad.addColorStop(1,'#03071200');ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
      ctx.strokeStyle=p.color+'28';ctx.lineWidth=1;
      for(let x=-h;x<w+h;x+=36){ctx.beginPath();ctx.moveTo(x+(t*.018)%36,h);ctx.lineTo(x+h+(t*.018)%36,0);ctx.stroke()}
      ctx.save();ctx.translate(w*.5,h*.58);
      if(p.station==='sensor'){
        for(let i=0;i<5;i++){const a=i/5*Math.PI*2+t*.00025;const x=Math.cos(a)*95,y=Math.sin(a)*42;ctx.fillStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=16;ctx.fillRect(x-7,y-34,14,68);ctx.shadowBlur=0}
        ctx.strokeStyle=p.accent+'88';for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(0,0,45+i*34,20+i*13,0,0,Math.PI*2);ctx.stroke()}
      } else if(p.station==='ai'){
        ctx.strokeStyle=p.color+'cc';ctx.lineWidth=2;for(let i=0;i<4;i++){ctx.beginPath();ctx.ellipse(0,0,58+i*22,72-i*6,(t*.00022)*(i%2?1:-1),0,Math.PI*2);ctx.stroke()}
        ctx.fillStyle=p.color+'88';for(let i=0;i<11;i++){const a=i/11*Math.PI*2+t*.00018;ctx.beginPath();ctx.arc(Math.cos(a)*105,Math.sin(a)*55,4,0,Math.PI*2);ctx.fill()}
      } else {
        ctx.fillStyle='#0b1628';ctx.strokeStyle=p.color+'aa';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-105,55);ctx.lineTo(-105,-30);ctx.lineTo(-70,-62);ctx.lineTo(88,-62);ctx.lineTo(110,-28);ctx.lineTo(110,55);ctx.closePath();ctx.fill();ctx.stroke();
        for(let i=0;i<6;i++){ctx.fillStyle=i%2?p.color:p.accent;ctx.globalAlpha=.45+.3*Math.sin(t*.003+i);ctx.fillRect(-62+i*25,-20+(i%3)*16,15,4)}ctx.globalAlpha=1;
      }
      ctx.restore();
      const vg=ctx.createLinearGradient(0,0,0,h);vg.addColorStop(0,'#00000000');vg.addColorStop(1,'#030712cc');ctx.fillStyle=vg;ctx.fillRect(0,0,w,h);
    }
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
}


function toggleMap(force) {
  if (!entered || routing) return;
  mapOpen = typeof force === 'boolean' ? force : !mapOpen;
  els.map.classList.toggle('is-open', mapOpen);
  if (mapOpen) {
    world.pause(true);
    els.interaction.classList.add('is-hidden');
  } else if (!currentPanel) {
    world.pause(false);
  }
}

function updateMapPlayer() {
  const p = world.getPlayerPosition();
  const left = 50 + (p.x / 58) * 43;
  const top = 52 + (p.z / 58) * 43;
  els.mapPlayer.style.left = `${Math.max(4,Math.min(96,left))}%`;
  els.mapPlayer.style.top = `${Math.max(4,Math.min(96,top))}%`;
}

function showToast(text) {
  clearTimeout(toastTimer); els.toast.textContent=text; els.toast.classList.add('is-show');
  toastTimer=setTimeout(()=>els.toast.classList.remove('is-show'),1800);
}

function setHUDHidden(flag) {
  [els.telemetry, els.controls, els.mobileControls].forEach(el => el.classList.toggle('is-hidden', flag));
  els.interaction.classList.add('is-hidden');
}


function hydratePanelAssets(panel) {
  if (!panel) return;
  panel.querySelectorAll('[data-src]').forEach(el => {
    if (el.dataset.loaded) return;
    const target = el.dataset.src;
    el.dataset.loaded = '1';
    const pre = new Image();
    pre.decoding = 'async';
    pre.onload = () => { el.src = target; el.classList.add('asset-loaded'); };
    pre.src = target;
  });
}

function routePanel(route) {
  return $(`[data-page="${route}"]`);
}

function updateNav(route) {
  $$('.nav [data-route]').forEach(b=>b.classList.toggle('is-active',b.dataset.route===route));
}

async function cinematicTransition(action, label='TRAVERSING') {
  if (routing) return;
  routing=true;
  $('.route-transition__label').textContent=label;
  els.transition.classList.add('is-active');
  await new Promise(r=>setTimeout(r,360));
  await action();
  await new Promise(r=>setTimeout(r,170));
  els.transition.classList.remove('is-active');
  await new Promise(r=>setTimeout(r,470));
  routing=false;
}

function closePanelsInstant() {
  $$('.world-panel.is-open').forEach(p=>p.classList.remove('is-open'));
  currentPanel=null;
}

async function openRoute(route, { updateHash=true }={}) {
  if (!entered || routing) return;
  toggleMap(false);
  const panel=routePanel(route);
  if(!panel)return;
  hydratePanelAssets(panel);
  world.pause(true); setHUDHidden(true); updateNav(route);
  await cinematicTransition(async()=>{
    closePanelsInstant();
    await world.flyTo(route);
    panel.classList.add('is-open'); currentPanel=route;
    if(updateHash)history.replaceState(null,'',`#${route}`);
  }, `LINKING // ${route.toUpperCase()}`);
}

async function openProject(slug, { updateHash=true }={}) {
  if (!entered || routing) return;
  toggleMap(false);
  const p=projects.find(x=>x.slug===slug); if(!p)return;
  world.pause(true); setHUDHidden(true); updateNav('projects');
  els.projectDetail.innerHTML=`
    <div class="project-detail">
      <div class="project-detail__visual" data-code="WORLD NODE // ${p.index} · LIVE 3D STATION"></div>
      <section class="project-detail__body">
        <p class="eyebrow">PROJECT // ${p.index} · ${escapeHTML(p.kicker)}</p>
        <h2 style="--accent:${p.color}">${escapeHTML(p.name)}</h2>
        <p>${escapeHTML(p.description)}</p>
        <div class="detail-meta"><div><span>STATUS</span><b>${escapeHTML(p.status)}</b></div><div><span>YEAR</span><b>${p.year}</b></div><div><span>PRIMARY ROLE</span><b>DESIGN + IMPLEMENTATION</b></div><div><span>WORLD NODE</span><b>${p.slug.toUpperCase()}</b></div></div>
        <p><b>Contribution.</b> ${escapeHTML(p.contribution)}</p>
        <div class="detail-stack">${p.stack.map(x=>`<span>${escapeHTML(x)}</span>`).join('')}</div>
        <div class="detail-actions"><a href="${p.repository}" target="_blank" rel="noreferrer">OPEN REPOSITORY ↗</a><button class="text-link" data-back-projects>← ALL PROJECTS</button></div>
      </section>
    </div>`;
  $('[data-back-projects]',els.projectDetail).addEventListener('click',()=>openRoute('projects'));
  await cinematicTransition(async()=>{
    closePanelsInstant(); await world.flyTo(slug); $('#projectDetailPanel').classList.add('is-open'); currentPanel='project-detail';
    if(updateHash)history.replaceState(null,'',`#project/${slug}`);
  },`FOCUSING // ${p.name.toUpperCase()}`);
}

async function closePanel() {
  if (!currentPanel || routing) return;
  const prev=currentPanel;
  await cinematicTransition(async()=>{
    closePanelsInstant(); await world.returnToVehicle(); world.pause(false); setHUDHidden(false); updateNav(''); history.replaceState(null,'',location.pathname+location.search);
  },'RETURNING // DRIVE MODE');
  showToast(`${prev.toUpperCase().replace('-',' ')} CLOSED · DRIVE MODE ACTIVE`);
}

function interactNear() {
  if(currentPanel){closePanel();return}
  if(!nearZone){showToast('NO INTERACTIVE NODE IN RANGE');return}
  const id=nearZone.id;
  if(projects.some(p=>p.slug===id))openProject(id); else openRoute(id);
}

els.enter.addEventListener('click', async()=>{
  if(entered)return;entered=true;
  els.boot.classList.add('is-gone');
  els.hud.classList.remove('is-hidden');
  setHUDHidden(false);
  await new Promise(r=>setTimeout(r,620));
  const hash=location.hash.slice(1);
  if(hash.startsWith('project/'))openProject(hash.split('/')[1],{updateHash:false});
  else if(['home','projects','security','about','contact'].includes(hash))openRoute(hash,{updateHash:false});
  else showToast('WORLD ONLINE · WASD / ARROWS TO DRIVE');
});

$$('[data-route]').forEach(btn=>btn.addEventListener('click',()=>openRoute(btn.dataset.route)));
$$('.panel-close').forEach(btn=>btn.addEventListener('click',closePanel));
els.quality.addEventListener('click',()=>{const q=world.cycleQuality();els.quality.textContent=q.toUpperCase();showToast(`GRAPHICS // ${q.toUpperCase()}`)});
els.mapButton.addEventListener('click',()=>toggleMap());
els.mapClose.addEventListener('click',()=>toggleMap(false));
$$('[data-map-route]').forEach(btn=>btn.addEventListener('click',()=>openRoute(btn.dataset.mapRoute)));
$$('[data-map-project]').forEach(btn=>btn.addEventListener('click',()=>openProject(btn.dataset.mapProject)));

addEventListener('keydown',e=>{
  if(e.code==='KeyM'&&entered){e.preventDefault();toggleMap();return}
  if(e.code==='KeyR'&&entered&&!currentPanel){e.preventDefault();world.respawn();showToast('RESPAWN // HOME TRANSIT');return}
  if(e.key==='Escape'&&mapOpen){e.preventDefault();toggleMap(false);return}
  if(e.key==='Escape'&&currentPanel){e.preventDefault();closePanel()}
  if((e.key==='Enter'||e.code==='KeyE')&&entered&&!routing){
    const active=document.activeElement;
    if(active && ['BUTTON','A'].includes(active.tagName))return;
    e.preventDefault();interactNear();
  }
});

$$('[data-control]').forEach(btn=>{
  const c=btn.dataset.control;
  if(c==='interact'){btn.addEventListener('pointerdown',e=>{e.preventDefault();interactNear()});return}
  const start=e=>{e.preventDefault();world.setControl(c,true)};const stop=e=>{e.preventDefault();world.setControl(c,false)};
  btn.addEventListener('pointerdown',start);btn.addEventListener('pointerup',stop);btn.addEventListener('pointercancel',stop);btn.addEventListener('pointerleave',stop);
});

setInterval(()=>{els.speed.textContent=String(world.getSpeedKmh()).padStart(3,'0');if(mapOpen)updateMapPlayer()},90);
renderProjects();renderSkills();
