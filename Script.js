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
