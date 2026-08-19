import { TransmissionMachine } from './engine.js?v=5.0.0';
import { profile, projects, skills, achievements, realms } from './data.js?v=5.0.0';

const $=(q,p=document)=>p.querySelector(q), $$=(q,p=document)=>[...p.querySelectorAll(q)];
const root=document.documentElement, body=document.body;
const canvas=$('#webgl'), boot=$('#boot'), lens=$('#lens'), lensContent=$('#lens-content');
const transition=$('#transition'), transitionWord=$('#transition-word'), transitionKicker=$('#transition-kicker');
const mapOverlay=$('#map'), mapLabels=$('#map-labels'), atlasStack=$('#atlas-route-stack');
const commandOverlay=$('#command'), commandInput=$('#command-input'), commandResults=$('#command-results'), searchEcho=$('#search-echo');
const cursorPulses=$('#cursor-pulses'), soundtrack=$('#soundtrack'), volume=$('#volume'), soundBtn=$('#sound-btn');
let engine=null,current='home',overlayReturn='home',tourTimer=null,tourOn=false,focusMode=false,explodeOn=false;
let audioCtx=null,source=null,analyser=null,master=null,filter=null,freqData=null,soundStarted=false,muted=false,selectedSearch=0,searchItems=[];

const esc=(s='')=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const routeName=route=>{
  if(route.startsWith('project/'))return projects.find(p=>route===`project/${p.slug}`)?.name||'PROJECT';
  return {home:'ORIGIN',projects:'ARCHIVE',cyber:'BREACH',lab:'FORGE',arsenal:'ARSENAL',missions:'MISSIONS',timeline:'TRAJECTORY',about:'ORBIT',contact:'UPLINK',map:'ATLAS',search:'SEARCH ARRAY'}[route]||route.toUpperCase();
};
const routeMeta=route=>{
  if(route.startsWith('project/')){const p=projects.find(p=>route===`project/${p.slug}`);return {num:p?.label?.slice(0,2)||'01',code:p?.name?.toUpperCase()||'PROJECT'};}
  const r=realms.find(x=>x.id===route);return r?{num:r.number,code:r.name.toUpperCase()}:{num:'--',code:'SIGNAL'};
};
const paletteFor=route=>{
  const p=route.startsWith('project/')?projects.find(x=>route===`project/${x.slug}`):null;
  if(p){if(p.realm==='ruvigil')return ['#47f5ff','#c67a24','#e7fff9'];if(p.realm==='phantom')return ['#ff5bd7','#6d44ff','#dffff4'];if(p.realm==='elif')return ['#b9ff43','#ff5038','#eef9ce'];return [p.accent,'#754dff','#fff4d5'];}
  const r=realms.find(x=>x.id===route);if(r)return [r.palette[0],r.palette[1],r.palette[2]];
  return route==='map'?['#6ce8ff','#ff5d98','#fff0ae']:route==='search'?['#ffffff','#ff5d98','#6ce8ff']:['#ff6a45','#ff2ba6','#45f1ff'];
};
function setPalette(route){const [a,b,c]=paletteFor(route);root.style.setProperty('--a',a);root.style.setProperty('--b',b);root.style.setProperty('--c',c);body.dataset.route=route.replace('/','-');}
function lensSide(route){if(['projects','about','lab','arsenal'].includes(route))return 'right';if(['contact','timeline','missions'].includes(route))return 'center';return 'left';}
function setLensSide(side){lens.classList.remove('lens-left','lens-right','lens-center');lens.classList.add(`lens-${side}`);}
const skillGroups=()=>{const g=new Map();skills.forEach(s=>{const k=s.family||'Systems';if(!g.has(k))g.set(k,[]);g.get(k).push(s)});return [...g.entries()];};

function homeHTML(){return `
  <div class="kicker">ORIGIN / CYBERPUNK NIGHT CIRCUIT · V5</div>
  <h1>Build.<span class="spectral">Break. Evolve.</span></h1>
  <p class="lead">I’m ${esc(profile.name)}. Robotics, AI, embedded systems and low-level security become one continuous machine language here — engineered, inspected and transmitted through a living cyberpunk city.</p>
  <div class="hero-panels">
    <section><small>BUILD VECTOR</small><b>Robotics + Embedded</b><span>Sensing · control · hardware · firmware</span></section>
    <section><small>THINK VECTOR</small><b>AI + Vision</b><span>Perception · learning · behavioral systems</span></section>
    <section><small>BREAK VECTOR</small><b>REV + PWN + CTF</b><span>Binaries · memory · evidence · exploitation</span></section>
  </div>
  <div class="signal-stats"><div><small>FLAGSHIP PROJECTS</small><b>${projects.length}</b></div><div><small>LIVE DISTRICTS</small><b>${realms.length}</b></div><div><small>FOCUS THREADS</small><b>${profile.focus.length}</b></div></div>
  <div class="actions"><button class="action primary magnetic" data-route="projects">ENTER PROJECT DISTRICT →</button><button class="action magnetic" data-route="lab">OPEN FORGE ↗</button><a class="action magnetic" href="${profile.links.github}" target="_blank" rel="noreferrer">GITHUB ↗</a></div>
  <div class="frequency-strip" aria-hidden="true">${Array.from({length:28},(_,i)=>`<i style="--i:${i};--h:${18+(i*31)%82}%"></i>`).join('')}</div>`;}

