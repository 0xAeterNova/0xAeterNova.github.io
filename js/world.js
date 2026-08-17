import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.185.0/build/three.module.min.js';
import { projects } from './data.js';

const C = {
  bg: 0x030712,
  floor: 0x050b17,
  cyan: 0x22d3ee,
  purple: 0x7c3aed,
  green: 0x10b981,
  blue: 0x38bdf8,
  white: 0xdbeafe,
  muted: 0x334155
};

const routePositions = {
  home: new THREE.Vector3(0, 0, 0),
  projects: new THREE.Vector3(0, 0, -31),
  security: new THREE.Vector3(36, 0, 8),
  about: new THREE.Vector3(-35, 0, 10),
  contact: new THREE.Vector3(0, 0, 39)
};

const projectPositions = {
  ruvigil: new THREE.Vector3(-18, 0, -27),
  phantom: new THREE.Vector3(0, 0, -41),
  'elif-linux': new THREE.Vector3(18, 0, -27)
};

// New projects added in data.js get a world position automatically.
// The first three keep their hand-designed hero positions; later projects fill rear rows.
projects.forEach((project, index) => {
  if (projectPositions[project.slug]) return;
  const extra = index - 3;
  const col = extra % 4;
  const row = Math.floor(extra / 4);
  projectPositions[project.slug] = new THREE.Vector3(-27 + col * 18, 0, -52 + row * 15);
});

function mat(color, emissive = 0x000000, emissiveIntensity = 0) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.56,
    metalness: 0.45,
    emissive,
    emissiveIntensity
  });
}

function glowMaterial(color, opacity = 1) {
  return new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, toneMapped: false });
}

function makeLabel(text, accent = '#22d3ee', width = 360, height = 88) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'rgba(3,7,18,.84)';
  ctx.fillRect(2, 2, width - 4, height - 4);
  ctx.strokeStyle = accent;
  ctx.globalAlpha = 0.6;
  ctx.strokeRect(2, 2, width - 4, height - 4);
  ctx.globalAlpha = 1;
  ctx.fillStyle = accent;
  ctx.fillRect(14, 14, 4, height - 28);
  ctx.fillStyle = '#dbeafe';
  ctx.font = '700 24px monospace';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 32, height / 2 - 4);
  ctx.fillStyle = '#64748b';
  ctx.font = '700 10px monospace';
  ctx.fillText('AETERNOVA // INTERACT', 32, height / 2 + 22);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
  sprite.scale.set(width / 80, height / 80, 1);
  return sprite;
}

function makeHexFloor(scene) {
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(140, 140),
    new THREE.MeshStandardMaterial({ color: C.floor, roughness: 0.92, metalness: 0.08 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const grid = new THREE.GridHelper(140, 70, 0x164e63, 0x172033);
  grid.material.transparent = true;
  grid.material.opacity = 0.26;
  grid.position.y = 0.012;
  scene.add(grid);

  const ringGeo = new THREE.RingGeometry(56, 56.09, 160);
  const ring = new THREE.Mesh(ringGeo, glowMaterial(C.purple, 0.25));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.02;
  scene.add(ring);

  const crossMat = glowMaterial(C.cyan, 0.12);
  const roadA = new THREE.Mesh(new THREE.PlaneGeometry(5.3, 92), crossMat.clone());
  roadA.rotation.x = -Math.PI / 2;
  roadA.position.set(0, 0.025, 1);
  scene.add(roadA);
  const roadB = new THREE.Mesh(new THREE.PlaneGeometry(86, 5.3), crossMat.clone());
  roadB.rotation.x = -Math.PI / 2;
  roadB.position.set(0, 0.026, 5);
  scene.add(roadB);

  const dashMat = glowMaterial(C.cyan, 0.5);
  for (let z = -52; z <= 52; z += 4) {
    const d = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 1.5), dashMat);
    d.rotation.x = -Math.PI / 2;
    d.position.set(0, 0.04, z);
    scene.add(d);
  }
  for (let x = -52; x <= 52; x += 4) {
    const d = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.08), dashMat);
    d.rotation.x = -Math.PI / 2;
    d.position.set(x, 0.041, 5);
    scene.add(d);
  }
}

