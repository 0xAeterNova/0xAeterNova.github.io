import { TransmissionMachine } from './engine.js';
import { profile, projects, skills, achievements, realms } from './data.js';

const $=(q,p=document)=>p.querySelector(q), $$=(q,p=document)=>[...p.querySelectorAll(q)];
const root=document.documentElement, body=document.body;
const canvas=$('#webgl'), boot=$('#boot'), lens=$('#lens'), lensContent=$('#lens-content');
const transition=$('#transition'), transitionWord=$('#transition-word'), transitionKicker=$('#transition-kicker');
const mapOverlay=$('#map'), mapLabels=$('#map-labels'), commandOverlay=$('#command'), commandInput=$('#command-input'), commandResults=$('#command-results');
const soundtrack=$('#soundtrack'), volume=$('#volume'), soundBtn=$('#sound-btn');
let engine=null,current='home',overlayReturn='home',tourTimer=null,tourOn=false,focusMode=false;
let audioCtx=null,source=null,analyser=null,master=null,filter=null,freqData=null,soundStarted=false,muted=false,selectedSearch=0,searchItems=[];

const routeName=route=>{
  if(route.startsWith('project/'))return projects.find(p=>route===`project/${p.slug}`)?.name||'PROJECT';
  return {home:'ORIGIN',projects:'ARCHIVE',cyber:'BREACH',about:'ORBIT',contact:'UPLINK',map:'LATTICE',search:'ACQUISITION'}[route]||route.toUpperCase();
};
const routeMeta=route=>{
  if(route.startsWith('project/')){const p=projects.find(p=>route===`project/${p.slug}`);return {num:p?.label?.slice(0,2)||'01',code:p?.name?.toUpperCase()||'PROJECT'};}
  return {home:{num:'00',code:'ORIGIN'},projects:{num:'01',code:'ARCHIVE'},cyber:{num:'02',code:'BREACH'},about:{num:'03',code:'ORBIT'},contact:{num:'04',code:'UPLINK'}}[route]||{num:'--',code:'SIGNAL'};
};
const paletteFor=route=>{
  const p=route.startsWith('project/')?projects.find(x=>route===`project/${x.slug}`):null;
  if(p){if(p.realm==='ruvigil')return ['#47f5ff','#c67a24','#e7fff9'];if(p.realm==='phantom')return ['#ff5bd7','#6d44ff','#dffff4'];if(p.realm==='elif')return ['#b9ff43','#ff5038','#eef9ce'];return [p.accent,'#754dff','#fff4d5'];}
  return {home:['#ff744f','#8159ff','#fff0ad'],projects:['#ff2ea6','#19e6ff','#fff4cb'],cyber:['#faff00','#ff5a1f','#f3ffc0'],about:['#ffd87a','#7d52ff','#a9ffe6'],contact:['#88ffd5','#ff9b78','#e6e0ff'],map:['#6ce8ff','#ff5d98','#fff0ae'],search:['#ffffff','#ff5d98','#6ce8ff']}[route]||['#ff744f','#8159ff','#fff0ad'];
};
function setPalette(route){const [a,b,c]=paletteFor(route);root.style.setProperty('--a',a);root.style.setProperty('--b',b);root.style.setProperty('--c',c);}
function lensSide(route){if(route==='projects'||route==='about')return 'right';if(route==='contact')return 'center';return 'left';}
function setLensSide(side){lens.classList.remove('lens-left','lens-right','lens-center');lens.classList.add(`lens-${side}`);}
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}