function projectsHTML(){return `
  <div class="kicker">PROJECT DISTRICT / LIVE MACHINES</div>
  <h2>Archive of<br><span class="spectral">built things.</span></h2>
  <p class="lead">Each project is a different district in the same city. Select one and the camera, color, architecture, UFO traffic and machine state reconfigure around it.</p>
  <div class="project-list">${projects.map((p,i)=>`<button class="project-row magnetic tilt-card" type="button" data-route="project/${p.slug}" style="--project:${p.accent}"><span class="n">${String(i+1).padStart(2,'0')}</span><span class="project-copy"><small>${esc(p.label)}</small><b>${esc(p.name)}</b><p>${esc(p.tagline)}</p></span><span class="signal-mark"><i></i><b>ENTER</b></span></button>`).join('')}</div>`;}

function projectHTML(route){const p=projects.find(x=>route===`project/${x.slug}`);if(!p)return projectsHTML();return `
  <div class="project-head"><div><div class="kicker">${esc(p.label)}</div><h2>${esc(p.name)}</h2><p class="lead">${esc(p.tagline)}</p></div><span class="project-status">${esc(p.status)}</span></div>
  <div class="project-visual tilt-card"><img src="${p.poster}" alt="${esc(p.name)} project artwork"><div class="project-scan"></div><small>LIVE PROJECT SIGNAL / ${esc(p.year)}</small></div>
  <p class="project-desc">${esc(p.long)}</p>
  <div class="tag-cloud">${p.stack.map(s=>`<span class="tag">${esc(s)}</span>`).join('')}</div>
  <div class="project-facts"><div><small>ROLE</small><b>${esc(p.role)}</b></div><div><small>YEAR</small><b>${esc(p.year)}</b></div><div><small>STATE</small><b>${esc(p.status)}</b></div></div>
  <div class="actions"><a class="action primary magnetic" href="${p.repository}" target="_blank" rel="noreferrer">REPOSITORY ↗</a><button class="action magnetic" data-route="projects">← PROJECT DISTRICT</button></div>`;}

function cyberHTML(){return `
  <div class="kicker">BREACH SECTOR / LOW-LEVEL SECURITY</div>
  <h2>Take it apart.<br><span class="spectral">Know it better.</span></h2>
  <p class="lead">Reverse engineering, binary exploitation and forensics turn software into observable machinery. This sector treats security as disciplined curiosity under pressure.</p>
  <div class="terminal"><div class="terminal-head"><i></i><i></i><i></i><span>root@0xaeternova // breach-sector</span></div><pre><span class="p">root@0xaeternova:~#</span> whoami
robotics_ai + reverse_engineering + pwn

<span class="p">root@0xaeternova:~#</span> team
GeomRavage

<span class="p">root@0xaeternova:~#</span> methodology
observe → disassemble → exploit → understand → rebuild █</pre></div>
  <div class="achievement-stack">${achievements.map(a=>`<a class="tilt-card" href="${a.url}" target="_blank" rel="noreferrer"><small>VERIFIED SIGNAL</small><b>${esc(a.title)} ↗</b><p>${esc(a.text)}</p></a>`).join('')}</div>
  <div class="actions"><a class="action primary magnetic" href="${profile.links.ctftime}" target="_blank" rel="noreferrer">CTFTIME ↗</a><a class="action magnetic" href="${profile.links.team}" target="_blank" rel="noreferrer">GEOMRAVAGE ↗</a></div>`;}

function labHTML(){return `
  <div class="kicker">FORGE / PROTOTYPE HANGAR</div>
  <h2>Invent strange things.<br><span class="spectral">Then make them real.</span></h2>
  <p class="lead">The Forge is the experimental district: realtime interfaces, embedded builds, sensors, visual systems and technical prototypes before they become polished machines.</p>
  <div class="lab-grid"><section class="tilt-card"><small>REALTIME GRAPHICS</small><b>WebGL + spatial interaction</b><p>Local rendering, audio reactivity, adaptive GPU quality and cinematic state transitions.</p></section><section class="tilt-card"><small>PHYSICAL SYSTEMS</small><b>Sensors + embedded hardware</b><p>ESP32, RF sensing, control systems and prototypes that exist outside the browser.</p></section><section class="tilt-card"><small>AI EXPERIMENTS</small><b>Vision + audio perception</b><p>Multimodal pipelines that turn cameras, voices and signals into usable perception.</p></section><section class="tilt-card"><small>LAB METHOD</small><b>Prototype aggressively</b><p>Build fast, inspect motion, keep the surprising parts, then rebuild with stronger constraints.</p></section></div>
  <div class="actions"><button class="action primary magnetic" data-route="arsenal">OPEN SYSTEMS ARSENAL →</button><button class="action magnetic" data-route="timeline">TRAJECTORY ↗</button></div>`;}

