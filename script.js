// ===== Serena landing page interactions =====

// Residence types — "similar product, different theme" (Zen names) with a shared base image.
// Each card uses the same base product render but a different accent/theme tag,
// mirroring the reference page's single product image across variants.
const BASE_IMG =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80";

const RESIDENCES = [
  { name: "Hana A — 9x17", tag: "Signature HOEK", theme: "Sumi (Charcoal)", land: "153 m²", bed: 4, bath: 4, price: "from Rp 4.2 B" },
  { name: "Hana A — 9x17", tag: "Signature",      theme: "Shiro (White)",   land: "153 m²", bed: 4, bath: 3, price: "from Rp 3.9 B" },
  { name: "Hana B — 9x16", tag: "Premium HOEK",   theme: "Hinoki (Timber)", land: "144 m²", bed: 4, bath: 3, price: "from Rp 3.8 B" },
  { name: "Hana B — 9x16", tag: "Premium",        theme: "Shiro (White)",   land: "144 m²", bed: 3, bath: 3, price: "from Rp 3.5 B" },
  { name: "Hana C — 7x17", tag: "Deluxe",         theme: "Sumi (Charcoal)", land: "119 m²", bed: 3, bath: 2, price: "from Rp 2.9 B" },
  { name: "Hana D — 7x16", tag: "Deluxe",         theme: "Hinoki (Timber)", land: "112 m²", bed: 2, bath: 2, price: "from Rp 2.4 B" },
];

// Subtle per-theme tint overlaid on the shared product image to express "different themes".
const THEME_TINT = {
  "Sumi (Charcoal)": "linear-gradient(rgba(40,40,46,0.45), rgba(40,40,46,0.15))",
  "Shiro (White)":   "linear-gradient(rgba(255,255,255,0.28), rgba(255,255,255,0.05))",
  "Hinoki (Timber)": "linear-gradient(rgba(176,136,88,0.38), rgba(176,136,88,0.1))",
};

function renderResidences() {
  const grid = document.getElementById("typeGrid");
  if (!grid) return;
  grid.innerHTML = RESIDENCES.map((r) => `
    <article class="type-card">
      <div class="type-thumb" style="background-image:${THEME_TINT[r.theme]}, url('${BASE_IMG}')">
        <span class="type-badge">${r.tag}</span>
      </div>
      <div class="type-body">
        <h3 class="type-name">${r.name}</h3>
        <div class="type-meta">
          <span>🎨 ${r.theme}</span>
          <span>📐 ${r.land}</span>
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

// ===== Footer year =====
function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  renderResidences();
  initForm();
  setYear();
});