function homeHTML(){return `
  <div class="kicker">THE TRANSMISSION MACHINE</div>
  <h1>Build.<span class="spectral">Break. Evolve.</span></h1>
  <p class="lead">I’m ${esc(profile.name)}. Robotics, artificial intelligence, embedded systems and low-level security are different frequencies of the same obsession: understanding machines deeply enough to build, bend and reinvent them.</p>
  <div class="signal-triad">
    <div><small>BUILD / 01</small><b>Robotics + Embedded</b><i style="--fill:92%"></i></div>
    <div><small>THINK / 02</small><b>AI + Vision</b><i style="--fill:88%"></i></div>
    <div><small>BREAK / 03</small><b>REV + PWN + CTF</b><i style="--fill:82%"></i></div>
  </div>
  <div class="actions"><button class="action primary magnetic" data-route="projects">TRANSMIT TO ARCHIVE →</button><a class="action magnetic" href="${profile.links.github}" target="_blank" rel="noreferrer">GITHUB ↗</a></div>
  <div class="frequency-strip" aria-hidden="true">${Array.from({length:28},(_,i)=>`<i style="--i:${i};--h:${18+(i*31)%82}%"></i>`).join('')}</div>`;}

function projectsHTML(){return `
  <div class="kicker">PROJECT CONSTELLATION / LIVE SIGNALS</div>
  <h2>Archive of<br><span class="spectral">built things.</span></h2>
  <p class="lead">Each project has its own machine state. Select a transmission and the entire 3D field reconfigures around it.</p>
  <div class="project-list">${projects.map((p,i)=>`<button class="project-row magnetic" type="button" data-route="project/${p.slug}" style="--project:${p.accent}"><span class="n">${String(i+1).padStart(2,'0')}</span><span class="project-copy"><small>${esc(p.label)}</small><b>${esc(p.name)}</b><p>${esc(p.tagline)}</p></span><span class="signal-mark"><i></i><b>OPEN</b></span></button>`).join('')}</div>`;}

function projectHTML(route){const p=projects.find(x=>route===`project/${x.slug}`);if(!p)return projectsHTML();return `
  <div class="project-head"><div><div class="kicker">${esc(p.label)}</div><h2>${esc(p.name)}</h2><p class="lead">${esc(p.tagline)}</p></div><span class="project-status">${esc(p.status)}</span></div>
  <div class="project-visual"><img src="${p.poster}" alt="${esc(p.name)} project artwork"><div class="project-scan"></div><small>LIVE PROJECT SIGNAL / ${esc(p.year)}</small></div>
  <p class="project-desc">${esc(p.long)}</p>
  <div class="tag-cloud">${p.stack.map(s=>`<span class="tag">${esc(s)}</span>`).join('')}</div>
  <div class="project-facts"><div><small>ROLE</small><b>${esc(p.role)}</b></div><div><small>YEAR</small><b>${esc(p.year)}</b></div><div><small>STATE</small><b>${esc(p.status)}</b></div></div>
  <div class="actions"><a class="action primary magnetic" href="${p.repository}" target="_blank" rel="noreferrer">REPOSITORY ↗</a><button class="action magnetic" data-route="projects">← ARCHIVE</button></div>`;}

function cyberHTML(){return `
  <div class="kicker">BREACH STATE / LOW-LEVEL SIGNAL</div>
  <h2>Take it apart.<br><span class="spectral">Know it better.</span></h2>
  <p class="lead">Reverse engineering, binary exploitation and forensics turn software into something observable instead of mysterious. CTFs make that curiosity measurable under pressure.</p>
  <div class="terminal"><div class="terminal-head"><i></i><i></i><i></i><span>root@0xaeternova // live</span></div><pre><span class="p">root@0xaeternova:~#</span> whoami
robotics_ai + reverse_engineering + pwn

<span class="p">root@0xaeternova:~#</span> team
GeomRavage

<span class="p">root@0xaeternova:~#</span> methodology
observe → disassemble → exploit → understand → rebuild █</pre></div>
  <div class="achievement-stack">${achievements.map(a=>`<a href="${a.url}" target="_blank" rel="noreferrer"><small>VERIFIED SIGNAL</small><b>${esc(a.title)} ↗</b><p>${esc(a.text)}</p></a>`).join('')}</div>
  <div class="actions"><a class="action primary" href="${profile.links.ctftime}" target="_blank" rel="noreferrer">CTFTIME ↗</a><a class="action" href="${profile.links.team}" target="_blank" rel="noreferrer">GEOMRAVAGE ↗</a></div>`;}