function makeStars(scene, count) {
  const g = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 55 + Math.random() * 65;
    const a = Math.random() * Math.PI * 2;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = 6 + Math.random() * 42;
    pos[i * 3 + 2] = Math.sin(a) * r;
  }
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(g, new THREE.PointsMaterial({ color: 0x8ec5ff, size: 0.085, transparent: true, opacity: 0.7 }));
  scene.add(pts);
  return pts;
}


function makeSkyline(scene, animated) {
  const buildings = new THREE.Group();
  const baseMat = mat(0x07101e, 0x0e7490, 0.06);
  const windowMat = glowMaterial(C.cyan, 0.36);
  for (let i = 0; i < 48; i++) {
    const a = i / 48 * Math.PI * 2 + (i % 3) * .035;
    const r = 62 + (i % 5) * 2.1;
    const h = 5 + (i * 7 % 15);
    const w = 1.8 + (i % 4) * .52;
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), baseMat);
    b.position.set(Math.cos(a) * r, h / 2, Math.sin(a) * r);
    b.rotation.y = -a;
    buildings.add(b);
    if (i % 2 === 0) {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(.035, h * .68, w * .62), windowMat);
      strip.position.set(b.position.x - Math.sin(a) * (w/2+.03), h*.52, b.position.z - Math.cos(a) * (w/2+.03));
      strip.rotation.y = -a;
      buildings.add(strip);
    }
  }
  scene.add(buildings);
  const moon = new THREE.Mesh(new THREE.IcosahedronGeometry(5.8, 2), new THREE.MeshBasicMaterial({ color:0x0b1c35, wireframe:true, transparent:true, opacity:.36 }));
  moon.position.set(-42, 33, -74);
  scene.add(moon);
  const moonCore = new THREE.Mesh(new THREE.SphereGeometry(4.6, 20, 14), new THREE.MeshBasicMaterial({ color:0x07152a, transparent:true, opacity:.84 }));
  moonCore.position.copy(moon.position);
  scene.add(moonCore);

  const drones = [];
  for (let i=0;i<6;i++) {
    const d = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(.55,.16,.85), mat(0x101b2c));
    d.add(body);
    for (const x of [-.42,.42]) {
      const light = new THREE.Mesh(new THREE.SphereGeometry(.06,6,4), glowMaterial(i%2?C.purple:C.cyan,.9));
      light.position.set(x,0,.24); d.add(light);
    }
    scene.add(d); drones.push(d);
  }
  animated.push({ type:'environment', object:buildings, moon, moonCore, drones });
}

function addPlatform(group, accent = C.cyan, radius = 6.2) {
  const base = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius + 0.3, 0.42, 48), mat(0x091323));
  base.position.y = 0.21;
  base.receiveShadow = true;
  group.add(base);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(radius - 0.22, 0.055, 8, 80), glowMaterial(accent, 0.88));
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.48;
  group.add(ring);
  const inner = new THREE.Mesh(new THREE.RingGeometry(radius * 0.44, radius * 0.445, 64), glowMaterial(accent, 0.25));
  inner.rotation.x = -Math.PI / 2;
  inner.position.y = 0.49;
  group.add(inner);
}

function createHomeStation(scene, animated) {
  const g = new THREE.Group();
  addPlatform(g, C.cyan, 7.1);
  const core = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 2.45, 4.8, 6), mat(0x0d1729, C.cyan, 0.15));
  core.position.y = 2.65;
  core.castShadow = true;
  g.add(core);
  const torus = new THREE.Mesh(new THREE.TorusGeometry(3.25, 0.13, 10, 80), glowMaterial(C.cyan, 0.85));
  torus.rotation.x = Math.PI / 2;
  torus.position.y = 3.0;
  g.add(torus);
  const torus2 = new THREE.Mesh(new THREE.TorusGeometry(2.7, 0.07, 8, 64), glowMaterial(C.purple, 0.75));
  torus2.rotation.set(Math.PI / 2, 0.4, 0.2);
  torus2.position.y = 4.4;
  g.add(torus2);
  const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(1.02, 0), mat(0x0b1830, C.cyan, 1.7));
  crystal.position.y = 6.3;
  g.add(crystal);
  const label = makeLabel('0xAETERNOVA // HOME');
  label.position.set(0, 5.2, 4.8);
  g.add(label);
  scene.add(g);
  animated.push({ type: 'home', object: g, torus, torus2, crystal });
  return g;
}

