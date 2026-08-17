import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.185.0/build/three.module.js';

export function initThreeStage() {
  const host = document.querySelector('#three-stage');
  if (!host || matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({alpha:true, antialias:true, powerPreference:'high-performance'}); }
  catch { host.insertAdjacentHTML('afterend','<div class="fallback-orb"></div>'); return null; }

  const mem = navigator.deviceMemory || 8;
  const isMobile = innerWidth < 760;
  let quality = localStorage.getItem('aeter-quality') || 'auto';
  const isLow = () => quality === 'low' || (quality === 'auto' && (isMobile || mem <= 4));
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030712, .055);
  const camera = new THREE.PerspectiveCamera(42, innerWidth/innerHeight, .1, 100);
  camera.position.set(isMobile ? 0 : 1.6, 1.2, isMobile ? 10.8 : 9.2);

  renderer.setPixelRatio(Math.min(devicePixelRatio, isLow()?1.15:1.55));
  renderer.setSize(innerWidth,innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.appendChild(renderer.domElement);

  const world = new THREE.Group(); scene.add(world);
  world.position.set(isMobile ? 1.0 : 2.9, .25, 0);

  const ambient = new THREE.AmbientLight(0x86a8c0, 1.25); scene.add(ambient);
  const cyanLight = new THREE.PointLight(0x22d3ee, 18, 12, 2); cyanLight.position.set(3,2,4); scene.add(cyanLight);
  const purpleLight = new THREE.PointLight(0x7c3aed, 14, 12, 2); purpleLight.position.set(-3,-1,2); scene.add(purpleLight);

  const coreGroup = new THREE.Group(); world.add(coreGroup);
  const solid = new THREE.Mesh(new THREE.IcosahedronGeometry(1.18,1), new THREE.MeshStandardMaterial({color:0x0b1730, roughness:.34, metalness:.8, emissive:0x081728, emissiveIntensity:.62, transparent:true, opacity:.9})); coreGroup.add(solid);
  const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.22,1), new THREE.MeshBasicMaterial({color:0x22d3ee, wireframe:true, transparent:true, opacity:.28})); coreGroup.add(wire);
  const node = new THREE.Mesh(new THREE.OctahedronGeometry(.37,0), new THREE.MeshStandardMaterial({color:0xd8fbff, emissive:0x22d3ee, emissiveIntensity:2.2, roughness:.22, metalness:.55})); coreGroup.add(node);

  const ringMats = [0x7c3aed,0x22d3ee,0x10b981].map((c,i)=>new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.28-i*.055,wireframe:true}));
  [1.75,2.15,2.55].forEach((r,i)=>{ const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.013,6,96), ringMats[i]); ring.rotation.set(Math.PI*(.28+i*.13),.4+i*.55,.25); coreGroup.add(ring); });

  const orbiters=[];
  const orbGeom = new THREE.BoxGeometry(.16,.16,.16);
  [0x22d3ee,0x7c3aed,0x10b981,0x8bdcf2,0xa78bfa].forEach((color,i)=>{
    const m=new THREE.Mesh(orbGeom,new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.8,metalness:.4,roughness:.4}));
    m.userData={radius:2.1+(i%3)*.42,speed:.18+i*.025,offset:i*1.28,y:(i-2)*.32}; coreGroup.add(m);orbiters.push(m);
  });

  const particleCount = isLow()?180:420;
  const pos = new Float32Array(particleCount*3);
  for(let i=0;i<particleCount;i++){ const j=i*3; pos[j]=(Math.random()-.5)*16;pos[j+1]=(Math.random()-.5)*9;pos[j+2]=(Math.random()-.5)*9; }
  const pgeo=new THREE.BufferGeometry();pgeo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const particles=new THREE.Points(pgeo,new THREE.PointsMaterial({color:0x71ddec,size:.018,transparent:true,opacity:.42,sizeAttenuation:true}));scene.add(particles);

  const grid = new THREE.GridHelper(24, 24, 0x14334d, 0x0c1729); grid.position.y=-3.2; grid.material.transparent=true;grid.material.opacity=.34;scene.add(grid);

  const cursor={x:0,y:0}, target={x:0,y:0};
  addEventListener('pointermove',e=>{ target.x=(e.clientX/innerWidth-.5)*2; target.y=(e.clientY/innerHeight-.5)*2; },{passive:true});
  let scrollNorm=0; addEventListener('scroll',()=>{scrollNorm=Math.min(scrollY/Math.max(innerHeight,1),1.5)},{passive:true});

  const clock=new THREE.Clock(); let running=true;
  document.addEventListener('visibilitychange',()=>running=!document.hidden);
  function frame(){
    if(!running) return;
    const t=clock.getElapsedTime();
    cursor.x += (target.x-cursor.x)*.035; cursor.y += (target.y-cursor.y)*.035;
    coreGroup.rotation.y=t*.11+cursor.x*.18+scrollNorm*.22; coreGroup.rotation.x=Math.sin(t*.25)*.08-cursor.y*.11;
    wire.rotation.y=-t*.17; node.rotation.set(t*.42,t*.55,t*.2);
    orbiters.forEach((m,i)=>{ const a=t*m.userData.speed*2+m.userData.offset; m.position.set(Math.cos(a)*m.userData.radius,m.userData.y+Math.sin(a*1.7)*.24,Math.sin(a)*m.userData.radius);m.rotation.x=a;m.rotation.y=a*.7; });
    particles.rotation.y=t*.006; particles.rotation.x=Math.sin(t*.08)*.03;
    camera.position.x=(isMobile?0:1.6)+cursor.x*.34;camera.position.y=1.2-cursor.y*.22-scrollNorm*.18;camera.lookAt(isMobile?.8:2.2,.05,0);
    renderer.render(scene,camera);
  }
  renderer.setAnimationLoop(frame);
  host.classList.add('ready');

  const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,isLow()?1.15:1.55));};
  addEventListener('resize',resize,{passive:true});

  document.querySelectorAll('[data-quality]').forEach(btn=>btn.addEventListener('click',()=>{
    quality=btn.dataset.quality;localStorage.setItem('aeter-quality',quality);
    document.querySelectorAll('[data-quality]').forEach(b=>b.classList.toggle('active',b.dataset.quality===quality));resize();
  }));
  document.querySelectorAll('[data-quality]').forEach(b=>b.classList.toggle('active',b.dataset.quality===quality));
  return renderer;
}