function aboutHTML(){return `
  <div class="about-grid">
    <div class="about-portrait"><img src="assets/profile/profile-hero-dark.svg" alt="0xAeterNova GitHub profile hero"><div class="portrait-scan"></div><span>IDENTITY SIGNAL // 0xAeterNova</span></div>
    <div class="about-copy"><div class="kicker">ORBIT / IDENTITY TRANSMISSION</div><h2>Between machines<br><span class="spectral">and imagination.</span></h2><p class="lead">A multidisciplinary Robotics & Artificial Intelligence student focused on systems that perceive, reason and interact with the real world — while going deep enough into software to reverse, exploit and understand it from the inside.</p></div>
  </div>
  <div class="about-spectrum">${skills.slice(0,10).map((s,i)=>`<div class="spectrum-row"><span><small>${esc(s.family)}</small><b>${esc(s.name)}</b></span><i><b style="width:${Math.round(s.level*100)}%"></b></i><em>${Math.round(s.level*100)}</em></div>`).join('')}</div>
  <div class="identity-panels"><div><small>CURRENT VECTOR</small><b>Robotics / AI / Embedded</b><p>Building perception and intelligent physical systems.</p></div><div><small>SECOND VECTOR</small><b>Reverse / Pwn / CTF</b><p>Understanding systems below the abstraction layer.</p></div><div><small>OPERATING MODE</small><b>Build → Break → Evolve</b><p>Learning by making and taking things apart.</p></div></div>
  <div class="heatmap-wrap"><div class="heatmap-head"><span>GITHUB ACTIVITY FIELD</span><b>CONTRIBUTION SIGNAL</b></div><img src="assets/heatmap/dark.svg" alt="GitHub contribution heatmap"></div>`;}

function contactHTML(){const links=[['GitHub',profile.links.github,'CODE / PROJECTS'],['LinkedIn',profile.links.linkedin,'PROFESSIONAL'],['CTFtime',profile.links.ctftime,'COMPETITION'],['GeomRavage',profile.links.team,'TEAM'],['LinkTree',profile.links.linktree,'ALL CHANNELS'],['Telegram',profile.links.telegram,'DIRECT SIGNAL']];return `
  <div class="kicker">AURORA UPLINK / OPEN CHANNEL</div>
  <h2>Transmit<br><span class="spectral">a signal.</span></h2>
  <p class="lead">Robotics, AI, embedded systems, competitions, reverse engineering, research or strange technical ideas — choose a channel and send it.</p>
  <div class="contact-grid">${links.map((x,i)=>`<a class="contact-tile magnetic" href="${x[1]}" target="_blank" rel="noreferrer" style="--delay:${i*45}ms"><small>${esc(x[2])}</small><b>${esc(x[0])}<span>↗</span></b><i></i></a>`).join('')}</div>`;}

function renderLens(route){const meta=routeMeta(route);$('#lens-num').textContent=meta.num;$('#lens-code').textContent=meta.code;setLensSide(lensSide(route));if(route==='home')lensContent.innerHTML=homeHTML();else if(route==='projects')lensContent.innerHTML=projectsHTML();else if(route==='cyber')lensContent.innerHTML=cyberHTML();else if(route==='about')lensContent.innerHTML=aboutHTML();else if(route==='contact')lensContent.innerHTML=contactHTML();else if(route.startsWith('project/'))lensContent.innerHTML=projectHTML(route);$('#telemetry-field').textContent=routeName(route);$$('.phase-node').forEach(n=>n.classList.toggle('active',route===n.dataset.route||(route.startsWith('project/')&&n.dataset.route==='projects')));}

