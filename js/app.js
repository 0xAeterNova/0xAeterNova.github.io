class AeterApp {
  constructor(engine) {
    this.engine = engine;
    this.currentDistrict = "00";
    this.isCinema = false;
    this.audioContext = null;
    this.soundtrack = null;
    this.audioSource = null;
    this.analyser = null;
    this.isMuted = false;

    this.initAudio();
    this.initReticleCursor();
    this.initNavigation();
    this.initSpectralSearch();
    this.initSignalAtlas();
    this.initKeyboardShortcuts();
    this.initOverlays();
  }

  initAudio() {
    const audioToggle = document.getElementById("audio-toggle");
    const volumeSlider = document.getElementById("volume-slider");

    const setupWebAudio = () => {
      if (this.audioContext) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioCtx();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 64;

        this.soundtrack = document.getElementById("ambient-soundtrack");
        if (this.soundtrack) {
          this.audioSource = this.audioContext.createMediaElementSource(this.soundtrack);
          this.audioSource.connect(this.analyser);
          this.analyser.connect(this.audioContext.destination);
          this.soundtrack.play().catch(() => console.log("Soundtrack waiting for trigger"));
        }
        this.startAudioTelemetry();
      } catch (e) {
        console.warn("WebAudio disabled", e);
      }
    };

    document.addEventListener("click", setupWebAudio, { once: true });

    if (audioToggle) {
      audioToggle.addEventListener("click", () => {
        setupWebAudio();
        this.isMuted = !this.isMuted;
        if (this.soundtrack) this.soundtrack.muted = this.isMuted;
        audioToggle.textContent = this.isMuted ? "SOUND: OFF" : "SOUND: ON";
        audioToggle.classList.toggle("active", !this.isMuted);
      });
    }

    if (volumeSlider && this.soundtrack) {
      volumeSlider.addEventListener("input", (e) => {
        this.soundtrack.volume = parseFloat(e.target.value);
      });
    }
  }

  playSpatialBeep(freq = 600, type = "sine", duration = 0.08) {
    if (!this.audioContext || this.isMuted) return;
    try {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
      gain.gain.setValueAtTime(0.08, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      osc.start();
      osc.stop(this.audioContext.currentTime + duration);
    } catch (e) {}
  }

  startAudioTelemetry() {
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    const step = () => {
      if (this.analyser && !this.isMuted) {
        this.analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        const avg = sum / dataArray.length / 255;
        this.engine.audioIntensity = avg;
      }
      requestAnimationFrame(step);
    };
    step();
  }

  initReticleCursor() {
    const reticle = document.getElementById("cyber-reticle");
    if (!reticle || window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let currX = mouseX, currY = mouseY;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
    });

    const renderReticle = () => {
      currX += (mouseX - currX) * 0.22;
      currY += (mouseY - currY) * 0.22;
      reticle.style.transform = `translate3d(${currX}px, ${currY}px, 0)`;
      requestAnimationFrame(renderReticle);
    };
    renderReticle();

    document.querySelectorAll("a, button, input, .interactive-node").forEach(el => {
      el.addEventListener("mouseenter", () => {
        reticle.classList.add("lock-state");
        this.playSpatialBeep(880, "triangle", 0.05);
      });
      el.addEventListener("mouseleave", () => reticle.classList.remove("lock-state"));
    });
  }

  initNavigation() {
    document.querySelectorAll("[data-district]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const districtId = e.currentTarget.getAttribute("data-district");
        this.transmitToDistrict(districtId);
      });
    });

    const xrayBtn = document.getElementById("xray-toggle");
    if (xrayBtn) {
      xrayBtn.addEventListener("click", () => {
        const active = this.engine.toggleXRay();
        xrayBtn.textContent = active ? "CLOSE X-RAY" : "X-RAY MACHINE";
        xrayBtn.classList.toggle("active", active);
        this.playSpatialBeep(active ? 1200 : 400, "sawtooth", 0.15);
      });
    }

    const cinemaBtn = document.getElementById("cinema-toggle");
    if (cinemaBtn) {
      cinemaBtn.addEventListener("click", () => this.toggleCinemaMode());
    }
  }

  transmitToDistrict(districtId) {
    this.currentDistrict = districtId;
    this.engine.setDistrict(districtId);
    this.playSpatialBeep(450, "sine", 0.2);

    document.querySelectorAll("[data-district]").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-district") === districtId);
    });
    this.renderSectionContent(districtId);
  }

  renderSectionContent(districtId) {
    const contentPanel = document.getElementById("district-overlay");
    if (!contentPanel) return;

    contentPanel.classList.remove("active");
    setTimeout(() => {
      let html = "";
      switch (districtId) {
        case "00":
          html = `
            <div class="hud-card">
              <span class="hud-badge">${AETER_DATA.identity.status}</span>
              <h1 class="hud-title">${AETER_DATA.identity.handle}</h1>
              <p class="hud-desc">${AETER_DATA.identity.tagline}</p>
              <div class="hud-grid-metrics">
                ${AETER_DATA.identity.stats.map(s => `
                  <div class="metric-box">
                    <span class="metric-val">${s.value}</span>
                    <span class="metric-lbl">${s.label}</span>
                  </div>
                `).join("")}
              </div>
              <div class="hud-cta-row">
                <button class="cyber-btn" onclick="AeterHUD.transmit('01')">EXPLORE ARCHIVE</button>
                <button class="cyber-btn" onclick="AeterHUD.transmit('02')">ENTER BREACH LAB</button>
                <a href="https://github.com/0xAeterNova" target="_blank" class="cyber-btn alt">GITHUB // 0x</a>
              </div>
            </div>
          `;
          break;
        case "01":
          html = `
            <div class="hud-card wide">
              <span class="hud-badge">CLASSIFIED PROJECT MATRIX</span>
              <h2 class="hud-title">FLAGSHIP ARCHIVE</h2>
              <div class="project-matrix-grid">
                ${AETER_DATA.projects.map(p => `
                  <div class="project-card" style="border-left: 3px solid ${p.color};">
                    <div class="proj-header">
                      <span class="proj-badge">${p.badge}</span>
                      <span class="proj-cat">${p.category}</span>
                    </div>
                    <h3 class="proj-name">${p.title}</h3>
                    <p class="proj-summary">${p.summary}</p>
                    <div class="tech-tag-row">
                      ${p.techStack.map(t => `<span class="tech-tag">${t}</span>`).join("")}
                    </div>
                    <div class="proj-footer">
                      <a href="${p.details.repo}" target="_blank" class="cyber-link">TRANSMIT REPO →</a>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          `;
          break;
        case "04":
          html = `
            <div class="hud-card">
              <span class="hud-badge">COMPETENCY CONSTELLATION</span>
              <h2 class="hud-title">ARSENAL CAPABILITIES</h2>
              <p class="hud-desc">Relational clustering without artificial percentage metrics.</p>
              <div class="constellation-list">
                ${AETER_DATA.arsenal.map(c => `
                  <div class="constellation-cluster">
                    <h4 style="color: ${c.color}">${c.cluster}</h4>
                    <div class="tech-tag-row">
                      ${c.technologies.map(t => `<span class="tech-tag" style="border-color: ${c.color}66">${t}</span>`).join("")}
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          `;
          break;
        case "07":
          html = `
            <div class="hud-card about-grid">
              <div class="about-visual">
                <div class="hero-frame-scaffold">
                  <img src="assets/hero/hero-artwork.png" alt="0xAeterNova Identity" class="hero-identity-image" onerror="this.src='https://raw.githubusercontent.com/0xAeterNova/0xAeterNova/main/assets/hero/left/option-a-photo-scene.png'"/>
                  <div class="scan-laser-line"></div>
                </div>
              </div>
              <div class="about-text-content">
                <span class="hud-badge">IDENTITY ORIGIN // 0x</span>
                <h2 class="hud-title">THE ARCHITECT</h2>
                <h4 class="hud-sub">${AETER_DATA.identity.philosophy}</h4>
                <p class="hud-desc">
                  Curiosity converges where low-level bare-metal hardware meets autonomous neural models and hardened attack surfaces.
                  Whether analyzing RF waveforms over distributed ESP32 nodes, dissecting GLIBC heap arenas, or running real-time point cloud landmark tracking,
                  the mission remains singular: complete systems comprehension.
                </p>
                <div class="hud-cta-row">
                  <button class="cyber-btn" onclick="AeterHUD.transmit('08')">ESTABLISH UPLINK</button>
                </div>
              </div>
            </div>
          `;
          break;
        default:
          html = `
            <div class="hud-card">
              <span class="hud-badge">DISTRICT // ${districtId}</span>
              <h2 class="hud-title">${AETER_DATA.districts.find(d => d.id === districtId)?.label || "SECTOR"}</h2>
              <p class="hud-desc">Telemetric grid active. Select an artifact or sub-node to inspect spatial details.</p>
            </div>
          `;
      }
      contentPanel.innerHTML = html;
      contentPanel.classList.add("active");
    }, 150);
  }

  initSpectralSearch() {
    const searchModal = document.getElementById("spectral-search-modal");
    const searchInput = document.getElementById("spectral-search-input");
    const resultsContainer = document.getElementById("spectral-search-results");

    if (!searchModal || !searchInput) return;

    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        resultsContainer.innerHTML = `<div class="search-empty">LOCKING FREQUENCY SPECTRUM...</div>`;
        return;
      }

      const matches = [];
      AETER_DATA.projects.forEach(p => {
        if (p.title.toLowerCase().includes(q) || p.techStack.some(t => t.toLowerCase().includes(q))) {
          matches.push({ title: p.title, type: "PROJECT // ARCHIVE", district: "01", color: p.color });
        }
      });

      AETER_DATA.arsenal.forEach(a => {
        a.technologies.forEach(t => {
          if (t.toLowerCase().includes(q)) {
            matches.push({ title: t, type: `ARSENAL // ${a.cluster}`, district: "04", color: a.color });
          }
        });
      });

      resultsContainer.innerHTML = matches.slice(0, 4).map(m => `
        <div class="search-result-node" onclick="AeterHUD.transmit('${m.district}'); AeterHUD.closeSearch();">
          <span class="sr-type" style="color:${m.color}">${m.type}</span>
          <span class="sr-title">${m.title}</span>
          <span class="sr-action">ACQUIRE SIGNAL →</span>
        </div>
      `).join("") || `<div class="search-empty">NO MATCHING SPECTRAL SIGNATURE</div>`;
    });
  }

  initSignalAtlas() {
    const atlasGrid = document.getElementById("atlas-node-grid");
    if (!atlasGrid) return;

    atlasGrid.innerHTML = AETER_DATA.districts.map(d => `
      <div class="atlas-cell" onclick="AeterHUD.transmit('${d.id}'); AeterHUD.closeAtlas();">
        <span class="atlas-id">${d.id}</span>
        <span class="atlas-label" style="color: ${d.color}">${d.label}</span>
        <span class="atlas-status">ACTIVE VECTOR</span>
      </div>
    `).join("");
  }

  initKeyboardShortcuts() {
    window.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        if (e.key === "Escape") e.target.blur();
        return;
      }
      if (e.key >= "0" && e.key <= "8") {
        this.transmitToDistrict(`0${e.key}`);
      } else if (e.key === "/" || e.key === "s") {
        e.preventDefault(); this.toggleSearch();
      } else if (e.key === "m" || e.key === "M") {
        this.toggleAtlas();
      } else if (e.key === "x" || e.key === "X") {
        document.getElementById("xray-toggle")?.click();
      } else if (e.key === "f" || e.key === "F") {
        this.toggleCinemaMode();
      } else if (e.key === "Escape") {
        this.closeAllModals();
      }
    });
  }

  toggleCinemaMode() {
    this.isCinema = !this.isCinema;
    document.body.classList.toggle("cinema-mode", this.isCinema);
    const btn = document.getElementById("cinema-toggle");
    if (btn) btn.classList.toggle("active", this.isCinema);
  }

  toggleSearch() {
    const modal = document.getElementById("spectral-search-modal");
    modal?.classList.toggle("active");
    if (modal?.classList.contains("active")) {
      document.getElementById("spectral-search-input")?.focus();
      this.playSpatialBeep(900, "triangle", 0.1);
    }
  }

  toggleAtlas() {
    const modal = document.getElementById("signal-atlas-modal");
    modal?.classList.toggle("active");
  }

  closeAllModals() {
    document.querySelectorAll(".hud-modal").forEach(m => m.classList.remove("active"));
  }

  initOverlays() {
    this.renderSectionContent("00");
  }

  updateMetrics(fps, resTier) {
    const fpsElem = document.getElementById("fps-metric");
    if (fpsElem) fpsElem.textContent = `${fps} FPS [Tier ${(resTier * 100).toFixed(0)}%]`;
  }
}
