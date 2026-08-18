import { ImpossibleMachine } from './world.js';
import { SpatialAudio } from './audio.js';
import { profile, projects, skills, realms, commandEntries } from './data.js';

const $=(q,p=document)=>p.querySelector(q), $$=(q,p=document)=>[...p.querySelectorAll(q)];
const root=document.documentElement, body=document.body;
const world=new ImpossibleMachine($('#webgl'));
const audio=new SpatialAudio();
let current='home', commandIndex=0, tourTimer=null, tourOn=false;

const paletteFor=route=>{
  const p=route.startsWith('project/')?projects.find(x=>route===`project/${x.slug}`):null;
  if(p){if(p.realm==='ruvigil')return ['#47f5ff','#c67a24','#e7fff9'];if(p.realm==='phantom')return ['#ff5bd7','#6d44ff','#dffff4'];if(p.realm==='elif')return ['#b9ff43','#ff5038','#eef9ce'];return [p.accent,'#754dff','#fff4d5'];}
  return {home:['#ff744f','#8159ff','#fff0ad'],projects:['#ff2ea6','#19e6ff','#fff4cb'],cyber:['#faff00','#ff5a1f','#f3ffc0'],about:['#ffd87a','#7d52ff','#a9ffe6'],contact:['#88ffd5','#ff9b78','#e6e0ff']}[route]||['#ff744f','#8159ff','#fff0ad'];
};
function setPalette(route){const [a,b,c]=paletteFor(route);root.style.setProperty('--a',a);root.style.setProperty('--b',b);root.style.setProperty('--c',c);}
function routeMeta(route){
  if(route.startsWith('project/')){const p=projects.find(x=>route===`project/${x.slug}`);return {num:p?.label?.slice(0,2)||'01',code:p?.name?.toUpperCase()||'PROJECT'};}
  return {home:{num:'00',code:'ORIGIN'},projects:{num:'01',code:'ARCHIVE'},cyber:{num:'02',code:'BREACH'},about:{num:'03',code:'ORBIT'},contact:{num:'04',code:'UPLINK'}}[route]||{num:'00',code:'ORIGIN'};
}
function lensLayout(route){if(route==='projects'||route==='about')return 'right';if(route==='contact')return 'center';return 'left';}
function setLensSide(side){const l=$('#lens');l.classList.remove('lens-left','lens-right','lens-center');l.classList.add(`lens-${side}`);}

