"use strict";

const LINKS = {
  instagram: "https://instagram.com/tileworks_studio",
  games: {
    connections: "https://tileworksgamesstudio.github.io/Curling-Connections/",
    crossword: "https://tileworksgamesstudio.github.io/Curling-Crossword/",
    memory: "https://tileworksgamesstudio.github.io/Curling-Memory/",
    spellingBee: "https://tileworksgamesstudio.github.io/Curling-Spelling/",
    trivia: "https://tileworksgamesstudio.github.io/Curling-Trivia/",
    wordle: "https://tileworksgamesstudio.github.io/Curling-Wordle/"
  },
  donations: {
    one: "https://buy.stripe.com/14AbJ0czm3Ct3ARdPgefC0U",
    two: "https://buy.stripe.com/14AfZgfLy2ypb3j6mOefC0V",
    three: "https://buy.stripe.com/5kQdR8aredd3fjzeTkefC0W"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const viewGames = document.getElementById("view-games");
  const viewDonations = document.getElementById("view-donations");
  const btnOpenDonate = document.getElementById("btn-open-donate");
  const btnBackGames = document.getElementById("btn-back-games");
  const logoLink = document.getElementById("brand-logo-link");
  const toastElement = document.getElementById("hub-toast");
  const toastMessage = document.getElementById("toast-message");

  let toastTimer = null;

  function isValidUrl(urlString) {
    if (!urlString || typeof urlString !== "string") return false;
    return urlString.startsWith("http://") || urlString.startsWith("https://");
  }

  function showToast(message) {
    if (!toastElement || !toastMessage) return;
    toastMessage.textContent = message;
    toastElement.classList.add("visible");

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastElement.classList.remove("visible");
    }, 2400);
  }

  function handleNavigation(destinationUrl, label) {
    if (isValidUrl(destinationUrl)) {
      window.open(destinationUrl, "_blank", "noopener,noreferrer");
    } else {
      showToast(`Opening ${label}...`);
    }
  }

  function syncAnchorLinks() {
    if (logoLink && isValidUrl(LINKS.instagram)) {
      logoLink.href = LINKS.instagram;
    }

    if (viewGames) {
      const cards = viewGames.querySelectorAll(".game-card");
      cards.forEach((card) => {
        const gameKey = card.getAttribute("data-game");
        if (gameKey && isValidUrl(LINKS.games[gameKey])) {
          card.href = LINKS.games[gameKey];
          card.target = "_blank";
          card.rel = "noopener noreferrer";
        }
      });
    }

    if (viewDonations) {
      const tierCards = viewDonations.querySelectorAll(".tier-card");
      tierCards.forEach((tierCard) => {
        const tierKey = tierCard.getAttribute("data-donation");
        if (tierKey && isValidUrl(LINKS.donations[tierKey])) {
          tierCard.href = LINKS.donations[tierKey];
          tierCard.target = "_blank";
          tierCard.rel = "noopener noreferrer";
        }
      });
    }
  }

  function switchView(targetView) {
    if (targetView === "donations") {
      viewGames.classList.remove("active");
      viewGames.setAttribute("hidden", "true");
      btnOpenDonate.setAttribute("aria-expanded", "true");

      viewDonations.removeAttribute("hidden");
      requestAnimationFrame(() => {
        viewDonations.classList.add("active");
        if (btnBackGames) btnBackGames.focus();
      });
    } else {
      viewDonations.classList.remove("active");
      viewDonations.setAttribute("hidden", "true");
      btnOpenDonate.setAttribute("aria-expanded", "false");

      viewGames.removeAttribute("hidden");
      requestAnimationFrame(() => {
        viewGames.classList.add("active");
        if (btnOpenDonate) btnOpenDonate.focus();
      });
    }
  }

  syncAnchorLinks();

  if (logoLink) {
    logoLink.addEventListener("click", (e) => {
      if (!isValidUrl(LINKS.instagram)) {
        e.preventDefault();
        handleNavigation(LINKS.instagram, "Instagram Profile");
      }
    });
  }

  if (viewGames) {
    viewGames.addEventListener("click", (e) => {
      const card = e.target.closest(".game-card");
      if (!card) return;

      const gameKey = card.getAttribute("data-game");
      const gameName = card.querySelector(".game-name")?.textContent.trim() || "Game";
      const targetUrl = LINKS.games[gameKey];

      if (!isValidUrl(targetUrl)) {
        e.preventDefault();
        handleNavigation(targetUrl, gameName);
      }
    });
  }

  if (btnOpenDonate) {
    btnOpenDonate.addEventListener("click", (e) => {
      e.preventDefault();
      switchView("donations");
    });
  }

  if (btnBackGames) {
    btnBackGames.addEventListener("click", (e) => {
      e.preventDefault();
      switchView("games");
    });
  }

  if (viewDonations) {
    viewDonations.addEventListener("click", (e) => {
      const tierCard = e.target.closest(".tier-card");
      if (!tierCard) return;

      const tierKey = tierCard.getAttribute("data-donation");
      const costBadge = tierCard.querySelector(".tier-cost-badge")?.textContent.trim() || "Support";
      const targetUrl = LINKS.donations[tierKey];

      if (!isValidUrl(targetUrl)) {
        e.preventDefault();
        handleNavigation(targetUrl, `${costBadge} Contribution`);
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && viewDonations && viewDonations.classList.contains("active")) {
      switchView("games");
    }
  });
});