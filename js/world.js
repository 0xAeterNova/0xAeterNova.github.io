import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js';
import { projects, skills } from './data.js';

const TAU = Math.PI * 2;
const clamp = (n,a,b)=>Math.max(a,Math.min(b,n));
const ease = t => 1 - Math.pow(1 - t, 4);
const mixColor = (a,b,t)=>a.clone().lerp(b,t);

function hexColor(value){ return new THREE.Color(value); }

function labelTexture(title, sub = '', accent = '#ffffff', width = 1024, height = 380){
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,width,height);
  const grad = ctx.createLinearGradient(0,0,width,height);
  grad.addColorStop(0,'rgba(8,8,10,.94)'); grad.addColorStop(1,'rgba(8,8,10,.28)');
  ctx.fillStyle = grad; ctx.fillRect(0,0,width,height);
  ctx.strokeStyle = accent; ctx.lineWidth = 3; ctx.strokeRect(2,2,width-4,height-4);
  ctx.fillStyle = accent; ctx.fillRect(0,0,18,height);
  ctx.font = '800 74px Arial'; ctx.fillStyle = '#ffffff'; ctx.fillText(title,70,145);
  ctx.font = '600 26px monospace'; ctx.fillStyle = accent; ctx.fillText(sub.toUpperCase(),72,210);
  ctx.font = '500 18px monospace'; ctx.fillStyle = 'rgba(255,255,255,.55)';
  ctx.fillText('0xAETER/NOVA :: SPATIAL ARCHIVE',72,298);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function createTextPlane(title, sub, accent, size=[8,3]){
  const tex = labelTexture(title,sub,accent);
  const mat = new THREE.MeshBasicMaterial({map:tex,transparent:true,side:THREE.DoubleSide,depthWrite:false});
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size[0],size[1]),mat);
  mesh.renderOrder = 6;
  return mesh;
}

function glowMaterial(color, intensity=2, opacity=1){
  return new THREE.MeshStandardMaterial({
    color, emissive:color, emissiveIntensity:intensity, roughness:.28, metalness:.55,
    transparent:opacity<1, opacity
  });
}

function wireMaterial(color, opacity=.6){
  return new THREE.LineBasicMaterial({color,transparent:true,opacity,blending:THREE.AdditiveBlending,depthWrite:false});
}

function ring(radius,tube,color,opacity=.65){
  return new THREE.Mesh(
    new THREE.TorusGeometry(radius,tube,12,128),
    new THREE.MeshBasicMaterial({color,transparent:true,opacity,blending:THREE.AdditiveBlending,depthWrite:false})
  );
}

function lineLoop(radius,color,opacity=.22,segments=128){
  const pts=[];
  for(let i=0;i<=segments;i++){
    const a=i/segments*TAU; pts.push(new THREE.Vector3(Math.cos(a)*radius,0,Math.sin(a)*radius));
  }
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), wireMaterial(color,opacity));
}

function randomSpherePoint(radiusMin,radiusMax){
  const u=Math.random(), v=Math.random();
  const theta=TAU*u, phi=Math.acos(2*v-1), r=THREE.MathUtils.lerp(radiusMin,radiusMax,Math.random());
  return new THREE.Vector3(r*Math.sin(phi)*Math.cos(theta),r*Math.cos(phi),r*Math.sin(phi)*Math.sin(theta));
}

function makeSprite(text,color='#fff',scale=4){
  const c=document.createElement('canvas'); c.width=512; c.height=128;
  const x=c.getContext('2d'); x.clearRect(0,0,512,128);
  x.font='800 34px monospace'; x.textAlign='center'; x.textBaseline='middle'; x.fillStyle=color; x.fillText(text.toUpperCase(),256,64);
  const tex=new THREE.CanvasTexture(c); tex.colorSpace=THREE.SRGBColorSpace;
  const mat=new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false});
  const s=new THREE.Sprite(mat); s.scale.set(scale,scale*.25,1); return s;
}

export class LivingArchiveWorld{
  constructor(canvas){
    this.canvas=canvas;
    this.clock=new THREE.Clock();
    this.scene=new THREE.Scene();
    this.scene.background=new THREE.Color('#070707');
    this.scene.fog=new THREE.FogExp2('#070707',.0065);
    this.camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,1000);
    this.camera.position.set(18,8,27);
    this.scene.add(this.camera);
    this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
    this.renderer.setSize(innerWidth,innerHeight,false);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure=1.18;
    this.renderer.shadowMap.enabled=true;
    this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;

