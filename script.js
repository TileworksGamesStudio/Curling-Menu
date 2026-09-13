/**
 * Game Collection Hub Controller — Championship Curling Edition
 * Advanced Light Neo-Brutalist Canadian Sport Interface
 */
(function () {
  "use strict";

  // Game Grid Collection Data Model (Preserved)
  const GAMES = [
    { id: "crossword", name: "Crossword", url: "https://tileworksgamesstudio.github.io/Curling-Crossword/", enabled: true, icon: "grid" },
    { id: "connections", name: "Connections", url: "https://tileworksgamesstudio.github.io/Curling-Connections/", enabled: true, icon: "nodes" },
    { id: "trivia", name: "Trivia", url: "https://tileworksgamesstudio.github.io/Curling-Trivia/", enabled: true, icon: "help" },
    { id: "hangman", name: "Hangman", url: "https://tileworksgamesstudio.github.io/Curling-Hangman/", enabled: true, icon: "text" },
    { id: "specs", name: "Cards", url: "https://tileworksgamesstudio.github.io/Curling-Cards/", enabled: true, icon: "check" },
    { id: "memory", name: "Memory", url: "https://tileworksgamesstudio.github.io/Curling-Memory/", enabled: true, icon: "cards" },
    { id: "spelling-bee", name: "Letters", url: "https://tileworksgamesstudio.github.io/Curling-Spelling", enabled: true, icon: "hex" },
    { id: "wordle", name: "Wordle", url: "https://tileworksgamesstudio.github.io/Curling-Wordle/", enabled: true, icon: "rows" },
    { id: "extra", name: "Wordsearch", url: "https://tileworksgamesstudio.github.io/Curling-Wordsearch/", enabled: true, icon: "plus" }
  ];

  // Restrained neutral stroke icons for games
  const ICONS = {
    grid: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>',
    nodes: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="18" r="3"/><line x1="9" y1="6" x2="15" y2="6"/><line x1="6" y1="9" x2="6" y2="15"/><line x1="18" y1="9" x2="18" y2="15"/><line x1="9" y1="18" x2="15" y2="18"/></svg>',
    help: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    text: '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="4" y1="7" x2="20" y2="7"/><line x1="10" y1="12" x2="20" y2="12"/><line x1="6" y1="17" x2="20" y2="17"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    cards: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="13" height="15" rx="2"/><rect x="9" y="3" width="13" height="15" rx="2"/></svg>',
    hex: '<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2"/></svg>',
    rows: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="4" rx="1"/><rect x="3" y="16" width="18" height="4" rx="1"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'
  };

  /* --------------------------------------------------------------------------
     EXACTLY 12 DISTINCT CURLING ICONS + CANADIAN MAPLE LEAF (MANDATORY SVG)
     -------------------------------------------------------------------------- */
  // Mandatory Canadian Maple Leaf SVG silhouette
  const MAPLE_LEAF_PATH = 'm325.8 480.69 8.1527-20.11-65.765-60.873 17.392-9.2397-7.6092-44.568 39.676 4.3481 11.957-16.849 30.98 39.133-17.392-84.788 26.089 8.6962 25.001-45.655 23.371 44.568 27.719-7.6092-17.936 84.244 30.98-38.046 10.87 16.305 39.133-3.8046-5.9786 42.937 17.936 11.414-65.765 60.33 7.0656 21.197-58.699-9.7832 1.6305 72.83h-22.284l3.2611-73.374z';

  const CURLING_ICONS = [
    // 1. Curling Stone
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="15" rx="9" ry="5"/><path d="M7 13V9a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"/><path d="M9 7V4h6v3"/></svg>',
    // 2. Curling House / Rings
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    // 3. Curling Broom
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="5" y1="5" x2="16" y2="16"/><path d="M14 18l5-5 2 2-5 5z"/></svg>',
    // 4. Brush Head
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="14" width="18" height="6" rx="2"/><path d="M12 14V5M8 5h8"/></svg>',
    // 5. Hack (Foothold)
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="8" width="14" height="8" rx="1"/><line x1="8" y1="8" x2="8" y2="16"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="16" y1="8" x2="16" y2="16"/></svg>',
    // 6. Curling Stone Handle
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 16h14M8 16V9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v7"/></svg>',
    // 7. Hog Line
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="2" y1="12" x2="22" y2="12"/><line x1="6" y1="8" x2="6" y2="16"/><line x1="18" y1="8" x2="18" y2="16"/></svg>',
    // 8. Back Line
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="2" y1="16" x2="22" y2="16"/><path d="M8 8a4 4 0 0 1 8 0"/></svg>',
    // 9. Centre Line
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="12" y1="2" x2="12" y2="22"/><line x1="4" y1="12" x2="20" y2="12"/></svg>',
    // 10. Ice Pebble Texture Motif
    '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="6" cy="6" r="1.5"/><circle cx="14" cy="7" r="1.2"/><circle cx="18" cy="13" r="1.5"/><circle cx="7" cy="15" r="1.2"/><circle cx="12" cy="18" r="1.4"/></svg>',
    // 11. Scoreboard End Marker
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="4" x2="12" y2="20"/></svg>',
    // 12. Skip / Delivery Silhouette
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="7" cy="7" r="2.5"/><path d="M4 19l4-6 5 2 7-3M9 13l4 6"/></svg>'
  ];

  function getMapleLeafSvg(color = "#d71920") {
    return `<svg viewBox="0 0 298.72 341.12" aria-hidden="true" focusable="false">
      <g transform="translate(-250.85 -233.44)">
        <path d="${MAPLE_LEAF_PATH}" fill="${color}"/>
      </g>
    </svg>`;
  }

  // State & Settings
  const STORAGE_KEY = "game_hub_settings";
  const state = {
    sound: true,
    animations: true
  };

  function loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.sound === "boolean") state.sound = parsed.sound;
        if (typeof parsed.animations === "boolean") state.animations = parsed.animations;
      }
    } catch (e) {
      // Local storage fallback
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // Local storage fallback
    }
  }

  /* --------------------------------------------------------------------------
     Synthesized Web Audio: Tactile Curling Stones, Ice & Broom Sounds
     (Clean, Safe, Zero External Assets)
     -------------------------------------------------------------------------- */
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  // Stone contact click / Broom sweep chime
  function playSound(freq = 480, type = "triangle", duration = 0.06, endFreqRatio = 0.45) {
    if (!state.sound) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * endFreqRatio), audioCtx.currentTime + duration);

      // Low, comfortable volume
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (err) {
      // Graceful silent fallback
    }
  }

  // Two-tone chime for modal opening and important actions
  function playIceChime() {
    if (!state.sound) return;
    playSound(580, "sine", 0.05, 0.9);
    setTimeout(() => {
      playSound(780, "sine", 0.06, 0.85);
    }, 45);
  }

  /* --------------------------------------------------------------------------
     Grid Renderer
     -------------------------------------------------------------------------- */
  function renderGrid() {
    const grid = document.getElementById("game-grid");
    if (!grid) return;

    const fragment = document.createDocumentFragment();

    GAMES.forEach((item, index) => {
      const cell = document.createElement("div");
      cell.className = "grid-cell";

      if (item && item.enabled) {
        const link = document.createElement("a");
        link.className = "tile";
        link.href = item.url || "#";
        link.setAttribute("role", "listitem");
        link.setAttribute("aria-label", `Play ${item.name}`);

        // Tactile stone tap feedback on click
        link.addEventListener("click", () => {
          // Alternating subtle pitch like red and yellow stones colliding
          const pitch = index % 2 === 0 ? 540 : 490;
          playSound(pitch, "triangle", 0.055, 0.4);
        });

        const iconEl = document.createElement("div");
        iconEl.className = "tile-icon";
        iconEl.innerHTML = ICONS[item.icon] || ICONS.grid;

        const label = document.createElement("span");
        label.className = "tile-label";
        label.textContent = item.name;

        link.appendChild(iconEl);
        link.appendChild(label);
        cell.appendChild(link);
      } else {
        cell.classList.add("is-empty");
        cell.setAttribute("aria-hidden", "true");
      }

      fragment.appendChild(cell);
    });

    grid.innerHTML = "";
    grid.appendChild(fragment);
  }

  /* --------------------------------------------------------------------------
     Ambient Floating Curling & Maple Leaf System
     -------------------------------------------------------------------------- */
  let ambientAnimationId = null;
  const activeParticles = [];
  const MAX_PARTICLES = 14;

  function createAmbientMotif() {
    const stage = document.getElementById("curling-ambient-stage");
    if (!stage || !state.animations || activeParticles.length >= MAX_PARTICLES) return;

    // Check prefers-reduced-motion
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const item = document.createElement("div");
    item.className = "floating-curling-item";

    // 3 Distinct Depth Levels
    const depthRand = Math.random();
    let depthClass, scale, opacity, speed, blur;
    
    if (depthRand < 0.45) {
      // Distant
      depthClass = "depth-distant";
      scale = 0.65 + Math.random() * 0.25;
      opacity = 0.08 + Math.random() * 0.08;
      speed = 0.35 + Math.random() * 0.3;
      blur = 1.2;
    } else if (depthRand < 0.8) {
      // Middle
      depthClass = "depth-mid";
      scale = 0.9 + Math.random() * 0.35;
      opacity = 0.16 + Math.random() * 0.12;
      speed = 0.55 + Math.random() * 0.35;
      blur = 0.5;
    } else {
      // Near
      depthClass = "depth-near";
      scale = 1.25 + Math.random() * 0.45;
      opacity = 0.22 + Math.random() * 0.15;
      speed = 0.75 + Math.random() * 0.4;
      blur = 0;
    }

    item.classList.add(depthClass);

    // Pick between 12 curling icons or Canadian Maple Leaf (approx 35% chance for leaf)
    const isLeaf = Math.random() < 0.35;
    if (isLeaf) {
      const colors = ["#d71920", "#0b1c2d", "#ff2b30", "#ffc400"];
      const leafColor = colors[Math.floor(Math.random() * colors.length)];
      item.innerHTML = getMapleLeafSvg(leafColor);
      item.style.width = "30px";
      item.style.height = "34px";
    } else {
      const iconIndex = Math.floor(Math.random() * CURLING_ICONS.length);
      item.innerHTML = CURLING_ICONS[iconIndex];
      item.style.width = "26px";
      item.style.height = "26px";

      // Color accent: dark blue, canadian red, or stone yellow
      const colorChoices = ["#0b1c2d", "#235882", "#d71920", "#ffc400"];
      item.style.color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
    }

    const startX = Math.random() * 92 + 4; // percentage
    let currentY = 105; // start below screen
    let currentX = startX;
    let rotation = Math.random() * 360;
    const rotSpeed = (Math.random() - 0.5) * 0.4;
    const driftX = (Math.random() - 0.5) * 0.25;

    item.style.left = `${startX}%`;
    item.style.top = `${currentY}%`;
    item.style.opacity = "0";
    item.style.filter = blur > 0 ? `blur(${blur}px)` : "none";

    stage.appendChild(item);

    const particleObj = {
      el: item,
      x: currentX,
      y: currentY,
      speed,
      driftX,
      rotation,
      rotSpeed,
      targetOpacity: opacity,
      currentOpacity: 0,
      scale
    };

    activeParticles.push(particleObj);
  }

  function updateAmbientMotifs() {
    if (!state.animations) {
      clearAmbientMotifs();
      return;
    }

    for (let i = activeParticles.length - 1; i >= 0; i--) {
      const p = activeParticles[i];
      p.y -= p.speed * 0.38;
      p.x += p.driftX;
      p.rotation += p.rotSpeed;

      // Smooth fade-in and fade-out
      if (p.y > 90) {
        p.currentOpacity = Math.min(p.targetOpacity, p.currentOpacity + 0.015);
      } else if (p.y < 15) {
        p.currentOpacity = Math.max(0, p.currentOpacity - 0.01);
      } else {
        p.currentOpacity = p.targetOpacity;
      }

      p.el.style.transform = `translate3d(${p.x - 50}vw, ${p.y}vh, 0) scale(${p.scale}) rotate(${p.rotation}deg)`;
      p.el.style.opacity = p.currentOpacity.toFixed(3);

      // Remove when off-screen
      if (p.y < -10) {
        if (p.el.parentNode) {
          p.el.parentNode.removeChild(p.el);
        }
        activeParticles.splice(i, 1);
      }
    }

    // Random spawn cadence
    if (Math.random() < 0.04 && activeParticles.length < MAX_PARTICLES) {
      createAmbientMotif();
    }

    ambientAnimationId = requestAnimationFrame(updateAmbientMotifs);
  }

  function clearAmbientMotifs() {
    if (ambientAnimationId) {
      cancelAnimationFrame(ambientAnimationId);
      ambientAnimationId = null;
    }
    const stage = document.getElementById("curling-ambient-stage");
    if (stage) stage.innerHTML = "";
    activeParticles.length = 0;
  }

  function startAmbientSystem() {
    if (!state.animations) return;
    clearAmbientMotifs();
    // Pre-populate with a few initial motifs at varied heights
    for (let i = 0; i < 5; i++) {
      createAmbientMotif();
      if (activeParticles[i]) {
        activeParticles[i].y = Math.random() * 80 + 10;
        activeParticles[i].currentOpacity = activeParticles[i].targetOpacity;
      }
    }
    ambientAnimationId = requestAnimationFrame(updateAmbientMotifs);
  }

  /* --------------------------------------------------------------------------
     Modal & Sheet Dialog Controller
     -------------------------------------------------------------------------- */
  let activeModal = null;
  let previouslyFocused = null;

  function openModal(modalEl, triggerBtn) {
    if (!modalEl) return;
    initAudio();
    playIceChime();

    previouslyFocused = triggerBtn || document.activeElement;
    activeModal = modalEl;

    const backdrop = document.getElementById("modal-backdrop");
    if (backdrop) backdrop.classList.add("is-active");

    modalEl.hidden = false;
    void modalEl.offsetHeight; // force reflow
    modalEl.classList.add("is-open");

    if (triggerBtn) {
      triggerBtn.setAttribute("aria-expanded", "true");
    }

    const focusable = modalEl.querySelector("button, [href], input, [tabindex]:not([tabindex='-1'])");
    if (focusable) focusable.focus();

    document.addEventListener("keydown", handleKeydown);
  }

  function closeModal() {
    if (!activeModal) return;
    playSound(380, "sine", 0.04, 0.6);

    const backdrop = document.getElementById("modal-backdrop");
    if (backdrop) backdrop.classList.remove("is-active");

    activeModal.classList.remove("is-open");

    const closingModal = activeModal;
    setTimeout(() => {
      if (!closingModal.classList.contains("is-open")) {
        closingModal.hidden = true;
      }
    }, 280);

    const btnSettings = document.getElementById("btn-settings");
    const btnDonate = document.getElementById("btn-donate");
    if (btnSettings) btnSettings.setAttribute("aria-expanded", "false");
    if (btnDonate) btnDonate.setAttribute("aria-expanded", "false");

    if (previouslyFocused && typeof previouslyFocused.focus === "function") {
      previouslyFocused.focus();
    }

    activeModal = null;
    document.removeEventListener("keydown", handleKeydown);
  }

  function handleKeydown(e) {
    if (e.key === "Escape") {
      closeModal();
    }
  }

  /* --------------------------------------------------------------------------
     Setup Interactions
     -------------------------------------------------------------------------- */
  function applyAnimationState() {
    if (state.animations) {
      document.body.classList.remove("animations-disabled");
      startAmbientSystem();
    } else {
      document.body.classList.add("animations-disabled");
      clearAmbientMotifs();
    }
  }

  function setupInteractions() {
    // Utility buttons
    const btnInstagram = document.getElementById("btn-instagram");
    const btnSettings = document.getElementById("btn-settings");
    const btnDonate = document.getElementById("btn-donate");

    // Modals
    const modalSettings = document.getElementById("settings-modal");
    const modalDonate = document.getElementById("donate-modal");
    const btnCloseSettings = document.getElementById("close-settings");
    const btnCloseDonate = document.getElementById("close-donate");
    const backdrop = document.getElementById("modal-backdrop");

    // Form inputs
    const soundToggle = document.getElementById("toggle-sound");
    const animToggle = document.getElementById("toggle-animations");
    const stripeLink = document.getElementById("stripe-donate-link");

    // Initialize toggle state
    if (soundToggle) soundToggle.checked = state.sound;
    if (animToggle) animToggle.checked = state.animations;
    applyAnimationState();

    // Instagram Tile Click Sound (stone crack)
    if (btnInstagram) {
      btnInstagram.addEventListener("click", () => {
        playSound(620, "triangle", 0.05, 0.7);
      });
    }

    // Settings Toggle Handlers
    if (soundToggle) {
      soundToggle.addEventListener("change", (e) => {
        state.sound = e.target.checked;
        saveSettings();
        if (state.sound) playSound(640, "sine", 0.05, 0.95);
      });
    }

    if (animToggle) {
      animToggle.addEventListener("change", (e) => {
        state.animations = e.target.checked;
        saveSettings();
        applyAnimationState();
        playSound(520, "sine", 0.04, 0.85);
      });
    }

    // Modal Trigger Listeners
    if (btnSettings && modalSettings) {
      btnSettings.addEventListener("click", () => openModal(modalSettings, btnSettings));
    }

    if (btnDonate && modalDonate) {
      btnDonate.addEventListener("click", () => openModal(modalDonate, btnDonate));
    }

    if (btnCloseSettings) {
      btnCloseSettings.addEventListener("click", closeModal);
    }

    if (btnCloseDonate) {
      btnCloseDonate.addEventListener("click", closeModal);
    }

    if (backdrop) {
      backdrop.addEventListener("click", closeModal);
    }

    // Audio feedback for Stripe Donate Link
    if (stripeLink) {
      stripeLink.addEventListener("click", () => {
        playIceChime();
      });
    }
  }

  /* --------------------------------------------------------------------------
     Initialization
     -------------------------------------------------------------------------- */
  function init() {
    loadSettings();
    renderGrid();
    setupInteractions();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();