function createRuVigil(scene, position, project, animated) {
  const g = new THREE.Group(); g.position.copy(position); addPlatform(g, C.cyan, 5.8);
  const towerMat = mat(0x0b1728, C.cyan, 0.25);
  const towers = [];
  for (let i = 0; i < 5; i++) {
    const a = i / 5 * Math.PI * 2;
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.48, 4.5, 8), towerMat);
    t.position.set(Math.cos(a) * 3.1, 2.7, Math.sin(a) * 3.1);
    t.castShadow = true; g.add(t); towers.push(t);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.52, 12, 8), glowMaterial(C.cyan, 0.92));
    cap.position.set(t.position.x, 5.05, t.position.z); g.add(cap);
  }
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.45, 1.6, 12), mat(0x0b1729, C.green, .4));
  hub.position.y = 1.3; g.add(hub);
  const waves = [];
  for (let i = 0; i < 3; i++) {
    const r = new THREE.Mesh(new THREE.TorusGeometry(1.5 + i * .7, .035, 6, 64), glowMaterial(C.green, .5 - i * .1));
    r.rotation.x = Math.PI / 2; r.position.y = 1.8; g.add(r); waves.push(r);
  }
  const label = makeLabel('RUVIGIL // RF SENSING', project.color); label.position.set(0, 6.6, 0); g.add(label);
  scene.add(g); animated.push({ type:'ruvigil', object:g, waves, towers });
  return g;
}

function createPhantom(scene, position, project, animated) {
  const g = new THREE.Group(); g.position.copy(position); addPlatform(g, C.purple, 5.8);
  const head = new THREE.Mesh(new THREE.IcosahedronGeometry(1.85, 2), new THREE.MeshStandardMaterial({ color:0x10182f, wireframe:true, emissive:C.purple, emissiveIntensity:.45 }));
  head.scale.y = 1.18; head.position.y = 3.3; g.add(head);
  const face = new THREE.Mesh(new THREE.IcosahedronGeometry(1.55, 1), new THREE.MeshStandardMaterial({ color:0x0a1225, roughness:.35, metalness:.8, emissive:C.purple, emissiveIntensity:.18 }));
  face.scale.y = 1.18; face.position.y=3.3; g.add(face);
  const rings=[];
  [[2.8,0],[3.45,.9],[4.05,-.65]].forEach(([r,rot],i)=>{
    const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.045,6,80),glowMaterial(i===1?C.cyan:C.purple,.62));
    ring.position.y=3.4; ring.rotation.set(.75+i*.3,rot,.2*i); g.add(ring); rings.push(ring);
  });
  const nodes=[];
  for(let i=0;i<8;i++){
    const a=i/8*Math.PI*2; const n=new THREE.Mesh(new THREE.SphereGeometry(.12,8,6),glowMaterial(i%2?C.cyan:C.purple,.9));
    n.position.set(Math.cos(a)*3.8,3.4+(i%3-.8)*.45,Math.sin(a)*3.8); g.add(n); nodes.push(n);
  }
  const label=makeLabel('PHANTOM // MULTIMODAL AI',project.color); label.position.set(0,7,0); g.add(label);
  scene.add(g); animated.push({type:'phantom',object:g,head,rings,nodes});
  return g;
}

function createElif(scene, position, project, animated) {
  const g=new THREE.Group(); g.position.copy(position); addPlatform(g,C.blue,5.8);
  const bunker=new THREE.Mesh(new THREE.BoxGeometry(6.4,2.5,4.5),mat(0x091221,C.blue,.12)); bunker.position.y=1.75; bunker.castShadow=true; g.add(bunker);
  const roof=new THREE.Mesh(new THREE.BoxGeometry(6.8,.38,4.9),mat(0x111a2b,C.purple,.22)); roof.position.y=3.2; g.add(roof);
  const door=new THREE.Mesh(new THREE.BoxGeometry(2.2,1.55,.12),mat(0x07101e,C.cyan,.55)); door.position.set(0,1.45,2.31); g.add(door);
  for(let i=-2;i<=2;i++){
    const line=new THREE.Mesh(new THREE.BoxGeometry(.55,.06,.08),glowMaterial(i%2?C.blue:C.purple,.82)); line.position.set(i*.72,1.25+((i+2)%3)*.27,2.39); g.add(line);
  }
  const antenna=new THREE.Mesh(new THREE.CylinderGeometry(.08,.11,3.8,8),mat(0x334155)); antenna.position.set(0,5.15,0); g.add(antenna);
  const beacon=new THREE.Mesh(new THREE.TorusGeometry(1.3,.06,6,48),glowMaterial(C.blue,.8)); beacon.position.set(0,6.7,0); beacon.rotation.x=Math.PI/2; g.add(beacon);
  const label=makeLabel('ELIF // SECURITY LINUX',project.color); label.position.set(0,7.8,0); g.add(label);
  scene.add(g); animated.push({type:'elif',object:g,beacon});
  return g;
}

