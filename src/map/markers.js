// src/map/markers.js
export function addProvinceMarkers({
  map,
  provinces,
  assets,
  H,
  W,
  onSelect,
  fadeBorder,
  audioCtl,
  computeOffsetCenter,
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

    // === Tooltip Label dengan animasi reveal (trend 2025) ===
    marker.bindTooltip(
      `<span class="label-text">${p.id}</span><span class="reveal-line"></span>`,
      {
        direction: "top",
        offset: [0, -28],
        permanent: false,
        opacity: 1, // biar CSS yang atur opacity
        className: "prov-label", // styling & animasi di CSS
        sticky: true, // mengikuti cursor saat hover
      }
    );

    let hideT;
    marker.on("mouseover", () => {
      clearTimeout(hideT);
      fadeBorder?.(p.id, 1);
      audioCtl?.playHoverSfx?.();
      marker.openTooltip();
    });

    marker.on("mouseout", () => {
      fadeBorder?.(p.id, 0);
      clearTimeout(hideT);
      hideT = setTimeout(() => marker.closeTooltip(), 120);
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
