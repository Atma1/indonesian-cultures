// src/ui/sidebar.js
// Sidebar + LoL-like image lightbox

export function initSidebar({ assets }) {
  const backdrop = document.getElementById("backdrop");
  const sidebar = document.getElementById("sidebar");
  const sbIcon = document.getElementById("sbIcon");
  const sbTitle = document.getElementById("sbTitle");
  const sbSubtitle = document.getElementById("sbSubtitle");
  const sbList = document.getElementById("sbList");

  // panel tambahan
  const sbHero = document.getElementById("sbHero");
  const sbDesc = document.getElementById("sbDesc");
  const sbGallery = document.getElementById("sbGallery");
  const sbYoutube = document.getElementById("sbYoutube");

  // lightbox elements
  const iScrim = document.getElementById("iscrim");
  const iModal = document.getElementById("imodal");
  const imgLarge = document.getElementById("imgLarge");
  const imgTitle = document.getElementById("imgTitle");
  const imgSub = document.getElementById("imgSub");
  const imgDesc = document.getElementById("imgDesc");
  const imgCount = document.getElementById("imgCount");
  const imgPrev = document.getElementById("imgPrev");
  const imgNext = document.getElementById("imgNext");
  const imgClose = document.getElementById("imgClose");

  let _lightbox = { images: [], index: 0, provName: "", provDesc: "" };

  /* ---------- Sidebar render ---------- */
  function renderChips(prov) {
    sbList.innerHTML = "";
    (prov.culture || []).forEach((it) => {
      const chip = document.createElement("div");
      chip.className = "chip";
      chip.innerHTML = `<img src="${assets.icons[prov.id]}" alt="">
        <strong>${it.t}</strong> ${it.d}`;
      sbList.appendChild(chip);
    });
  }

  function renderGallery(images, prov) {
    sbGallery.innerHTML = "";
    (images || []).forEach((src, i) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "Gallery image";
      img.className = "gallery-img";
      img.addEventListener("click", () =>
        openLightbox(prov, i + (prov.featuredImage ? 1 : 0))
      );
      sbGallery.appendChild(img);
    });
  }

  function openSidebar(prov) {
    // header
    sbIcon.src = assets.icons[prov.id];
    sbTitle.textContent = prov.id;
    sbSubtitle.textContent = "Budaya & Warisan • " + prov.id;

    // hero
    if (prov.featuredImage) {
      sbHero.src = prov.featuredImage;
      sbHero.style.display = "block";
      sbHero.onclick = () => openLightbox(prov, 0);
    } else {
      sbHero.removeAttribute("src");
      sbHero.style.display = "none";
      sbHero.onclick = null;
    }

    // desc + youtube
    sbDesc.textContent = prov.desc || "";
    if (prov.linkYt) {
      sbYoutube.href = prov.linkYt;
      sbYoutube.style.display = "inline-block";
    } else {
      sbYoutube.style.display = "none";
    }

    // gallery + chips
    renderGallery(prov.images, prov);
    renderChips(prov);

    // show sidebar
    backdrop.classList.add("active");
    if (window.anime) {
      window.anime({
        targets: sidebar,
        translateX: ["-110%", "0%"],
        duration: 420,
        easing: "easeOutCubic",
      });
    } else {
      sidebar.style.transform = "translateX(0%)";
    }
  }

  function closeSidebar() {
    if (!backdrop.classList.contains("active")) return;
    if (window.anime) {
      window.anime({
        targets: sidebar,
        translateX: ["0%", "-110%"],
        duration: 360,
        easing: "easeInCubic",
        complete: () => backdrop.classList.remove("active"),
      });
    } else {
      sidebar.style.transform = "translateX(-110%)";
      backdrop.classList.remove("active");
    }
  }
  backdrop.addEventListener("click", closeSidebar);

  /* ---------- Lightbox ---------- */
  function openLightbox(prov, startIndex = 0) {
    const imgs = [];
    if (prov.featuredImage) imgs.push(prov.featuredImage);
    (prov.images || []).forEach((s) => imgs.push(s));
    if (!imgs.length) return;

    _lightbox = {
      images: imgs,
      index: Math.max(0, Math.min(startIndex, imgs.length - 1)),
      provName: prov.id,
      provDesc: prov.desc || "",
    };
    updateLightbox();
    iScrim.classList.add("active");
    iModal.classList.add("active");
    document.addEventListener("keydown", onKey);
  }

  function updateLightbox() {
    const { images, index, provName, provDesc } = _lightbox;
    imgLarge.src = images[index];
    imgTitle.textContent = provName.toUpperCase();
    imgSub.textContent = "BUDAYA & WARISAN";
    imgDesc.textContent = provDesc;
    imgCount.textContent = `${String(index + 1).padStart(2, "0")} / ${String(
      images.length
    ).padStart(2, "0")}`;

    const single = images.length <= 1;
    imgPrev.style.display = single ? "none" : "grid";
    imgNext.style.display = single ? "none" : "grid";
  }

  function closeLightbox() {
    iScrim.classList.remove("active");
    iModal.classList.remove("active");
    document.removeEventListener("keydown", onKey);
  }

  function onKey(e) {
    if (e.key === "Escape") return closeLightbox();
    if (e.key === "ArrowLeft") return nav(-1);
    if (e.key === "ArrowRight") return nav(1);
  }

  function nav(step) {
    const { images } = _lightbox;
    if (!images.length) return;
    _lightbox.index = (_lightbox.index + step + images.length) % images.length;
    updateLightbox();
  }

  // modal bindings
  iScrim.addEventListener("click", closeLightbox);
  imgClose.addEventListener("click", closeLightbox);
  imgPrev.addEventListener("click", () => nav(-1));
  imgNext.addEventListener("click", () => nav(1));

  // API publik
  return {
    openSidebar,
    closeSidebar,
    isOpen: () => backdrop.classList.contains("active"),
    backdropEl: backdrop,
  };
}