function createSecurity(scene, animated) {
  const g=new THREE.Group(); g.position.copy(routePositions.security); addPlatform(g,C.green,7);
  const archMat=mat(0x0a1723,C.green,.28);
  for (const x of [-3.2,3.2]) { const p=new THREE.Mesh(new THREE.BoxGeometry(1,6,1),archMat); p.position.set(x,3.2,0); g.add(p); }
  const top=new THREE.Mesh(new THREE.BoxGeometry(7.4,.8,1),archMat); top.position.set(0,6.2,0); g.add(top);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(2.3,.15,10,80),glowMaterial(C.green,.82)); ring.position.y=3.35; g.add(ring);
  const target=new THREE.Mesh(new THREE.TorusGeometry(.7,.08,8,40),glowMaterial(C.cyan,.9)); target.position.set(0,3.35,.06); g.add(target);
  const label=makeLabel('CYBER ARENA // REV + PWN','#10b981'); label.position.set(0,8,0); g.add(label);
  scene.add(g); animated.push({type:'security',object:g,ring,target});
}

function createAbout(scene, animated) {
  const g=new THREE.Group(); g.position.copy(routePositions.about); addPlatform(g,C.purple,7);
  const dome=new THREE.Mesh(new THREE.SphereGeometry(3.4,28,18,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0x091224,wireframe:true,emissive:C.purple,emissiveIntensity:.32})); dome.position.y=.5; g.add(dome);
  const core=new THREE.Mesh(new THREE.SphereGeometry(1.05,20,14),mat(0x081222,C.purple,.9)); core.position.y=3.15; g.add(core);
  const rings=[];
  for(let i=0;i<3;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(2.2+i*.62,.04,6,64),glowMaterial(i===1?C.cyan:C.purple,.55));r.position.y=3.15;r.rotation.set(.5+i*.45,i*.8,.2);g.add(r);rings.push(r)}
  const label=makeLabel('ABOUT // OBSERVATORY','#a78bfa'); label.position.set(0,7.4,0); g.add(label);
  scene.add(g); animated.push({type:'about',object:g,rings,core});
}

function createContact(scene, animated) {
  const g=new THREE.Group(); g.position.copy(routePositions.contact); addPlatform(g,C.cyan,7);
  const mast=new THREE.Mesh(new THREE.CylinderGeometry(.22,.36,7.5,10),mat(0x142033,C.cyan,.15)); mast.position.y=4.1; g.add(mast);
  const dish=new THREE.Mesh(new THREE.SphereGeometry(2.2,24,12,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0x0d1b2f,side:THREE.DoubleSide,roughness:.35,metalness:.65,emissive:C.cyan,emissiveIntensity:.15})); dish.scale.z=.38; dish.rotation.x=-.85; dish.position.set(0,7.4,-.55); g.add(dish);
  const signal=[];
  for(let i=0;i<3;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(2.2+i*1.15,.04,6,64),glowMaterial(C.cyan,.46-i*.08));r.rotation.x=Math.PI/2;r.position.set(0,9.2,-2.2);g.add(r);signal.push(r)}
  const label=makeLabel('CONTACT // UPLINK','#22d3ee'); label.position.set(0,11,0); g.add(label);
  scene.add(g); animated.push({type:'contact',object:g,dish,signal});
}

