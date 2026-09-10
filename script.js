/**
 * TILEWORKS CURLING GAMES — MASTER HUB CONTROLLER
 * 
 * Features:
 * 1. Liquid glass melting & 3D fall-through animation when tiles are clicked.
 * 2. Exact 0.7s (700ms) delay for a silky-smooth transition to the next page.
 * 3. Dynamic sub-ice crater and liquid glass droplet cascade.
 * 4. Ambient 2D physics simulation of curling stones on ice sheet.
 * 5. Dedicated Instagram link configuration at the top.
 */

// ==========================================================================
// 1. CONFIGURATION — EDIT YOUR INSTAGRAM URL & TILES HERE
// ==========================================================================
const CONFIG = {
  // 👉 PASTE YOUR INSTAGRAM PROFILE LINK HERE:
  instagramUrl: "https://instagram.com/tileworks_studio",

  // Master switch for dev/testing bypass of the intro sequence
  skipIntro: false,

  // Animation Timings (milliseconds)
  timings: {
    logoHoldDuration: 800,    // 0.8s logo hold on screen
    logoExitDuration: 650,    // Fly-through toward camera
    gridStaggerDelay: 45,     // Sequential card rise
    transitionDelay: 700,     // Exact 0.7s delay: molten fall through screen before page opens
    veilTriggerLead: 200      // Smooth veil begins 200ms before redirect (at 500ms)
  },

  // 9 Fixed Slots (Order preserved)
  tiles: [
    {
      id: "crossword",
      name: "Crossword",
      url: "https://tileworksgamesstudio.github.io/Curling-Crossword/",
      enabled: true,
      icon: "crossword"
    },
    {
      id: "connections",
      name: "Connections",
      url: "https://tileworksgamesstudio.github.io/Curling-Connections/",
      enabled: true,
      icon: "connections"
    },
    {
      id: "trivia",
      name: "Trivia",
      url: "https://tileworksgamesstudio.github.io/Curling-Trivia/",
      enabled: true,
      icon: "trivia"
    },
    {
      id: "hangman",
      name: "Hangman",
      url: "https://tileworksgamesstudio.github.io/Curling-Hangman/",
      enabled: true,
      icon: "hangman"
    },
    {
      id: "specs",
      name: "Specs",
      url: "https://tileworks.games/specs",
      enabled: false,
      icon: "specs"
    },
    {
      id: "memory",
      name: "Memory",
      url: "https://tileworksgamesstudio.github.io/Curling-Memory/",
      enabled: true,
      icon: "memory"
    },
    {
      id: "spelling-bee",
      name: "Spelling Bee",
      url: "https://tileworksgamesstudio.github.io/Curling-Spelling",
      enabled: true,
      icon: "spelling-bee"
    },
    {
      id: "wordle",
      name: "Wordle",
      url: "https://tileworksgamesstudio.github.io/Curling-Wordle/",
      enabled: true,
      icon: "wordle"
    },
    {
      id: "donate",
      name: "Donate",
      url: "https://tileworks.games/donate",
      enabled: false,
      icon: "donate"
    }
  ],

  // Background Curling Arena Simulation
  physics: {
    stoneCountDesktop: 10,
    stoneCountMobile: 7,
    friction: 0.996,
    angularFriction: 0.992,
    bounceRestitution: 0.82,
    minGlideSpeed: 0.25
  }
};

