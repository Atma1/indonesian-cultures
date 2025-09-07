// src/ui/events.js

/* ===== helpers ===== */
const $ = (s, r = document) => r.querySelector(s);

const trim = (txt, n = 200) =>
  (txt || "").length > n ? txt.slice(0, n).trimEnd() + "…" : (txt || "");

const IDR = (v) =>
  (v ?? 0).toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

/* ===== DOM ===== */
let eModal, eScrim, eCloseBtn, eBody;

/* ====== LOAD DATA via Vite (tanpa fetch/public) ======
   - Ambil SEMUA file JSON di src/data/thedata/*.json
   - { eager: true } => dimuat saat build/dev, tidak async import.
*/
function loadProvinceJsons() {
  try {
    const modules = import.meta.glob("/src/data/thedata/*.json", {
      eager: true,
      import: "default",
    });
    // modules: { '/src/data/thedata/Aceh.json': [array], ... }
    const all = [];
    for (const [path, payload] of Object.entries(modules)) {
      const slug = path.split("/").pop().replace(".json", "");
      if (Array.isArray(payload)) {
        payload.forEach((item, idx) => {
          all.push(toEventLike(item, slug, idx));
        });
      }
    }
    return all;
  } catch (err) {
    console.error("[events] gagal load via import.meta.glob:", err);
    return [];
  }
}

/* Ubah item budaya -> event-like */
function toEventLike(item, provinceSlug, idx) {
  const image =
    item?.featuredImage ||
    (Array.isArray(item?.images) && item.images.length ? item.images[0] : "");

  return {
    id: `${provinceSlug}-${idx}`,
    title: item?.name ?? "Tanpa Judul",
    desc: item?.description ?? "",
    image,
    province: provinceSlug,
    city: "", // opsional
    venue: "", // opsional
    tags: [item?.category].filter(Boolean),
    link: item?.youtubeLink || "",
    priceFrom: 0,
  };
}

/* ===== render ===== */
function card(ev) {
  const loc = [ev.venue, ev.city, ev.province].filter(Boolean).join(" • ");
  const linkIsYoutube = (ev.link || "").includes("youtu");

  return `
  <article class="evt2">
    <div class="evt2-img">
      ${
        ev.image
          ? `<img src="${ev.image}" alt="${ev.title}" loading="lazy" />`
          : `<div class="ph"></div>`
      }
    </div>
    <div class="evt2-main">
      <div class="evt2-title">${ev.title}</div>
      ${loc ? `<div class="evt2-loc">${loc}</div>` : ""}
      <p class="evt2-desc">${trim(ev.desc, 220)}</p>
      <div class="evt2-tags">
        ${(ev.tags || []).map((t) => `<span class="tag">${t}</span>`).join("")}
      </div>
      <div class="evt2-foot">
        <span class="evt2-price">${ev.priceFrom === 0 ? "Gratis" : `Mulai ${IDR(ev.priceFrom)}`}</span>
        ${
          ev.link
            ? `<a class="gbtn${linkIsYoutube ? " yt" : ""}" href="${ev.link}" target="_blank" rel="noopener">
                 ${linkIsYoutube ? "Tonton" : "Detail"}
               </a>`
            : ""
        }
      </div>
    </div>
  </article>`;
}

function renderEventList(list) {
  if (!eBody) return;

  if (!Array.isArray(list) || list.length === 0) {
    eBody.innerHTML = `
      <div class="evt2-empty">
        <div class="hintbox">
          <h4>Tidak ada data</h4>
          <p>Belum ada item yang bisa ditampilkan dari <code>src/data/thedata/*.json</code>.
          Pastikan file berisi array objek budaya.</p>
        </div>
      </div>
    `;
    return;
  }

  const left = `
    <div class="evt2-list" id="evtList" tabindex="0" aria-label="Daftar event">
      ${list.map(card).join("")}
    </div>
  `;

  eBody.innerHTML = `<div class="evt2-wrap">${left}</div>`;
}

/* ===== open/close ===== */
export function closeEvents() {
  $("#escrim")?.setAttribute("aria-hidden", "true");
  $("#emodal")?.setAttribute("aria-hidden", "true");
}

export function openEvents() {
  const events = loadProvinceJsons();
  console.info("[events] items:", events.length);
  renderEventList(events);
  $("#escrim")?.setAttribute("aria-hidden", "false");
  $("#emodal")?.setAttribute("aria-hidden", "false");
  $("#evtList")?.focus();
}

/* ===== init ===== */
export function registerEventsUI() {
  eModal = $("#emodal");
  eScrim = $("#escrim");
  eCloseBtn = $("#eCloseBtn");
  eBody = eModal?.querySelector(".gbody");
  if (!eModal || !eBody) return;

  eCloseBtn?.addEventListener("click", closeEvents);
  eScrim?.addEventListener("click", closeEvents);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && eModal.getAttribute("aria-hidden") === "false") closeEvents();
  });

  document.addEventListener("click", (e) => {
    const opener = e.target.closest('[data-open="events"]');
    if (opener) {
      if (opener.tagName === "A") e.preventDefault();
      openEvents();
    }
  });

  // expose optional
  window.openEvents = openEvents;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", registerEventsUI);
} else {
  registerEventsUI();
}
