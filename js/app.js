import { LivingArchiveWorld } from './world.js';
import { GenerativeAudio } from './audio.js';
import { profile, projects, skills, realms, commandEntries } from './data.js';

const $=(q,p=document)=>p.querySelector(q), $$=(q,p=document)=>[...p.querySelectorAll(q)];
const root=document.documentElement, body=document.body;
const world=new LivingArchiveWorld($('#webgl'));
const audio=new GenerativeAudio();
let current='home',transitioning=false,quality='high',commandIndex=0;

function routeBase(route){return route.startsWith('project/')?'project':route}
function realmForRoute(route){
  if(route.startsWith('project/'))return {id:'projects',name:'Artifact',subtitle:projects.find(p=>route.endsWith(p.slug))?.name||'Project',number:'01',palette:projectPalette(route)};
  return realms.find(r=>r.id===route)||realms[0];
}
function projectPalette(route){const p=projects.find(x=>route.endsWith(x.slug));return [p?.accent||'#fff','#6d55ff','#fff4d6']}
function setCSSPalette(route){const r=realmForRoute(route);const pal=r.palette||['#fff','#777','#111'];root.style.setProperty('--a',pal[0]);root.style.setProperty('--b',pal[1]);root.style.setProperty('--c',pal[2]);body.className=[...body.classList].filter(x=>!x.startsWith('realm-')).join(' ');body.classList.add(`realm-${route.startsWith('project/')?(route.includes('ruvigil')?'ruvigil':route.includes('phantom')?'phantom':'elif'):route}`)}

function buildUI(){
  $('#realm-rail').innerHTML=realms.map(r=>`<button class="realm-button magnetic" type="button" data-route="${r.id}" aria-label="${r.name}"><span>${r.number}</span><span class="realm-tip">${r.name} · ${r.subtitle}</span></button>`).join('');
  $('#project-orbit-ui').innerHTML=projects.map(p=>`<button type="button" class="project-orbit-card magnetic" data-route="project/${p.slug}" style="--project:${p.accent}"><small>${p.label}</small><strong>${p.name}</strong><p>${p.tagline}</p></button>`).join('');
  $('#skill-cloud').innerHTML=skills.map(s=>`<span class="skill-pill">${s.name}</span>`).join('');
  const links=[['GitHub',profile.links.github],['LinkedIn',profile.links.linkedin],['CTFtime',profile.links.ctftime],['GeomRavage',profile.links.team],['LinkTree',profile.links.linktree],['Telegram',profile.links.telegram]];
  $('#contact-links').innerHTML=links.map(([n,u])=>`<a class="contact-link magnetic" href="${u}" target="_blank" rel="noreferrer">${n} ↗</a>`).join('');
  const board=$('#map-board');
  const spots={home:[50,52],projects:[50,25],cyber:[22,72],about:[50,78],contact:[78,72]};
  board.insertAdjacentHTML('beforeend',realms.map(r=>`<button class="map-node magnetic" type="button" data-route="${r.id}" style="left:${spots[r.id][0]}%;top:${spots[r.id][1]}%;--node:${r.palette[0]}"><span><b>${r.name}</b><small>${r.subtitle}</small></span></button>`).join(''));
  bindRouteButtons();bindMagnetics();
}

function bindRouteButtons(){
  $$('[data-route]').forEach(el=>{if(el.dataset.bound)return;el.dataset.bound='1';el.addEventListener('click',e=>{if(el.tagName==='A')e.preventDefault();navigate(el.dataset.route)})})
}

function bindMagnetics(){
  $$('.magnetic').forEach(el=>{if(el.dataset.magnetic)return;el.dataset.magnetic='1';el.addEventListener('pointermove',e=>{if(innerWidth<980)return;const r=el.getBoundingClientRect(),x=e.clientX-(r.left+r.width/2),y=e.clientY-(r.top+r.height/2);el.style.transform=`translate(${x*.1}px,${y*.1}px)`});el.addEventListener('pointerleave',()=>el.style.transform='')})
}