function buildDial(){const dial=$('#phase-dial');dial.innerHTML=realms.map(r=>`<button class="phase-node magnetic" type="button" data-route="${r.id}" title="${r.name}"><span>${r.number}</span><b class="phase-label">${r.name}</b></button>`).join('');}
function transitionTo(route){transitionWord.textContent=routeName(route);transitionKicker.textContent=route.startsWith('project/')?'LOCKING PROJECT SIGNAL':'TRANSMITTING';transition.classList.remove('active');void transition.offsetWidth;transition.classList.add('active');setTimeout(()=>transition.classList.remove('active'),1180);}
function navigate(route,{instant=false,hash=true}={}){if(!engine||!engine.scenes?.[route])return;if(route===current&&!instant)return;closeMap(false);closeSearch(false);const from=current;current=route;setPalette(route);renderLens(route);if(!instant)transitionTo(route);lens.classList.add('switching');setTimeout(()=>{engine.setRoute(route,instant);lens.classList.remove('switching')},instant?0:220);if(hash)history.replaceState(null,'','#'+(route.startsWith('project/')?'project/'+route.slice(8):route));txSweep(from,route);}

function routeFromHash(){const h=location.hash.replace(/^#/,'');if(h.startsWith('project/'))return `project/${h.slice(8)}`;return ['home','projects','cyber','about','contact'].includes(h)?h:'home';}

function mapLabelName(route){if(route.startsWith('project/'))return projects.find(p=>route===`project/${p.slug}`)?.name||'Project';return {home:'Origin',projects:'Archive',cyber:'Breach',about:'Orbit',contact:'Uplink'}[route]||route;}
function openMap(){if(!engine)return;overlayReturn=current;mapOverlay.hidden=false;body.classList.add('map-active');setPalette('map');engine.setRoute('map');mapLabels.innerHTML=['home','projects','cyber','about','contact',...projects.map(p=>`project/${p.slug}`)].map(r=>`<button class="map-node-label" data-route="${r}" data-map-route="${r}"><small>${r.startsWith('project/')?'PROJECT SIGNAL':'CORE REALM'}</small><b>${esc(mapLabelName(r))}</b><span>TRANSMIT ↗</span></button>`).join('');}
function closeMap(restore=true){if(mapOverlay.hidden)return;mapOverlay.hidden=true;mapLabels.innerHTML='';body.classList.remove('map-active');if(restore&&engine){setPalette(overlayReturn);engine.setRoute(overlayReturn,true);}}
function updateMapLabels(anchors){if(mapOverlay.hidden)return;anchors.forEach(a=>{const el=$(`[data-map-route="${CSS.escape(a.route)}"]`,mapLabels);if(!el)return;el.style.left=`${a.pos.x}px`;el.style.top=`${a.pos.y}px`;el.classList.toggle('behind',!a.pos.visible);});}

function openSearch(){if(!engine)return;overlayReturn=current;commandOverlay.hidden=false;body.classList.add('search-active');setPalette('search');engine.setRoute('search');commandInput.value='';selectedSearch=0;renderSearch();setTimeout(()=>commandInput.focus(),80);}
function closeSearch(restore=true){if(commandOverlay.hidden)return;commandOverlay.hidden=true;body.classList.remove('search-active');if(restore&&engine){setPalette(overlayReturn);engine.setRoute(overlayReturn,true);}}
function renderSearch(){searchItems=engine.search(commandInput.value);selectedSearch=searchItems.length?Math.max(0,Math.min(selectedSearch,Math.min(2,searchItems.length-1))):0;engine.setSearchResults(searchItems);commandResults.innerHTML=searchItems.slice(0,3).map((x,i)=>`<button class="command-item${i===selectedSearch?' active':''}" type="button" data-result="${i}"><span><small>${esc(x.type||'SIGNAL')} // ${String(i+1).padStart(2,'0')}</small><b>${esc(x.label)}</b></span><em>${i===selectedSearch?'LOCKED':'ACQUIRE'}</em></button>`).join('')||`<div class="search-empty"><b>NO SIGNAL LOCK</b><span>Try another project, skill or realm.</span></div>`;}
function commitSearch(i=selectedSearch){const hit=searchItems[i];if(!hit)return;closeSearch(false);current=overlayReturn;engine.setRoute(overlayReturn,true);navigate(hit.route);}

async function startSound(){try{if(!audioCtx){audioCtx=new (window.AudioContext||window.webkitAudioContext)();source=audioCtx.createMediaElementSource(soundtrack);filter=audioCtx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=15500;const comp=audioCtx.createDynamicsCompressor();comp.threshold.value=-14;comp.knee.value=16;comp.ratio.value=2.5;comp.attack.value=.006;comp.release.value=.26;analyser=audioCtx.createAnalyser();analyser.fftSize=256;analyser.smoothingTimeConstant=.8;master=audioCtx.createGain();master.gain.value=Number(volume.value)/100;source.connect(filter);filter.connect(comp);comp.connect(analyser);analyser.connect(master);master.connect(audioCtx.destination);freqData=new Uint8Array(analyser.frequencyBinCount);}if(audioCtx.state==='suspended')await audioCtx.resume();soundtrack.volume=1;await soundtrack.play();soundStarted=true;muted=false;soundBtn.textContent='♪';}catch(e){console.warn('Soundtrack start failed',e);toast('AUDIO COULD NOT START — CLICK ♪ TO RETRY');}}
function setVolume(v){if(master&&audioCtx)master.gain.setTargetAtTime(v,audioCtx.currentTime,.035);else soundtrack.volume=v;}
function toggleSound(){if(!soundStarted){startSound();return;}muted=!muted;if(master&&audioCtx)master.gain.setTargetAtTime(muted?0:Number(volume.value)/100,audioCtx.currentTime,.045);else soundtrack.muted=muted;soundBtn.textContent=muted?'×':'♪';}
function audioLevel(){if(!analyser||!freqData)return 0;analyser.getByteFrequencyData(freqData);let sum=0,n=0;for(let i=1;i<45;i++){sum+=freqData[i];n++;}return Math.min(1,(sum/n)/170);}
function txSweep(){if(!audioCtx||!soundStarted||muted)return;try{const t=audioCtx.currentTime;const osc=audioCtx.createOscillator(),g=audioCtx.createGain(),pan=audioCtx.createStereoPanner();osc.type='sine';osc.frequency.setValueAtTime(135,t);osc.frequency.exponentialRampToValueAtTime(880,t+.48);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.055,t+.08);g.gain.exponentialRampToValueAtTime(.0001,t+.6);pan.pan.setValueAtTime(-.65,t);pan.pan.linearRampToValueAtTime(.65,t+.6);osc.connect(g);g.connect(pan);pan.connect(master);osc.start(t);osc.stop(t+.62);filter?.frequency.cancelScheduledValues(t);filter?.frequency.setValueAtTime(filter.frequency.value,t);filter?.frequency.exponentialRampToValueAtTime(1500,t+.16);filter?.frequency.exponentialRampToValueAtTime(15500,t+.75);}catch{}}
function toast(text){const el=$('#toast');el.textContent=text;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),1800);}

