// ===== MENU MOBILE =====
const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
    });
  });
}

// ===== LIGHTBOX GALERIE =====
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.querySelector(".lightbox-img");
const lightboxClose = document.querySelector(".lightbox-close");

function openLightbox(src, alt) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt || "";
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  if (!lightbox || !lightboxImg) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
}

document.querySelectorAll(".gallery .media img").forEach((img) => {
  img.addEventListener("click", () => openLightbox(img.src, img.alt));
});

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});
// ===== CLIPS MODAL =====
(() => {
  const modal = document.getElementById("clipModal");
  const player = document.getElementById("clipPlayer");
  const title = document.getElementById("clipModalTitle");

  if (!modal || !player) return;

  const openClip = (btn) => {
    const type = btn.getAttribute("data-clip-type");
    const src = btn.getAttribute("data-clip-src");
    const t = btn.getAttribute("data-clip-title") || "";

    // Nettoyage
    player.innerHTML = "";
    if (title) title.textContent = t;

    if (type === "mp4") {
      const video = document.createElement("video");
      video.src = src;
      video.controls = true;
      video.playsInline = true; // iPad friendly
      video.preload = "metadata";
      player.appendChild(video);
    } else {
      // embed (YouTube/Vimeo)
      const iframe = document.createElement("iframe");
      iframe.src = src + (src.includes("?") ? "&" : "?") + "autoplay=1";
      iframe.allow = "autoplay; fullscreen; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.loading = "lazy";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      player.appendChild(iframe);
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
  };

  const closeClip = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    player.innerHTML = ""; // stop video/audio
    document.documentElement.style.overflow = "";
  };

  document.querySelectorAll(".clip-card").forEach((btn) => {
    btn.addEventListener("click", () => openClip(btn));
  });

  modal.querySelectorAll("[data-clip-close]").forEach((el) => {
    el.addEventListener("click", closeClip);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeClip();
  });
})();
// ====== CLIPS (YouTube/Vimeo/MP4) ======
const clipsModal = document.getElementById("clipsModal");
const clipsModalTitle = document.getElementById("clipsModalTitle");
const clipsMedia = clipsModal ? clipsModal.querySelector(".modal-media") : null;

function openClipModal({ type, src, title }) {
  if (!clipsModal || !clipsMedia) return;

  clipsModalTitle.textContent = title || "";

  // vide le contenu précédent (important pour arrêter YouTube)
  clipsMedia.innerHTML = "";

  const frame = document.createElement("div");
  frame.className = "frame";

  if (type === "embed") {
    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = title || "Clip";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.loading = "lazy";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    frame.appendChild(iframe);
  } else if (type === "mp4") {
    const video = document.createElement("video");
    video.src = src;
    video.controls = true;
    video.playsInline = true; // iPad/iPhone
    video.preload = "metadata";
    frame.appendChild(video);
  }

  clipsMedia.appendChild(frame);

  clipsModal.classList.add("open");
  clipsModal.setAttribute("aria-hidden", "false");

  // ferme avec ESC
  document.addEventListener("keydown", onEscClose);
}

function closeClipModal() {
  if (!clipsModal || !clipsMedia) return;

  clipsModal.classList.remove("open");
  clipsModal.setAttribute("aria-hidden", "true");

  // vide pour arrêter l’audio/vidéo
  clipsMedia.innerHTML = "";
  document.removeEventListener("keydown", onEscClose);
}

function onEscClose(e) {
  if (e.key === "Escape") closeClipModal();
}

// Clic sur une carte
document.querySelectorAll(".clip-card").forEach((btn) => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.clipType; // "embed" ou "mp4"
    const src = btn.dataset.clipSrc;
    const title = btn.dataset.clipTitle || "";
    if (!type || !src) return;
    openClipModal({ type, src, title });
  });
});

// Fermeture (backdrop + bouton X)
document.querySelectorAll("[data-modal-close]").forEach((el) => {
  el.addEventListener("click", closeClipModal);
});
// ====== CLIPS INLINE PLAYER ======
(function () {
  const cards = document.querySelectorAll(".clip-card");

  function stopAllExcept(exceptCard) {
    document.querySelectorAll(".clip-card.is-playing").forEach((card) => {
      if (card === exceptCard) return;

      const holder = card.querySelector(".clip-holder");
      if (holder) holder.remove();

      // Remet l’overlay play visible
      const play = card.querySelector(".clip-play");
      if (play) play.style.display = "";

      card.classList.remove("is-playing");
      card.setAttribute("aria-expanded", "false");
    });
  }

  function buildEmbed(src, title) {
    const iframe = document.createElement("iframe");
    // autoplay + mute aide sur plusieurs navigateurs; YouTube ignore parfois l’autoplay selon le contexte
    const join = src.includes("?") ? "&" : "?";
    iframe.src = `${src}${join}autoplay=1&mute=1&playsinline=1&rel=0`;
    iframe.title = title || "Clip";
    iframe.loading = "lazy";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    return iframe;
  }

  function buildMp4(src, title) {
    const video = document.createElement("video");
    video.src = src;
    video.controls = true;
    video.playsInline = true;     // iOS
    video.preload = "metadata";
    video.setAttribute("playsinline", ""); // iOS (attribut)
    video.setAttribute("aria-label", title || "Clip");
    // autoplay iOS exige souvent muted + user gesture; ici on laisse controls (safe)
    return video;
  }

  cards.forEach((card) => {
    card.setAttribute("aria-expanded", "false");

    card.addEventListener("click", () => {
      const type = card.dataset.clipType;
      const src = card.dataset.clipSrc;
      const title = card.dataset.clipTitle || "Clip";

      if (!type || !src) return;

      // toggle: si déjà ouvert, on ferme
      if (card.classList.contains("is-playing")) {
        stopAllExcept(null);
        return;
      }

      stopAllExcept(card);

      const thumb = card.querySelector(".clip-thumb");
      if (!thumb) return;

      // Crée un conteneur ratio 16/9 dans la vignette
      const holder = document.createElement("div");
      holder.className = "clip-holder";

      const player =
        type === "mp4" ? buildMp4(src, title) : buildEmbed(src, title);

      holder.appendChild(player);
      thumb.appendChild(holder);

      // Cache l’icône ▶
      const play = card.querySelector(".clip-play");
      if (play) play.style.display = "none";

      card.classList.add("is-playing");
      card.setAttribute("aria-expanded", "true");

      // Optionnel: si MP4, tente play (souvent OK après clic)
      if (type === "mp4") {
        try { player.play(); } catch (e) {}
      }
    });
  });
})();