    this.composer=new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene,this.camera));
    this.bloom=new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),1.2,.9,.2);
    this.bloom.threshold=.08; this.bloom.radius=.85; this.bloom.strength=1.3;
    this.composer.addPass(this.bloom);
    this.afterimage=new AfterimagePass(.89); this.afterimage.enabled=false; this.composer.addPass(this.afterimage);
    this.glitch=new GlitchPass(); this.glitch.enabled=false; this.composer.addPass(this.glitch);
    this.composer.addPass(new OutputPass());

    this.pointer=new THREE.Vector2();
    this.pointerSmooth=new THREE.Vector2();
    this.raycaster=new THREE.Raycaster();
    this.interactive=[];
    this.animators=[];
    this.transients=[];
    this.groups={};
    this.route='home';
    this.routeConfig={};
    this.center=new THREE.Vector3();
    this.baseCameraOffset=new THREE.Vector3(18,8,27);
    this.orbitYaw=0; this.orbitPitch=0; this.zoom=1;
    this.dragging=false; this.dragMoved=false; this.dragStart={x:0,y:0,yaw:0,pitch:0};
    this.hovered=null;
    this.flight=null;
    this.palette={a:hexColor('#ff6a3d'),b:hexColor('#5b2cff'),c:hexColor('#f7f0d8')};
    this.paletteTarget={a:this.palette.a.clone(),b:this.palette.b.clone(),c:this.palette.c.clone()};
    this.quality='high';
    this.lowMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.buildLights();
    this.buildCosmos();
    this.buildWarpFX();
    this.buildRealmNetwork();
    this.buildHome();
    this.buildProjects();
    this.buildProjectWorlds();
    this.buildCyber();
    this.buildAbout();
    this.buildContact();
    this.bindEvents();
    this.setRoute('home',true);
    this.resize();
    this.renderer.setAnimationLoop(()=>this.tick());
  }

  buildLights(){
    this.hemi=new THREE.HemisphereLight('#fff6df','#1a1235',1.6); this.scene.add(this.hemi);
    this.key=new THREE.DirectionalLight('#fff2d2',3.2); this.key.position.set(8,22,14); this.key.castShadow=true; this.scene.add(this.key);
    this.fill=new THREE.PointLight('#ff6a3d',45,90,2); this.fill.position.set(-18,8,10); this.scene.add(this.fill);
    this.rim=new THREE.PointLight('#5b2cff',55,100,2); this.rim.position.set(20,14,-10); this.scene.add(this.rim);
  }

  buildCosmos(){
    const vertex=`varying vec3 vPos; varying vec2 vUv; void main(){vUv=uv; vPos=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
    const fragment=`
      uniform float uTime; uniform vec3 uA; uniform vec3 uB; uniform vec3 uC; varying vec3 vPos; varying vec2 vUv;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
      float fbm(vec2 p){float s=0.;float a=.5;for(int i=0;i<5;i++){s+=a*noise(p);p*=2.02;a*=.5;}return s;}
      void main(){
        vec2 p=vUv*4.; p.x+=uTime*.012;
        float n=fbm(p+fbm(p*1.7+uTime*.025));
        float bands=.5+.5*sin((vUv.y+n*.25)*18.+uTime*.14);
        vec3 col=mix(uA,uB,n); col=mix(col,uC,pow(bands,5.)*.22);
        float stars=step(.994,hash(floor(vUv*vec2(900.,450.)))); col+=stars*uC*(.3+.7*hash(vUv*77.));
        gl_FragColor=vec4(col*.18+.012,1.);
      }`;
    this.domeMat=new THREE.ShaderMaterial({vertexShader:vertex,fragmentShader:fragment,side:THREE.BackSide,uniforms:{uTime:{value:0},uA:{value:this.palette.a.clone()},uB:{value:this.palette.b.clone()},uC:{value:this.palette.c.clone()}}});
    const dome=new THREE.Mesh(new THREE.SphereGeometry(440,48,32),this.domeMat); this.scene.add(dome);

    const starCount=7000; const pos=new Float32Array(starCount*3); const col=new Float32Array(starCount*3);
    for(let i=0;i<starCount;i++){
      const p=randomSpherePoint(140,390); pos[i*3]=p.x;pos[i*3+1]=p.y;pos[i*3+2]=p.z;
      const br=.45+Math.random()*.55; col[i*3]=br; col[i*3+1]=br; col[i*3+2]=br;
    }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));
    this.stars=new THREE.Points(g,new THREE.PointsMaterial({size:.34,vertexColors:true,transparent:true,opacity:.78,depthWrite:false,blending:THREE.AdditiveBlending}));this.scene.add(this.stars);
    this.animators.push((t)=>{this.stars.rotation.y=t*.004;this.stars.rotation.z=Math.sin(t*.03)*.03;});
  }

  realmPositions(){
    const p={
      home:new THREE.Vector3(0,0,0),
      projects:new THREE.Vector3(0,4,-92),
      'project/ruvigil':new THREE.Vector3(-72,8,-176),
      'project/phantom':new THREE.Vector3(0,12,-188),
      'project/elif-linux':new THREE.Vector3(74,6,-174),
      cyber:new THREE.Vector3(-74,26,-278),
      about:new THREE.Vector3(0,52,-286),
      contact:new THREE.Vector3(78,26,-278)
    };
    projects.forEach((project,i)=>{
      const key=`project/${project.slug}`;
      if(!p[key]){
        const a=(i/projects.length)*TAU;
        p[key]=new THREE.Vector3(Math.cos(a)*92,18+Math.sin(i)*8,-205+Math.sin(a)*30);
      }
    });
    return p;
  }


  buildWarpFX(){
    this.warp=new THREE.Group();this.warp.visible=false;this.camera.add(this.warp);this.warpRings=[];
    for(let i=0;i<28;i++){
      const mat=new THREE.MeshBasicMaterial({color:i%2?'#ff6a3d':'#7d52ff',transparent:true,opacity:.0,blending:THREE.AdditiveBlending,depthWrite:false});
      const r=new THREE.Mesh(new THREE.TorusGeometry(1.7+i*.045,.012+i*.0015,6,72),mat);
      r.position.z=-2-i*1.25;r.rotation.z=i*.37;this.warp.add(r);this.warpRings.push(r);
    }
    const geo=new THREE.BufferGeometry(),count=900,pos=new Float32Array(count*3);
    for(let i=0;i<count;i++){const a=Math.random()*TAU,rad=1.7+Math.random()*4.5;pos[i*3]=Math.cos(a)*rad;pos[i*3+1]=Math.sin(a)*rad;pos[i*3+2]=-Math.random()*40;}
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    this.warpDust=new THREE.Points(geo,new THREE.PointsMaterial({color:'#ffffff',size:.045,transparent:true,opacity:.0,blending:THREE.AdditiveBlending,depthWrite:false}));this.warp.add(this.warpDust);
  }

  spawnPulse(){
    const group=new THREE.Group();const palette=[this.palette.a,this.palette.b,this.palette.c];
    for(let i=0;i<3;i++){const r=ring(1+i*.32,.025,palette[i],.72-i*.15);r.lookAt(this.camera.position);group.add(r)}
    group.position.copy(this.center).add(new THREE.Vector3(this.pointerSmooth.x*5,1.2+this.pointerSmooth.y*3,2));this.scene.add(group);
    this.transients.push({group,life:0});
  }

  resetView(){this.orbitYaw=0;this.orbitPitch=0;this.zoom=1;}

  buildRealmNetwork(){
    this.positions=this.realmPositions();
    const pairs=[['home','projects'],['projects','project/ruvigil'],['projects','project/phantom'],['projects','project/elif-linux'],['project/ruvigil','cyber'],['project/phantom','about'],['project/elif-linux','contact'],['cyber','about'],['about','contact']];
    pairs.forEach(([a,b],idx)=>{
      const pa=this.positions[a],pb=this.positions[b]; if(!pa||!pb)return;
      const mid=pa.clone().lerp(pb,.5); mid.y+=18+idx%3*7;
      const curve=new THREE.QuadraticBezierCurve3(pa,mid,pb);
      const tube=new THREE.Mesh(new THREE.TubeGeometry(curve,64,.045,5,false),new THREE.MeshBasicMaterial({color:idx%2?'#7f62ff':'#ff7147',transparent:true,opacity:.18,blending:THREE.AdditiveBlending,depthWrite:false}));
      this.scene.add(tube);
    });
    Object.entries(this.positions).forEach(([id,p])=>{
      const beacon=ring(1.1,.035,'#ffffff',.2);beacon.position.copy(p);beacon.rotation.x=Math.PI/2;this.scene.add(beacon);
      this.animators.push((t)=>{beacon.scale.setScalar(1+Math.sin(t*1.7+p.x*.02)*.12)});
    });
  }

  makeGroup(route){
    const g=new THREE.Group();g.position.copy(this.positions[route]||new THREE.Vector3());g.userData.route=route;this.scene.add(g);this.groups[route]=g;return g;
  }

  buildHome(){
    const g=this.makeGroup('home');
    const core=new THREE.Mesh(new THREE.IcosahedronGeometry(4.1,6),new THREE.MeshPhysicalMaterial({color:'#fff5d9',emissive:'#ff5a34',emissiveIntensity:2.8,roughness:.08,metalness:.15,transmission:.22,thickness:1.6,clearcoat:1}));core.castShadow=true;g.add(core);
    const shell=new THREE.Mesh(new THREE.IcosahedronGeometry(6.3,2),new THREE.MeshBasicMaterial({color:'#9c79ff',wireframe:true,transparent:true,opacity:.34,blending:THREE.AdditiveBlending}));g.add(shell);
    const knot1=new THREE.Mesh(new THREE.TorusKnotGeometry(7.5,.07,220,12,2,5),new THREE.MeshBasicMaterial({color:'#ff6a3d',transparent:true,opacity:.78,blending:THREE.AdditiveBlending,depthWrite:false}));g.add(knot1);
    const knot2=new THREE.Mesh(new THREE.TorusKnotGeometry(9,.045,240,10,3,7),new THREE.MeshBasicMaterial({color:'#d8c4ff',transparent:true,opacity:.42,blending:THREE.AdditiveBlending,depthWrite:false}));g.add(knot2);
    for(let i=0;i<8;i++){
      const r=ring(8.5+i*.46,.025,i%2?'#ffad65':'#7755ff',.25);r.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI);g.add(r);
      this.animators.push(t=>{r.rotation.z+=.0009*(i+1);r.rotation.y+=.0004*(i%3+1)});
    }
    const disciplines=['ROBOTICS','AI','REV','PWN','SYSTEMS','SPACE'];
    disciplines.forEach((d,i)=>{
      const pivot=new THREE.Group();pivot.rotation.y=i/disciplines.length*TAU;g.add(pivot);
      const shard=new THREE.Mesh(new THREE.OctahedronGeometry(.7,0),glowMaterial(i%2?'#ff7f4d':'#8066ff',1.8));shard.position.set(12,Math.sin(i)*2,0);pivot.add(shard);
      const sprite=makeSprite(d,'#ffffff',3.5);sprite.position.set(12,1.2+Math.sin(i)*2,0);pivot.add(sprite);
      this.animators.push(t=>{pivot.rotation.y=i/disciplines.length*TAU+t*(.04+i*.003);shard.rotation.x=t*.6;shard.rotation.y=t*.4});
    });
    const floor=new THREE.Mesh(new THREE.CircleGeometry(26,128),new THREE.MeshBasicMaterial({color:'#ff6a3d',transparent:true,opacity:.025,side:THREE.DoubleSide}));floor.rotation.x=-Math.PI/2;floor.position.y=-7;g.add(floor);
    for(let r=7;r<=25;r+=3){const ll=lineLoop(r,'#fff5d9',.065);ll.position.y=-6.95;g.add(ll)}
    const pCount=1600, arr=new Float32Array(pCount*3);
    for(let i=0;i<pCount;i++){const a=Math.random()*TAU,rr=5+Math.pow(Math.random(),.6)*19,y=(Math.random()-.5)*13;arr[i*3]=Math.cos(a)*rr;arr[i*3+1]=y;arr[i*3+2]=Math.sin(a)*rr;}
    const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(arr,3));
    const pts=new THREE.Points(pg,new THREE.PointsMaterial({color:'#fff4d7',size:.09,transparent:true,opacity:.66,blending:THREE.AdditiveBlending,depthWrite:false}));g.add(pts);
    this.animators.push(t=>{core.rotation.y=t*.12;core.rotation.x=Math.sin(t*.2)*.2;shell.rotation.y=-t*.08;shell.rotation.z=t*.03;knot1.rotation.x=t*.05;knot1.rotation.y=t*.13;knot2.rotation.z=-t*.07;pts.rotation.y=t*.028;core.scale.setScalar(1+Math.sin(t*1.45)*.045)});
  }

  buildProjects(){
    const g=this.makeGroup('projects');
    const platform=new THREE.Mesh(new THREE.CylinderGeometry(24,27,1.2,12),new THREE.MeshStandardMaterial({color:'#111012',metalness:.85,roughness:.26,emissive:'#351a3d',emissiveIntensity:.55}));platform.position.y=-7;platform.receiveShadow=true;g.add(platform);
    for(let r=6;r<25;r+=4){const ll=lineLoop(r,r%8===2?'#ff2ea6':'#19e6ff',.18);ll.position.y=-6.34;g.add(ll)}
    projects.forEach((project,i)=>{
      const angle=(-.65+i*Math.min(.65,1.3/Math.max(1,projects.length-1)))+Math.PI/2;
      const x=(i-(projects.length-1)/2)*12.5;
      const z=Math.abs(i-(projects.length-1)/2)*2.3;
      const artifact=new THREE.Group();artifact.position.set(x,-2,z);g.add(artifact);
      const base=new THREE.Mesh(new THREE.CylinderGeometry(3.3,4.2,1.2,6),new THREE.MeshStandardMaterial({color:'#0c0c0f',metalness:.9,roughness:.2,emissive:project.accent,emissiveIntensity:.18}));base.position.y=-4;artifact.add(base);
      const body=new THREE.Mesh(new THREE.BoxGeometry(6.2,9.5,1.15,2,6,1),new THREE.MeshPhysicalMaterial({color:'#0b0b0e',metalness:.75,roughness:.24,emissive:project.accent,emissiveIntensity:.32,clearcoat:1}));body.castShadow=true;artifact.add(body);
      const edges=new THREE.LineSegments(new THREE.EdgesGeometry(body.geometry),wireMaterial(project.accent,.74));body.add(edges);
      const screen=createTextPlane(project.name,project.label,project.accent,[5.3,2.1]);screen.position.set(0,.3,.59);artifact.add(screen);
      const halo=ring(4.8,.045,project.accent,.55);halo.rotation.x=Math.PI/2;artifact.add(halo);
      const shard=new THREE.Mesh(new THREE.OctahedronGeometry(1.1,1),new THREE.MeshBasicMaterial({color:project.accent,wireframe:true,transparent:true,opacity:.75,blending:THREE.AdditiveBlending}));shard.position.y=6.4;artifact.add(shard);
      body.userData.route=`project/${project.slug}`; screen.userData.route=`project/${project.slug}`;this.interactive.push(body,screen);
      const beam=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,16,8),new THREE.MeshBasicMaterial({color:project.accent,transparent:true,opacity:.35,blending:THREE.AdditiveBlending}));beam.position.y=9;artifact.add(beam);
      this.animators.push(t=>{artifact.position.y=-2+Math.sin(t*.8+i)*.45;halo.rotation.z=t*(.28+i*.05);shard.rotation.x=t*.8;shard.rotation.y=t*1.1;beam.material.opacity=.2+.18*(.5+.5*Math.sin(t*2+i))});
    });
    const beacon=createTextPlane('PROJECT CONSTELLATION','SELECT AN ARTIFACT','#fff4cb',[11,3.8]);beacon.position.set(0,11,-4);beacon.rotation.x=-.05;g.add(beacon);
  }

  buildProjectWorlds(){
    projects.forEach(project=>{
      if(project.realm==='ruvigil')this.buildRuVigil(project);
      else if(project.realm==='phantom')this.buildPhantom(project);
      else if(project.realm==='elif')this.buildElif(project);
      else this.buildGenericProject(project);
    });
  }

  buildRuVigil(project){
    const route=`project/${project.slug}`,g=this.makeGroup(route),c=project.accent;
    const floor=new THREE.Mesh(new THREE.CircleGeometry(24,96),new THREE.MeshStandardMaterial({color:'#041316',metalness:.7,roughness:.3,emissive:'#062d33',emissiveIntensity:.9}));floor.rotation.x=-Math.PI/2;floor.position.y=-6;g.add(floor);
    [5,10,15,20].forEach(r=>{const l=lineLoop(r,c,.2);l.position.y=-5.9;g.add(l)});
    const towers=[];
    for(let i=0;i<5;i++){
      const a=i/5*TAU;const tower=new THREE.Group();tower.position.set(Math.cos(a)*14,-1,Math.sin(a)*14);g.add(tower);towers.push(tower);
      const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.75,1.25,10,8),glowMaterial('#10272b',.3));shaft.castShadow=true;tower.add(shaft);
      const top=new THREE.Mesh(new THREE.OctahedronGeometry(1.1,1),glowMaterial(c,3));top.position.y=5.7;tower.add(top);
      for(let j=0;j<4;j++){const rr=ring(1.8+j*.55,.025,c,.34-j*.05);rr.rotation.x=Math.PI/2;rr.position.y=4.6;tower.add(rr);this.animators.push(t=>{rr.scale.setScalar(1+((t*.55+j*.17+i*.07)%1)*1.7);rr.material.opacity=.38*(1-((t*.55+j*.17+i*.07)%1))})}
      const label=makeSprite(`NODE ${i+1}`,c,2.7);label.position.y=7.6;tower.add(label);
    }
    const body=new THREE.Group();body.position.y=-1.8;g.add(body);
    const joints=[[0,6,0],[0,4.7,0],[0,2.8,0],[0,.4,0],[-1.8,3.5,0],[1.8,3.5,0],[-2.8,1.8,0],[2.8,1.8,0],[-1.3,-2.2,0],[1.3,-2.2,0],[-1.6,-5.1,0],[1.6,-5.1,0]];
    joints.forEach((p,i)=>{const s=new THREE.Mesh(new THREE.SphereGeometry(i===0?.7:.35,16,12),new THREE.MeshBasicMaterial({color:c,wireframe:true,transparent:true,opacity:.8}));s.position.set(...p);body.add(s)});
    const bones=[[0,1],[1,2],[2,3],[1,4],[1,5],[4,6],[5,7],[3,8],[3,9],[8,10],[9,11]];
    bones.forEach(([a,b])=>{const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...joints[a]),new THREE.Vector3(...joints[b])]),wireMaterial(c,.6));body.add(line)});
    towers.forEach((tower,i)=>{
      const start=tower.position.clone().add(new THREE.Vector3(0,4.7,0));const end=new THREE.Vector3(0,1,0);const mid=start.clone().lerp(end,.5);mid.y+=8+i%2*2;
      const curve=new THREE.QuadraticBezierCurve3(start,mid,end);const tube=new THREE.Mesh(new THREE.TubeGeometry(curve,72,.045,5,false),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.28,blending:THREE.AdditiveBlending,depthWrite:false}));g.add(tube);
    });
    const scan=new THREE.Mesh(new THREE.CylinderGeometry(8,8,.1,64,1,true),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.12,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));scan.position.y=-1;g.add(scan);
    const title=createTextPlane('RUVIGIL','ELECTROMAGNETIC CATHEDRAL',c,[11,3.8]);title.position.set(0,12,-10);g.add(title);
    this.animators.push(t=>{body.rotation.y=Math.sin(t*.22)*.25;scan.position.y=-5+((t*.5)%1)*13;scan.material.opacity=.18*(1-((t*.5)%1));towers.forEach((tw,i)=>tw.rotation.y=Math.sin(t*.5+i)*.06)});
  }

  buildPhantom(project){
    const route=`project/${project.slug}`,g=this.makeGroup(route),pink=project.accent;
    const halo=ring(13,.09,pink,.28);halo.rotation.x=Math.PI/2;halo.position.y=1;g.add(halo);
    const pts=[];for(let i=0;i<1700;i++){const u=Math.random()*TAU,v=Math.acos(THREE.MathUtils.randFloatSpread(2));let x=Math.sin(v)*Math.cos(u)*5.2,y=Math.cos(v)*7.2,z=Math.sin(v)*Math.sin(u)*4.3;y+=1.5-Math.max(0,-y)*.08;pts.push(x,y,z)}
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));
    const face=new THREE.Points(geo,new THREE.PointsMaterial({color:'#ffe6fa',size:.085,transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false}));face.position.y=-1;g.add(face);
    const mask=new THREE.Mesh(new THREE.IcosahedronGeometry(5.25,4),new THREE.MeshBasicMaterial({color:pink,wireframe:true,transparent:true,opacity:.08,blending:THREE.AdditiveBlending}));mask.scale.y=1.38;mask.position.y=.5;g.add(mask);
    const nodePositions=[];for(let i=0;i<48;i++)nodePositions.push(randomSpherePoint(8,15));
    const ng=new THREE.Group();g.add(ng);nodePositions.forEach((p,i)=>{const n=new THREE.Mesh(new THREE.SphereGeometry(.12,8,6),new THREE.MeshBasicMaterial({color:i%3===0?'#75fff0':pink}));n.position.copy(p);ng.add(n)});
    for(let i=0;i<65;i++){const a=nodePositions[Math.floor(Math.random()*nodePositions.length)],b=nodePositions[Math.floor(Math.random()*nodePositions.length)];const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints([a,b]),wireMaterial(i%2?pink:'#75fff0',.12));ng.add(l)}
    const emotions=[['JOY','#ffd45a'],['CALM','#55ffd6'],['FEAR','#8c6dff'],['ANGER','#ff664d'],['SAD','#5b9aff']];
    emotions.forEach(([name,color],i)=>{const pivot=new THREE.Group();g.add(pivot);const orb=new THREE.Mesh(new THREE.SphereGeometry(.65,24,18),glowMaterial(color,3));orb.position.set(10+i*.7,0,0);pivot.add(orb);const spr=makeSprite(name,color,2.4);spr.position.set(10+i*.7,1.15,0);pivot.add(spr);this.animators.push(t=>{pivot.rotation.y=t*(.1+i*.012)+i/emotions.length*TAU;pivot.rotation.z=Math.sin(t*.12+i)*.18;orb.scale.setScalar(1+Math.sin(t*2+i)*.08)})});
    const bars=[];for(let i=0;i<42;i++){const a=i/41*Math.PI*1.25-Math.PI*.625;const bar=new THREE.Mesh(new THREE.BoxGeometry(.18,1,.18),new THREE.MeshBasicMaterial({color:i%2?pink:'#75fff0'}));bar.position.set(Math.sin(a)*9,-5,Math.cos(a)*3);bar.rotation.z=-a*.35;g.add(bar);bars.push(bar)}
    const title=createTextPlane('PHANTOM','NEURAL DREAM / MULTIMODAL SIGNALS',pink,[12,3.8]);title.position.set(0,12,-11);g.add(title);
    this.animators.push(t=>{face.rotation.y=Math.sin(t*.18)*.35;mask.rotation.y=-Math.sin(t*.16)*.22;ng.rotation.y=t*.025;ng.rotation.x=Math.sin(t*.09)*.08;bars.forEach((bar,i)=>{const s=.4+Math.abs(Math.sin(t*2.2+i*.38))*3.2;bar.scale.y=s;bar.position.y=-5+(s-1)*.5})});
  }

  buildElif(project){
    const route=`project/${project.slug}`,g=this.makeGroup(route),acid=project.accent;
    const platform=new THREE.Mesh(new THREE.CylinderGeometry(22,25,2.2,8),new THREE.MeshStandardMaterial({color:'#090a08',metalness:.95,roughness:.18,emissive:'#2a0808',emissiveIntensity:.8}));platform.position.y=-7;g.add(platform);
    const core=new THREE.Group();core.position.y=0;g.add(core);
    for(let i=0;i<5;i++){const tor=ring(3.7+i*1.5,.12,i%2?acid:'#ff5038',.55);tor.rotation.set(i*.42,i*.63,i*.25);core.add(tor);this.animators.push(t=>{tor.rotation.x+=.001*(i+1);tor.rotation.y+=.0022*(6-i)})}
    const reactor=new THREE.Mesh(new THREE.DodecahedronGeometry(3.2,1),new THREE.MeshStandardMaterial({color:'#0b0d08',metalness:1,roughness:.12,emissive:acid,emissiveIntensity:2.5}));core.add(reactor);
    const cage=new THREE.Mesh(new THREE.IcosahedronGeometry(7,1),new THREE.MeshBasicMaterial({color:'#ff5038',wireframe:true,transparent:true,opacity:.22}));core.add(cage);
    for(let i=0;i<18;i++){const a=i/18*TAU;const block=new THREE.Mesh(new THREE.BoxGeometry(1.2,2.2,.8),glowMaterial(i%3===0?'#ff5038':acid,.8));block.position.set(Math.cos(a)*10,-1+Math.sin(i)*2,Math.sin(a)*10);block.lookAt(0,0,0);g.add(block);this.animators.push(t=>{block.position.y=-1+Math.sin(t*1.2+i)*2.1})}
    const panels=[];for(let i=0;i<4;i++){const panel=createTextPlane(i===0?'ELIF KERNEL':i===1?'REVERSE':i===2?'PWNDBG':'FORENSICS',i===0?'SECURITY OS / v1.0.0':'LOW LEVEL TOOLCHAIN',i%2?acid:'#ff5038',[7,2.4]);const a=i/4*TAU;panel.position.set(Math.cos(a)*15,4,Math.sin(a)*15);panel.lookAt(0,3,0);g.add(panel);panels.push(panel)}
    const rainGeo=new THREE.BufferGeometry(),count=900,arr=new Float32Array(count*3);for(let i=0;i<count;i++){arr[i*3]=THREE.MathUtils.randFloatSpread(38);arr[i*3+1]=THREE.MathUtils.randFloat(-6,18);arr[i*3+2]=THREE.MathUtils.randFloatSpread(38)}rainGeo.setAttribute('position',new THREE.BufferAttribute(arr,3));const rain=new THREE.Points(rainGeo,new THREE.PointsMaterial({color:acid,size:.1,transparent:true,opacity:.42,blending:THREE.AdditiveBlending}));g.add(rain);
    const title=createTextPlane('ELIF LINUX','MACHINE CORE / SECURITY WORKSTATION',acid,[12,3.8]);title.position.set(0,13,-12);g.add(title);
    this.animators.push(t=>{reactor.rotation.x=t*.22;reactor.rotation.y=-t*.35;cage.rotation.y=t*.08;core.scale.setScalar(1+Math.sin(t*1.5)*.025);rain.position.y=-((t*2)%8)});
  }

  buildGenericProject(project){
    const route=`project/${project.slug}`,g=this.makeGroup(route),c=project.accent||'#ffffff';
    const core=new THREE.Mesh(new THREE.DodecahedronGeometry(5,2),glowMaterial(c,2));g.add(core);
    for(let i=0;i<6;i++){const r=ring(7+i*.9,.035,c,.3);r.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI);g.add(r)}
    const title=createTextPlane(project.name,project.tagline,c,[11,3.8]);title.position.set(0,11,-10);g.add(title);
    this.animators.push(t=>{core.rotation.x=t*.17;core.rotation.y=t*.25});
  }

  buildCyber(){
    const g=this.makeGroup('cyber');
    const giant=new THREE.Mesh(new THREE.BoxGeometry(13,13,13,4,4,4),new THREE.MeshBasicMaterial({color:'#faff00',wireframe:true,transparent:true,opacity:.14}));giant.rotation.set(.4,.6,.15);g.add(giant);
    const shardMat=new THREE.MeshBasicMaterial({color:'#ff5a1f',wireframe:true,transparent:true,opacity:.5,blending:THREE.AdditiveBlending});
    const nodes=[];for(let i=0;i<42;i++){const p=randomSpherePoint(8,22);p.y*=.7;nodes.push(p);const m=new THREE.Mesh(i%4===0?new THREE.TetrahedronGeometry(.6):new THREE.OctahedronGeometry(.28),i%3===0?shardMat:new THREE.MeshBasicMaterial({color:'#faff00'}));m.position.copy(p);g.add(m);this.animators.push(t=>{m.rotation.x=t*.6+i;m.rotation.y=-t*.4+i*.3})}
    for(let i=0;i<70;i++){const a=nodes[Math.floor(Math.random()*nodes.length)],b=nodes[Math.floor(Math.random()*nodes.length)];const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints([a,b]),wireMaterial(i%4===0?'#ff5a1f':'#faff00',.10));g.add(l)}
    for(let i=0;i<16;i++){const panel=createTextPlane(i%2?'0x7f45 :: ROP':'SIGSEGV @ 0x41414141',i%3?'STACK / HEAP / REGISTERS':'REV / PWN / FORENSICS',i%2?'#faff00':'#ff5a1f',[4.8,1.5]);const a=i/16*TAU;panel.position.set(Math.cos(a)*(17+Math.random()*8),THREE.MathUtils.randFloat(-6,11),Math.sin(a)*(17+Math.random()*8));panel.lookAt(0,0,0);panel.material.opacity=.7;g.add(panel);this.animators.push(t=>{panel.position.y+=Math.sin(t*.8+i)*.002})}
    const sweep=new THREE.Mesh(new THREE.PlaneGeometry(48,48),new THREE.MeshBasicMaterial({color:'#faff00',transparent:true,opacity:.035,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));sweep.rotation.x=-Math.PI/2;g.add(sweep);
    const awardGeo=new THREE.PlaneGeometry(9.2,5.2);const awardMat=new THREE.MeshBasicMaterial({transparent:true,opacity:0,side:THREE.DoubleSide});const award=new THREE.Mesh(awardGeo,awardMat);award.position.set(16,5,-6);award.rotation.y=-.56;g.add(award);new THREE.TextureLoader().load('assets/profile/trophy-1.png',tex=>{tex.colorSpace=THREE.SRGBColorSpace;awardMat.map=tex;awardMat.opacity=.9;awardMat.needsUpdate=true});const awardFrame=new THREE.LineSegments(new THREE.EdgesGeometry(awardGeo),wireMaterial('#faff00',.38));award.add(awardFrame);
    const awardLabel=makeSprite('WRITEUP WINNER','#faff00',4.4);awardLabel.position.set(0,3.4,0);award.add(awardLabel);
    const title=createTextPlane('BREACH REALM','CTF / REVERSE ENGINEERING / PWN','#faff00',[12,3.8]);title.position.set(0,14,-13);g.add(title);
    this.animators.push(t=>{giant.rotation.y=t*.07;giant.rotation.x=.4+Math.sin(t*.08)*.18;sweep.position.y=-8+((t*.42)%1)*18;sweep.material.opacity=.08*(1-((t*.42)%1));award.position.y=5+Math.sin(t*.55)*.35});
  }

  buildAbout(){
    const g=this.makeGroup('about');
    const sun=new THREE.Mesh(new THREE.SphereGeometry(4.6,48,32),new THREE.MeshStandardMaterial({color:'#ffe7a6',emissive:'#ff9d4f',emissiveIntensity:5,roughness:.4}));g.add(sun);
    const light=new THREE.PointLight('#ffb36b',110,70,2);g.add(light);
    const shell=new THREE.Mesh(new THREE.SphereGeometry(6.3,24,16),new THREE.MeshBasicMaterial({color:'#7d52ff',wireframe:true,transparent:true,opacity:.2}));g.add(shell);
    skills.forEach((skill,i)=>{const a=i/skills.length*TAU,rad=10+(i%4)*3.2;const pivot=new THREE.Group();pivot.rotation.x=((i%3)-1)*.22;pivot.rotation.y=a;g.add(pivot);const planet=new THREE.Mesh(new THREE.SphereGeometry(.55+skill.level*.7,20,14),new THREE.MeshStandardMaterial({color:i%3===0?'#26e6b4':i%3===1?'#ffd87a':'#8b68ff',emissive:i%3===0?'#26e6b4':i%3===1?'#ff9b50':'#7d52ff',emissiveIntensity:1.1,roughness:.55}));planet.position.x=rad;pivot.add(planet);const spr=makeSprite(skill.name,'#fff7d5',2.9);spr.position.set(rad,1.8,0);pivot.add(spr);const orbit=lineLoop(rad,'#fff3c2',.06);orbit.rotation.x=pivot.rotation.x;g.add(orbit);this.animators.push(t=>{pivot.rotation.y=a+t*(.025+(i%4)*.002);planet.rotation.y=t*.4+i})});
    const holoGeo=new THREE.PlaneGeometry(12,5.6);const holoMat=new THREE.MeshBasicMaterial({color:'#fff',transparent:true,opacity:.0,side:THREE.DoubleSide});const holo=new THREE.Mesh(holoGeo,holoMat);holo.position.set(-18,4,-1);holo.rotation.y=.45;g.add(holo);
    new THREE.TextureLoader().load('assets/profile/profile-hero-dark.svg',tex=>{tex.colorSpace=THREE.SRGBColorSpace;holoMat.map=tex;holoMat.opacity=.82;holoMat.needsUpdate=true;});
    const frame=new THREE.LineSegments(new THREE.EdgesGeometry(holoGeo),wireMaterial('#ffd87a',.45));holo.add(frame);
    const title=createTextPlane('ORBITAL OBSERVATORY','SKILLS / SYSTEMS / CURIOSITY','#ffd87a',[12,3.8]);title.position.set(12,14,-12);g.add(title);
    this.animators.push(t=>{sun.scale.setScalar(1+Math.sin(t*1.4)*.035);shell.rotation.y=-t*.035;holo.position.y=4+Math.sin(t*.45)*.35});
  }

  buildContact(){
    const g=this.makeGroup('contact');
    const core=new THREE.Mesh(new THREE.SphereGeometry(2.8,32,24),new THREE.MeshPhysicalMaterial({color:'#d8fff0',emissive:'#62ffd0',emissiveIntensity:3,roughness:.08,metalness:.18,transmission:.3,thickness:1}));g.add(core);
    const dish=new THREE.Mesh(new THREE.SphereGeometry(8,48,24,0,TAU,0,Math.PI*.34),new THREE.MeshStandardMaterial({color:'#151316',metalness:.85,roughness:.22,emissive:'#6755ff',emissiveIntensity:.4,side:THREE.DoubleSide}));dish.rotation.x=Math.PI;dish.position.y=-3.2;g.add(dish);
    for(let i=0;i<5;i++){const r=ring(5+i*1.5,.045,i%2?'#88ffd5':'#ff9b78',.38);r.rotation.x=Math.PI/2;r.position.y=-3.2;g.add(r);this.animators.push(t=>{r.scale.setScalar(1+((t*.25+i*.13)%1)*.8);r.material.opacity=.38*(1-((t*.25+i*.13)%1))})}
    const beam=new THREE.Mesh(new THREE.ConeGeometry(7,32,64,1,true),new THREE.MeshBasicMaterial({color:'#88ffd5',transparent:true,opacity:.055,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));beam.position.y=16;g.add(beam);
    const portals=[['GITHUB','#f4f4f4'],['LINKEDIN','#6ba8ff'],['CTFTIME','#88ffd5'],['LINKTREE','#8cff95'],['TELEGRAM','#77caff']];portals.forEach(([name,color],i)=>{const pivot=new THREE.Group();g.add(pivot);const a=i/portals.length*TAU;const portal=ring(1.5,.09,color,.7);portal.position.set(12,0,0);pivot.add(portal);const orb=new THREE.Mesh(new THREE.SphereGeometry(.36,16,12),glowMaterial(color,2));orb.position.set(12,0,0);pivot.add(orb);const label=makeSprite(name,color,2.8);label.position.set(12,2.2,0);pivot.add(label);this.animators.push(t=>{pivot.rotation.y=a+t*(.06+i*.006);pivot.rotation.z=Math.sin(t*.1+i)*.12;portal.rotation.y=t*.7})});
    const ribbons=['#88ffd5','#ff9b78','#6755ff'];ribbons.forEach((color,i)=>{const pts=[];for(let j=0;j<28;j++){const z=-18+j*1.35;pts.push(new THREE.Vector3(Math.sin(j*.5+i*2)*7,6+i*1.2+Math.cos(j*.37+i)*2,z))}const curve=new THREE.CatmullRomCurve3(pts);const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,160,.055,6,false),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.35,blending:THREE.AdditiveBlending,depthWrite:false}));g.add(mesh);this.animators.push(t=>{mesh.rotation.z=Math.sin(t*.13+i)*.05})});
    const title=createTextPlane('AURORA UPLINK','OPEN A CHANNEL','#88ffd5',[12,3.8]);title.position.set(0,14,-12);g.add(title);
    this.animators.push(t=>{core.rotation.y=t*.18;core.scale.setScalar(1+Math.sin(t*1.6)*.055);beam.material.opacity=.04+.035*(.5+.5*Math.sin(t*.8))});
  }

  routeSettings(route){
    const project=route.startsWith('project/')?projects.find(p=>p.slug===route.split('/')[1]):null;
    const presets={
      home:{center:this.positions.home,offset:new THREE.Vector3(18,8,27),palette:['#ff6a3d','#5b2cff','#f7f0d8'],fog:'#100b0c',bloom:1.35,exposure:1.16},
      projects:{center:this.positions.projects,offset:new THREE.Vector3(0,8,34),palette:['#ff2ea6','#19e6ff','#fff4cb'],fog:'#100717',bloom:1.55,exposure:1.14},
      cyber:{center:this.positions.cyber,offset:new THREE.Vector3(18,10,31),palette:['#faff00','#ff5a1f','#101009'],fog:'#111105',bloom:1.22,exposure:1.04},
      about:{center:this.positions.about,offset:new THREE.Vector3(18,11,35),palette:['#ffd87a','#7d52ff','#26e6b4'],fog:'#160f13',bloom:1.38,exposure:1.2},
      contact:{center:this.positions.contact,offset:new THREE.Vector3(0,10,34),palette:['#88ffd5','#ff9b78','#6755ff'],fog:'#091112',bloom:1.52,exposure:1.16}
    };
    if(project){
      const custom={
        ruvigil:{offset:new THREE.Vector3(20,8,31),palette:['#47f5ff','#ffca64','#081a1e'],fog:'#071517',bloom:1.6,exposure:1.15},
        phantom:{offset:new THREE.Vector3(18,9,32),palette:['#ff5bd7','#6d44ff','#8dffd9'],fog:'#120817',bloom:1.68,exposure:1.12},
        elif:{offset:new THREE.Vector3(20,8,31),palette:['#b9ff43','#ff5038','#11130c'],fog:'#090a07',bloom:1.35,exposure:1.02}
      }[project.realm]||{offset:new THREE.Vector3(18,8,30),palette:[project.accent,'#815cff','#fff'],fog:'#080808',bloom:1.4,exposure:1.1};
      return {...custom,center:this.positions[route]};
    }
    return presets[route]||presets.home;
  }

  setRoute(route,instant=false){
    this.route=route;
    const cfg=this.routeSettings(route);this.routeConfig=cfg;
    this.center.copy(cfg.center);
    this.baseCameraOffset.copy(cfg.offset);
    this.orbitYaw=0;this.orbitPitch=0;this.zoom=1;
    this.paletteTarget={a:hexColor(cfg.palette[0]),b:hexColor(cfg.palette[1]),c:hexColor(cfg.palette[2])};
    const end=cfg.center.clone().add(cfg.offset);
    const look=cfg.center.clone().add(new THREE.Vector3(0,1.5,0));
    if(instant){this.camera.position.copy(end);this.camera.lookAt(look);this.flight=null}
    else{
      const start=this.camera.position.clone();
      const distance=start.distanceTo(end);
      const lift=Math.min(42,12+distance*.12);
      const c1=start.clone().lerp(end,.28).add(new THREE.Vector3(0,lift,0));
      const c2=start.clone().lerp(end,.72).add(new THREE.Vector3(0,lift*.65,0));
      this.flight={start,c1,c2,end,startLook:this.currentLook?this.currentLook.clone():look.clone(),endLook:look,t:0,duration:clamp(distance/90,1.25,2.3)};
    }
    this.targetFog=new THREE.Color(cfg.fog);
    this.targetBloom=cfg.bloom;this.targetExposure=cfg.exposure;
  }

  setQuality(mode){
    this.quality=mode;
    const high=mode==='high';
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,high?2:1));
    this.bloom.enabled=high;
    this.afterimage.enabled=high&&this.route.includes('phantom');
    this.glitch.enabled=high&&this.route==='cyber';
    this.stars.material.size=high?.34:.22;
    this.resize();
  }

  bindEvents(){
    addEventListener('resize',()=>this.resize());
    addEventListener('pointermove',e=>{
      this.pointer.x=e.clientX/innerWidth*2-1;this.pointer.y=-(e.clientY/innerHeight)*2+1;
      if(this.dragging){const dx=e.clientX-this.dragStart.x,dy=e.clientY-this.dragStart.y;if(Math.abs(dx)+Math.abs(dy)>4)this.dragMoved=true;this.orbitYaw=this.dragStart.yaw-dx*.0048;this.orbitPitch=clamp(this.dragStart.pitch-dy*.0032,-.46,.46)}
    });
    addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('button,a,input,textarea,#map,#command'))return;this.dragging=true;this.dragMoved=false;this.dragStart={x:e.clientX,y:e.clientY,yaw:this.orbitYaw,pitch:this.orbitPitch};this.spawnPulse()});
    addEventListener('pointerup',()=>{if(this.dragging&&!this.dragMoved&&this.hovered?.userData?.route)window.dispatchEvent(new CustomEvent('worldnavigate',{detail:{route:this.hovered.userData.route}}));this.dragging=false});
    addEventListener('wheel',e=>{if(document.querySelector('#command.open,#map.open'))return;this.zoom=clamp(this.zoom+Math.sign(e.deltaY)*.08,.72,1.45)},{passive:true});
  }

  updateHover(){
    this.raycaster.setFromCamera(this.pointer,this.camera);
    const hits=this.raycaster.intersectObjects(this.interactive,false);
    const next=hits[0]?.object||null;
    if(next!==this.hovered){
      if(this.hovered?.material?.emissiveIntensity!=null)this.hovered.material.emissiveIntensity=this.hovered.userData.baseEmissive??.32;
      this.hovered=next;
      if(this.hovered?.material?.emissiveIntensity!=null){this.hovered.userData.baseEmissive=this.hovered.material.emissiveIntensity;this.hovered.material.emissiveIntensity=1.2}
      window.dispatchEvent(new CustomEvent('worldhover',{detail:{active:!!next}}));
    }
  }

  updateCamera(dt){
    if(this.flight){
      this.flight.t+=dt/this.flight.duration;const t=clamp(this.flight.t,0,1),e=ease(t);
      const p=new THREE.CubicBezierCurve3(this.flight.start,this.flight.c1,this.flight.c2,this.flight.end).getPoint(e);this.camera.position.copy(p);
      const look=mixColor(this.flight.startLook,this.flight.endLook,e);this.currentLook=look;this.camera.lookAt(look);
      if(t>=1){this.flight=null;this.currentLook=this.flight?.endLook||this.routeSettings(this.route).center.clone().add(new THREE.Vector3(0,1.5,0));}
      return;
    }
    const base=this.baseCameraOffset.clone().multiplyScalar(this.zoom);
    const q=new THREE.Quaternion().setFromEuler(new THREE.Euler(this.orbitPitch,this.orbitYaw,0,'YXZ'));
    base.applyQuaternion(q);
    const parallax=new THREE.Vector3(this.pointerSmooth.x*1.2,this.pointerSmooth.y*.65,0);
    const desired=this.center.clone().add(base).add(parallax);
    this.camera.position.lerp(desired,1-Math.pow(.0015,dt));
    const look=this.center.clone().add(new THREE.Vector3(this.pointerSmooth.x*.9,1.4+this.pointerSmooth.y*.55,0));
    this.currentLook=look;this.camera.lookAt(look);
  }

  tick(){
    const dt=Math.min(this.clock.getDelta(),.05),t=this.clock.elapsedTime;
    this.pointerSmooth.lerp(this.pointer,.045);
    this.domeMat.uniforms.uTime.value=t;
    this.palette.a.lerp(this.paletteTarget.a,.025);this.palette.b.lerp(this.paletteTarget.b,.025);this.palette.c.lerp(this.paletteTarget.c,.025);
    this.domeMat.uniforms.uA.value.copy(this.palette.a);this.domeMat.uniforms.uB.value.copy(this.palette.b);this.domeMat.uniforms.uC.value.copy(this.palette.c);
    this.fill.color.lerp(this.palette.a,.03);this.rim.color.lerp(this.palette.b,.03);this.hemi.color.lerp(this.palette.c,.02);
    if(this.targetFog)this.scene.fog.color.lerp(this.targetFog,.025);
    if(this.targetBloom!=null)this.bloom.strength=THREE.MathUtils.lerp(this.bloom.strength,this.targetBloom,.035);
    if(this.targetExposure!=null)this.renderer.toneMappingExposure=THREE.MathUtils.lerp(this.renderer.toneMappingExposure,this.targetExposure,.035);
    this.animators.forEach(fn=>fn(t,dt));
    const warping=!!this.flight;this.warp.visible=warping;
    if(warping){
      this.warpRings.forEach((r,i)=>{const travel=(t*19+i*1.25)%35;r.position.z=-2-travel;r.scale.setScalar(.72+travel*.035);r.material.opacity=.12+.42*(1-travel/35);r.material.color.lerp(i%2?this.palette.a:this.palette.b,.12);r.rotation.z+=.012*(i%3+1)});
      this.warpDust.material.opacity=.62;this.warpDust.position.z=(t*16)%12;
    }else this.warpDust.material.opacity=0;
    for(let i=this.transients.length-1;i>=0;i--){const p=this.transients[i];p.life+=dt;const k=p.life/1.05;p.group.scale.setScalar(1+k*5);p.group.children.forEach((r,j)=>{r.material.opacity=Math.max(0,(.72-j*.15)*(1-k));r.rotation.z+=.015*(j+1)});if(k>=1){this.scene.remove(p.group);p.group.children.forEach(r=>{r.geometry.dispose();r.material.dispose()});this.transients.splice(i,1)}}
    this.afterimage.enabled=this.quality==='high'&&this.route.includes('phantom');
    this.glitch.enabled=this.quality==='high'&&this.route==='cyber';
    this.updateCamera(dt);
    this.updateHover();
    this.composer.render();
  }

  resize(){
    const w=innerWidth,h=innerHeight;this.camera.aspect=w/h;this.camera.updateProjectionMatrix();this.renderer.setSize(w,h,false);this.composer.setSize(w,h);
  }
}