function startTour(){if(tourOn){tourOn=false;clearInterval(tourTimer);$('#tour-btn').classList.remove('on');$('#tour-btn').textContent='AUTO TRANSMIT';return;}tourOn=true;$('#tour-btn').classList.add('on');$('#tour-btn').textContent='STOP TOUR';const sequence=['home','projects','project/ruvigil','project/phantom','project/elif-linux','cyber','about','contact'];let i=Math.max(0,sequence.indexOf(current));navigate(sequence[i],{instant:true});tourTimer=setInterval(()=>{if(!tourOn)return;i=(i+1)%sequence.length;navigate(sequence[i]);},7200);}
function enter(withSound){if(withSound)startSound();boot.classList.add('leaving');setTimeout(()=>boot.hidden=true,1150);}
window.AeterNovaEnter=enter;window.dispatchEvent(new Event('aeter-app-ready'));

function bindUI(){document.addEventListener('click',e=>{const route=e.target.closest('[data-route]')?.dataset.route;if(route){if(!mapOverlay.hidden&&e.target.closest('.map-node-label')){closeMap(false);current=overlayReturn;engine.setRoute(overlayReturn,true);}navigate(route);return;}const close=e.target.closest('[data-close]')?.dataset.close;if(close==='map')closeMap(true);if(close==='search')closeSearch(true);const ri=e.target.closest('[data-result]')?.dataset.result;if(ri!=null)commitSearch(Number(ri));});
  $('#map-btn').addEventListener('click',openMap);$('#command-btn').addEventListener('click',openSearch);$('#explode-btn').addEventListener('click',()=>{const v=engine.toggleExplode();$('#explode-btn').classList.toggle('on',v);toast(v?'MACHINE EXPLODED':'MACHINE REASSEMBLED');});$('#tour-btn').addEventListener('click',startTour);soundBtn.addEventListener('click',toggleSound);volume.addEventListener('input',e=>{setVolume(Number(e.target.value)/100);if(muted)toggleSound();});commandInput.addEventListener('input',()=>{selectedSearch=0;renderSearch();});
  addEventListener('keydown',e=>{if(e.key==='/'&&commandOverlay.hidden&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();openSearch();return;}if(e.key==='Escape'){if(!commandOverlay.hidden)closeSearch(true);else if(!mapOverlay.hidden)closeMap(true);return;}if(!commandOverlay.hidden){if(e.key==='ArrowDown'){e.preventDefault();selectedSearch=Math.min(2,selectedSearch+1);renderSearch();}if(e.key==='ArrowUp'){e.preventDefault();selectedSearch=Math.max(0,selectedSearch-1);renderSearch();}if(e.key==='Enter'){e.preventDefault();commitSearch();}return;}if(e.key.toLowerCase()==='m'){e.preventDefault();openMap();}if(e.key.toLowerCase()==='r'){engine.reset();toast('CAMERA RECENTERED');}if(e.key.toLowerCase()==='f'){focusMode=!focusMode;body.classList.toggle('focus-mode',focusMode);}if(e.key==='1')navigate('home');if(e.key==='2')navigate('projects');if(e.key==='3')navigate('cyber');if(e.key==='4')navigate('about');if(e.key==='5')navigate('contact');});
  const cursor=$('#cursor');addEventListener('pointermove',e=>{cursor.style.transform=`translate(${e.clientX}px,${e.clientY}px)`;});
  document.addEventListener('pointerover',e=>body.classList.toggle('cursor-hot',!!e.target.closest('button,a,input')));
}

