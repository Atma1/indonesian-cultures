// src/map/markers.js
// Membuat marker ikon provinsi dan wiring hover/click persis seperti sebelumnya.

export function addProvinceMarkers({
  map,
  provinces,
  assets,
  H,
  W,
  onSelect, // callback saat marker selesai fly (openSidebar)
  fadeBorder, // dari createBorders()
  audioCtl, // modul audio (opsional, tetap aman kalau null)
  computeOffsetCenter, // helper center offset
}) {
  const createdMarkers = [];

  provinces.forEach((p) => {
    const lat = p.y * H,
      lng = p.x * W;

    const el = document.createElement("div");
    el.className = "prov-icon";
    el.innerHTML = `<img src="${assets.icons[p.id]}" alt="${p.id}">`;

    const marker = L.marker([lat, lng], {
      icon: L.divIcon({
        html: el,
        className: "",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      }),
      pane: "icons",
      riseOnHover: true,
    }).addTo(map);

    marker.on("mouseover", () => {
      fadeBorder?.(p.id, 1);
      audioCtl?.playHoverSfx?.();
    });

    marker.on("mouseout", () => {
      fadeBorder?.(p.id, 0);
    });

    marker.on("click", () => {
      audioCtl?.playClickSfx?.();
      const zMax = map.getMaxZoom();
      const centerMax = computeOffsetCenter([lat, lng], zMax);
      map.flyTo(centerMax, zMax, {
        animate: true,
        duration: 0.85,
        easeLinearity: 0.24,
      });
      map.once("moveend", () => onSelect?.(p));
    });

    createdMarkers.push(marker);
  });

  return createdMarkers;
}