function createVehicle(scene) {
  const vehicle = new THREE.Group();
  vehicle.position.set(0, .55, 10);
  const dark=mat(0x0a1220,C.cyan,.16), metal=mat(0x1d293a);
  const body=new THREE.Mesh(new THREE.BoxGeometry(2.2,.55,3.7),dark); body.position.y=.45; body.castShadow=true; vehicle.add(body);
  const hood=new THREE.Mesh(new THREE.BoxGeometry(1.7,.38,1.15),mat(0x101b2c,C.purple,.25)); hood.position.set(0,.77,-1.05);vehicle.add(hood);
  const cockpit=new THREE.Mesh(new THREE.BoxGeometry(1.5,.55,1.35),new THREE.MeshStandardMaterial({color:0x07111f,metalness:.8,roughness:.2,emissive:C.cyan,emissiveIntensity:.16}));cockpit.position.set(0,1,.42);vehicle.add(cockpit);
  const bumper=new THREE.Mesh(new THREE.BoxGeometry(1.72,.08,.08),glowMaterial(C.cyan,.9));bumper.position.set(0,.6,-1.88);vehicle.add(bumper);
  const rear=new THREE.Mesh(new THREE.BoxGeometry(1.72,.08,.08),glowMaterial(C.purple,.9));rear.position.set(0,.6,1.88);vehicle.add(rear);
  const wheels=[];
  for(const x of [-1.16,1.16]) for(const z of [-1.15,1.15]){
    const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.48,.48,.32,16),metal);wheel.rotation.z=Math.PI/2;wheel.position.set(x,.45,z);wheel.castShadow=true;vehicle.add(wheel);wheels.push(wheel)
    const hub=new THREE.Mesh(new THREE.CylinderGeometry(.20,.20,.34,16),glowMaterial(x<0?C.cyan:C.purple,.65));hub.rotation.z=Math.PI/2;hub.position.copy(wheel.position);vehicle.add(hub)
  }
  const under=new THREE.PointLight(C.cyan,2.4,7,2);under.position.set(0,.05,0);vehicle.add(under);
  const trailCount=54;
  const trailPositions=[new Float32Array(trailCount*3),new Float32Array(trailCount*3)];
  const trails=trailPositions.map((arr,i)=>{
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(arr,3));
    const line=new THREE.Line(geo,new THREE.LineBasicMaterial({color:i===0?C.cyan:C.purple,transparent:true,opacity:.46}));scene.add(line);return line;
  });
  scene.add(vehicle);
  return { group:vehicle, wheels, speed:0, heading:Math.PI, steer:0, trails, trailPositions, trailCount, trailClock:0 };
}