// ==========================================================================
// 2. SVG ICON REPOSITORY (CURLING BLUE PALETTE)
// ==========================================================================
const ICONS = {
  crossword: `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"></rect>
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18"></path>
      <rect x="9" y="9" width="6" height="6" fill="currentColor" fill-opacity="0.22"></rect>
      <rect x="3" y="3" width="6" height="6" fill="currentColor" fill-opacity="0.14"></rect>
      <rect x="15" y="15" width="6" height="6" fill="currentColor" fill-opacity="0.14"></rect>
    </svg>`,

  connections: `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="6" cy="6" r="3"></circle>
      <circle cx="18" cy="6" r="3"></circle>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="18" r="3"></circle>
      <line x1="9" y1="6" x2="15" y2="6"></line>
      <line x1="6" y1="9" x2="6" y2="15"></line>
      <line x1="18" y1="9" x2="18" y2="15"></line>
      <line x1="9" y1="18" x2="15" y2="18"></line>
      <line x1="8.5" y1="8.5" x2="15.5" y2="15.5"></line>
    </svg>`,

  trivia: `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="9"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <circle cx="12" cy="17" r="0.75" fill="currentColor"></circle>
    </svg>`,

  hangman: `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 21h16M7 21V3h8v4"></path>
      <circle cx="15" cy="9.5" r="2.5"></circle>
      <path d="M15 12v4m-2-3h4m-3 3l-2 3m3-3l2 3"></path>
    </svg>`,

  specs: `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <rect x="5" y="3" width="14" height="18" rx="2"></rect>
      <line x1="9" y1="7" x2="15" y2="7"></line>
      <line x1="9" y1="11" x2="15" y2="11"></line>
      <line x1="9" y1="15" x2="12" y2="15"></line>
      <circle cx="8" cy="7" r="0.7" fill="currentColor"></circle>
      <circle cx="8" cy="11" r="0.7" fill="currentColor"></circle>
      <circle cx="8" cy="15" r="0.7" fill="currentColor"></circle>
    </svg>`,

  memory: `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="5" width="11" height="15" rx="2"></rect>
      <path d="M10 3h8a2 2 0 0 1 2 2v12"></path>
      <circle cx="8.5" cy="12.5" r="2" fill="currentColor" fill-opacity="0.2"></circle>
    </svg>`,

  "spelling-bee": `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="12 2 20 6.5 20 15.5 12 20 4 15.5 4 6.5 12 2"></polygon>
      <polygon points="12 6 16 8.5 16 13.5 12 16 8 13.5 8 8.5 12 6" fill="currentColor" fill-opacity="0.25"></polygon>
      <circle cx="12" cy="11" r="1.5" fill="currentColor"></circle>
    </svg>`,

  wordle: `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="5" height="5" rx="1" fill="currentColor" fill-opacity="0.2"></rect>
      <rect x="9.5" y="3" width="5" height="5" rx="1"></rect>
      <rect x="16" y="3" width="5" height="5" rx="1"></rect>
      <rect x="3" y="9.5" width="5" height="5" rx="1"></rect>
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" fill="currentColor" fill-opacity="0.3"></rect>
      <rect x="16" y="9.5" width="5" height="5" rx="1"></rect>
      <rect x="3" y="16" width="5" height="5" rx="1"></rect>
      <rect x="9.5" y="16" width="5" height="5" rx="1"></rect>
      <rect x="16" y="16" width="5" height="5" rx="1" fill="currentColor" fill-opacity="0.2"></rect>
    </svg>`,

  donate: `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      <path d="M12 9v6m-3-3h6" stroke-linecap="round"></path>
    </svg>`
};

