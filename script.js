/**
 * Game Hub Controller & Canadian Curling Ice House Simulation
 * Full Implementation of the Ice House Royale Design Transformation Bible
 * Features:
 *  - Persistent, off-screen bottom launch, red/yellow alternating curling end
 *  - Stones spawn completely off-screen and enter the viewport in smooth glide motion
 *  - Authoritative elevated house (40% down from top)
 *  - Button convergence solver with authentic shot vocabulary
 *  - Continuous spin-to-curl physics with >= 50% light curl
 *  - Every 5th delivery: High-velocity MEGA CLEAR that hits hard and blasts the house
 *  - Resilient quiescence detection & delivery watchdog (guaranteed releases, zero deadlock)
 *  - Board persistence with natural out-of-play culling
 *  - Web Audio synthetic ice-glide chimes & tactile clicks
 */
(function () {
  "use strict";

  /* --------------------------------------------------------------------------
     1. Decoupled Game Catalog & Runtime Schema Validation
     -------------------------------------------------------------------------- */
  const GAME_CATALOG = [
    { id: "crossword",    name: "Crossword",    desc: "Daily mini puzzle",    url: "https://tileworksgamesstudio.github.io/Curling-Crossword/",   enabled: true,  icon: "grid" },
    { id: "connections",  name: "Connections",  desc: "Find groups of 4",     url: "https://tileworksgamesstudio.github.io/Curling-Connections/", enabled: true,  icon: "nodes" },
    { id: "trivia",       name: "Trivia",       desc: "Knowledge test",       url: "https://tileworksgamesstudio.github.io/Curling-Trivia/",      enabled: true,  icon: "help" },
    { id: "hangman",      name: "Hangman",      desc: "Guess the phrase",     url: "https://tileworksgamesstudio.github.io/Curling-Hangman/",     enabled: true,  icon: "text" },
    { id: "specs",        name: "Match",        desc: "Pair identical cards", url: "https://tileworksgamesstudio.github.io/Curling-Cards/",       enabled: true,  icon: "check" },
    { id: "memory",       name: "Memory",       desc: "Pattern recall",       url: "https://tileworksgamesstudio.github.io/Curling-Memory/",      enabled: true,  icon: "cards" },
    { id: "spelling-bee", name: "Spelling Bee", desc: "Form 4+ letter words", url: "https://tileworksgamesstudio.github.io/Curling-Spelling/",    enabled: true,  icon: "hex" },
    { id: "wordle",       name: "Word Guess",   desc: "5-letter challenge",   url: "https://tileworksgamesstudio.github.io/Curling-Wordle/",      enabled: true,  icon: "rows" },
    { id: "wordsearch",   name: "Wordsearch",   desc: "Find hidden words",    url: "https://tileworksgamesstudio.github.io/Curling-Wordsearch/",  enabled: true,  icon: "dice" }
  ];

  const ICONS = {
    grid: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>',
    nodes: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="18" r="3"/><line x1="9" y1="6" x2="15" y2="6"/><line x1="6" y1="9" x2="6" y2="15"/><line x1="18" y1="9" x2="18" y2="15"/><line x1="9" y1="18" x2="15" y2="18"/></svg>',
    help: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    text: '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="4" y1="7" x2="20" y2="7"/><line x1="10" y1="12" x2="20" y2="12"/><line x1="6" y1="17" x2="20" y2="17"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    cards: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="13" height="15" rx="2"/><rect x="9" y="3" width="13" height="15" rx="2"/></svg>',
    hex: '<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2"/></svg>',
    rows: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="4" rx="1"/><rect x="3" y="16" width="18" height="4" rx="1"/></svg>',
    dice: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
  };

  function validateGameItem(item, index) {
    return {
      id: typeof item.id === "string" && item.id.trim() ? item.id : `game-${index}`,
      name: typeof item.name === "string" && item.name.trim() ? item.name : "New Puzzle",
      desc: typeof item.desc === "string" ? item.desc : "",
      url: typeof item.url === "string" && item.url.trim() ? item.url : "#",
      enabled: typeof item.enabled === "boolean" ? item.enabled : true,
      icon: ICONS[item.icon] ? item.icon : "grid"
    };
  }

  /* --------------------------------------------------------------------------
     2. Centralized Audio Profiles & Sound Synth Engine
     -------------------------------------------------------------------------- */
  const AUDIO_THEME = {
    CHIME_TAP:    { freq1: 523.25, freq2: 659.25, type: "sine",     duration: 0.09 },
    SHUFFLE_TAP:  { freq1: 587.33, freq2: 880.00, type: "triangle", duration: 0.11 },
    MODAL_OPEN:   { freq1: 440.00, freq2: 587.33, type: "sine",     duration: 0.07 },
    MODAL_CLOSE:  { freq1: 400.00, freq2: 300.00, type: "sine",     duration: 0.05 },
    TOGGLE_CLICK: { freq1: 659.25, freq2: 659.25, type: "sine",     duration: 0.04 },
    DONATE_TAP:   { freq1: 523.25, freq2: 783.99, type: "sine",     duration: 0.10 },
    STONE_KISS:   { freq1: 320.00, freq2: 240.00, type: "triangle", duration: 0.08 }
  };

  let audioCtx = null;

  function initAudio() {
    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          audioCtx = new AudioContextClass();
        }
      }
      if (audioCtx && (audioCtx.state === "suspended" || audioCtx.state === "interrupted")) {
        audioCtx.resume();
      }
    } catch (e) {}
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  });

  function playAudioTone(profile) {
    if (!state.sound) {
      if ("vibrate" in navigator) {
        try { navigator.vibrate(10); } catch (err) {}
      }
      return;
    }

    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc1.type = profile.type || "sine";
      osc2.type = profile.type || "sine";

      osc1.frequency.setValueAtTime(profile.freq1, now);
      osc2.frequency.setValueAtTime(profile.freq2, now + profile.duration * 0.4);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + profile.duration);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);

      osc1.start(now);
      osc1.stop(now + profile.duration * 0.5);

      osc2.start(now + profile.duration * 0.4);
      osc2.stop(now + profile.duration);
    } catch (e) {}
  }

  /* --------------------------------------------------------------------------
     3. State, Versioned Persistence & Multi-Tab Synchronization
     -------------------------------------------------------------------------- */
  const SETTINGS_KEY = "game_hub_settings_v1";
  const PROGRESS_KEY = "hub_daily_progress";
  const LAST_PLAYED_KEY = "hub_last_played";

  const state = {
    version: 1,
    sound: true,
    animations: true
  };

  function loadSettings() {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.version === 1) {
          if (typeof parsed.sound === "boolean") state.sound = parsed.sound;
          if (typeof parsed.animations === "boolean") state.animations = parsed.animations;
        }
      }
    } catch (e) {
      state.sound = true;
      state.animations = true;
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function getTodayLocalDate() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function getCompletedGamesToday() {
    try {
      const today = getTodayLocalDate();
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (!raw) return [];
      const data = JSON.parse(raw);
      return Object.keys(data).filter((id) => data[id] === today);
    } catch (e) {
      return [];
    }
  }

  function markGameCompletedToday(gameId) {
    try {
      const today = getTodayLocalDate();
      const data = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
      data[gameId] = today;
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
      renderGrid();
    } catch (e) {}
  }

  function getLastPlayedGame() {
    try {
      return localStorage.getItem(LAST_PLAYED_KEY) || null;
    } catch (e) {
      return null;
    }
  }

  function setLastPlayedGame(gameId) {
    try {
      localStorage.setItem(LAST_PLAYED_KEY, gameId);
    } catch (e) {}
  }

  /* --------------------------------------------------------------------------
     4. Contextual Greeting, ARIA Announcements & Toast
     -------------------------------------------------------------------------- */
  function updateTimeOfDayGreeting() {
    const subtitle = document.getElementById("hub-subtitle");
    if (!subtitle) return;

    const hour = new Date().getHours();
    let greeting = "Select a game to play";
    if (hour >= 5 && hour < 12) {
      greeting = "Good morning! Pick today's puzzle";
    } else if (hour >= 12 && hour < 18) {
      greeting = "Good afternoon! Ready for a quick break?";
    } else {
      greeting = "Good evening! Unwind with a game";
    }
    subtitle.textContent = greeting;
  }

  function announceA11y(message) {
    const announcer = document.getElementById("a11y-announcer");
    if (announcer) {
      announcer.textContent = "";
      setTimeout(() => {
        announcer.textContent = message;
      }, 50);
    }
  }

  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById("toast-banner");
    if (!toast) return;

    if (toastTimer) clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toast.setAttribute("aria-hidden", "false");

    toastTimer = setTimeout(() => {
      toast.classList.remove("is-visible");
      toast.setAttribute("aria-hidden", "true");
    }, 2400);
  }

  /* --------------------------------------------------------------------------
     5. Grid Renderer
     -------------------------------------------------------------------------- */
  function renderGrid() {
    const grid = document.getElementById("game-grid");
    if (!grid) return;

    const completedList = getCompletedGamesToday();
    const lastPlayedId = getLastPlayedGame();
    const fragment = document.createDocumentFragment();

    GAME_CATALOG.forEach((rawItem, index) => {
      const item = validateGameItem(rawItem, index);
      const li = document.createElement("li");
      li.className = "grid-cell";

      if (item.enabled) {
        const link = document.createElement("a");
        link.className = "tile";
        link.href = item.url;
        link.setAttribute("aria-label", `Play ${item.name}: ${item.desc}`);
        link.setAttribute("data-id", item.id);

        if (completedList.includes(item.id)) {
          const badge = document.createElement("span");
          badge.className = "tile-badge-done";
          badge.setAttribute("aria-label", "Completed today");
          badge.textContent = "✓";
          link.appendChild(badge);
        } else if (item.id === lastPlayedId) {
          const recentBadge = document.createElement("span");
          recentBadge.className = "tile-badge-recent";
          recentBadge.textContent = "Recent";
          link.appendChild(recentBadge);
        }

        const iconEl = document.createElement("div");
        iconEl.className = "tile-icon";
        iconEl.innerHTML = ICONS[item.icon] || ICONS.grid;

        const label = document.createElement("span");
        label.className = "tile-label";
        label.textContent = item.name;

        const desc = document.createElement("span");
        desc.className = "tile-desc";
        desc.textContent = item.desc;

        link.appendChild(iconEl);
        link.appendChild(label);
        link.appendChild(desc);

        link.addEventListener("click", (e) => {
          setLastPlayedGame(item.id);
          playAudioTone(AUDIO_THEME.CHIME_TAP);

          if (item.url.startsWith("#")) {
            e.preventDefault();
            link.classList.add("is-loading");
            showToast(`Opening ${item.name}...`);
            setTimeout(() => {
              link.classList.remove("is-loading");
            }, 600);
          }
        });

        li.appendChild(link);
      } else {
        const disabledTile = document.createElement("div");
        disabledTile.className = "tile tile-disabled";
        disabledTile.setAttribute("aria-disabled", "true");
        disabledTile.setAttribute("aria-label", `${item.name} is coming soon`);

        const iconEl = document.createElement("div");
        iconEl.className = "tile-icon";
        iconEl.innerHTML = ICONS.lock;

        const label = document.createElement("span");
        label.className = "tile-label";
        label.textContent = item.name;

        const desc = document.createElement("span");
        desc.className = "tile-desc";
        desc.textContent = "Coming Soon";

        disabledTile.appendChild(iconEl);
        disabledTile.appendChild(label);
        disabledTile.appendChild(desc);
        li.appendChild(disabledTile);
      }

      fragment.appendChild(li);
    });

    grid.innerHTML = "";
    grid.appendChild(fragment);
  }

  window.addEventListener("pageshow", () => {
    document.querySelectorAll(".tile.is-loading").forEach((el) => {
      el.classList.remove("is-loading");
    });
  });

  /* --------------------------------------------------------------------------
     6. Modal Dialog Controller
     -------------------------------------------------------------------------- */
  let activeModal = null;
  let previouslyFocused = null;
  let closeTimeoutId = null;

  function getFocusableElements(container) {
    return Array.from(
      container.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  }

  function trapFocus(e) {
    if (!activeModal) return;
    const focusables = getFocusableElements(activeModal);
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.key === "Tab") {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    } else if (e.key === "Escape") {
      closeModal();
    }
  }

  function openModal(modalEl, triggerBtn) {
    if (!modalEl) return;
    if (closeTimeoutId) {
      clearTimeout(closeTimeoutId);
      closeTimeoutId = null;
    }

    initAudio();
    playAudioTone(AUDIO_THEME.MODAL_OPEN);

    previouslyFocused = triggerBtn || document.activeElement;
    activeModal = modalEl;

    const backdrop = document.getElementById("modal-backdrop");
    if (backdrop) backdrop.classList.add("is-active");

    modalEl.hidden = false;
    void modalEl.offsetHeight;
    modalEl.classList.add("is-open");

    if (triggerBtn) {
      triggerBtn.setAttribute("aria-expanded", "true");
    }

    const focusables = getFocusableElements(modalEl);
    if (focusables.length) {
      focusables[0].focus();
    }

    document.addEventListener("keydown", trapFocus);
    announceA11y(`${modalEl.querySelector(".sheet-title")?.textContent || "Dialog"} opened`);
  }

  function closeModal() {
    if (!activeModal) return;

    playAudioTone(AUDIO_THEME.MODAL_CLOSE);

    const backdrop = document.getElementById("modal-backdrop");
    if (backdrop) backdrop.classList.remove("is-active");

    activeModal.classList.remove("is-open");
    const closingModal = activeModal;

    function handleTransitionEnd(e) {
      if (e.target === closingModal && (e.propertyName === "transform" || !e.propertyName)) {
        closingModal.removeEventListener("transitionend", handleTransitionEnd);
        if (!closingModal.classList.contains("is-open")) {
          closingModal.hidden = true;
        }
      }
    }

    closingModal.addEventListener("transitionend", handleTransitionEnd);
    closeTimeoutId = setTimeout(() => {
      closingModal.removeEventListener("transitionend", handleTransitionEnd);
      if (!closingModal.classList.contains("is-open")) {
        closingModal.hidden = true;
      }
    }, 320);

    const btnSettings = document.getElementById("btn-settings");
    const btnDonate = document.getElementById("btn-donate");
    if (btnSettings) btnSettings.setAttribute("aria-expanded", "false");
    if (btnDonate) btnDonate.setAttribute("aria-expanded", "false");

    if (previouslyFocused && typeof previouslyFocused.focus === "function") {
      previouslyFocused.focus();
    }

    document.removeEventListener("keydown", trapFocus);
    activeModal = null;
  }

  function setupSwipeToDismiss(modalEl) {
    let startY = 0;
    let currentY = 0;
    let isTracking = false;

    const handle = modalEl.querySelector(".sheet-handle") || modalEl.querySelector(".sheet-header");
    if (!handle) return;

    handle.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        startY = e.touches[0].clientY;
        isTracking = true;
      }
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
      if (!isTracking || !activeModal) return;
      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
      if (deltaY > 0) {
        activeModal.style.transform = `translate(-50%, ${deltaY}px)`;
      }
    }, { passive: true });

    window.addEventListener("touchend", () => {
      if (!isTracking || !activeModal) return;
      isTracking = false;
      const deltaY = currentY - startY;
      activeModal.style.transform = "";

      if (deltaY > 75) {
        closeModal();
      }
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     7. Settings Interactions
     -------------------------------------------------------------------------- */
  function applyAnimationState() {
    if (state.animations) {
      document.body.classList.remove("animations-disabled");
    } else {
      document.body.classList.add("animations-disabled");
    }
  }

  function setupInteractions() {
    const btnInstagram = document.getElementById("btn-instagram");
    const btnSettings = document.getElementById("btn-settings");
    const btnDonate = document.getElementById("btn-donate");
    const modalSettings = document.getElementById("settings-modal");
    const modalDonate = document.getElementById("donate-modal");
    const btnCloseSettings = document.getElementById("close-settings");
    const btnCloseDonate = document.getElementById("close-donate");
    const backdrop = document.getElementById("modal-backdrop");
    const soundToggle = document.getElementById("toggle-sound");
    const animToggle = document.getElementById("toggle-animations");
    const stripeLink = document.getElementById("stripe-donate-link");

    if (soundToggle) soundToggle.checked = state.sound;
    if (animToggle) animToggle.checked = state.animations;
    applyAnimationState();

    if (btnInstagram) {
      btnInstagram.addEventListener("click", () => {
        playAudioTone(AUDIO_THEME.TOGGLE_CLICK);
      });
    }

    if (soundToggle) {
      soundToggle.addEventListener("change", (e) => {
        state.sound = e.target.checked;
        saveSettings();
        if (state.sound) {
          playAudioTone(AUDIO_THEME.TOGGLE_CLICK);
        }
        announceA11y(state.sound ? "Rink audio effects enabled" : "Rink audio effects disabled");
      });
    }

    if (animToggle) {
      animToggle.addEventListener("change", (e) => {
        state.animations = e.target.checked;
        saveSettings();
        applyAnimationState();
        playAudioTone(AUDIO_THEME.TOGGLE_CLICK);
        announceA11y(state.animations ? "Atmosphere & motion enabled" : "Atmosphere & motion disabled");
      });
    }

    if (btnSettings && modalSettings) {
      btnSettings.addEventListener("click", () => openModal(modalSettings, btnSettings));
      setupSwipeToDismiss(modalSettings);
    }

    if (btnDonate && modalDonate) {
      btnDonate.addEventListener("click", () => openModal(modalDonate, btnDonate));
      setupSwipeToDismiss(modalDonate);
    }

    if (btnCloseSettings) btnCloseSettings.addEventListener("click", closeModal);
    if (btnCloseDonate) btnCloseDonate.addEventListener("click", closeModal);
    if (backdrop) backdrop.addEventListener("click", closeModal);

    if (stripeLink) {
      stripeLink.addEventListener("click", () => {
        playAudioTone(AUDIO_THEME.DONATE_TAP);
      });
    }

    window.addEventListener("storage", (e) => {
      if (e.key === SETTINGS_KEY) {
        loadSettings();
        if (soundToggle) soundToggle.checked = state.sound;
        if (animToggle) animToggle.checked = state.animations;
        applyAnimationState();
      } else if (e.key === PROGRESS_KEY) {
        renderGrid();
      }
    });
  }

  /* ==========================================================================
     8. CANADIAN CURLING ICE HOUSE SIMULATION ENGINE
     Persistent curling sheet with deep off-screen launches, strict RED/YELLOW
     alternation, button convergence, real tactics, 50% light curl, and
     recurring 5th-rock MEGA CLEAR deliveries with high-velocity impacts.
     ========================================================================== */
  const CurlingEngine = (function () {
    let canvas = null;
    let ctx = null;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Simulation Constants
    const ROCK_DIAMETER_PX = 32;
    const ROCK_RADIUS = ROCK_DIAMETER_PX / 2;
    const HOUSE_CENTER_Y_NORM = 0.40; // Elevated House 40% from top
    let houseCenter = { x: 0, y: 0 };
    let houseRadius = 110;

    // Physics Tuning Constants
    const FRICTION = 0.989;
    const ANGULAR_FRICTION = 0.980;
    const CURL_COEFF = 0.085;

    // State Tracking
    let stones = [];
    let throwCount = 0;
    let activeDelivery = null;
    let activeDeliveryTimer = 0;
    let quiescenceTimer = 0;
    let deadlockTimer = 0;
    let lastTime = 0;
    let isRunning = true;

    // Tactical Color Management: Red / Yellow Alternation
    const TEAMS = {
      RED: {
        id: "red",
        bodyColor: "#c8102e",
        darkColor: "#8b0f24",
        highlight: "#ff7b8e",
        name: "Red"
      },
      YELLOW: {
        id: "yellow",
        bodyColor: "#ffd52a",
        darkColor: "#c99a00",
        highlight: "#ffea88",
        name: "Yellow"
      }
    };

    function initCanvas() {
      canvas = document.getElementById("curling-canvas");
      if (!canvas) return;
      ctx = canvas.getContext("2d");
      resize();
      window.addEventListener("resize", debounceResize, { passive: true });
    }

    let resizeTimer = null;
    function debounceResize() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 100);
    }

    function resize() {
      if (!canvas || !ctx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Elevated House Center Geometry
      houseCenter = {
        x: width * 0.5,
        y: height * HOUSE_CENTER_Y_NORM
      };
      houseRadius = Math.max(90, Math.min(width * 0.32, 160));
    }

    /* ------------------------------------------------------------------------
       Shot Planning & Button-Locked Predictive Solver
       ------------------------------------------------------------------------ */
    function getNextTeam() {
      return (throwCount % 2 === 0) ? TEAMS.RED : TEAMS.YELLOW;
    }

    // Every 5th rock hits hard (Mega turn)
    function isMegaTurn() {
      return (throwCount + 1) % 5 === 0;
    }

    function createStone(team, x, y, vx, vy, angularVel, intent, isMega) {
      return {
        id: `stone-${++throwCount}`,
        team: team,
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        radius: ROCK_RADIUS,
        mass: 1.0,
        angle: Math.random() * Math.PI * 2,
        angularVel: angularVel,
        visualSpin: angularVel,
        intent: intent,
        isMega: isMega,
        sleeping: false,
        outOfPlay: false,
        createdAt: performance.now()
      };
    }

    /**
     * Solves initial delivery velocity v0 such that after integrating under
     * rolling friction, the stone glides smoothly right to its intended location.
     * Mega throws are boosted significantly harder.
     */
    function solveInitialVelocity(dist, mega) {
      const f = FRICTION;
      const k = -Math.log(f);
      const lambda = k * 60;

      if (mega) {
        // High-velocity hard blast through the house
        return (dist * 2.2) + 620;
      }

      // Smooth glide-in calibrated for exact arrival in the target zone
      return dist * lambda * 1.08;
    }

    /**
     * Plan and launch delivery with smooth off-screen spawn and continuous glide-in.
     */
    function planAndLaunchThrow() {
      if (activeDelivery) return;

      const team = getNextTeam();
      const mega = isMegaTurn();

      // Spawn comfortably off-screen below the bottom viewport border
      const offscreenBuffer = ROCK_DIAMETER_PX * 2 + (Math.random() * 30);
      const originY = height + offscreenBuffer;
      const originX = houseCenter.x + (Math.random() - 0.5) * (width * 0.08);

      let targetX = houseCenter.x;
      let targetY = houseCenter.y;
      let intent = "DRAW";

      // 1. Tactical Target Selection
      const activeStones = stones.filter((s) => !s.outOfPlay);

      if (mega) {
        intent = "MEGA_CLEAR";
        let bestTarget = null;
        let maxNeighbors = -1;

        activeStones.forEach((candidate) => {
          let neighbors = 0;
          activeStones.forEach((other) => {
            if (candidate !== other) {
              const d = Math.hypot(candidate.x - other.x, candidate.y - other.y);
              if (d < ROCK_RADIUS * 4.4) neighbors++;
            }
          });
          if (neighbors > maxNeighbors) {
            maxNeighbors = neighbors;
            bestTarget = candidate;
          }
        });

        if (bestTarget) {
          targetX = bestTarget.x + (Math.random() - 0.5) * (ROCK_RADIUS * 0.35);
          targetY = bestTarget.y;
        } else {
          targetX = houseCenter.x;
          targetY = houseCenter.y;
        }
      } else {
        if (activeStones.length === 0) {
          intent = "DRAW";
          targetX = houseCenter.x;
          targetY = houseCenter.y;
        } else {
          const buttonOccupied = activeStones.some(
            (s) => Math.hypot(s.x - houseCenter.x, s.y - houseCenter.y) < ROCK_RADIUS * 2.2
          );

          if (!buttonOccupied) {
            intent = "DRAW";
            targetX = houseCenter.x + (Math.random() - 0.5) * (ROCK_RADIUS * 0.4);
            targetY = houseCenter.y + (Math.random() - 0.5) * (ROCK_RADIUS * 0.4);
          } else {
            const rand = Math.random();
            if (rand < 0.32 && activeStones.length < 5) {
              intent = "GUARD";
              targetX = houseCenter.x + (Math.random() - 0.5) * (ROCK_RADIUS * 2.4);
              targetY = houseCenter.y + houseRadius * 0.82;
            } else if (rand < 0.68) {
              intent = "FREEZE";
              const opponentStones = activeStones.filter((s) => s.team.id !== team.id);
              if (opponentStones.length > 0) {
                opponentStones.sort(
                  (a, b) =>
                    Math.hypot(a.x - houseCenter.x, a.y - houseCenter.y) -
                    Math.hypot(b.x - houseCenter.x, b.y - houseCenter.y)
                );
                const targetStone = opponentStones[0];
                targetX = targetStone.x;
                targetY = targetStone.y + (ROCK_RADIUS * 2.05);
              } else {
                targetX = houseCenter.x + (Math.random() - 0.5) * (ROCK_RADIUS * 1.5);
                targetY = houseCenter.y;
              }
            } else {
              intent = "POCKET_DRAW";
              const angle = Math.random() * Math.PI * 2;
              const dist = ROCK_RADIUS * (2.0 + Math.random() * 1.6);
              targetX = houseCenter.x + Math.cos(angle) * dist;
              targetY = houseCenter.y + Math.sin(angle) * dist;
            }
          }
        }
      }

      // 2. Physics & Spin Calibration
      const isCurlShot = Math.random() >= 0.45; // >= 50% curl
      const spinDirection = Math.random() > 0.5 ? 1 : -1;
      const angularVel = isCurlShot
        ? spinDirection * (2.2 + Math.random() * 1.2)
        : spinDirection * (0.8 + Math.random() * 0.5);

      const dy = originY - targetY;
      const baseSpeed = solveInitialVelocity(dy, mega);

      const curlEstimatedOffset = isCurlShot ? spinDirection * (ROCK_RADIUS * 1.35) : 0;
      const dx = (targetX - curlEstimatedOffset) - originX;

      const angleToTarget = Math.atan2(-dy, dx);
      const vx = Math.cos(angleToTarget) * baseSpeed;
      const vy = Math.sin(angleToTarget) * baseSpeed;

      const stone = createStone(team, originX, originY, vx, vy, angularVel, intent, mega);
      activeDelivery = stone;
      activeDeliveryTimer = 0;
      stones.push(stone);

      // Clean up excess out-of-play rocks to preserve memory
      if (stones.length > 28) {
        stones = stones.filter((s) => !s.outOfPlay || performance.now() - s.createdAt < 15000);
      }
    }

    /* ------------------------------------------------------------------------
       Physics Integration & Continuous Collision Detection
       ------------------------------------------------------------------------ */
    function updatePhysics(dt) {
      if (!state.animations) return;

      const friction = FRICTION;
      const angularFriction = ANGULAR_FRICTION;
      const curlCoeff = CURL_COEFF;

      // 1. Motion Step
      for (let i = 0; i < stones.length; i++) {
        const s = stones[i];
        if (s.outOfPlay || s.sleeping) continue;

        // Curl Acceleration derived from spin & forward speed
        const speed = Math.hypot(s.vx, s.vy);
        if (speed > 12) {
          const curlAcc = s.angularVel * curlCoeff * Math.min(speed / 180, 1.0);
          s.vx += curlAcc * dt * 60;
        }

        // Apply velocities
        s.x += s.vx * dt;
        s.y += s.vy * dt;

        // Apply friction decay
        const f = Math.pow(friction, dt * 60);
        s.vx *= f;
        s.vy *= f;

        // Visual and rotational decay
        s.angle += s.visualSpin * dt;
        s.angularVel *= Math.pow(angularFriction, dt * 60);
        s.visualSpin *= Math.pow(angularFriction, dt * 60);

        // Responsive Sleep Condition (Prevents creeping and deadlocks)
        const currentSpeed = Math.hypot(s.vx, s.vy);
        if (s.y <= height + 30 && currentSpeed < 3.2) {
          s.vx = 0;
          s.vy = 0;
          s.angularVel = 0;
          s.visualSpin = 0;
          s.sleeping = true;
        }

        // Out-of-play boundaries
        if (
          s.x < -ROCK_RADIUS * 3.5 ||
          s.x > width + ROCK_RADIUS * 3.5 ||
          s.y < -ROCK_RADIUS * 4.5 ||
          s.y > height + 240
        ) {
          s.outOfPlay = true;
          s.sleeping = true;
        }
      }

      // 2. Continuous Collision Detection (Substepping for Mega Impacts)
      const substeps = (activeDelivery && activeDelivery.isMega) ? 4 : 2;
      for (let step = 0; step < substeps; step++) {
        for (let i = 0; i < stones.length; i++) {
          for (let j = i + 1; j < stones.length; j++) {
            const s1 = stones[i];
            const s2 = stones[j];

            if (s1.outOfPlay || s2.outOfPlay) continue;
            if (s1.sleeping && s2.sleeping) continue;

            const dx = s2.x - s1.x;
            const dy = s2.y - s1.y;
            const dist = Math.hypot(dx, dy);
            const minDist = s1.radius + s2.radius;

            if (dist < minDist && dist > 0.001) {
              const overlap = minDist - dist;
              const nx = dx / dist;
              const ny = dy / dist;

              s1.x -= nx * overlap * 0.5;
              s1.y -= ny * overlap * 0.5;
              s2.x += nx * overlap * 0.5;
              s2.y += ny * overlap * 0.5;

              // Elastic momentum exchange with hard bounce restitution on mega turns
              const kx = s1.vx - s2.vx;
              const ky = s1.vy - s2.vy;
              const p = 2 * (nx * kx + ny * ky) / (s1.mass + s2.mass);
              const restitution = (s1.isMega || s2.isMega) ? 0.98 : 0.72;

              if (p > 0) {
                s1.vx -= p * s2.mass * nx * restitution;
                s1.vy -= p * s2.mass * ny * restitution;
                s2.vx += p * s1.mass * nx * restitution;
                s2.vy += p * s1.mass * ny * restitution;

                s1.sleeping = false;
                s2.sleeping = false;

                if (s1.y > 0 && s1.y <= height && s2.y > 0 && s2.y <= height) {
                  playAudioTone(AUDIO_THEME.STONE_KISS);
                }
              }
            }
          }
        }
      }

      // 3. Active Delivery Lifecycle & Watchdog
      if (activeDelivery) {
        activeDeliveryTimer += dt;
        if (activeDelivery.sleeping || activeDelivery.outOfPlay || activeDeliveryTimer > 6.0) {
          if (activeDeliveryTimer > 6.0) {
            activeDelivery.sleeping = true;
          }
          activeDelivery = null;
          activeDeliveryTimer = 0;
          quiescenceTimer = 0;
        }
      }

      // 4. Quiescence & Next Rock Turn Scheduler
      if (!activeDelivery) {
        const anyStoneMoving = stones.some((s) => !s.outOfPlay && !s.sleeping);
        if (!anyStoneMoving) {
          deadlockTimer = 0;
          quiescenceTimer += dt;
          if (quiescenceTimer > 0.55) {
            quiescenceTimer = 0;
            planAndLaunchThrow();
          }
        } else {
          // Deadlock Safety: if stones keep rolling/jittering beyond 5.5s, force sleep
          deadlockTimer += dt;
          if (deadlockTimer > 5.5) {
            stones.forEach((s) => {
              if (!s.outOfPlay && Math.hypot(s.vx, s.vy) < 16) {
                s.vx = 0;
                s.vy = 0;
                s.angularVel = 0;
                s.visualSpin = 0;
                s.sleeping = true;
              }
            });
            deadlockTimer = 0;
            quiescenceTimer = 0.56;
          }
        }
      }
    }

    /* ------------------------------------------------------------------------
       Renderer: Authentic Ice Sheet, Elevated House & Sliding Granite Stones
       ------------------------------------------------------------------------ */
    function drawRink() {
      ctx.clearRect(0, 0, width, height);

      // Ice Sheet Lines
      ctx.save();
      ctx.strokeStyle = "rgba(18, 59, 114, 0.22)";
      ctx.lineWidth = 2;

      // Center line
      ctx.beginPath();
      ctx.moveTo(houseCenter.x, 0);
      ctx.lineTo(houseCenter.x, height);
      ctx.stroke();

      // Tee line
      ctx.beginPath();
      ctx.moveTo(houseCenter.x - houseRadius * 1.5, houseCenter.y);
      ctx.lineTo(houseCenter.x + houseRadius * 1.5, houseCenter.y);
      ctx.stroke();

      // 12-foot ring (Blue)
      ctx.beginPath();
      ctx.arc(houseCenter.x, houseCenter.y, houseRadius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(18, 59, 114, 0.12)";
      ctx.fill();
      ctx.strokeStyle = "rgba(18, 59, 114, 0.45)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // 8-foot ring (White)
      ctx.beginPath();
      ctx.arc(houseCenter.x, houseCenter.y, houseRadius * 0.66, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(247, 252, 255, 0.75)";
      ctx.fill();
      ctx.strokeStyle = "rgba(18, 59, 114, 0.35)";
      ctx.stroke();

      // 4-foot ring (Red)
      ctx.beginPath();
      ctx.arc(houseCenter.x, houseCenter.y, houseRadius * 0.33, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(200, 16, 46, 0.22)";
      ctx.fill();
      ctx.strokeStyle = "rgba(200, 16, 46, 0.6)";
      ctx.stroke();

      // Button / Pin
      ctx.beginPath();
      ctx.arc(houseCenter.x, houseCenter.y, houseRadius * 0.10, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(247, 252, 255, 0.95)";
      ctx.fill();
      ctx.strokeStyle = "rgba(18, 59, 114, 0.75)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
    }

    function drawStones() {
      for (let i = 0; i < stones.length; i++) {
        const s = stones[i];
        if (s.outOfPlay) continue;

        ctx.save();
        ctx.translate(s.x, s.y);

        // Contact Ice Shadow
        ctx.beginPath();
        ctx.ellipse(2, 4, s.radius * 1.05, s.radius * 0.9, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(11, 36, 80, 0.24)";
        ctx.fill();

        // Polished Granite Stone Body
        ctx.beginPath();
        ctx.arc(0, 0, s.radius, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(-s.radius * 0.3, -s.radius * 0.3, 2, 0, 0, s.radius);
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(0.3, s.team.highlight);
        grad.addColorStop(0.7, s.team.bodyColor);
        grad.addColorStop(1, s.team.darkColor);
        ctx.fillStyle = grad;
        ctx.fill();

        // Neo-Brutalist Outer Rim
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = "#0b2450";
        ctx.stroke();

        // Handle Assembly
        ctx.rotate(s.angle);

        // Handle base
        ctx.beginPath();
        ctx.arc(0, 0, s.radius * 0.42, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
        ctx.fill();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = "#0b2450";
        ctx.stroke();

        // Handle Grip Arm
        ctx.beginPath();
        ctx.roundRect(-s.radius * 0.55, -s.radius * 0.14, s.radius * 1.1, s.radius * 0.28, 3);
        ctx.fillStyle = s.team.darkColor;
        ctx.fill();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = "#0b2450";
        ctx.stroke();

        // Top Specular Sheen
        ctx.beginPath();
        ctx.roundRect(-s.radius * 0.45, -s.radius * 0.08, s.radius * 0.9, s.radius * 0.16, 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.restore();
      }
    }

    function loop(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
      lastTime = timestamp;

      if (isRunning) {
        updatePhysics(dt);
        drawRink();
        drawStones();
      }

      requestAnimationFrame(loop);
    }

    function init() {
      initCanvas();
      setTimeout(() => {
        planAndLaunchThrow();
      }, 350);

      requestAnimationFrame(loop);
    }

    return {
      init: init,
      planAndLaunchThrow: planAndLaunchThrow
    };
  })();

  /* --------------------------------------------------------------------------
     9. App Initialization
     -------------------------------------------------------------------------- */
  function initApp() {
    loadSettings();
    updateTimeOfDayGreeting();
    renderGrid();
    setupInteractions();
    CurlingEngine.init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }

  window.GameHub = {
    markCompleted: markGameCompletedToday
  };
})();