function arsenalHTML(){const groups=skillGroups();return `
  <div class="kicker">SYSTEMS ARSENAL / TOOLS + DISCIPLINES</div>
  <h2>Tools are not badges.<br><span class="spectral">They are leverage.</span></h2>
  <p class="lead">A technical stack grouped by what it helps me do: build physical systems, create perception, inspect binaries, operate environments and turn ideas into working prototypes.</p>
  <div class="arsenal-grid">${groups.slice(0,8).map(([family,items])=>`<article class="tilt-card"><small>${esc(family)}</small><b>${items.slice(0,2).map(x=>esc(x.name)).join(' + ')}</b><p>${items.map(x=>esc(x.signal)).slice(0,2).join(' · ')}</p><div class="arsenal-stack">${items.map(x=>`<span>${esc(x.name)}</span>`).join('')}</div></article>`).join('')}</div>
  <div class="actions"><button class="action primary magnetic" data-route="missions">MISSION DECK →</button><button class="action magnetic" data-route="projects">PROJECTS ↗</button></div>`;}

function missionsHTML(){return `
  <div class="kicker">MISSION DECK / COMPETITION + OUTPUT</div>
  <h2>Pressure turns theory<br><span class="spectral">into evidence.</span></h2>
  <p class="lead">Competitions, writeups and team work are where technical understanding has to become reproducible, explainable and useful under time pressure.</p>
  <div class="mission-grid">${achievements.map((a,i)=>`<article class="tilt-card"><span class="mission-mark"></span><small>MISSION ${String(i+1).padStart(2,'0')}</small><b>${esc(a.title)}</b><p>${esc(a.text)}</p><div class="actions"><a class="action magnetic" href="${a.url}" target="_blank" rel="noreferrer">OPEN SIGNAL ↗</a></div></article>`).join('')}<article class="tilt-card"><span class="mission-mark"></span><small>ACTIVE TEAM</small><b>GeomRavage</b><p>CTF practice across reverse engineering, exploitation, forensics and technical problem solving.</p><div class="actions"><a class="action magnetic" href="${profile.links.team}" target="_blank" rel="noreferrer">TEAM ↗</a></div></article></div>
  <div class="actions"><button class="action primary magnetic" data-route="timeline">FOLLOW TRAJECTORY →</button></div>`;}

function timelineHTML(){return `
  <div class="kicker">TRAJECTORY / SIGNAL TIMELINE</div>
  <h2>One system keeps<br><span class="spectral">feeding the next.</span></h2>
  <p class="lead">The path is not a list of disconnected interests. Security taught inspection. Robotics forced physical constraints. AI expanded perception. Embedded systems made ideas tangible. Realtime graphics turned the presentation itself into another machine.</p>
  <div class="timeline-rail"><article class="tilt-card"><small>PHASE 01</small><b>Security curiosity</b><p>Reverse engineering, pwn, forensics and CTF work established the habit of going beneath the surface.</p></article><article class="tilt-card"><small>PHASE 02</small><b>Robotics + AI</b><p>Physical systems, sensing, machine perception and intelligent control became the primary build vector.</p></article><article class="tilt-card"><small>PHASE 03</small><b>Experimental systems</b><p>RuVigil, PHANTOM and Elif turned technical interests into complete project signals.</p></article><article class="tilt-card"><small>PHASE 04</small><b>Realtime experiences</b><p>The portfolio becomes a system itself: audiovisual, spatial, interactive and alive.</p></article></div>
  <div class="actions"><button class="action primary magnetic" data-route="about">IDENTITY ORBIT →</button><button class="action magnetic" data-route="home">RETURN ORIGIN ↗</button></div>`;}