function homeHTML(){return `<div class="kicker">THE IMPOSSIBLE MACHINE</div><h1>Build.<span class="spectral">Break. Evolve.</span></h1><p class="lead">I’m ${profile.name}. Robotics, artificial intelligence, embedded systems and low-level security are not separate tabs here — they are different states of the same machine.</p><div class="stat-strip"><div class="stat"><small>Build</small><b>Robotics / Embedded</b></div><div class="stat"><small>Think</small><b>AI / Vision</b></div><div class="stat"><small>Break</small><b>REV / PWN / CTF</b></div></div><div class="actions"><button class="action primary magnetic" type="button" data-route="projects">Open the archive →</button><a class="action magnetic" href="${profile.links.github}" target="_blank" rel="noreferrer">GitHub ↗</a></div><div class="audio-meter" aria-hidden="true">${Array.from({length:12},(_,i)=>`<i style="--i:${i};--h:${20+(i*17)%80}%"></i>`).join('')}</div>`;}
function projectsHTML(){return `<div class="kicker">PROJECT CONSTELLATION</div><h2>The machine remembers.</h2><p class="lead">Every project is stored as a physical signal. Choose one and the whole machine reconfigures around its logic.</p><div class="project-list">${projects.map((p,i)=>`<button class="project-row magnetic" type="button" data-route="project/${p.slug}" style="--project:${p.accent}"><span class="n">${String(i+1).padStart(2,'0')}</span><span><b>${p.name}</b><p>${p.tagline}</p></span><span class="arrow">↗</span></button>`).join('')}</div>`;}
function projectHTML(route){const p=projects.find(x=>route===`project/${x.slug}`);if(!p)return projectsHTML();return `<div class="kicker">${p.label}</div><h2>${p.name}</h2><p class="lead">${p.tagline}</p><img class="project-art" src="${p.poster}" alt="${p.name} project artwork"><p class="project-desc">${p.long}</p><div class="tag-cloud">${p.stack.map(s=>`<span class="tag">${s}</span>`).join('')}</div><div class="stat-strip"><div class="stat"><small>Status</small><b>${p.status}</b></div><div class="stat"><small>Year</small><b>${p.year}</b></div><div class="stat"><small>Role</small><b>${p.role}</b></div></div><div class="actions"><a class="action primary magnetic" href="${p.repository}" target="_blank" rel="noreferrer">Repository ↗</a><button class="action magnetic" type="button" data-route="projects">Archive ←</button></div>`;}
function cyberHTML(){return `<div class="kicker">BREACH STATE</div><h2>Take it apart.<br><span class="spectral">Know it better.</span></h2><p class="lead">Reverse engineering and binary exploitation are how I learn software below the abstraction line. CTFs turn that curiosity into pressure-tested practice.</p><div class="terminal"><pre><span class="p">root@0xaeternova:~#</span> whoami
robotics_ai + reverse_engineering + pwn

<span class="p">root@0xaeternova:~#</span> team
GeomRavage

<span class="p">root@0xaeternova:~#</span> mode
learn → break → understand → rebuild █</pre></div><div class="actions"><a class="action primary" href="${profile.links.ctftime}" target="_blank" rel="noreferrer">CTFtime ↗</a><a class="action" href="${profile.links.team}" target="_blank" rel="noreferrer">GeomRavage ↗</a><a class="action" href="https://github.com/0xAeterNova/upctf-writeups/blob/main/REV/Locked%20Temple/Write-Up.md" target="_blank" rel="noreferrer">Writeup ↗</a></div>`;}
function aboutHTML(){return `<div class="kicker">ORBITAL BIOGRAPHY</div><img class="about-art" src="assets/profile/profile-hero-dark.svg" alt="0xAeterNova GitHub profile hero"><h2>Between machines<br><span class="spectral">and imagination.</span></h2><p class="lead">A multidisciplinary Robotics & Artificial Intelligence student interested in systems that perceive, reason and interact with the real world — and in understanding software deeply enough to reverse it when needed.</p><div class="skill-grid">${skills.slice(0,10).map(s=>`<div class="skill"><span>${s.family}</span><b>${s.name}</b></div>`).join('')}</div><img class="about-art heatmap-art" src="assets/heatmap/dark.svg" alt="GitHub contribution heatmap">`;}
function contactHTML(){const links=[['GitHub',profile.links.github],['LinkedIn',profile.links.linkedin],['CTFtime',profile.links.ctftime],['GeomRavage',profile.links.team],['LinkTree',profile.links.linktree],['Telegram',profile.links.telegram]];return `<div class="kicker">AURORA UPLINK</div><h2>Transmit<br><span class="spectral">a signal.</span></h2><p class="lead">Robotics, AI, research, competitions, low-level security or something strange enough to be worth building — open a channel.</p><div class="contact-grid">${links.map(([n,u])=>`<a class="contact-tile magnetic" href="${u}" target="_blank" rel="noreferrer"><b>${n} ↗</b><small>OPEN EXTERNAL CHANNEL</small></a>`).join('')}</div>`;}
function render(route){
  let html=route==='home'?homeHTML():route==='projects'?projectsHTML():route==='cyber'?cyberHTML():route==='about'?aboutHTML():route==='contact'?contactHTML():route.startsWith('project/')?projectHTML(route):homeHTML();
  $('#lens-content').innerHTML=html;const m=routeMeta(route);$('#lens-num').textContent=m.num;$('#lens-code').textContent=m.code;setLensSide(lensLayout(route));bindDynamic();
}
function bindDynamic(){$$('[data-route]').forEach(b=>{if(b.dataset.bound)return;b.dataset.bound='1';b.addEventListener('click',e=>{if(b.tagName==='A')e.preventDefault();navigate(b.dataset.route);});});$$('.magnetic').forEach(bindMagnetic);}
function bindMagnetic(el){if(el.dataset.mag)return;el.dataset.mag='1';el.addEventListener('pointermove',e=>{if(innerWidth<1080)return;const r=el.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;el.style.transform=`translate(${x*.08}px,${y*.08}px)`});el.addEventListener('pointerleave',()=>el.style.transform='');}