function renderProject(route){
  const slug=route.split('/')[1],p=projects.find(x=>x.slug===slug);if(!p)return;
  $('#project-detail').innerHTML=`
    <div class="panel-kicker">${p.label}</div>
    <h1>${p.name}</h1><p class="tagline">${p.tagline}</p>
    <img class="project-poster" src="${p.poster}" alt="${p.name} project artwork" />
    <p class="long">${p.long}</p>
    <div class="tags">${p.stack.map(x=>`<span class="tag">${x}</span>`).join('')}</div>
    <div class="detail-meta"><div><small>Status</small><b>${p.status}</b></div><div><small>Year</small><b>${p.year}</b></div><div><small>Role</small><b>${p.role}</b></div></div>
    <div class="hero-buttons"><a class="cta primary magnetic" href="${p.repository}" target="_blank" rel="noreferrer">View repository ↗</a><button type="button" class="cta magnetic" data-route="projects">Back to archive ←</button></div>`;
  bindRouteButtons();bindMagnetics();
}

function updateHUD(route){
  const r=realmForRoute(route);$('#realm-number').textContent=r.number;$('#realm-name').textContent=r.name.toUpperCase();$('#realm-subtitle').textContent=r.subtitle.toUpperCase();
  $$('.realm-button').forEach(b=>b.classList.toggle('active',b.dataset.route===(route.startsWith('project/')?'projects':route)));
}

function swapView(route){
  const base=routeBase(route);$$('.view').forEach(v=>v.classList.toggle('active',v.dataset.view===base));if(base==='project')renderProject(route)
}

function flashTransition(){const t=$('#transition');t.classList.remove('active');void t.offsetWidth;t.classList.add('active');setTimeout(()=>t.classList.remove('active'),1050)}

export function navigate(route,{fromHash=false,instant=false}={}){
  if(!route)route='home';
  if(route.startsWith('project/')&&!projects.some(p=>route===`project/${p.slug}`))route='projects';
  if(route===current&&!instant){closeOverlays();return}
  current=route;transitioning=true;setCSSPalette(route);updateHUD(route);flashTransition();audio.setRealm(route);audio.blip();
  const delay=instant?0:300;
  setTimeout(()=>{swapView(route);world.setRoute(route,instant);transitioning=false},delay);
  if(!fromHash){const hash=`#/${route}`;if(location.hash!==hash)history.pushState(null,'',hash)}
  closeOverlays();
}

function hashRoute(){return location.hash.replace(/^#\//,'')||'home'}
addEventListener('hashchange',()=>navigate(hashRoute(),{fromHash:true}));
addEventListener('worldnavigate',e=>navigate(e.detail.route));
addEventListener('worldhover',e=>body.classList.toggle('cursor-active',e.detail.active));

function closeOverlays(){$('#map').classList.remove('open');$('#command').classList.remove('open')}
function toggleMap(){const m=$('#map');m.classList.toggle('open');$('#command').classList.remove('open')}
$('#map-btn').addEventListener('click',toggleMap);$('#map').addEventListener('click',e=>{if(e.target===$('#map'))toggleMap()});

function filterCommands(q=''){
  const needle=q.trim().toLowerCase();const results=commandEntries.filter(x=>!needle||`${x.label} ${x.keywords}`.toLowerCase().includes(needle)).slice(0,10);commandIndex=0;
  $('#command-results').innerHTML=results.map((r,i)=>`<button class="command-item ${i===0?'active':''}" type="button" data-cmd-route="${r.route}"><span>${r.label}</span><small>${r.route}</small></button>`).join('');
  $$('[data-cmd-route]').forEach((b,i)=>b.addEventListener('click',()=>navigate(b.dataset.cmdRoute)));return results
}
function toggleCommand(force){const c=$('#command');const open=force??!c.classList.contains('open');c.classList.toggle('open',open);$('#map').classList.remove('open');if(open){filterCommands();setTimeout(()=>$('#command-input').focus(),40)}else $('#command-input').blur()}
$('#command-btn').addEventListener('click',()=>toggleCommand());$('#command').addEventListener('click',e=>{if(e.target===$('#command'))toggleCommand(false)});$('#command-input').addEventListener('input',e=>filterCommands(e.target.value));
$('#command-input').addEventListener('keydown',e=>{const items=$$('.command-item');if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();commandIndex=(commandIndex+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;items.forEach((x,i)=>x.classList.toggle('active',i===commandIndex));items[commandIndex]?.scrollIntoView({block:'nearest'})}if(e.key==='Enter'&&items[commandIndex])navigate(items[commandIndex].dataset.cmdRoute)});

function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),1700)}
$('#sound-btn').addEventListener('click',async()=>{const on=await audio.toggle();$('#sound-btn').textContent=on?'◉':'◌';toast(on?'Generative ambience enabled':'Audio muted')});
$('#quality-btn').addEventListener('click',()=>{quality=quality==='high'?'low':'high';world.setQuality(quality);body.classList.toggle('low-fx',quality==='low');toast(`Render quality: ${quality.toUpperCase()}`)});

