class AeterEngine {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();
    
    this.cityGroup = new THREE.Group();
    this.coreGroup = new THREE.Group();
    this.ufos = [];
    this.sentinels = [];
    this.projectMonoliths = [];
    this.constellationNodes = [];
    this.xRayActive = false;
    this.xRayExplosionFactor = 0;

    this.fps = 60;
    this.framesThisSecond = 0;
    this.lastFpsUpdate = performance.now();
    this.resolutionTier = 1.0;
    this.targetCameraPos = new THREE.Vector3(0, 6, 28);
    this.targetLookAt = new THREE.Vector3(0, 2, 0);
    this.currentLookAt = new THREE.Vector3(0, 2, 0);
    this.audioIntensity = 0;

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x020308, 0.0075);

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 1500);
    this.camera.position.set(0, 6, 28);

    this.renderer = new THREE.WebGLRenderer({
      antialias: window.devicePixelRatio < 2,
      powerPreference: "high-performance",
      stencil: false,
      depth: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.container.appendChild(this.renderer.domElement);

    this.setupLighting();
    this.buildCyberCity();
    this.buildTransmissionCore();
    this.spawnSpacecraftFleet();
    this.spawnCyberSentinels();
    this.buildProjectEnvironments();
    this.buildArsenalConstellation();
    this.buildCosmicBackdrop();

    window.addEventListener("resize", () => this.onResize());
    this.animate();
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x08101a, 1.8);
    this.scene.add(ambientLight);

    const corePoint = new THREE.PointLight(0x00f0ff, 3.5, 90, 1.5);
    corePoint.position.set(0, 4, 0);
    this.scene.add(corePoint);

    const rimLight = new THREE.DirectionalLight(0xff007f, 1.2);
    rimLight.position.set(-50, 80, -60);
    this.scene.add(rimLight);

    const amberFill = new THREE.DirectionalLight(0xffaa00, 0.8);
    amberFill.position.set(60, 40, 40);
    this.scene.add(amberFill);
  }

  buildCosmicBackdrop() {
    const starCount = 1800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      const r = 350 + Math.random() * 250;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = Math.abs(r * Math.cos(phi)) + 10;
      positions[i + 2] = r * Math.sin(phi) * Math.sin(theta);

      const choice = Math.random();
      if (choice < 0.4) {
        colors[i] = 0; colors[i + 1] = 0.9; colors[i + 2] = 1.0;
      } else if (choice < 0.7) {
        colors[i] = 1.0; colors[i + 1] = 0.7; colors[i + 2] = 0.1;
      } else {
        colors[i] = 0.9; colors[i + 1] = 0.2; colors[i + 2] = 0.7;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    const starField = new THREE.Points(geometry, material);
    this.scene.add(starField);
  }

  buildCyberCity() {
    const buildingCount = 140;
    const buildingGeo = new THREE.BoxGeometry(1, 1, 1);
    const buildingMat = new THREE.MeshStandardMaterial({ color: 0x050811, roughness: 0.25, metalness: 0.85 });
    const windowColors = [0x00f0ff, 0xff007f, 0x00ff66, 0xffaa00, 0x8000ff];

    for (let i = 0; i < buildingCount; i++) {
      const height = 15 + Math.random() * 85;
      const width = 6 + Math.random() * 12;
      const depth = 6 + Math.random() * 12;
      const angle = Math.random() * Math.PI * 2;
      const distance = 55 + Math.random() * 140;

      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;

      const building = new THREE.Mesh(buildingGeo, buildingMat);
      building.scale.set(width, height, depth);
      building.position.set(x, height / 2 - 5, z);
      this.cityGroup.add(building);

      if (height > 55) {
        const spireGeo = new THREE.CylinderGeometry(0.1, 0.5, 12, 6);
        const spireMat = new THREE.MeshBasicMaterial({ color: windowColors[Math.floor(Math.random() * windowColors.length)] });
        const spire = new THREE.Mesh(spireGeo, spireMat);
        spire.position.set(x, height - 5 + 6, z);
        this.cityGroup.add(spire);

        const beaconLight = new THREE.PointLight(spireMat.color, 1.5, 25);
        beaconLight.position.set(x, height + 8, z);
        this.cityGroup.add(beaconLight);
      }
    }

    const grid = new THREE.GridHelper(320, 80, 0x00f0ff, 0x0a1c2e);
    grid.position.y = -5;
    this.cityGroup.add(grid);
    this.scene.add(this.cityGroup);
  }

  buildTransmissionCore() {
    this.coreGroup = new THREE.Group();

    const innerCoreGeo = new THREE.IcosahedronGeometry(2.5, 2);
    const innerCoreMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff, emissive: 0x0077aa, roughness: 0.1, metalness: 0.9, wireframe: true
    });
    this.innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    this.coreGroup.add(this.innerCore);

    const solidSphereGeo = new THREE.SphereGeometry(1.4, 32, 32);
    const solidSphereMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.solidCore = new THREE.Mesh(solidSphereGeo, solidSphereMat);
    this.coreGroup.add(this.solidCore);

    this.rings = [];
    const ringRadii = [4.2, 6.0, 8.2];
    const ringColors = [0x00f0ff, 0xff007f, 0x00ff66];

    ringRadii.forEach((radius, idx) => {
      const ringGeo = new THREE.TorusGeometry(radius, 0.12, 16, 100);
      const ringMat = new THREE.MeshStandardMaterial({
        color: ringColors[idx], emissive: ringColors[idx], emissiveIntensity: 0.6, roughness: 0.2, metalness: 0.8
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.random() * Math.PI;
      ringMesh.rotation.y = Math.random() * Math.PI;
      this.coreGroup.add(ringMesh);
      this.rings.push({ mesh: ringMesh, speed: (0.008 + idx * 0.005) * (idx % 2 === 0 ? 1 : -1) });
    });

    this.brackets = [];
    for (let i = 0; i < 4; i++) {
      const bracketGeo = new THREE.BoxGeometry(0.5, 3.5, 0.5);
      const bracketMat = new THREE.MeshStandardMaterial({ color: 0x1f293d, metalness: 0.9, roughness: 0.2 });
      const bracket = new THREE.Mesh(bracketGeo, bracketMat);
      const angle = (i / 4) * Math.PI * 2;
      bracket.position.set(Math.cos(angle) * 5.2, 0, Math.sin(angle) * 5.2);
      this.coreGroup.add(bracket);
      this.brackets.push({ mesh: bracket, basePos: bracket.position.clone() });
    }

    this.coreGroup.position.set(0, 2, 0);
    this.scene.add(this.coreGroup);
  }

  spawnSpacecraftFleet() {
    const fleetCount = 14;
    const craftColors = [0x00f0ff, 0xff007f, 0xffaa00, 0x00ff66, 0x8a2be2];

    for (let i = 0; i < fleetCount; i++) {
      const craftGroup = new THREE.Group();
      const chassisGeo = new THREE.CylinderGeometry(1.2, 2.2, 0.4, 16);
      const chassisMat = new THREE.MeshStandardMaterial({ color: 0x0a0e17, roughness: 0.2, metalness: 0.95 });
      const chassis = new THREE.Mesh(chassisGeo, chassisMat);
      craftGroup.add(chassis);

      const engineGeo = new THREE.TorusGeometry(1.4, 0.15, 8, 24);
      const engineMat = new THREE.MeshBasicMaterial({ color: craftColors[i % craftColors.length] });
      const engine = new THREE.Mesh(engineGeo, engineMat);
      engine.rotation.x = Math.PI / 2;
      craftGroup.add(engine);

      const light = new THREE.PointLight(engineMat.color, 1.8, 22);
      light.position.set(0, -0.5, 0);
      craftGroup.add(light);

      const pathRadius = 40 + Math.random() * 80;
      const height = 10 + Math.random() * 45;
      const speed = 0.003 + Math.random() * 0.007;
      const startAngle = Math.random() * Math.PI * 2;

      craftGroup.position.set(Math.cos(startAngle) * pathRadius, height, Math.sin(startAngle) * pathRadius);
      this.scene.add(craftGroup);
      this.ufos.push({
        group: craftGroup, radius: pathRadius, height: height, speed: speed, angle: startAngle, pitchFactor: Math.random() * 0.2
      });
    }
  }

  spawnCyberSentinels() {
    const sentinelPositions = [[12, -2, -10], [-14, 0, -12], [45, 2, -65], [-60, -3, -45]];
    sentinelPositions.forEach((pos, idx) => {
      const sentinel = new THREE.Group();
      const headGeo = new THREE.BoxGeometry(0.6, 0.7, 0.6);
      const headMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.9 });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 2.4;

      const visorGeo = new THREE.BoxGeometry(0.5, 0.15, 0.2);
      const visorMat = new THREE.MeshBasicMaterial({ color: idx % 2 === 0 ? 0x00f0ff : 0xff007f });
      const visor = new THREE.Mesh(visorGeo, visorMat);
      visor.position.set(0, 2.4, 0.28);
      sentinel.add(head); sentinel.add(visor);

      const torsoGeo = new THREE.CylinderGeometry(0.4, 0.6, 1.4, 8);
      const torsoMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.3, metalness: 0.8 });
      const torso = new THREE.Mesh(torsoGeo, torsoMat);
      torso.position.y = 1.3;
      sentinel.add(torso);

      const auraGeo = new THREE.RingGeometry(0.9, 1.0, 16);
      const auraMat = new THREE.MeshBasicMaterial({ color: visorMat.color, side: THREE.DoubleSide });
      const aura = new THREE.Mesh(auraGeo, auraMat);
      aura.rotation.x = Math.PI / 2;
      aura.position.y = 0.1;
      sentinel.add(aura);

      sentinel.position.set(pos[0], pos[1], pos[2]);
      this.scene.add(sentinel);
      this.sentinels.push({ group: sentinel, basePosY: pos[1], timeOffset: idx * 2.0 });
    });
  }

  buildProjectEnvironments() {
    AETER_DATA.projects.forEach((proj, idx) => {
      const group = new THREE.Group();
      const monolithGeo = new THREE.BoxGeometry(3.5, 8, 3.5);
      const monolithMat = new THREE.MeshStandardMaterial({
        color: 0x0a101d, emissive: proj.color, emissiveIntensity: 0.35, roughness: 0.15, metalness: 0.9
      });
      const monolith = new THREE.Mesh(monolithGeo, monolithMat);
      group.add(monolith);

      if (proj.id === "ruvigil") {
        const waveGeo = new THREE.TorusGeometry(3.2, 0.08, 8, 32);
        const waveMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
        const wave = new THREE.Mesh(waveGeo, waveMat);
        wave.rotation.x = Math.PI / 2; group.add(wave);
      } else if (proj.id === "phantom") {
        const ptsGeo = new THREE.SphereGeometry(3.0, 12, 12);
        const ptsMat = new THREE.PointsMaterial({ color: 0xff007f, size: 0.2 });
        const pts = new THREE.Points(ptsGeo, ptsMat); group.add(pts);
      } else if (proj.id === "elif-linux") {
        const reactorGeo = new THREE.TorusGeometry(2.8, 0.18, 12, 32);
        const reactorMat = new THREE.MeshStandardMaterial({ color: 0x00ff66, metalness: 0.8 });
        const reactor = new THREE.Mesh(reactorGeo, reactorMat); group.add(reactor);
      }

      const x = 50 + (idx % 2 === 0 ? 1 : -1) * (20 + idx * 15);
      const z = -60 - idx * 20;
      group.position.set(x, 4, z);
      this.scene.add(group);
      this.projectMonoliths.push({ group: group, data: proj, baseY: 4 });
    });
  }

  buildArsenalConstellation() {
    const constellationGroup = new THREE.Group();
    const nodeGeo = new THREE.OctahedronGeometry(0.8);

    AETER_DATA.arsenal.forEach((cluster, cIdx) => {
      const clusterColor = new THREE.Color(cluster.color);
      cluster.technologies.forEach((tech, tIdx) => {
        const nodeMat = new THREE.MeshStandardMaterial({
          color: clusterColor, emissive: clusterColor, emissiveIntensity: 0.5, metalness: 0.8, roughness: 0.2
        });
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        const angle = (tIdx / cluster.technologies.length) * Math.PI * 2;
        const radius = 6 + cIdx * 4;

        node.position.set(
          -70 + Math.cos(angle) * radius,
          15 + (cIdx * 3) + Math.sin(angle) * 2,
          60 + Math.sin(angle) * radius
        );
        const light = new THREE.PointLight(clusterColor, 0.8, 8);
        light.position.copy(node.position);
        constellationGroup.add(node);
        constellationGroup.add(light);
        this.constellationNodes.push({ mesh: node, basePos: node.position.clone() });
      });
    });
    this.scene.add(constellationGroup);
  }

  setDistrict(districtId) {
    const district = AETER_DATA.districts.find(d => d.id === districtId);
    if (!district) return;
    const pos = district.pos;
    this.targetCameraPos.set(pos[0], pos[1] + 6, pos[2] + 28);
    this.targetLookAt.set(pos[0], pos[1] + 2, pos[2]);
  }

  toggleXRay() {
    this.xRayActive = !this.xRayActive;
    return this.xRayActive;
  }

  onResize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    this.camera.position.lerp(this.targetCameraPos, 0.045);
    this.currentLookAt.lerp(this.targetLookAt, 0.045);
    this.camera.lookAt(this.currentLookAt);

    if (this.innerCore) {
      this.innerCore.rotation.x = elapsedTime * 0.25;
      this.innerCore.rotation.y = elapsedTime * 0.4;
      const audioScale = 1.0 + this.audioIntensity * 0.35;
      this.innerCore.scale.set(audioScale, audioScale, audioScale);
    }

    const targetFactor = this.xRayActive ? 1.0 : 0.0;
    this.xRayExplosionFactor += (targetFactor - this.xRayExplosionFactor) * 0.06;

    this.rings.forEach(r => {
      r.mesh.rotation.z += r.speed;
      r.mesh.rotation.y += r.speed * 0.5;
      r.mesh.scale.setScalar(1.0 + this.xRayExplosionFactor * 0.85);
    });

    this.brackets.forEach((b, i) => {
      const offset = b.basePos.clone().multiplyScalar(1.0 + this.xRayExplosionFactor * 1.5);
      b.mesh.position.lerp(offset, 0.1);
      b.mesh.rotation.y = elapsedTime * 0.2 + i;
    });

    this.ufos.forEach(ufo => {
      ufo.angle += ufo.speed;
      ufo.group.position.x = Math.cos(ufo.angle) * ufo.radius;
      ufo.group.position.z = Math.sin(ufo.angle) * ufo.radius;
      ufo.group.position.y = ufo.height + Math.sin(elapsedTime * 2 + ufo.angle) * 2;
      ufo.group.rotation.y = -ufo.angle - Math.PI / 2;
      ufo.group.rotation.z = Math.sin(ufo.angle * 2) * ufo.pitchFactor;
    });

    this.sentinels.forEach(s => {
      s.group.position.y = s.basePosY + Math.sin(elapsedTime * 1.8 + s.timeOffset) * 0.4;
      s.group.rotation.y = Math.sin(elapsedTime * 0.5 + s.timeOffset) * 0.3;
    });

    this.projectMonoliths.forEach((m, idx) => {
      m.group.rotation.y = elapsedTime * 0.3 + idx;
      m.group.position.y = m.baseY + Math.sin(elapsedTime + idx) * 0.3;
    });

    this.constellationNodes.forEach((node, idx) => {
      node.mesh.rotation.x = elapsedTime * 0.5 + idx;
      node.mesh.rotation.y = elapsedTime * 0.8 + idx;
    });

    this.renderer.render(this.scene, this.camera);
    this.updatePerformanceTelemetry();
  }

  updatePerformanceTelemetry() {
    this.framesThisSecond++;
    const now = performance.now();
    if (now - this.lastFpsUpdate >= 1000) {
      this.fps = this.framesThisSecond;
      this.framesThisSecond = 0;
      this.lastFpsUpdate = now;

      if (this.fps < 35 && this.resolutionTier > 0.6) {
        this.resolutionTier = Math.max(0.5, this.resolutionTier - 0.2);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio * this.resolutionTier, 1.5));
      } else if (this.fps > 55 && this.resolutionTier < 1.0) {
        this.resolutionTier = Math.min(1.0, this.resolutionTier + 0.1);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio * this.resolutionTier, 2));
      }

      if (window.AeterHUD) {
        window.AeterHUD.updateMetrics(this.fps, this.resolutionTier);
      }
    }
  }
}