function buildNav(){
  $('#phase-dial').innerHTML=realms.map(r=>`<button class="phase-node magnetic" type="button" data-route="${r.id}"><span>${r.number}</span><span class="phase-label">${r.name} // ${r.subtitle}</span></button>`).join('');
  const spots={home:[50,50],projects:[50,21],cyber:[18,70],about:[50,78],contact:[82,70]};$('#map-core').innerHTML=realms.map(r=>`<button class="map-node magnetic" type="button" data-route="${r.id}" style="left:${spots[r.id][0]}%;top:${spots[r.id][1]}%;--node:${r.palette[0]}"><span><b>${r.name}</b><small>${r.number} / ${r.subtitle}</small></span></button>`).join('');bindDynamic();
}
function updateNav(route){const base=route.startsWith('project/')?'projects':route;$$('.phase-node').forEach(n=>n.classList.toggle('active',n.dataset.route===base));}
function transitionLabel(route){if(route.startsWith('project/'))return projects.find(p=>route===`project/${p.slug}`)?.name||'ARTIFACT';return {home:'ORIGIN',projects:'ARCHIVE',cyber:'BREACH',about:'ORBIT',contact:'UPLINK'}[route]||'RECONFIGURE';}
function fireTransition(route){const t=$('#transition');$('#transition-word').textContent=transitionLabel(route);t.classList.remove('active');void t.offsetWidth;t.classList.add('active');setTimeout(()=>t.classList.remove('active'),1250);}
function navigate(route,{fromHash=false,instant=false}={}){
  if(route.startsWith('project/')&&!projects.some(p=>route===`project/${p.slug}`))route='projects';if(!['home','projects','cyber','about','contact'].includes(route)&&!route.startsWith('project/'))route='home';if(route===current&&!instant){closeOverlays();return;}current=route;setPalette(route);updateNav(route);if(!instant)fireTransition(route);audio.setRoute(route);world.setRoute(route,instant);setTimeout(()=>render(route),instant?0:360);if(!fromHash){const h=`#/${route}`;if(location.hash!==h)history.pushState(null,'',h);}closeOverlays();
}
function hashRoute(){return location.hash.replace(/^#\//,'')||'home';}
addEventListener('hashchange',()=>navigate(hashRoute(),{fromHash:true}));addEventListener('worldnavigate',e=>navigate(e.detail.route));addEventListener('worldlayout',e=>setLensSide(e.detail.side));addEventListener('worldhover',e=>body.classList.toggle('cursor-hot',e.detail.active));addEventListener('worldtelemetry',e=>{$('#telemetry-phase').textContent=(e.detail.phase%100).toFixed(3);$('#telemetry-field').textContent=String(e.detail.field).toUpperCase().slice(0,12);});

function closeOverlays(){$$('.overlay').forEach(o=>o.classList.remove('open'));}
$('#map-btn').addEventListener('click',()=>{$('#map').classList.add('open');$('#command').classList.remove('open');audio.uiTick();});
$('#command-btn').addEventListener('click',()=>toggleCommand(true));$$('[data-close]').forEach(b=>b.addEventListener('click',closeOverlays));$$('.overlay').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)closeOverlays();}));
function filterCommands(q=''){const n=q.trim().toLowerCase(),rows=commandEntries.filter(x=>!n||`${x.label} ${x.keywords}`.toLowerCase().includes(n)).slice(0,12);commandIndex=0;$('#command-results').innerHTML=rows.map((r,i)=>`<button class="command-item ${i===0?'active':''}" type="button" data-cmd="${r.route}"><span>${r.label}</span><small>${r.route}</small></button>`).join('');$$('[data-cmd]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.cmd)));return rows;}
function toggleCommand(open=true){$('#command').classList.toggle('open',open);$('#map').classList.remove('open');if(open){filterCommands();setTimeout(()=>$('#command-input').focus(),40);}else $('#command-input').blur();}
$('#command-input').addEventListener('input',e=>filterCommands(e.target.value));$('#command-input').addEventListener('keydown',e=>{const items=$$('.command-item');if((e.key==='ArrowDown'||e.key==='ArrowUp')&&items.length){e.preventDefault();commandIndex=(commandIndex+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;items.forEach((x,i)=>x.classList.toggle('active',i===commandIndex));items[commandIndex]?.scrollIntoView({block:'nearest'});}if(e.key==='Enter'&&items[commandIndex])navigate(items[commandIndex].dataset.cmd);});

function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),1800);}
async function enter(withSound){if(withSound){await audio.start(true);$('#sound-btn').textContent='♫';toast('Spatial audio online');}else{await audio.start(false);$('#sound-btn').textContent='♪';}$('#boot').classList.add('done');navigate(hashRoute(),{fromHash:true,instant:true});}
$('#enter-sound').addEventListener('click',()=>enter(true));$('#enter-silent').addEventListener('click',()=>enter(false));
$('#sound-btn').addEventListener('click',async()=>{const on=await audio.toggle();$('#sound-btn').textContent=on?'♫':'♪';toast(on?'Spatial audio online':'Audio muted');});$('#volume').addEventListener('input',e=>{audio.setVolume(Number(e.target.value)/100);});
function startTour(){stopTour();tourOn=true;$('#tour-btn').textContent='STOP PILOT';const seq=['home','projects','project/ruvigil','project/phantom','project/elif-linux','cyber','about','contact'];let i=Math.max(0,seq.indexOf(current));const next=()=>{if(!tourOn)return;i=(i+1)%seq.length;navigate(seq[i]);tourTimer=setTimeout(next,7200);};tourTimer=setTimeout(next,1600);toast('Auto pilot engaged');}
function stopTour(){tourOn=false;clearTimeout(tourTimer);tourTimer=null;$('#tour-btn').textContent='AUTO PILOT';}
$('#tour-btn').addEventListener('click',()=>tourOn?stopTour():startTour());
$('#explode-btn').addEventListener('click',()=>{const on=world.toggleExplode();audio.transition(current);toast(on?'Machine exploded view':'Machine recomposed');});