function init(){buildDial();bindUI();try{engine=new TransmissionMachine(canvas);$('#lens-status').textContent='LOCAL 3D ONLINE';engine.onNavigate=route=>{if(!mapOverlay.hidden){closeMap(false);current=overlayReturn;engine.setRoute(overlayReturn,true);}navigate(route);};engine.onHover=route=>{$('#lens-hint').textContent=route?`CLICK TO TRANSMIT // ${routeName(route)}`:'DRAG SPACE · SCROLL DEPTH · CLICK SIGNALS';};engine.onFrame=f=>{$('#telemetry-phase').textContent=f.time.toFixed(3);updateMapLabels(f.map||[]);const lvl=audioLevel();engine.setAudioLevel(lvl);if(!mapOverlay.hidden)$('#map-readout').textContent=`${(Math.sin(f.time*.21)*47.2).toFixed(3)} // ${(Math.cos(f.time*.17)*88.4).toFixed(3)}`;};current=routeFromHash();if(!engine.scenes[current])current='home';setPalette(current);renderLens(current);engine.setRoute(current,true);$('#engine-error').hidden=true;}catch(e){console.error(e);$('#engine-error').hidden=false;$('#engine-error').innerHTML=`<b>LOCAL WEBGL2 ENGINE COULD NOT START</b><span>${esc(e.message)}</span><a href="DIAGNOSTICS.html">OPEN DIAGNOSTICS →</a>`;$('#lens-status').textContent='WEBGL2 ERROR';}
  if(window.__AETER_BOOT_INTENT__!==undefined){const v=window.__AETER_BOOT_INTENT__;delete window.__AETER_BOOT_INTENT__;enter(v);}
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