export class PortfolioWorld {
  constructor(canvas, { onSectorChange, onNearZone } = {}) {
    this.canvas=canvas;
    this.scene=new THREE.Scene();
    this.scene.background=new THREE.Color(C.bg);
    this.scene.fog=new THREE.FogExp2(C.bg,.014);
    this.camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,220);
    this.camera.position.set(0,9,18);
    this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure=1.03;
    this.renderer.shadowMap.enabled=true;
    this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    this.clock=new THREE.Clock();
    this.animated=[];
    this.keys={};
    this.enabled=false;
    this.paused=false;
    this.cameraYaw=.0;
    this.cameraPitch=.30;
    this.cameraDistance=10.8;
    this.dragging=false;
    this.pointer={x:0,y:0};
    this.nearZone=null;
    this.sector='HOME';
    this.onSectorChange=onSectorChange || (()=>{});
    this.onNearZone=onNearZone || (()=>{});
    this.quality='auto';
    this.fly=null;
    this.worldTime=0;
    this.initScene();
    this.bind();
    this.resize();
  }

  initScene(){
    const hemi=new THREE.HemisphereLight(0x9fc8ff,0x08101e,1.05); this.scene.add(hemi);
    const key=new THREE.DirectionalLight(0xdbeafe,2.2);key.position.set(-14,28,18);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-60;key.shadow.camera.right=60;key.shadow.camera.top=60;key.shadow.camera.bottom=-60;this.scene.add(key);
    const fill=new THREE.PointLight(C.purple,8,80,2);fill.position.set(0,18,-28);this.scene.add(fill);
    const cyan=new THREE.PointLight(C.cyan,6,70,2);cyan.position.set(-24,10,14);this.scene.add(cyan);
    makeHexFloor(this.scene);
    this.stars=makeStars(this.scene,innerWidth<700?650:1500);
    makeSkyline(this.scene,this.animated);
    createHomeStation(this.scene,this.animated);
    projects.forEach(p=>{
      const pos=projectPositions[p.slug];
      if(p.station==='sensor')createRuVigil(this.scene,pos,p,this.animated);
      else if(p.station==='ai')createPhantom(this.scene,pos,p,this.animated);
      else createElif(this.scene,pos,p,this.animated);
    });
    createSecurity(this.scene,this.animated);
    createAbout(this.scene,this.animated);
    createContact(this.scene,this.animated);
    this.vehicle=createVehicle(this.scene);

    const beacons=[
      ['home',routePositions.home,7.5,'HOME'],
      ...projects.map(p=>[p.slug,projectPositions[p.slug],6.8,p.name.toUpperCase()]),
      ['security',routePositions.security,8,'CYBER'],['about',routePositions.about,8,'ABOUT'],['contact',routePositions.contact,8,'CONTACT']
    ];
    this.beacons=beacons.map(([id,pos,r,label])=>({id,pos:pos.clone(),radius:r,label}));
  }

  bind(){
    addEventListener('resize',()=>this.resize());
    addEventListener('keydown',e=>{this.keys[e.code]=true;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault()},{passive:false});
    addEventListener('keyup',e=>this.keys[e.code]=false);
    this.canvas.addEventListener('pointerdown',e=>{this.dragging=true;this.pointer.x=e.clientX;this.pointer.y=e.clientY;this.canvas.setPointerCapture?.(e.pointerId)});
    this.canvas.addEventListener('pointermove',e=>{if(!this.dragging||this.paused)return;const dx=e.clientX-this.pointer.x,dy=e.clientY-this.pointer.y;this.pointer.x=e.clientX;this.pointer.y=e.clientY;this.cameraYaw-=dx*.005;this.cameraPitch=THREE.MathUtils.clamp(this.cameraPitch+dy*.004,.08,.75)});
    this.canvas.addEventListener('pointerup',()=>this.dragging=false);
    this.canvas.addEventListener('wheel',e=>{if(this.paused)return;this.cameraDistance=THREE.MathUtils.clamp(this.cameraDistance+e.deltaY*.006,7.5,16)},{passive:true});
  }

  setControl(name,state){
    const map={forward:'KeyW',backward:'KeyS',left:'KeyA',right:'KeyD',boost:'ShiftLeft'};
    if(map[name])this.keys[map[name]]=state;
  }

  start(){this.enabled=true;this.animate()}
  pause(flag=true){this.paused=flag}

  resize(){
    const dpr=this.getDpr();
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(innerWidth,innerHeight,false);
    this.camera.aspect=innerWidth/innerHeight;this.camera.updateProjectionMatrix();
  }

  getDpr(){
    if(this.quality==='low')return 1;
    if(this.quality==='high')return Math.min(devicePixelRatio,1.8);
    const coarse=matchMedia('(pointer:coarse)').matches;return Math.min(devicePixelRatio,coarse?1.15:1.55);
  }

  setQuality(mode){this.quality=mode;this.resize();return mode}

  cycleQuality(){
    const modes=['auto','high','low'];
    this.quality=modes[(modes.indexOf(this.quality)+1)%modes.length];
    this.resize(); return this.quality;
  }

  getPlayerPosition(){return this.vehicle.group.position.clone()}

  respawn(){
    this.vehicle.group.position.set(0,.56,10);this.vehicle.heading=Math.PI;this.vehicle.speed=0;this.vehicle.steer=0;
    this.vehicle.trailPositions.forEach((arr,idx)=>{arr.fill(0);this.vehicle.trails[idx].geometry.attributes.position.needsUpdate=true});
  }

  getSpeedKmh(){return Math.round(Math.abs(this.vehicle.speed)*24)}

  updateVehicle(dt){
    if(this.paused||this.fly)return;
    const v=this.vehicle;
    const forward=this.keys.KeyW||this.keys.ArrowUp;
    const backward=this.keys.KeyS||this.keys.ArrowDown;
    const left=this.keys.KeyA||this.keys.ArrowLeft;
    const right=this.keys.KeyD||this.keys.ArrowRight;
    const boost=this.keys.ShiftLeft||this.keys.ShiftRight;
    const brake=this.keys.Space;
    const max=boost?12.8:8.2;
    const accel=forward?10.5:backward?-8.2:0;
    v.speed+=accel*dt;
    if(!forward&&!backward)v.speed*=Math.pow(.90,dt*60);
    if(brake)v.speed*=Math.pow(.79,dt*60);
    v.speed=THREE.MathUtils.clamp(v.speed,-max*.55,max);
    const targetSteer=(left?1:0)+(right?-1:0);
    v.steer=THREE.MathUtils.damp(v.steer,targetSteer,9,dt);
    const turnFactor=THREE.MathUtils.clamp(Math.abs(v.speed)/4,0,1);
    v.heading+=v.steer*dt*1.7*turnFactor*(v.speed>=0?1:-1);
    const dir=new THREE.Vector3(Math.sin(v.heading),0,Math.cos(v.heading));
    v.group.position.addScaledVector(dir,v.speed*dt);
    const lim=58;v.group.position.x=THREE.MathUtils.clamp(v.group.position.x,-lim,lim);v.group.position.z=THREE.MathUtils.clamp(v.group.position.z,-lim,lim);
    v.group.rotation.y=v.heading;
    v.group.rotation.z=THREE.MathUtils.damp(v.group.rotation.z,-v.steer*.05,7,dt);
    v.group.position.y=.56+Math.sin(this.worldTime*4)*.025;
    v.wheels.forEach(w=>w.rotation.x-=v.speed*dt*2.0);
    v.trailClock += dt;
    if(v.trailClock>.035){
      v.trailClock=0;
      const side=new THREE.Vector3(Math.cos(v.heading),0,-Math.sin(v.heading));
      v.trailPositions.forEach((arr,idx)=>{
        for(let i=v.trailCount-1;i>0;i--){arr[i*3]=arr[(i-1)*3];arr[i*3+1]=arr[(i-1)*3+1];arr[i*3+2]=arr[(i-1)*3+2]}
        const off=idx===0?-.62:.62;
        arr[0]=v.group.position.x+side.x*off;arr[1]=.12;arr[2]=v.group.position.z+side.z*off;
        v.trails[idx].geometry.attributes.position.needsUpdate=true;
      });
    }
  }

  updateCamera(dt){
    if(this.fly){
      const now=performance.now();
      const t=THREE.MathUtils.clamp((now-this.fly.start)/this.fly.duration,0,1);
      const e=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
      this.camera.position.lerpVectors(this.fly.from,this.fly.to,e);
      this.fly.look.copy(this.fly.lookFrom).lerp(this.fly.lookTo,e);
      this.camera.lookAt(this.fly.look);
      if(t>=1){const done=this.fly.resolve;this.fly=null;done?.()}
      return;
    }
    const v=this.vehicle.group;
    const ang=this.vehicle.heading+Math.PI+this.cameraYaw;
    const horiz=Math.cos(this.cameraPitch)*this.cameraDistance;
    const desired=new THREE.Vector3(v.position.x+Math.sin(ang)*horiz,v.position.y+2.0+Math.sin(this.cameraPitch)*this.cameraDistance,v.position.z+Math.cos(ang)*horiz);
    const stiffness=1-Math.pow(.0025,dt);
    this.camera.position.lerp(desired,stiffness);
    const look=new THREE.Vector3(v.position.x,v.position.y+1.0,v.position.z);
    this.camera.lookAt(look);
  }

  flyTo(id){
    const pos=projectPositions[id]||routePositions[id]||routePositions.home;
    let offset;
    if(id==='projects')offset=new THREE.Vector3(0,17,19);
    else if(id==='contact')offset=new THREE.Vector3(12,10,13);
    else if(id==='about')offset=new THREE.Vector3(13,9,14);
    else if(id==='security')offset=new THREE.Vector3(-14,9,12);
    else if(projectPositions[id])offset=new THREE.Vector3(10,7,12);
    else offset=new THREE.Vector3(11,9,15);
    return new Promise(resolve=>{
      const lookFrom=new THREE.Vector3();this.camera.getWorldDirection(lookFrom);lookFrom.multiplyScalar(8).add(this.camera.position);
      this.fly={start:performance.now(),duration:950,from:this.camera.position.clone(),to:pos.clone().add(offset),lookFrom,lookTo:pos.clone().add(new THREE.Vector3(0,2.3,0)),look:new THREE.Vector3(),resolve};
    });
  }

  returnToVehicle(){
    return new Promise(resolve=>{
      const v=this.vehicle.group.position;
      const ang=this.vehicle.heading+Math.PI+this.cameraYaw;
      const horiz=Math.cos(this.cameraPitch)*this.cameraDistance;
      const to=new THREE.Vector3(v.x+Math.sin(ang)*horiz,v.y+2+Math.sin(this.cameraPitch)*this.cameraDistance,v.z+Math.cos(ang)*horiz);
      const lookFrom=new THREE.Vector3();this.camera.getWorldDirection(lookFrom);lookFrom.multiplyScalar(8).add(this.camera.position);
      this.fly={start:performance.now(),duration:700,from:this.camera.position.clone(),to,lookFrom,lookTo:new THREE.Vector3(v.x,v.y+1,v.z),look:new THREE.Vector3(),resolve};
    });
  }

  updateZones(){
    const p=this.vehicle.group.position;
    let nearest=null,dist=Infinity;
    for(const b of this.beacons){const d=p.distanceTo(b.pos);if(d<dist){dist=d;nearest=b}}
    const near=nearest&&dist<nearest.radius?nearest:null;
    if((near?.id||null)!==(this.nearZone?.id||null)){this.nearZone=near;this.onNearZone(near)}
    let sector='TRANSIT';
    if(nearest&&dist<18)sector=nearest.label;
    if(sector!==this.sector){this.sector=sector;this.onSectorChange(sector)}
  }

  updateAnimations(dt){
    const t=this.worldTime;
    this.stars.rotation.y+=dt*.006;
    for(const a of this.animated){
      if(a.type==='home'){a.torus.rotation.z+=dt*.35;a.torus2.rotation.z-=dt*.22;a.crystal.rotation.y+=dt*.7;a.crystal.position.y=6.3+Math.sin(t*1.6)*.22}
      if(a.type==='ruvigil'){a.waves.forEach((w,i)=>{const s=1+((t*.32+i*.28)%1)*.34;w.scale.setScalar(s);w.material.opacity=.5-(s-1)*.9})}
      if(a.type==='phantom'){a.head.rotation.y+=dt*.15;a.rings.forEach((r,i)=>{r.rotation.y+=dt*(.18+i*.06);r.rotation.z+=dt*(i%2?.12:-.09)});a.nodes.forEach((n,i)=>n.position.y+=Math.sin(t*1.6+i)*dt*.05)}
      if(a.type==='elif'){a.beacon.rotation.z+=dt*.5;a.beacon.material.opacity=.6+Math.sin(t*3)*.2}
      if(a.type==='security'){a.ring.rotation.z+=dt*.55;a.target.scale.setScalar(1+Math.sin(t*3)*.06)}
      if(a.type==='about'){a.rings.forEach((r,i)=>r.rotation.y+=dt*(.13+i*.07));a.core.rotation.y-=dt*.22}
      if(a.type==='contact'){a.dish.rotation.z=Math.sin(t*.45)*.18;a.signal.forEach((r,i)=>{const s=1+((t*.24+i*.28)%1)*.28;r.scale.setScalar(s);r.material.opacity=.45-(s-1)*.8})}
      if(a.type==='environment'){a.moon.rotation.y+=dt*.018;a.moon.rotation.x+=dt*.007;a.drones.forEach((d,i)=>{const angle=t*(.08+i*.012)+i*1.05;const r=25+i*4.5;d.position.set(Math.cos(angle)*r,8+(i%3)*3+Math.sin(t*.7+i)*.8,Math.sin(angle)*r);d.rotation.y=-angle+Math.PI/2})}
    }
  }

  animate=()=>{
    if(!this.enabled)return;
    requestAnimationFrame(this.animate);
    const dt=Math.min(this.clock.getDelta(),.05);this.worldTime+=dt;
    this.updateVehicle(dt);this.updateCamera(dt);this.updateZones();this.updateAnimations(dt);
    this.renderer.render(this.scene,this.camera);
  }
}

export { routePositions, projectPositions };
