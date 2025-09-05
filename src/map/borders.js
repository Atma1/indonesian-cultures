// src/map/borders.js
// Membuat layer overlay per-provinsi dan helper fadeBorder().

export function createBorders({ map, bounds, overlays }) {
  const borderLayers = {};

  Object.entries(overlays).forEach(([name, file]) => {
    const layer = L.imageOverlay(encodeURI(file), bounds, {
      pane: "borders",
      opacity: 0,
      interactive: false,
    }).addTo(map);

    layer.once("load", () => {
      const el = layer.getElement();
      el.style.mixBlendMode = "screen";
      el.style.pointerEvents = "none";
    });

    borderLayers[name] = layer;
  });

  const fadeBorder = (id, toOpacity) => {
    const layer = borderLayers[id];
    if (!layer) return;
    const img = layer.getElement();
    const from = { o: parseFloat(getComputedStyle(img).opacity) || 0 };
    anime({
      targets: from,
      o: toOpacity,
      duration: 280,
      easing: "easeOutQuad",
      update: () => {
        img.style.opacity = from.o;
      },
    });
  };

  return { borderLayers, fadeBorder };
}
