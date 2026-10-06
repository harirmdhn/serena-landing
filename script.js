// ===== Serena landing page interactions =====

// Residence types — Zen-named layouts sharing a single base product render.
const BASE_IMG =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80";

const RESIDENCES = [
  { name: "Hana A — 9x17", tag: "Signature HOEK", land: "153 m²", building: "182 m²", bed: 4, bath: 4, price: "from Rp 4.2 B" },
  { name: "Hana A — 9x17", tag: "Signature",      land: "153 m²", building: "165 m²", bed: 4, bath: 3, price: "from Rp 3.9 B" },
  { name: "Hana B — 9x16", tag: "Premium HOEK",   land: "144 m²", building: "171 m²", bed: 4, bath: 3, price: "from Rp 3.8 B" },
  { name: "Hana B — 9x16", tag: "Premium",        land: "144 m²", building: "156 m²", bed: 3, bath: 3, price: "from Rp 3.5 B" },
  { name: "Hana C — 7x17", tag: "Deluxe",         land: "119 m²", building: "132 m²", bed: 3, bath: 2, price: "from Rp 2.9 B" },
  { name: "Hana D — 7x16", tag: "Deluxe",         land: "112 m²", building: "124 m²", bed: 2, bath: 2, price: "from Rp 2.4 B" },
];

function renderResidences() {
  const grid = document.getElementById("typeGrid");
  if (!grid) return;
  grid.innerHTML = RESIDENCES.map((r) => `
    <article class="type-card">
      <div class="type-thumb" style="background-image:url('${BASE_IMG}')">
        <span class="type-badge">${r.tag}</span>
      </div>
      <div class="type-body">
        <h3 class="type-name">${r.name}</h3>
        <div class="type-meta">
          <span>📐 Land ${r.land}</span>
          <span>🏠 Building ${r.building}</span>
        </div>
        <div class="type-meta">
          <span>🛏️ ${r.bed} Bed</span>
          <span>🛁 ${r.bath} Bath</span>
        </div>
        <p class="type-price">${r.price}</p>
      </div>
    </article>
  `).join("");
}

// ===== Lead form handling (client-side demo) =====
function initForm() {
  const form = document.getElementById("leadForm");
  const note = document.getElementById("formNote");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    note.hidden = false;

    if (!data.name || !data.email || !data.phone) {
      note.textContent = "Please fill in your name, email, and phone.";
      note.classList.add("error");
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    if (!emailOk) {
      note.textContent = "Please enter a valid email address.";
      note.classList.add("error");
      return;
    }

    note.classList.remove("error");
    note.textContent = `Thank you, ${data.name.split(" ")[0]}! Our team will contact you shortly.`;
    form.reset();
    // In production, POST `data` to your CRM / backend endpoint here.
    console.log("Lead captured:", data);
  });
}

// ===== Product photo gallery =====
const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1000&q=80",
];

function initGallery() {
  const main = document.getElementById("galleryMain");
  const thumbs = document.getElementById("galleryThumbs");
  if (!main || !thumbs) return;

  thumbs.innerHTML = GALLERY_IMAGES.map((src, i) => `
    <button class="gallery-thumb${i === 0 ? " active" : ""}" data-src="${src}" aria-label="View photo ${i + 1}">
      <img src="${src}" alt="Serena residence photo ${i + 1}" loading="lazy" />
    </button>
  `).join("");

  thumbs.addEventListener("click", (e) => {
    const btn = e.target.closest(".gallery-thumb");
    if (!btn) return;
    main.src = btn.dataset.src;
    thumbs.querySelectorAll(".gallery-thumb").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
}

// ===== Parallax reveal: small image -> full screen on scroll =====
function initReveal() {
  const section = document.getElementById("reveal");
  const frame = document.getElementById("revealFrame");
  const image = section ? section.querySelector(".reveal-image") : null;
  const caption = document.getElementById("revealCaption");
  const hint = document.getElementById("revealHint");
  if (!section || !frame || !image) return;

  // Respect reduced-motion: leave CSS fallback as-is.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  let ticking = false;

  function update() {
    ticking = false;
    const rect = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    // progress 0 -> 1 across the section's scroll range
    const progress = clamp(-rect.top / scrollable, 0, 1);

    // Ease the growth so it finishes a bit before the end, then holds full-screen.
    const p = clamp(progress / 0.85, 0, 1);
    const eased = p * (2 - p); // easeOutQuad

    const width = lerp(42, 100, eased);   // vw
    const height = lerp(46, 100, eased);  // vh
    const radius = lerp(18, 0, eased);    // px
    const imgScale = lerp(1.15, 1, eased);

    frame.style.width = width + "vw";
    frame.style.height = height + "vh";
    frame.style.borderRadius = radius + "px";
    image.style.transform = "scale(" + imgScale + ")";

    // Caption fades in as the image fills the screen.
    if (caption) caption.style.opacity = clamp((eased - 0.2) / 0.6, 0, 1).toFixed(3);
    // Scroll hint fades out early.
    if (hint) hint.style.opacity = clamp(1 - progress * 3, 0, 1).toFixed(3);
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
}

// ===== Footer year =====
function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  initReveal();
  renderResidences();
  initGallery();
  initForm();
  setYear();
});