function aboutHTML(){return `
  <div class="about-grid">
    <div class="about-portrait"><div class="hero-frame tilt-card"><img src="assets/profile/profile-hero-dark.svg" alt="0xAeterNova GitHub profile hero"><div class="portrait-scan"></div><div class="hero-glow"></div></div><span>IDENTITY SIGNAL // ${esc(profile.handle)}</span></div>
    <div class="about-copy"><div class="kicker">ORBIT / IDENTITY ARCHITECTURE</div><h2>Machines are the medium.<br><span class="spectral">Curiosity is the engine.</span></h2><p class="lead">I work where software meets hardware, uncertainty and constraints: robotics, perception, embedded systems, AI and low-level security. I care more about understanding a system deeply than collecting decorative scores.</p><div class="identity-signature"><span>BUILD</span><i></i><span>DISASSEMBLE</span><i></i><span>UNDERSTAND</span><i></i><span>REINVENT</span></div><div class="about-pillars"><span>Real systems</span><span>Iterative research</span><span>Security thinking</span><span>Interactive design</span></div></div>
  </div>
  <div class="identity-modules"><section class="tilt-card"><small>CURRENT FOCUS</small><b>Immersive interfaces + sensing systems</b><p>Technical work presented as responsive experiences rather than static screenshots.</p></section><section class="tilt-card"><small>WORKFLOW</small><b>Build → observe → break → rebuild</b><p>Prototype, inspect the real behavior, then return with stronger architecture.</p></section><section class="tilt-card"><small>MODE</small><b>${esc(profile.location)} · experimental systems</b><p>Robotics, AI, embedded systems, low-level security and realtime graphics.</p></section></div>
  <div class="capability-atlas">${skillGroups().slice(0,6).map(([family,items])=>`<section class="capability-cluster tilt-card"><small>${esc(family)}</small><div>${items.slice(0,5).map(x=>`<span><b>${esc(x.name)}</b><em>${esc(x.signal)}</em></span>`).join('')}</div></section>`).join('')}</div>
  <div class="identity-manifesto"><div><small>01 / BUILD</small><b>Make the idea touch reality.</b><p>Prototype with real devices, code and constraints.</p></div><div><small>02 / BREAK</small><b>Inspect below the abstraction.</b><p>Trace, reverse, test and understand actual behavior.</p></div><div><small>03 / EVOLVE</small><b>Rebuild with better understanding.</b><p>Turn what was learned into a stronger next version.</p></div></div>`;}

function contactHTML(){const links=[['GitHub',profile.links.github,'CODE / PROJECTS'],['LinkedIn',profile.links.linkedin,'PROFESSIONAL'],['CTFtime',profile.links.ctftime,'COMPETITION'],['GeomRavage',profile.links.team,'TEAM'],['LinkTree',profile.links.linktree,'ALL CHANNELS'],['Telegram',profile.links.telegram,'DIRECT SIGNAL']];return `
  <div class="kicker">AURORA UPLINK / OPEN CHANNEL</div>
  <h2>Transmit<br><span class="spectral">a signal.</span></h2>
  <p class="lead">Robotics, AI, embedded systems, competitions, reverse engineering, research or strange technical ideas — choose a channel and send it.</p>
  <div class="contact-grid">${links.map(x=>`<a class="contact-tile magnetic tilt-card" href="${x[1]}" target="_blank" rel="noreferrer"><small>${esc(x[2])}</small><b>${esc(x[0])}<span>↗</span></b><i></i></a>`).join('')}</div>`;}

function renderLens(route){
  const meta=routeMeta(route);$('#lens-num').textContent=meta.num;$('#lens-code').textContent=meta.code;setLensSide(lensSide(route));
  const renderer={home:homeHTML,projects:projectsHTML,cyber:cyberHTML,lab:labHTML,arsenal:arsenalHTML,missions:missionsHTML,timeline:timelineHTML,about:aboutHTML,contact:contactHTML};
  lensContent.innerHTML=route.startsWith('project/')?projectHTML(route):(renderer[route]?.()||homeHTML());
  $$('.phase-node').forEach(n=>n.classList.toggle('active',route===n.dataset.route||(route.startsWith('project/')&&n.dataset.route==='projects')));
}