function cursor(){const c=$('#cursor');let x=innerWidth/2,y=innerHeight/2,rx=x,ry=y;addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY});function loop(){rx+=(x-rx)*.18;ry+=(y-ry)*.18;c.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;requestAnimationFrame(loop)}loop();addEventListener('pointerover',e=>body.classList.toggle('cursor-hot',!!e.target.closest('a,button,input')));}
addEventListener('keydown',e=>{if(e.target.matches('input,textarea')){if(e.key==='Escape')closeOverlays();return;}if(e.key==='/'){e.preventDefault();toggleCommand(true);}if(e.key.toLowerCase()==='m')$('#map-btn').click();if(e.key.toLowerCase()==='f'){body.classList.toggle('focus-mode');toast(body.classList.contains('focus-mode')?'Focus mode':'Interface restored');}if(e.key.toLowerCase()==='r'){world.reset();toast('Camera reset');}if(e.key.toLowerCase()==='x')$('#explode-btn').click();if(e.key==='Escape')closeOverlays();if(/^[1-5]$/.test(e.key))navigate(realms[Number(e.key)-1]?.id||'home');});

function audioReactive(){world.setAudioLevel(audio.getLevel());requestAnimationFrame(audioReactive)}
audioReactive();
buildNav();cursor();setPalette('home');render('home');updateNav('home');
