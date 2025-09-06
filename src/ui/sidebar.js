// src/ui/sidebar.js
// Sidebar + LoL-like Lightbox (vertical slides: image left + info right)

export function initSidebar({ assets }) {
  const backdrop = document.getElementById("backdrop");
  const sidebar = document.getElementById("sidebar");
  const sbIcon = document.getElementById("sbIcon");
  const sbTitle = document.getElementById("sbTitle");
  const sbSubtitle = document.getElementById("sbSubtitle");
  const sbList = document.getElementById("sbList");

  // panel sidebar
  const sbHero = document.getElementById("sbHero");
  const sbDesc = document.getElementById("sbDesc");
  const sbGallery = document.getElementById("sbGallery");
  const sbYoutube = document.getElementById("sbYoutube");

  // lightbox (markup sudah ada di HTML)
  const iScrim = document.getElementById("iscrim");
  const iModal = document.getElementById("imodal");
  const imgClose = document.getElementById("imgClose");
  const imgStream = document.getElementById("imgStream");

  let _lightbox = { images: [], index: 0, provName: "", provDesc: "" };
  let _obs = null;

  /* -----------------------------------------
     UTIL: Normalisasi slides dari berbagai bentuk data
     - Prioritas: prov.slides (hasil dari JSON per-budaya)
       item boleh {cover|featuredImage|images[0], title|name, desc|description}
     - Fallback: featuredImage + images (lama)
  ----------------------------------------- */
  function getSlidesOf(prov) {
    if (Array.isArray(prov.slides) && prov.slides.length) {
      return prov.slides
        .map((s) => ({
          cover:
            s.cover ||
            s.featuredImage ||
            (Array.isArray(s.images) ? s.images[0] : s.image) ||
            "",
          title: s.title || s.name || prov.id,
          desc: s.desc || s.description || prov.desc || "",
        }))
        .filter((s) => !!s.cover);
    }

    const imgs = [];
    if (prov.featuredImage) imgs.push(prov.featuredImage);
    if (Array.isArray(prov.images)) imgs.push(...prov.images);

    return imgs.map((src) => ({
      cover: src,
      title: prov.id,
      desc: prov.desc || "",
    }));
  }

  /* ---------- Sidebar render ---------- */
  function renderChips(prov) {
    sbList.innerHTML = "";
    (prov.culture || []).forEach((it) => {
      const chip = document.createElement("div");
      chip.className = "chip";
      chip.innerHTML = `<img src="${assets?.icons?.[prov.id] || ""}" alt="">
        <strong>${it.t}</strong> ${it.d}`;
      sbList.appendChild(chip);
    });
  }

  function renderGallery(prov) {
    const slides = getSlidesOf(prov);
    sbGallery.innerHTML = "";

    // helper: set kartu aktif (border emas)
    const setActiveCard = (idx) => {
      sbGallery.querySelectorAll(".nox-card").forEach((el, i) => {
        el.classList.toggle("is-active", i === idx);
      });
    };

    slides.forEach((s, i) => {
      const card = document.createElement("a");
      card.href = "#";
      card.className = "nox-card";
      card.addEventListener("click", (e) => {
        e.preventDefault();
        setActiveCard(i);
        openLightbox(prov, i);
      });

      const bg = document.createElement("img");
      bg.src = s.cover;
      bg.alt = s.title || "Gallery image";
      bg.className = "nox-card__bg";

      const content = document.createElement("div");
      content.className = "nox-card__content";

      const sub = document.createElement("div");
      sub.className = "nox-sub";
      sub.textContent = "BUDAYA & WARISAN";

      const ttl = document.createElement("div");
      ttl.className = "nox-title";
      ttl.textContent = (s.title || prov.id).toUpperCase();

      content.append(sub, ttl);
      card.append(bg, content);
      sbGallery.appendChild(card);
    });
  }

  function openSidebar(prov) {
    const slides = getSlidesOf(prov);

    // header
    sbIcon.src = assets?.icons?.[prov.id] || "";
    sbTitle.textContent = prov.id;
    sbSubtitle.textContent = "Budaya & Warisan • " + prov.id;

    // hero (klik buat buka lightbox)
    if (slides.length) {
      sbHero.src = slides[0].cover;
      sbHero.style.display = "block";
      sbHero.onclick = () => openLightbox(prov, 0);
    } else if (prov.featuredImage) {
      sbHero.src = prov.featuredImage;
      sbHero.style.display = "block";
      sbHero.onclick = () => openLightbox(prov, 0);
    } else {
      sbHero.removeAttribute("src");
      sbHero.style.display = "none";
      sbHero.onclick = null;
    }

    // desc + youtube (desc umum prov; detail per slide ada di lightbox)
    sbDesc.textContent = prov.desc || "";
    if (prov.linkYt) {
      sbYoutube.href = prov.linkYt;
      sbYoutube.style.display = "inline-block";
    } else {
      sbYoutube.style.display = "none";
    }

    // gallery + chips
    renderGallery(prov);
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

  /* ---------- Lightbox (LoL-like, vertical stream) ---------- */
  const pad = (n) => String(n).padStart(2, "0");

  function buildSlide({ src, i, total, title, desc }) {
    const slide = document.createElement("article");
    slide.className = "slide";
    slide.dataset.index = i;

    // kiri: gambar + tombol nav
    const wrap = document.createElement("div");
    wrap.className = "img-wrap";

    const img = document.createElement("img");
    img.src = src;
    img.alt = title;
    wrap.appendChild(img);

    if (i > 0) {
      const prev = document.createElement("button");
      prev.className = "img-nav left";
      prev.setAttribute("aria-label", "Sebelumnya");
      prev.textContent = "‹";
      prev.addEventListener("click", () => scrollToIndex(i - 1));
      wrap.appendChild(prev);
    }
    if (i < total - 1) {
      const next = document.createElement("button");
      next.className = "img-nav right";
      next.setAttribute("aria-label", "Berikutnya");
      next.textContent = "›";
      next.addEventListener("click", () => scrollToIndex(i + 1));
      wrap.appendChild(next);
    }

    // kanan: meta
    const meta = document.createElement("aside");
    meta.className = "img-meta";
    meta.innerHTML = `
      <div class="img-count">${pad(i + 1)} / ${pad(total)}</div>
      <h3 class="img-title">${(title || "").toUpperCase()}</h3>
      <div class="img-sub">BUDAYA &amp; WARISAN</div>
      <p class="img-desc">${desc || ""}</p>
    `;

    slide.appendChild(wrap);
    slide.appendChild(meta);
    return slide;
  }

  function openLightbox(prov, startIndex = 0) {
    const slides = getSlidesOf(prov);
    if (!slides.length) return;

    _lightbox = {
      images: slides.map((s) => s.cover),
      index: Math.max(0, Math.min(startIndex, slides.length - 1)),
      provName: prov.id,
      provDesc: prov.desc || "",
    };

    // bangun stream vertikal — pakai meta per slide
    imgStream.innerHTML = "";
    slides.forEach((s, i) => {
      imgStream.appendChild(
        buildSlide({
          src: s.cover,
          i,
          total: slides.length,
          title: s.title || prov.id,
          desc: s.desc ?? prov.desc ?? "",
        })
      );
    });

    // tampilkan
    iScrim.classList.add("active");
    iModal.classList.add("active");

    attachObserver();
    requestAnimationFrame(() => scrollToIndex(_lightbox.index, false));

    document.addEventListener("keydown", onKey);
  }

  function attachObserver() {
    if (_obs) _obs.disconnect();
    const slides = imgStream.querySelectorAll(".slide");
    _obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            _lightbox.index = Number(en.target.dataset.index || 0);
          }
        });
      },
      { root: imgStream, threshold: 0.6 }
    );
    slides.forEach((s) => _obs.observe(s));
  }

  function scrollToIndex(i, smooth = true) {
    const slides = imgStream.querySelectorAll(".slide");
    if (!slides.length) return;
    const idx = Math.max(0, Math.min(i, slides.length - 1));
    _lightbox.index = idx;
    slides[idx].scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "start",
    });
  }

  function onKey(e) {
    if (e.key === "Escape") return closeLightbox();
    if (e.key === "ArrowDown" || e.key === "ArrowRight")
      return scrollToIndex(_lightbox.index + 1);
    if (e.key === "ArrowUp" || e.key === "ArrowLeft")
      return scrollToIndex(_lightbox.index - 1);
  }

  function closeLightbox() {
    iScrim.classList.remove("active");
    iModal.classList.remove("active");
    document.removeEventListener("keydown", onKey);
    if (_obs) {
      _obs.disconnect();
      _obs = null;
    }
  }

  // bindings modal
  iScrim.addEventListener("click", closeLightbox);
  imgClose.addEventListener("click", closeLightbox);

  // API
  return {
    openSidebar,
    closeSidebar,
    isOpen: () => backdrop.classList.contains("active"),
    backdropEl: backdrop,
  };
}
