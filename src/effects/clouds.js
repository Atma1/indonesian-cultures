// src/effects/clouds.js
// Layer awan dengan mask + parallax yang mengikuti viewport Leaflet

export function addCloudsLayer({
  map,
  llb,
  cloudsUrl = "assets/effects/clouds.jpg",
  maskUrl = "assets/effects/fog-mask.jpg",
}) {
  // --- DOM di overlayPane
  const pane = map.getPanes().overlayPane;
  const cont = L.DomUtil.create("div", "clouds-masked", pane);
  const tex1 = L.DomUtil.create("div", "cloud-tex", cont);
  const tex2 = L.DomUtil.create("div", "cloud-tex parallax", cont);

  // aset
  tex1.style.backgroundImage = `url(${cloudsUrl})`;
  tex2.style.backgroundImage = `url(${cloudsUrl})`;
  cont.style.webkitMaskImage = `url(${maskUrl})`;
  cont.style.maskImage = `url(${maskUrl})`;
  cont.style.webkitMaskRepeat = cont.style.maskRepeat = "no-repeat";
  cont.style.webkitMaskSize = cont.style.maskSize = "100% 100%";
  cont.style.webkitMaskPosition = cont.style.maskPosition = "center";

  // --- resize & posisi mengikuti map
  function updatePosAndSize() {
    const nw = map.latLngToLayerPoint(llb.getNorthWest());
    const se = map.latLngToLayerPoint(llb.getSouthEast());
    const sz = se.subtract(nw);
    L.DomUtil.setPosition(cont, nw);
    cont.style.width = sz.x + "px";
    cont.style.height = sz.y + "px";
    tex1.style.backgroundSize = `${Math.max(512, sz.x / 2)}px ${Math.max(
      512,
      sz.y / 2
    )}px`;
    tex2.style.backgroundSize = `${Math.max(640, sz.x / 1.6)}px ${Math.max(
      640,
      sz.y / 1.6
    )}px`;
  }
  updatePosAndSize();
  const mapEvents = "move zoom viewreset resize";
  map.on(mapEvents, updatePosAndSize);

  // --- parallax anim (GSAP ticker)
  const TILE1 = 1024,
    TILE2 = 1280;
  const speed1 = { x: 0.9, y: 0.42 };
  const speed2 = { x: 0.52, y: 0.24 };
  let x1 = 0,
    y1 = 0,
    x2 = 0,
    y2 = 0;

  let removeTicker = () => {};
  if (window.gsap?.ticker) {
    const tick = () => {
      const dr = window.gsap.ticker.deltaRatio(60);
      x1 = (x1 - speed1.x * dr) % TILE1;
      y1 = (y1 - speed1.y * dr) % TILE1;
      x2 = (x2 - speed2.x * dr) % TILE2;
      y2 = (y2 - speed2.y * dr) % TILE2;
      const bx1 = (x1 + TILE1) % TILE1,
        by1 = (y1 + TILE1) % TILE1;
      const bx2 = (x2 + TILE2) % TILE2,
        by2 = (y2 + TILE2) % TILE2;
      tex1.style.backgroundPosition = `${-bx1}px ${-by1}px`;
      tex2.style.backgroundPosition = `${-bx2}px ${-by2}px`;
    };
    window.gsap.ticker.add(tick);
    removeTicker = () => window.gsap.ticker.remove(tick);
  }

  const visHandler = () => {
    if (!window.gsap?.ticker) return;
    window.gsap.ticker[document.hidden ? "sleep" : "wake"]();
  };
  document.addEventListener("visibilitychange", visHandler);

  // --- API cleanup optional
  function destroy() {
    map.off(mapEvents, updatePosAndSize);
    removeTicker();
    document.removeEventListener("visibilitychange", visHandler);
    cont.remove();
  }

  return { destroy, container: cont };
}