function buildDial(){const dial=$('#phase-dial');dial.innerHTML=realms.map(r=>`<button class="phase-node magnetic" type="button" data-route="${r.id}" title="${esc(r.name)}"><span>${r.number}</span><b class="phase-label">${esc(r.name)}</b></button>`).join('');}
function buildSearchSpectrum(){const el=$('.search-spectrum');if(el)el.innerHTML=Array.from({length:30},(_,i)=>`<i style="animation-delay:${-(i%7)*.11}s"></i>`).join('');}
function routeFromHash(){const h=location.hash.replace(/^#\/?/,'');if(h.startsWith('project/'))return h;return realms.some(r=>r.id===h)?h:'home';}
function transitionTo(route){transitionWord.textContent=routeName(route);transitionKicker.textContent=route.startsWith('project/')?'LOCKING PROJECT DISTRICT':'TRANSMITTING SECTOR';transition.classList.remove('active');void transition.offsetWidth;transition.classList.add('active');setTimeout(()=>transition.classList.remove('active'),1550);}
function navigate(route,{instant=false,hash=true}={}){if(!engine||!engine.scenes?.[route])return;if(route===current&&!instant)return;closeMap(false);closeSearch(false);const from=current;current=route;setPalette(route);renderLens(route);if(!instant)transitionTo(route);lens.classList.add('switching');setTimeout(()=>{engine.setRoute(route,instant);lens.classList.remove('switching')},instant?0:300);if(hash)history.replaceState(null,'','#'+route);txSweep(from,route);}

function mapLabelName(route){if(route.startsWith('project/'))return projects.find(p=>route===`project/${p.slug}`)?.name||'Project';return realms.find(r=>r.id===route)?.name||route;}
function mapNodeType(route){if(route.startsWith('project/'))return 'PROJECT DISTRICT';if(['lab','arsenal','missions','timeline'].includes(route))return 'AUXILIARY DISTRICT';return 'CORE CITY STATE';}
function openMap(){if(!engine)return;overlayReturn=current;mapOverlay.hidden=false;body.classList.add('map-active');setPalette('map');engine.setRoute('map');const routes=[...realms.map(r=>r.id),...projects.map(p=>`project/${p.slug}`)];$('#atlas-node-count').textContent=`${String(routes.length).padStart(2,'0')} SIGNALS`;mapLabels.innerHTML=routes.map((r,i)=>`<button class="map-node-label ${r.startsWith('project/')?'project-node':(['lab','arsenal','missions','timeline'].includes(r)?'district-node':'core-node')}" data-route="${r}" data-map-route="${r}" style="--node-index:${i}"><span class="map-pin"><i></i></span><small>${mapNodeType(r)}</small><b>${esc(mapLabelName(r))}</b><em>LOCK ↗</em></button>`).join('');atlasStack.innerHTML=routes.slice(0,9).map(r=>`<button class="magnetic" data-route="${r}" data-map-stack="${r}"><span>${esc(mapLabelName(r))}</span><b>↗</b></button>`).join('');engine.setMapFocus?.(null);}
function closeMap(restore=true){if(mapOverlay.hidden)return;mapOverlay.hidden=true;mapLabels.innerHTML='';atlasStack.innerHTML='';body.classList.remove('map-active');if(restore&&engine){setPalette(overlayReturn);engine.setRoute(overlayReturn,true);}}
function updateMapLabels(anchors){if(mapOverlay.hidden)return;const marginX=innerWidth<760?54:104,marginY=innerWidth<760?74:94;const pts=anchors.filter(a=>a.pos.visible).map(a=>({a,x:clamp(a.pos.x,marginX,innerWidth-marginX),y:clamp(a.pos.y,marginY,innerHeight-marginY),z:a.pos.z||0}));for(let pass=0;pass<8;pass++)for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){let dx=pts[j].x-pts[i].x,dy=pts[j].y-pts[i].y,d=Math.hypot(dx,dy)||1;const minD=innerWidth<760?70:125;if(d<minD){const push=(minD-d)*.26,ux=dx/d,uy=dy/d;pts[i].x-=ux*push;pts[i].y-=uy*push;pts[j].x+=ux*push;pts[j].y+=uy*push;}}anchors.forEach(a=>{const el=$(`[data-map-route="${CSS.escape(a.route)}"]`,mapLabels);if(!el)return;const p=pts.find(x=>x.a.route===a.route);el.classList.toggle('behind',!p);if(!p)return;const depth=clamp(1.06-(p.z+1)*.11,.73,1.06);el.style.left=`${clamp(p.x,marginX,innerWidth-marginX)}px`;el.style.top=`${clamp(p.y,marginY,innerHeight-marginY)}px`;el.style.setProperty('--depth',depth.toFixed(3));el.style.zIndex=String(Math.round(50+depth*20));});}

function openSearch(){if(!engine)return;overlayReturn=current;commandOverlay.hidden=false;body.classList.add('search-active');setPalette('search');engine.setRoute('search');commandInput.value='';selectedSearch=0;engine.setSearchQuery?.('');renderSearch();setTimeout(()=>commandInput.focus(),70);}
function closeSearch(restore=true){if(commandOverlay.hidden)return;commandOverlay.hidden=true;body.classList.remove('search-active');if(restore&&engine){setPalette(overlayReturn);engine.setRoute(overlayReturn,true);}}
function renderSearch(){const q=commandInput.value.trim();searchItems=engine.search(q);selectedSearch=searchItems.length?clamp(selectedSearch,0,Math.min(3,searchItems.length-1)):0;engine.setSearchQuery?.(q);engine.setSearchResults(searchItems);engine.setSearchFocus?.(selectedSearch);const state=i=>i===0?'PRIMARY LOCK':i===1?'SECONDARY':i===2?'TRACE':'ECHO';commandResults.innerHTML=searchItems.slice(0,4).map((x,i)=>`<button class="command-item${i===selectedSearch?' active':''}" type="button" data-result="${i}"><span class="result-index">0${i+1}</span><span class="result-copy"><small>${esc(x.type||'SIGNAL')}</small><b>${esc(x.label)}</b><em>${esc((x.keywords||'').split(' ').slice(0,5).join(' · '))}</em></span><strong>${i===selectedSearch?'LOCKED':state(i)}</strong></button>`).join('')||`<div class="search-empty"><b>NO RESONANCE</b><span>Try another project, technology, skill or district.</span></div>`;searchEcho.textContent=q?`${q.toUpperCase()} // ${searchItems.length||0} RESONANCE${searchItems.length===1?'':'S'}`:'AWAITING SIGNAL';}
function commitSearch(i=selectedSearch){const hit=searchItems[i];if(!hit)return;closeSearch(false);current=overlayReturn;engine.setRoute(overlayReturn,true);navigate(hit.route);}

async function startSound(){try{if(!audioCtx){audioCtx=new (window.AudioContext||window.webkitAudioContext)();source=audioCtx.createMediaElementSource(soundtrack);filter=audioCtx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=15500;const comp=audioCtx.createDynamicsCompressor();comp.threshold.value=-14;comp.knee.value=16;comp.ratio.value=2.5;comp.attack.value=.006;comp.release.value=.26;analyser=audioCtx.createAnalyser();analyser.fftSize=256;analyser.smoothingTimeConstant=.8;master=audioCtx.createGain();master.gain.value=Number(volume.value)/100;source.connect(filter);filter.connect(comp);comp.connect(analyser);analyser.connect(master);master.connect(audioCtx.destination);freqData=new Uint8Array(analyser.frequencyBinCount);}if(audioCtx.state==='suspended')await audioCtx.resume();soundtrack.volume=1;await soundtrack.play();soundStarted=true;muted=false;soundBtn.textContent='♪';}catch(e){console.warn('Soundtrack start failed',e);toast('AUDIO COULD NOT START — CLICK ♪ TO RETRY');}}
function setVolume(v){if(master&&audioCtx)master.gain.setTargetAtTime(v,audioCtx.currentTime,.035);else soundtrack.volume=v;}
function toggleSound(){if(!soundStarted){startSound();return;}muted=!muted;if(master&&audioCtx)master.gain.setTargetAtTime(muted?0:Number(volume.value)/100,audioCtx.currentTime,.045);else soundtrack.muted=muted;soundBtn.textContent=muted?'×':'♪';}
function audioLevel(){if(!analyser||!freqData)return 0;analyser.getByteFrequencyData(freqData);let sum=0,n=0;for(let i=1;i<45;i++){sum+=freqData[i];n++;}return Math.min(1,(sum/n)/170);}
function txSweep(){if(!audioCtx||!soundStarted||muted)return;try{const t=audioCtx.currentTime;const osc=audioCtx.createOscillator(),sub=audioCtx.createOscillator(),g=audioCtx.createGain(),g2=audioCtx.createGain(),pan=audioCtx.createStereoPanner();osc.type='sine';osc.frequency.setValueAtTime(120,t);osc.frequency.exponentialRampToValueAtTime(980,t+.62);sub.type='triangle';sub.frequency.setValueAtTime(62,t);sub.frequency.exponentialRampToValueAtTime(38,t+.42);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.045,t+.07);g.gain.exponentialRampToValueAtTime(.0001,t+.72);g2.gain.setValueAtTime(.0001,t);g2.gain.exponentialRampToValueAtTime(.038,t+.05);g2.gain.exponentialRampToValueAtTime(.0001,t+.44);pan.pan.setValueAtTime(-.75,t);pan.pan.linearRampToValueAtTime(.75,t+.66);osc.connect(g);g.connect(pan);sub.connect(g2);g2.connect(master);pan.connect(master);osc.start(t);sub.start(t);osc.stop(t+.75);sub.stop(t+.48);filter?.frequency.cancelScheduledValues(t);filter?.frequency.setValueAtTime(filter.frequency.value,t);filter?.frequency.exponentialRampToValueAtTime(1200,t+.14);filter?.frequency.exponentialRampToValueAtTime(15500,t+.82);}catch{}}
function toast(text){const el=$('#toast');el.textContent=text;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),1800);}

