
// src/data/js/provinces.js
// Panel LoL-ready: setiap provinsi punya name, desc, featuredImage, images, linkYt
// + tetap mempertahankan field lama (x, y, culture) + merge data dari JSON di /src/thedata

/* =======================
   0) Ambil semua JSON dari /src/thedata
   - Vite: import.meta.glob dengan { eager: true } -> langsung jadi objek di build-time
   - Key: nama file tanpa .json (mis. DKIJakarta, Aceh, Bali, ...)
======================= */
const JSON_MODULES = import.meta.glob("../data/thedata/*.json", { eager: true });
const JSON_BY_KEY = Object.fromEntries(
  Object.entries(JSON_MODULES).map(([path, mod]) => {
    const file = path.split("/").pop();            // "DKIJakarta.json"
    const key = file.replace(/\.json$/i, "");      // "DKIJakarta"
    // Vite expose JSON di mod.default (atau langsung mod pada beberapa versi)
    return [key, (mod && mod.default) || mod];
  })
);

/* =======================
   1) Helper nama file JSON yang "aneh" vs ID provinsi
======================= */
const JSON_ALIAS = {
  "Daerah Khusus Jakarta": "DKIJakarta",
  "Daerah Istimewa Yogyakarta": "DIYogyakarta",
};

function jsonKeyFor(id) {
  // jika ada alias, pakai; kalau tidak, default: hapus spasi & tanda bukan huruf
  return JSON_ALIAS[id] || id.replace(/[^A-Za-z0-9]/g, "");
}

/* =======================
   2) Slugify untuk path gambar fallback
======================= */
const SLUG_OVERRIDE = {
  "Daerah Khusus Jakarta": "jakarta",
  "Daerah Istimewa Yogyakarta": "yogyakarta",
};