addEventListener('keydown',e=>{
  if(e.target.matches('input,textarea')){if(e.key==='Escape')toggleCommand(false);return}
  if(e.key==='/'){e.preventDefault();toggleCommand(true)}
  if(e.key.toLowerCase()==='m')toggleMap();
  if(e.key==='Escape')closeOverlays();
  if(/^[1-5]$/.test(e.key))navigate(realms[Number(e.key)-1]?.id||'home');
  if(e.key.toLowerCase()==='q')$('#quality-btn').click();
  if(e.key.toLowerCase()==='r'){world.resetView();toast('Camera orbit reset')}
  if(e.key.toLowerCase()==='f'){body.classList.toggle('focus-mode');toast(body.classList.contains('focus-mode')?'Focus mode · HUD hidden':'Focus mode off')}
});

function setupCursor(){const dot=$('#cursor-dot'),ring=$('#cursor-ring');let x=innerWidth/2,y=innerHeight/2,rx=x,ry=y;addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;dot.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`});function loop(){rx+=(x-rx)*.16;ry+=(y-ry)*.16;ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;requestAnimationFrame(loop)}loop();$$('a,button').forEach(el=>{el.addEventListener('mouseenter',()=>body.classList.add('cursor-active'));el.addEventListener('mouseleave',()=>body.classList.remove('cursor-active'))})}

function setupIntro(){const intro=$('#intro'),bar=$('#intro-bar'),pct=$('#intro-pct'),step=$('#intro-step');let p=0,done=false;const steps=['Generating worlds','Compiling neural geometry','Mapping project signals','Calibrating bloom field','Opening the archive'];const finish=()=>{if(done)return;done=true;p=100;bar.style.width='100%';pct.textContent='100%';step.textContent='Archive online';setTimeout(()=>intro.classList.add('done'),260);setTimeout(()=>navigate(hashRoute(),{fromHash:true,instant:true}),300)};const timer=setInterval(()=>{p=Math.min(96,p+Math.random()*9+2);bar.style.width=`${p}%`;pct.textContent=`${String(Math.floor(p)).padStart(2,'0')}%`;step.textContent=steps[Math.min(steps.length-1,Math.floor(p/22))];if(p>=96){clearInterval(timer);setTimeout(finish,350)}},110);$('#skip-intro').addEventListener('click',()=>{clearInterval(timer);finish()});}

function coordinatesLoop(){const copy=$('#coord-copy');let t=0;setInterval(()=>{t+=.017;copy.textContent=`REALM // ${(Math.sin(t)*41.7).toFixed(3)} / ${(Math.cos(t*.7)*78.2).toFixed(3)}`},160)}

buildUI();setupCursor();setupIntro();coordinatesLoop();
setCSSPalette('home');updateHUD('home');swapView('home');