function startTour(){if(tourOn){tourOn=false;clearInterval(tourTimer);$('#tour-btn').classList.remove('on');$('#tour-btn').textContent='AUTOPILOT';return;}tourOn=true;$('#tour-btn').classList.add('on');$('#tour-btn').textContent='STOP TOUR';const sequence=['home','projects','project/ruvigil','project/phantom','project/elif-linux','cyber','lab','arsenal','missions','timeline','about','contact'];let i=Math.max(0,sequence.indexOf(current));navigate(sequence[i],{instant:true});tourTimer=setInterval(()=>{if(!tourOn)return;i=(i+1)%sequence.length;navigate(sequence[i]);},7600);}
function enter(withSound){if(withSound)startSound();boot.classList.add('leaving');setTimeout(()=>boot.hidden=true,1050);}
window.AeterNovaEnter=enter;window.dispatchEvent(new Event('aeter-app-ready'));

function bindMicroInteractions(){
  document.addEventListener('pointermove',e=>{
    const mag=e.target.closest('.magnetic');if(mag&&e.pointerType!=='touch'){const r=mag.getBoundingClientRect(),dx=(e.clientX-(r.left+r.width/2))/r.width,dy=(e.clientY-(r.top+r.height/2))/r.height;mag.style.translate=`${dx*5}px ${dy*4}px`;}
    const tilt=e.target.closest('.tilt-card');if(tilt&&e.pointerType!=='touch'){const r=tilt.getBoundingClientRect(),nx=(e.clientX-r.left)/r.width-.5,ny=(e.clientY-r.top)/r.height-.5;tilt.classList.add('tilt-active');tilt.style.transform=`perspective(760px) rotateX(${-ny*5}deg) rotateY(${nx*6}deg) translateZ(4px)`;tilt.style.setProperty('--hover-x',`${(nx+.5)*100}%`);tilt.style.setProperty('--hover-y',`${(ny+.5)*100}%`);}
  });
  document.addEventListener('pointerout',e=>{const mag=e.target.closest('.magnetic');if(mag&&!mag.contains(e.relatedTarget))mag.style.translate='';const tilt=e.target.closest('.tilt-card');if(tilt&&!tilt.contains(e.relatedTarget)){tilt.style.transform='';tilt.classList.remove('tilt-active');}});
}