// ==========================================================================
// 3. AMBIENT CURLING ICE & STONE SIMULATION
// ==========================================================================
class CurlingArenaEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false });
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.stones = [];
    this.width = 0;
    this.height = 0;
    this.isRunning = false;
    this.light = { x: 0, y: 0 };

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener("resize", () => this.resize(), { passive: true });

    const count = this.width < 600 ? CONFIG.physics.stoneCountMobile : CONFIG.physics.stoneCountDesktop;
    this.stones = [];
    for (let i = 0; i < count; i++) {
      this.stones.push(this.createStone(i));
    }

    this.start();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.ctx.scale(this.dpr, this.dpr);

    this.light.x = this.width * 0.5;
    this.light.y = this.height * 0.35;
  }

  createStone(index) {
    const isRed = index % 2 === 0;
    const depth = 0.75 + Math.random() * 0.45;
    const baseRadius = (this.width < 500 ? 24 : 30) * depth;

    return {
      x: Math.random() * (this.width - 100) + 50,
      y: Math.random() * (this.height - 100) + 50,
      vx: (Math.random() - 0.5) * 1.8,
      vy: (Math.random() - 0.5) * 1.8,
      radius: baseRadius,
      mass: baseRadius * baseRadius,
      color: isRed ? "#c5232a" : "#df9e19",
      accentColor: isRed ? "#96151b" : "#b37b0c",
      rotation: Math.random() * Math.PI * 2,
      angularVelocity: (Math.random() - 0.5) * 0.04
    };
  }

  update() {
    this.light.x += (Math.sin(Date.now() * 0.0006) * this.width * 0.2 + (this.width * 0.5) - this.light.x) * 0.02;
    this.light.y += (Math.cos(Date.now() * 0.0005) * this.height * 0.15 + (this.height * 0.35) - this.light.y) * 0.02;

    document.documentElement.style.setProperty("--light-x", `${(this.light.x / this.width) * 100}%`);
    document.documentElement.style.setProperty("--light-y", `${(this.light.y / this.height) * 100}%`);

    const p = CONFIG.physics;

    for (let i = 0; i < this.stones.length; i++) {
      const s = this.stones[i];

      s.vx *= p.friction;
      s.vy *= p.friction;
      s.angularVelocity *= p.angularFriction;

      s.x += s.vx;
      s.y += s.vy;
      s.rotation += s.angularVelocity;

      const currentSpeed = Math.hypot(s.vx, s.vy);
      if (currentSpeed < p.minGlideSpeed) {
        const angle = Math.random() * Math.PI * 2;
        s.vx += Math.cos(angle) * 0.35;
        s.vy += Math.sin(angle) * 0.35;
        s.angularVelocity += (Math.random() - 0.5) * 0.015;
      }

      if (s.x - s.radius < 0) {
        s.x = s.radius;
        s.vx = -s.vx * p.bounceRestitution;
      } else if (s.x + s.radius > this.width) {
        s.x = this.width - s.radius;
        s.vx = -s.vx * p.bounceRestitution;
      }

      if (s.y - s.radius < 0) {
        s.y = s.radius;
        s.vy = -s.vy * p.bounceRestitution;
      } else if (s.y + s.radius > this.height) {
        s.y = this.height - s.radius;
        s.vy = -s.vy * p.bounceRestitution;
      }
    }

    // Elastic Granite Collisions
    for (let i = 0; i < this.stones.length; i++) {
      for (let j = i + 1; j < this.stones.length; j++) {
        const s1 = this.stones[i];
        const s2 = this.stones[j];

        const dx = s2.x - s1.x;
        const dy = s2.y - s1.y;
        const dist = Math.hypot(dx, dy);
        const minDist = s1.radius + s2.radius;

        if (dist < minDist && dist > 0.001) {
          const nx = dx / dist;
          const ny = dy / dist;

          const overlap = minDist - dist;
          s1.x -= nx * overlap * 0.5;
          s1.y -= ny * overlap * 0.5;
          s2.x += nx * overlap * 0.5;
          s2.y += ny * overlap * 0.5;

          const kx = s1.vx - s2.vx;
          const ky = s1.vy - s2.vy;
          const pVal = 2 * (nx * kx + ny * ky) / (s1.mass + s2.mass);

          s1.vx -= pVal * s2.mass * nx * p.bounceRestitution;
          s1.vy -= pVal * s2.mass * ny * p.bounceRestitution;
          s2.vx += pVal * s1.mass * nx * p.bounceRestitution;
          s2.vy += pVal * s1.mass * ny * p.bounceRestitution;

          const spinDelta = (s1.angularVelocity - s2.angularVelocity) * 0.3;
          s1.angularVelocity -= spinDelta;
          s2.angularVelocity += spinDelta;
        }
      }
    }
  }

  drawRoundedRect(x, y, w, h, radius) {
    const ctx = this.ctx;
    if (ctx.roundRect) {
      ctx.roundRect(x, y, w, h, radius);
    } else {
      ctx.rect(x, y, w, h);
    }
  }

  drawCurlingStone(stone) {
    const ctx = this.ctx;
    const r = stone.radius;

    ctx.save();
    ctx.translate(stone.x, stone.y);

    // Drop shadow
    ctx.save();
    const shadowGrad = ctx.createRadialGradient(4, 6, r * 0.3, 4, 6, r * 1.2);
    shadowGrad.addColorStop(0, "rgba(7, 23, 38, 0.25)");
    shadowGrad.addColorStop(0.7, "rgba(7, 23, 38, 0.08)");
    shadowGrad.addColorStop(1, "rgba(7, 23, 38, 0)");
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.arc(4, 6, r * 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.rotate(stone.rotation);

    // Granite body
    const bodyGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
    bodyGrad.addColorStop(0, "#565e68");
    bodyGrad.addColorStop(0.6, "#333940");
    bodyGrad.addColorStop(1, "#1c2126");
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Colored Ring
    const ringGrad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, r * 0.1, 0, 0, r * 0.75);
    ringGrad.addColorStop(0, stone.color);
    ringGrad.addColorStop(0.85, stone.accentColor);
    ringGrad.addColorStop(1, "#181d22");
    ctx.fillStyle = ringGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.75, 0, Math.PI * 2);
    ctx.fill();

    // Core
    ctx.fillStyle = "#2b3036";
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.38, 0, Math.PI * 2);
    ctx.fill();

    // Screws
    ctx.fillStyle = "#bcc5ce";
    ctx.beginPath();
    ctx.arc(-r * 0.22, 0, r * 0.07, 0, Math.PI * 2);
    ctx.arc(r * 0.22, 0, r * 0.07, 0, Math.PI * 2);
    ctx.fill();

    // Handle
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    this.drawRoundedRect(-r * 0.26, -r * 0.08, r * 0.52, r * 0.16, r * 0.06);
    ctx.fill();

    ctx.fillStyle = stone.color;
    ctx.beginPath();
    this.drawRoundedRect(-r * 0.18, -r * 0.06, r * 0.36, r * 0.12, r * 0.04);
    ctx.fill();

    ctx.restore();
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Ice Base
    const iceGrad = ctx.createLinearGradient(0, 0, this.width, this.height);
    iceGrad.addColorStop(0, "#f3f8fc");
    iceGrad.addColorStop(0.5, "#eaf3fa");
    iceGrad.addColorStop(1, "#e2eff9");
    ctx.fillStyle = iceGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Rink Markings
    ctx.save();
    ctx.strokeStyle = "rgba(11, 34, 56, 0.08)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.width * 0.5, 0);
    ctx.lineTo(this.width * 0.5, this.height);
    ctx.stroke();

    ctx.strokeStyle = "rgba(197, 35, 42, 0.12)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, this.height * 0.28);
    ctx.lineTo(this.width, this.height * 0.28);
    ctx.stroke();

    // House Rings
    const hX = this.width * 0.5;
    const hY = this.height * 0.58;
    const hR = Math.min(this.width, this.height) * 0.42;

    ctx.fillStyle = "rgba(11, 34, 56, 0.05)";
    ctx.beginPath();
    ctx.arc(hX, hY, hR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(240, 246, 251, 0.4)";
    ctx.beginPath();
    ctx.arc(hX, hY, hR * 0.66, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(197, 35, 42, 0.07)";
    ctx.beginPath();
    ctx.arc(hX, hY, hR * 0.33, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.beginPath();
    ctx.arc(hX, hY, hR * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Arena dynamic lighting
    const arenaLight = ctx.createRadialGradient(
      this.light.x, this.light.y, 10,
      this.light.x, this.light.y, Math.max(this.width, this.height) * 0.65
    );
    arenaLight.addColorStop(0, "rgba(255, 255, 255, 0.45)");
    arenaLight.addColorStop(0.5, "rgba(240, 247, 253, 0.12)");
    arenaLight.addColorStop(1, "rgba(220, 235, 248, 0)");
    ctx.fillStyle = arenaLight;
    ctx.fillRect(0, 0, this.width, this.height);

    // Stones
    for (let i = 0; i < this.stones.length; i++) {
      this.drawCurlingStone(this.stones[i]);
    }
  }

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.render();
    requestAnimationFrame(() => this.loop());
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      requestAnimationFrame(() => this.loop());
    }
  }

  pause() {
    this.isRunning = false;
  }
}

