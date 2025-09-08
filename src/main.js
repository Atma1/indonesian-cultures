// src/main.js
import { ASSETS } from "./config/assets.js";
import { PROVINCES } from "./data/provinces.js";
import { makeComputeOffsetCenter } from "./utils/offsetCenter.js";
import { EXTRA_ZOOM, makeSetCoverView } from "./utils/view.js";
import { createAudio } from "./audio/index.js";
import { initModals } from "./ui/modals.js";
import { createBorders } from "./map/borders.js";
import { addProvinceMarkers } from "./map/markers.js";
import { initDock, buildDefaultDockItems } from "./ui/dock.js";
import { initQuickShortcuts } from "./ui/quickShortcuts.js";
import { initSidebar } from "./ui/sidebar.js";
import { initOnboarding } from "./ui/onboarding.js";
import { addCloudsLayer } from "./effects/clouds.js";
import { registerGlobalHotkeys } from "./utils/hotkeys.js";
import { initGame } from "./ui/game.js";
import { registerSubscriptionUI } from "./ui/subscription.js";
import "./ui/events.js";

registerSubscriptionUI(); // inisialisasi sekali

window.openEvents();

/* ====== LEAFLET ====== */
const H = 1365,
  W = 2048;
const bounds = [
  [0, 0],
  [H, W],
];
const llb = L.latLngBounds(bounds);

const map = L.map("map", {
  crs: L.CRS.Simple,
  preferCanvas: true,
  zoomControl: false,
  scrollWheelZoom: true,
  zoomAnimation: true,
  zoomSnap: 0,
  zoomDelta: 0.12,
  wheelDebounceTime: 0,
  wheelPxPerZoomLevel: 100,
  touchZoom: true,
  doubleClickZoom: true,
  inertia: true,
  maxBounds: bounds,
  maxBoundsViscosity: 1.0,
  worldCopyJump: false,
});

map.createPane("borders");
map.createPane("icons");
L.imageOverlay(ASSETS.base, bounds).addTo(map);

// cover view
const setCoverView = makeSetCoverView({ map, bounds, H, W, EXTRA_ZOOM });
setCoverView();
map.on("resize", setCoverView);

/* ====== CLOUDS (modul) ====== */
addCloudsLayer({
  map,
  llb,
  cloudsUrl: "assets/effects/clouds.jpg",
  maskUrl: "assets/effects/fog-mask.jpg",
});

/* ====== Overlay batas ====== */
const { borderLayers, fadeBorder } = createBorders({
  map,
  bounds,
  overlays: ASSETS.overlays,
});

/* ====== AUDIO ====== */
const audioCtl = createAudio(ASSETS.sounds, {
  hoverVol: 0.5,
  clickVol: 0.6,
  bgVol: 0.45,
});
const musicBtn = document.getElementById("musicBtn");
audioCtl.bindUI({ button: musicBtn, hotkey: "m" });

/* ====== Sidebar ====== */
const { openSidebar, closeSidebar } = initSidebar({ assets: ASSETS });

/* ====== UTIL offset center ====== */
const backdrop = document.getElementById("backdrop");
const computeOffsetCenter = makeComputeOffsetCenter({ map, llb, backdrop });

/* ====== MODAL SYSTEM ====== */
const { showModal, hideModal, anyModalOpen } = initModals();

/* ====== Hotkeys global (Escape -> close sidebar jika tidak ada modal) ====== */
registerGlobalHotkeys({
  anyModalOpen,
  onEscapeNoModal: closeSidebar,
});

/* ====== Marker provinsi ====== */
addProvinceMarkers({
  map,
  provinces: PROVINCES,
  assets: ASSETS,
  H,
  W,
  onSelect: openSidebar,
  fadeBorder,
  audioCtl,
  computeOffsetCenter,
});

/* ====== Onboarding ====== */
initOnboarding({ map, H, W, audioCtl });

/* ====== DOCK ====== */
const dockInner = document.getElementById("dockInner");
const underline = document.getElementById("dockUnderline");
const spotlight = document.getElementById("dockSpotlight");
const toastEl = document.getElementById("toast");

const dockItems = buildDefaultDockItems({ showModal, toastEl });
initDock({
  container: dockInner,
  underline,
  spotlight,
  items: dockItems,
  audioCtl,
});

/* ====== QUICK SHORTCUTS ====== */
initQuickShortcuts({
  map,
  H,
  W,
  assets: ASSETS,
  provinces: PROVINCES,
  audioCtl,
  showModal,
  hideModal,
  computeOffsetCenter,
  openSidebar,
});

window.addEventListener("DOMContentLoaded", () => {
  const game = initGame();

  // contoh: klik tombol dock icon game
  const gameBtn = document.getElementById("dockGameBtn");
  if (gameBtn) {
    gameBtn.addEventListener("click", () => {
      game.startGame();
    });
  }
});