function bindCursor(){const cursor=$('#cursor'),trail=$('#cursor-trail'),lock=$('#cursor-lock');const dots=Array.from({length:8},(_,i)=>{const d=document.createElement('i');d.style.setProperty('--trail-index',i);trail.appendChild(d);return {el:d,x:innerWidth/2,y:innerHeight/2}});let cx=innerWidth/2,cy=innerHeight/2,tx=cx,ty=cy,lastX=cx,lastY=cy,angle=0;addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;const dx=tx-lastX,dy=ty-lastY,speed=Math.min(1,Math.hypot(dx,dy)/44);if(Math.abs(dx)+Math.abs(dy)>2)angle=Math.atan2(dy,dx);root.style.setProperty('--cursor-speed',speed.toFixed(3));root.style.setProperty('--cursor-angle',`${angle}rad`);lastX=tx;lastY=ty;});addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;const p=document.createElement('i');p.style.left=e.clientX+'px';p.style.top=e.clientY+'px';cursorPulses.appendChild(p);setTimeout(()=>p.remove(),760);});const loop=()=>{cx+=(tx-cx)*.29;cy+=(ty-cy)*.29;cursor.style.transform=`translate(${cx}px,${cy}px)`;let px=cx,py=cy;dots.forEach((d,i)=>{const k=.22-i*.018;d.x+=(px-d.x)*Math.max(.055,k);d.y+=(py-d.y)*Math.max(.055,k);d.el.style.transform=`translate(${d.x}px,${d.y}px) scale(${1-i*.08})`;px=d.x;py=d.y;});requestAnimationFrame(loop)};loop();document.addEventListener('pointerover',e=>{const hot=!!e.target.closest('button,a,input,.tilt-card');body.classList.toggle('cursor-hot',hot);const mapNode=e.target.closest('[data-map-route]');lock.textContent=mapNode?'NODE':e.target.closest('.command-item')?'SIGNAL':e.target.closest('input')?'TYPE':hot?'LOCK':'SCAN';if(mapNode&&!mapOverlay.hidden){const r=mapNode.dataset.mapRoute;engine?.setMapFocus?.(r);$('#map-focus-name').textContent=mapLabelName(r).toUpperCase();$('#map-focus-meta').textContent=mapNodeType(r)+' // ROUTE READY';}});document.addEventListener('pointerout',e=>{const node=e.target.closest('[data-map-route]');if(node&&!mapOverlay.hidden&&!node.contains(e.relatedTarget)){engine?.setMapFocus?.(null);$('#map-focus-name').textContent='NO SIGNAL';$('#map-focus-meta').textContent='MOVE THROUGH THE CONSTELLATION';}});}

