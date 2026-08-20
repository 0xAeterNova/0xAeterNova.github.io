window.AeterHUD = null;

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("webgl-container");
  const bootOverlay = document.getElementById("boot-overlay");
  const bootSoundBtn = document.getElementById("boot-sound-btn");
  const bootSilentBtn = document.getElementById("boot-silent-btn");

  let engineInstance = null;

  try {
    if (typeof THREE !== "undefined" && container) {
      engineInstance = new AeterEngine(container);
    } else {
      console.warn("Three.js engine fallback active.");
    }
  } catch (err) {
    console.error("WebGL Initialization failed, launching fallback UI:", err);
  }

  const appInstance = new AeterApp(engineInstance);
  window.AeterHUD = {
    transmit: (id) => appInstance.transmitToDistrict(id),
    closeAllModals: () => appInstance.closeAllModals(),
    closeSearch: () => document.getElementById("spectral-search-modal")?.classList.remove("active"),
    closeAtlas: () => document.getElementById("signal-atlas-modal")?.classList.remove("active"),
    updateMetrics: (fps, tier) => appInstance.updateMetrics(fps, tier)
  };

  const closeBoot = (withSound) => {
    if (bootOverlay) bootOverlay.classList.remove("active");
    if (!withSound) {
      const toggle = document.getElementById("audio-toggle");
      if (toggle) toggle.click();
    }
  };

  if (bootSoundBtn) bootSoundBtn.addEventListener("click", () => closeBoot(true));
  if (bootSilentBtn) bootSilentBtn.addEventListener("click", () => closeBoot(false));
});