// ==========================================================================
// 4. HUB CONTROLLER & ADVANCED MELT-FALL TRANSITION
// ==========================================================================
class TileworksHubController {
  constructor() {
    this.arenaEngine = null;
    this.isNavigating = false;
    this.isReady = false;
    this.introHandled = false;

    // DOM Elements
    this.gridElement = document.getElementById("games-grid");
    this.introOverlay = document.getElementById("intro-overlay");
    this.introLogo = document.getElementById("intro-logo");
    this.logoStage = document.getElementById("logo-stage");
    this.headerElement = document.getElementById("hub-header");
    this.footerElement = document.getElementById("hub-footer");
    this.viewportElement = document.getElementById("app-viewport");
    this.transitionVeil = document.getElementById("page-transition-veil");
    this.instagramLink = document.getElementById("instagram-link");

    this.init();
  }

  init() {
    // 1. Ice Simulation
    const canvas = document.getElementById("ice-canvas");
    if (canvas) {
      this.arenaEngine = new CurlingArenaEngine(canvas);
    }

    // 2. Set Instagram Profile from CONFIG
    if (this.instagramLink && CONFIG.instagramUrl) {
      this.instagramLink.href = CONFIG.instagramUrl;
    }

    // 3. Render 3x3 Grid
    this.renderGrid();

    // 4. Visibility Listener for CPU Economy
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (this.arenaEngine) this.arenaEngine.pause();
      } else {
        if (this.arenaEngine) this.arenaEngine.start();
      }
    });

    // 5. Intro Sequence with automatic failsafe
    if (CONFIG.skipIntro) {
      this.bypassIntro();
    } else {
      this.runIntroSequence();

      setTimeout(() => {
        if (!this.introHandled) {
          this.introHandled = true;
          this.revealHub();
        }
      }, 1600);
    }
  }

  renderGrid() {
    if (!this.gridElement) return;
    this.gridElement.innerHTML = "";

    CONFIG.tiles.forEach((tile, index) => {
      const slot = document.createElement("div");
      slot.className = "grid-slot";
      slot.setAttribute("data-slot", index);

      if (tile && tile.enabled) {
        const link = document.createElement("a");
        link.className = "glass-tile";
        link.href = tile.url;
        link.setAttribute("role", "button");
        link.setAttribute("aria-label", `Play ${tile.name}`);
        link.setAttribute("data-id", tile.id);

        const iconWrap = document.createElement("div");
        iconWrap.className = "tile-icon-wrap";
        iconWrap.innerHTML = ICONS[tile.icon] || ICONS.crossword;

        const nameEl = document.createElement("span");
        nameEl.className = "tile-name";
        nameEl.textContent = tile.name;

        link.appendChild(iconWrap);
        link.appendChild(nameEl);

        this.attachTileInteractions(link, slot, tile);
        slot.appendChild(link);
      } else {
        slot.classList.add("empty");
        slot.setAttribute("aria-hidden", "true");
      }

      this.gridElement.appendChild(slot);
    });
  }

  attachTileInteractions(tileElement, slotElement, tileData) {
    // Dynamic liquid glint tracking
    const updateGlint = (e) => {
      const rect = tileElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      tileElement.style.setProperty("--liquid-x", `${x}%`);
      tileElement.style.setProperty("--liquid-y", `${y}%`);
    };

    tileElement.addEventListener("mousemove", updateGlint, { passive: true });
    tileElement.addEventListener("touchmove", (e) => {
      if (e.touches && e.touches[0]) updateGlint(e.touches[0]);
    }, { passive: true });

    // Click: Trigger Liquid Melt & 3D Fall-Through (0.7s Delay)
    tileElement.addEventListener("click", (e) => {
      e.preventDefault();
      if (this.isNavigating || !this.isReady) return;
      this.executeTileMeltAndFall(tileElement, slotElement, tileData.url);
    });
  }

  spawnMeltDroplets(slotElement) {
    const count = 6;
    for (let i = 0; i < count; i++) {
      const drop = document.createElement("div");
      drop.className = "melt-droplet";
      
      const size = Math.random() * 8 + 6;
      drop.style.width = `${size}px`;
      drop.style.height = `${size}px`;
      
      // Random position across the slot
      drop.style.left = `${Math.random() * 80 + 10}%`;
      drop.style.top = `${Math.random() * 60 + 20}%`;
      
      const tx = (Math.random() - 0.5) * 45;
      drop.style.setProperty("--tx", `${tx}px`);
      drop.style.animationDelay = `${Math.random() * 120}ms`;

      slotElement.appendChild(drop);

      setTimeout(() => drop.remove(), 700);
    }
  }

  executeTileMeltAndFall(tileElement, slotElement, destinationUrl) {
    this.isNavigating = true;

    // 1. Dim neighboring tiles
    const hubContainer = document.getElementById("hub-container");
    if (hubContainer) hubContainer.classList.add("has-selection");

    // 2. Open molten sub-ice crater in grid slot
    if (slotElement) {
      slotElement.classList.add("is-dropping");
      this.spawnMeltDroplets(slotElement);
    }

    // 3. Trigger Liquid Melt & 3D plunge animation
    tileElement.classList.add("is-melting-falling");

    // 4. Subtle camera plunge toward the breach
    if (this.viewportElement) {
      this.viewportElement.classList.add("camera-plunge");
    }

    // 5. Smooth Veil Fade-In (Leads into redirect at 500ms -> 700ms)
    const veilLeadTime = Math.max(0, CONFIG.timings.transitionDelay - CONFIG.timings.veilTriggerLead);
    setTimeout(() => {
      if (this.transitionVeil) {
        this.transitionVeil.classList.add("active");
      }
    }, veilLeadTime);

    // 6. Navigate cleanly at exactly 0.7s (700ms)
    setTimeout(() => {
      window.location.href = destinationUrl;
    }, CONFIG.timings.transitionDelay);
  }

  runIntroSequence() {
    if (!this.introOverlay || !this.logoStage || !this.introLogo) {
      this.revealHub();
      return;
    }

    this.introLogo.onerror = () => {
      if (!this.introHandled) {
        this.introHandled = true;
        this.revealHub();
      }
    };

    // Elastic Logo Entrance
    this.logoStage.classList.add("logo-animate-in");

    // Fly through camera
    setTimeout(() => {
      if (this.introHandled) return;
      this.logoStage.classList.remove("logo-animate-in");
      this.logoStage.classList.add("logo-animate-out");

      setTimeout(() => {
        this.introHandled = true;
        this.revealHub();
      }, CONFIG.timings.logoExitDuration);
    }, 750 + CONFIG.timings.logoHoldDuration);
  }

  revealHub() {
    if (this.introOverlay) {
      this.introOverlay.classList.add("dismissed");
    }

    if (this.headerElement) this.headerElement.classList.add("revealed");

    const tiles = this.gridElement.querySelectorAll(".glass-tile");
    tiles.forEach((tile, index) => {
      setTimeout(() => {
        tile.classList.add("revealed");
      }, index * CONFIG.timings.gridStaggerDelay);
    });

    setTimeout(() => {
      this.isReady = true;
    }, tiles.length * CONFIG.timings.gridStaggerDelay + 150);
  }

  bypassIntro() {
    if (this.introOverlay) this.introOverlay.classList.add("dismissed");
    if (this.headerElement) this.headerElement.classList.add("revealed");

    const tiles = this.gridElement.querySelectorAll(".glass-tile");
    tiles.forEach((tile) => tile.classList.add("revealed"));
    this.isReady = true;
  }
}

// ==========================================================================
// 5. APPLICATION BOOTSTRAP
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  window.TileworksApp = new TileworksHubController();
});