function bindUI(){
  document.addEventListener('click',e=>{const route=e.target.closest('[data-route]')?.dataset.route;if(route){if(!mapOverlay.hidden){closeMap(false);current=overlayReturn;engine?.setRoute(overlayReturn,true);}navigate(route);return;}const close=e.target.closest('[data-close]')?.dataset.close;if(close==='map')closeMap(true);if(close==='search')closeSearch(true);const ri=e.target.closest('[data-result]')?.dataset.result;if(ri!=null)commitSearch(Number(ri));});
  $('#map-btn').addEventListener('click',openMap);$('#command-btn').addEventListener('click',openSearch);$('#tour-btn').addEventListener('click',startTour);soundBtn.addEventListener('click',toggleSound);volume.addEventListener('input',e=>{setVolume(Number(e.target.value)/100);if(muted)toggleSound();});
  $('#cinema-btn').addEventListener('click',()=>{focusMode=!focusMode;body.classList.toggle('focus-mode',focusMode);$('#cinema-btn').classList.toggle('on',focusMode);$('#cinema-btn').textContent=focusMode?'EXIT CINEMA':'CINEMA';toast(focusMode?'CINEMA MODE — UI HIDDEN':'CINEMA MODE CLOSED');});
  const toggleExplode=()=>{if(!engine)return;explodeOn=engine.toggleExplode();const btn=$('#explode-btn'),hud=$('#disassembly-hud');btn.classList.toggle('on',explodeOn);btn.textContent=explodeOn?'CLOSE X-RAY':'X-RAY';hud.hidden=!explodeOn;body.classList.toggle('explode-mode',explodeOn);$('#lens-hint').textContent=explodeOn?'X-RAY OPEN · DRAG TO INSPECT · X TO CLOSE':'DRAG SPACE · SCROLL DEPTH · CLICK SIGNALS';toast(explodeOn?'ENGINEERING X-RAY OPEN':'MACHINE REASSEMBLED');};$('#explode-btn').addEventListener('click',toggleExplode);
  commandInput.addEventListener('input',()=>{selectedSearch=0;renderSearch();});commandResults.addEventListener('pointerover',e=>{const item=e.target.closest('[data-result]');if(!item)return;selectedSearch=Number(item.dataset.result);engine?.setSearchFocus?.(selectedSearch);$$('.command-item',commandResults).forEach((x,i)=>x.classList.toggle('active',i===selectedSearch));});
  addEventListener('keydown',e=>{if(e.key==='/'&&commandOverlay.hidden&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();openSearch();return;}if(e.key==='Escape'){if(!commandOverlay.hidden)closeSearch(true);else if(!mapOverlay.hidden)closeMap(true);else if(focusMode){focusMode=false;body.classList.remove('focus-mode');$('#cinema-btn').classList.remove('on');$('#cinema-btn').textContent='CINEMA';}return;}if(!commandOverlay.hidden){if(e.key==='ArrowDown'){e.preventDefault();selectedSearch=Math.min(3,selectedSearch+1);renderSearch();}if(e.key==='ArrowUp'){e.preventDefault();selectedSearch=Math.max(0,selectedSearch-1);renderSearch();}if(e.key==='Enter'){e.preventDefault();commitSearch();}return;}if(e.key.toLowerCase()==='m'){e.preventDefault();openMap();}if(e.key.toLowerCase()==='x'){e.preventDefault();toggleExplode();}if(e.key.toLowerCase()==='r'){engine?.reset();toast('CAMERA RECENTERED');}if(e.key.toLowerCase()==='f'){focusMode=!focusMode;body.classList.toggle('focus-mode',focusMode);$('#cinema-btn').classList.toggle('on',focusMode);}const n=Number(e.key);if(n>=1&&n<=9)navigate(realms[n-1]?.id||'home');});
  bindMicroInteractions();bindCursor();
}

function init(){
  buildDial();buildSearchSpectrum();bindUI();
  try{
    engine=new TransmissionMachine(canvas);console.info('AETER/NOVA TRANSMISSION MACHINE V5.0 // NIGHT CIRCUIT');
    $('#lens-status').textContent='LOCAL 3D // V5 ONLINE';$('#boot-status').textContent='CITY ONLINE';$('#boot-renderer').textContent='WEBGL2 / GPU ONLINE';
    engine.onNavigate=route=>{if(!mapOverlay.hidden){closeMap(false);current=overlayReturn;engine.setRoute(overlayReturn,true);}navigate(route);};
    engine.onHover=route=>{$('#lens-hint').textContent=route?`CLICK TO TRANSMIT // ${routeName(route)}`:'DRAG SPACE · SCROLL DEPTH · CLICK SIGNALS';};
    engine.onFrame=f=>{$('#telemetry-phase').textContent=f.time.toFixed(3);updateMapLabels(f.map||[]);const lvl=audioLevel();engine.setAudioLevel(lvl);root.style.setProperty('--audio-level',lvl.toFixed(3));root.style.setProperty('--render-quality',(f.quality||1).toFixed(2));body.classList.toggle('perf-low',(f.quality||1)<.82);$('#lens-status').textContent=`LOCAL 3D // ${Math.round(f.fps||60)} FPS // Q${Math.round((f.quality||1)*100)}`;$('#telemetry-gpu').textContent=`Q${Math.round((f.quality||1)*100)}`;if(!mapOverlay.hidden)$('#map-readout').textContent=`${(Math.sin(f.time*.21)*47.2).toFixed(3)} // ${(Math.cos(f.time*.17)*88.4).toFixed(3)}`;};
    current=routeFromHash();if(!engine.scenes[current])current='home';setPalette(current);renderLens(current);engine.setRoute(current,true);$('#engine-error').hidden=true;
  }catch(e){console.error(e);$('#engine-error').hidden=false;$('#engine-error').innerHTML=`<b>LOCAL WEBGL2 ENGINE COULD NOT START</b><span>${esc(e.message)}</span><a href="DIAGNOSTICS.html">OPEN DIAGNOSTICS →</a>`;$('#lens-status').textContent='WEBGL2 ERROR';$('#boot-status').textContent='GPU LINK ERROR';}
  if(window.__AETER_BOOT_INTENT__!==undefined){const v=window.__AETER_BOOT_INTENT__;delete window.__AETER_BOOT_INTENT__;enter(v);}
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
