// src/utils/offsetCenter.js
// Factory agar computeOffsetCenter tetap bisa dipanggil dgn signature lama
// dan mendapat akses ke map, llb, dan backdrop dari main.
export function makeComputeOffsetCenter({ map, llb, backdrop }) {
  return function computeOffsetCenter(latlng, zoom, padX = 160, padY = 130) {
    const sidebarOpen = backdrop.classList.contains("active");
    const padLeftExtra = sidebarOpen ? 120 : 0;
    const size = map.getSize();
    const half = L.point(size.x / 2, size.y / 2);
    const nwZ = map.project(llb.getNorthWest(), zoom);
    const seZ = map.project(llb.getSouthEast(), zoom);
    const p = map.project(latlng, zoom);
    let cx = p.x,
      cy = p.y;

    const rightLimit = seZ.x - half.x,
      leftLimit = nwZ.x + half.x;
    const bottomLimit = seZ.y - half.y,
      topLimit = nwZ.y + half.y;

    if (p.x > rightLimit) cx = p.x - (half.x - padX);
    else if (p.x < leftLimit) cx = p.x + (half.x - (padX + padLeftExtra));
    if (p.y > bottomLimit) cy = p.y - (half.y - padY);
    else if (p.y < topLimit) cy = p.y + (half.y - padY);

    const eps = 1;
    const minX = nwZ.x + half.x + eps,
      maxX = seZ.x - half.x - eps;
    const minY = nwZ.y + half.y + eps,
      maxY = seZ.y - half.y - eps;
    cx = Math.min(Math.max(cx, minX), maxX);
    cy = Math.min(Math.max(cy, minY), maxY);

    return map.unproject(L.point(cx, cy), zoom);
  };
}
