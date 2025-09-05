// src/utils/view.js
export const EXTRA_ZOOM = 2.0;

// Factory: kembalikan fungsi setCoverView yang tertutup pada map/bounds/H/W
export function makeSetCoverView({
  map,
  bounds,
  H,
  W,
  EXTRA_ZOOM: extra = EXTRA_ZOOM,
}) {
  return function setCoverView() {
    const zCover = map.getBoundsZoom(bounds, false);
    map.setMinZoom(zCover);
    map.setMaxZoom(zCover + extra);
    if (!isFinite(map.getZoom()) || map.getZoom() < zCover) {
      map.setView([H / 2, W / 2], zCover, { animate: false });
    }
    map.setMaxBounds(bounds);
  };
}
