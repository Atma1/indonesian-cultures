// src/data/provinces.js
// Panel LoL-ready: setiap provinsi punya name, desc, featuredImage, images, linkYt
// + tetap mempertahankan field lama (x, y, culture)

// Folder override kalau nama folder gambar beda dari slug otomatis
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
   DATA DASAR (x, y, culture)
   ——— JANGAN pake nama BASE_PROVINCES lagi
   ======================= */
const RAW_PROVINCES = [
  {
    id: "Aceh",
    x: 0.06,
    y: 0.82,
    // contoh lengkap
    desc:
      "Aceh dikenal sebagai Serambi Mekah dengan tradisi Islam yang kuat. Budaya kolektif tercermin pada Tari Saman, musik Rapai, dan kuliner Mie Aceh.",
    featuredImage: "/assets/regions/aceh/hero.jpg",
    images: [
      "/assets/regions/aceh/1.jpg",
      "/assets/regions/aceh/2.jpg",
      "/assets/regions/aceh/3.jpg",
    ],
    linkYt: "https://www.youtube.com/watch?v=rTmuK9_3xkA",
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Sumatera Utara",
    x: 0.1,
    y: 0.75,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Sumatera Barat",
    x: 0.1,
    y: 0.64,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Riau",
    x: 0.15,
    y: 0.68,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Kepulauan Riau",
    x: 0.22,
    y: 0.75,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Jambi",
    x: 0.17,
    y: 0.62,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Sumatera Selatan",
    x: 0.19,
    y: 0.57,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Bengkulu",
    x: 0.13,
    y: 0.55,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Lampung",
    x: 0.19,
    y: 0.51,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Kepulauan Bangka Belitung",
    x: 0.24,
    y: 0.63,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Banten",
    x: 0.21,
    y: 0.45,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Daerah Khusus Jakarta",
    x: 0.25,
    y: 0.50,

    // dipakai sidebar + lightbox
    featuredImage: "/assets/images/4.jpg",
    images: [
      "/assets/images/1.jpeg",
      "/assets/images/2.jpeg",
      "/assets/images/3.jpeg",
    ],
    linkYt: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    desc:
      "Pusat pemerintahan dan budaya urban Indonesia. Di sisi modernitas, Jakarta tetap merawat tradisi Betawi: ondel-ondel, lenong, hingga kuliner Kerak Telor.",

    // chip lama (tetap didukung)
    culture: [
      { t: "Tari", d: "Topeng Betawi" },
      { t: "Kuliner", d: "Kerak Telor" },
      { t: "Musik", d: "Gambang Kromong" },
    ],
  },
  {
    id: "Jawa Barat",
    x: 0.25,
    y: 0.428,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Jawa Tengah",
    x: 0.3,
    y: 0.43,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Daerah Istimewa Yogyakarta",
    x: 0.32,
    y: 0.39,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Jawa Timur",
    x: 0.35,
    y: 0.43,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Bali",
    x: 0.4,
    y: 0.44,
    // contoh lengkap
    desc:
      "Pulau dewata dengan budaya Hindu yang kaya. Pura, upacara, dan seni pertunjukan seperti Tari Kecak serta musik gamelan membentuk identitas Bali.",
    featuredImage: "/assets/regions/bali/hero.jpg",
    images: [
      "/assets/regions/bali/1.jpg",
      "/assets/regions/bali/2.jpg",
      "/assets/regions/bali/3.jpg",
    ],
    linkYt: "https://www.youtube.com/watch?v=EXAMPLEBALI",
    culture: [
      { t: "Tari", d: "Kecak" },
      { t: "Kuliner", d: "Ayam Betutu" },
      { t: "Musik", d: "Gamelan Bali" },
    ],
  },
  {
    id: "Nusa Tenggara Barat",
    x: 0.45,
    y: 0.44,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Nusa Tenggara Timur",
    x: 0.55,
    y: 0.42,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Kalimantan Barat",
    x: 0.29,
    y: 0.7,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Kalimantan Tengah",
    x: 0.37,
    y: 0.65,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Kalimantan Selatan",
    x: 0.42,
    y: 0.62,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Kalimantan Timur",
    x: 0.43,
    y: 0.78,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Kalimantan Utara",
    x: 0.41,
    y: 0.85,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Sulawesi Utara",
    x: 0.58,
    y: 0.82,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Gorontalo",
    x: 0.56,
    y: 0.73,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Sulawesi Tengah",
    x: 0.52,
    y: 0.67,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Sulawesi Barat",
    x: 0.47,
    y: 0.6,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Sulawesi Selatan",
    x: 0.51,
    y: 0.52,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Sulawesi Tenggara",
    x: 0.55,
    y: 0.57,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Maluku",
    x: 0.68,
    y: 0.53,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Maluku Utara",
    x: 0.65,
    y: 0.73,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Papua",
    x: 0.88,
    y: 0.6,
    // contoh lengkap
    desc:
      "Papua dengan ratusan bahasa lokal dan seni ukir Asmat. Festival Danau Sentani dan tradisi bakar batu menjadi sorotan budaya.",
    featuredImage: "/assets/regions/papua/hero.jpg",
    images: [
      "/assets/regions/papua/1.jpg",
      "/assets/regions/papua/2.jpg",
      "/assets/regions/papua/3.jpg",
    ],
    linkYt: "https://www.youtube.com/watch?v=EXAMPLEPAPUA",
    culture: [
      { t: "Tari", d: "Tari Perang" },
      { t: "Kuliner", d: "Papeda" },
      { t: "Musik", d: "Tifa" },
    ],
  },
  {
    id: "Papua Barat",
    x: 0.74,
    y: 0.65,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Papua Selatan",
    x: 0.9,
    y: 0.45,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Papua Tengah",
    x: 0.84,
    y: 0.52,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
  {
    id: "Papua Pegunungan",
    x: 0.93,
    y: 0.54,
    culture: [
      { t: "Tari", d: "Saman" },
      { t: "Kuliner", d: "Mie Aceh" },
      { t: "Musik", d: "Rapai" },
    ],
  },
];

// EXPORT: diperkaya untuk panel kanan
export const PROVINCES = RAW_PROVINCES.map((p) => {
  const slug = slugify(p.id);
  return {
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
    linkYt: p.linkYt || "", // kosong = tombol YouTube disembunyikan
  };
});
 