function slugify(name) {
  if (SLUG_OVERRIDE[name]) return SLUG_OVERRIDE[name];
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const DEFAULT_DESC =
  "Deskripsi singkat provinsi akan ditambahkan. Jelajahi budaya, kuliner, seni pertunjukan, serta warisan yang khas.";

/* =======================
   3) DATA DASAR (x, y, culture) — tetap seperti semula
======================= */
const RAW_PROVINCES = [
  { id: "Aceh", x: 0.06, y: 0.82,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Sumatera Utara", x: 0.1, y: 0.75,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Sumatera Barat", x: 0.1, y: 0.64,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Riau", x: 0.15, y: 0.68,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Kepulauan Riau", x: 0.22, y: 0.75,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Jambi", x: 0.17, y: 0.62,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Sumatera Selatan", x: 0.19, y: 0.57,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Bengkulu", x: 0.13, y: 0.55,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Lampung", x: 0.19, y: 0.51,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Kepulauan Bangka Belitung", x: 0.24, y: 0.63,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Banten", x: 0.21, y: 0.45,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  {
    id: "Daerah Khusus Jakarta", x: 0.25, y: 0.5,
    culture: [
      { t: "Tari", d: "Topeng Betawi" },
      { t: "Kuliner", d: "Kerak Telor" },
      { t: "Musik", d: "Gambang Kromong" },
    ],
  },
  { id: "Jawa Barat", x: 0.25, y: 0.428,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Jawa Tengah", x: 0.3, y: 0.43,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Daerah Istimewa Yogyakarta", x: 0.32, y: 0.39,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Jawa Timur", x: 0.35, y: 0.43,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  {
    id: "Bali", x: 0.4, y: 0.44,
    culture: [{ t: "Tari", d: "Kecak" },{ t: "Kuliner", d: "Ayam Betutu" },{ t: "Musik", d: "Gamelan Bali" }],
  },
  { id: "Nusa Tenggara Barat", x: 0.45, y: 0.44,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Nusa Tenggara Timur", x: 0.55, y: 0.42,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Kalimantan Barat", x: 0.29, y: 0.7,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Kalimantan Tengah", x: 0.37, y: 0.65,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Kalimantan Selatan", x: 0.42, y: 0.62,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Kalimantan Timur", x: 0.43, y: 0.78,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Kalimantan Utara", x: 0.41, y: 0.85,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Sulawesi Utara", x: 0.58, y: 0.82,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Gorontalo", x: 0.56, y: 0.73,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Sulawesi Tengah", x: 0.52, y: 0.67,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Sulawesi Barat", x: 0.47, y: 0.6,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Sulawesi Selatan", x: 0.51, y: 0.52,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Sulawesi Tenggara", x: 0.55, y: 0.57,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Maluku", x: 0.68, y: 0.53,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Maluku Utara", x: 0.65, y: 0.73,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  {
    id: "Papua", x: 0.88, y: 0.6,
    culture: [{ t: "Tari", d: "Tari Perang" },{ t: "Kuliner", d: "Papeda" },{ t: "Musik", d: "Tifa" }],
  },
  { id: "Papua Barat", x: 0.74, y: 0.65,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Papua Selatan", x: 0.9, y: 0.45,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Papua Tengah", x: 0.84, y: 0.52,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
  { id: "Papua Pegunungan", x: 0.93, y: 0.54,
    culture: [{ t: "Tari", d: "Saman" },{ t: "Kuliner", d: "Mie Aceh" },{ t: "Musik", d: "Rapai" }],
  },
];

/* =======================
   4) Normalisasi item JSON -> slides
   Struktur JSON kamu (per item):
   { name, description, featuredImage, images[], youtubeLink }
======================= */
function slidesFromJsonArray(arr, fallbackTitle) {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((it) => ({
      cover: it.featuredImage || (Array.isArray(it.images) ? it.images[0] : "") || "",
      title: it.name || fallbackTitle,
      desc: it.description || "",
      images: Array.isArray(it.images) ? it.images : [],
      youtube: it.youtubeLink || "",
    }))
    .filter((s) => !!s.cover);
}

/* =======================
   5) Merge satu provinsi dengan JSON (jika ada)
   - Tidak menghapus logika lama: semua fallback tetap dipakai
   - Menambah field "slides" untuk dipakai lightbox baru
======================= */
function enrichWithJson(baseProv) {
  const key = jsonKeyFor(baseProv.id);
  const json = JSON_BY_KEY[key];            // bisa array langsung

  if (!json) return baseProv;

  const items = Array.isArray(json) ? json : (json.items || []);
  const slides = slidesFromJsonArray(items, baseProv.id);

  // Ambil linkYt pertama dari JSON kalau belum di-set
  const ytFromJson =
    baseProv.linkYt ||
    (items.find((it) => it.youtubeLink)?.youtubeLink ?? "");

  // featured & images: jika sudah ada di baseProv, dipertahankan;
  // kalau kosong, ambil dari JSON slides
  const featuredFromJson = slides[0]?.cover;
  const galleryFromJson = slides.slice(1).map((s) => s.cover);

  return {
    ...baseProv,
    linkYt: ytFromJson,
    slides, // dipakai oleh sidebar.js (getSlidesOf)
    featuredImage: baseProv.featuredImage || featuredFromJson || baseProv.featuredImage,
    images:
      (Array.isArray(baseProv.images) && baseProv.images.length
        ? baseProv.images
        : galleryFromJson.length
        ? galleryFromJson
        : baseProv.images) || [],
  };
}

/* =======================
   6) EXPORT: sama seperti semula + diperkaya JSON
======================= */
export const PROVINCES = RAW_PROVINCES.map((p) => {
  const slug = slugify(p.id);

  // base logic (jangan dihilangin)
  const base = {
    ...p,
    name: p.name || p.id,
    desc: p.desc || DEFAULT_DESC,
    featuredImage: p.featuredImage || `/assets/regions/${slug}/hero.jpg`,
    images:
      p.images || [
        `/assets/regions/${slug}/1.jpg`,
        `/assets/regions/${slug}/2.jpg`,
        `/assets/regions/${slug}/3.jpg`,
      ],
    linkYt: p.linkYt || "",
  };

  // lalu merge dengan JSON (jika ada)
  return enrichWithJson(base);
});

/* Optional helper */
export const getProvinceById = (id) =>
  PROVINCES.find((p) => p.id === id);
