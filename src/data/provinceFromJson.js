// src/data/provinceFromJson.js
// Membaca file JSON per-provinsi yang bentuknya ARRAY item budaya
// lalu menormalkan ke struktur yang dipakai Sidebar + Lightbox.

const DEFAULT_DESC =
  "Jelajahi budaya Betawi: ondel-ondel, lenong, hingga kuliner khas seperti Kerak Telor.";

/**
 * Ubah array item budaya → objek provinsi + slides.
 * @param {string} id - Nama provinsi untuk ditampilkan.
 * @param {Array} items - Array dari JSON (name, description, featuredImage, images, youtubeLink).
 * @param {{x:number,y:number}} coords - Posisi marker.
 */
export function buildProvinceFromItems(id, items, coords = { x: 0.25, y: 0.5 }) {
  const slides = (items || []).map((it) => ({
    cover: it.featuredImage || (it.images?.[0] ?? ""),
    title: it.name || id,
    desc: it.description || "",
    images: Array.isArray(it.images) ? it.images : [],
    linkYt: it.youtubeLink || "",
  }));

  return {
    id,
    name: id,
    x: coords.x,
    y: coords.y,

    // pakai cover slide pertama sebagai hero
    featuredImage: slides[0]?.cover || "",
    // untuk galeri di sidebar: pakai cover tiap slide
    images: slides.map((s) => s.cover).filter(Boolean),

    // deskripsi global (boleh kamu ganti kalau ada di luar JSON)
    desc: DEFAULT_DESC,

    // ambil linkYt pertama yang ada
    linkYt: slides.find((s) => s.linkYt)?.linkYt || "",

    // inilah kunci untuk lightbox per-slide
    slides,

    // biarkan kosong / isi kalau ada chip lama
    culture: [],
  };
}
