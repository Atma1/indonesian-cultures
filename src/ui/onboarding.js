// src/ui/onboarding.js
// Mengatur lock/unlock interaksi map, animasi judul GSAP, hover BTN,
// aksi klik Explore (fade out, mulai BG music), flyTo tengah & animasi ikon.

export function initOnboarding({ map, H, W, audioCtl }) {
  const onboard = document.getElementById("onboard");
  const btnExplore = document.getElementById("btnExplore");
  const iconsPane = map.getPane("icons");

  if (!onboard || !btnExplore || !iconsPane) return;

  // ----- Interactions lock (sama seperti sebelumnya)
  function lockInteractions(lock = true) {
    const m = map;
    if (lock) {
      m.dragging.disable();
      m.scrollWheelZoom.disable();
      m.doubleClickZoom.disable();
      m.touchZoom.disable();
    } else {
      m.dragging.enable();
      m.scrollWheelZoom.enable();
      m.doubleClickZoom.enable();
      m.touchZoom.enable();
    }
  }

  lockInteractions(true);
  iconsPane.classList.add("icons-hidden");

  // ----- Stroke prep untuk SVG rule (identik)
  function prepStrokeDraw(poly) {
    if (!poly) return 0;
    let length = 0;
    try {
      length =
        typeof poly.getTotalLength === "function"
          ? poly.getTotalLength()
          : Math.max(
              200,
              Math.floor((poly.getBBox ? poly.getBBox().width : 800) * 1.2)
            );
    } catch (e) {
      length = 800;
    }
    poly.style.strokeDasharray = String(length);
    poly.style.strokeDashoffset = "0";
    return length;
  }
  prepStrokeDraw(document.getElementById("ruleMain"));
  prepStrokeDraw(document.getElementById("ruleSub"));

  // ----- GSAP intro timeline (persis)
  if (window.gsap) {
    window.gsap
      .timeline({ defaults: { ease: "power3.out" } })
      .to("#obTitle", { opacity: 1, y: 0, duration: 0.6, delay: 0.05 })
      .to(".ob-subtitle", { opacity: 1, y: 0, duration: 0.5 }, "-=.35")
      .to(
        ".onboard .onboard-rule",
        { opacity: 1, y: 0, duration: 0.45 },
        "-=.15"
      )
      .to(
        [".onboard p", "#btnExplore"],
        { opacity: 1, y: 0, duration: 0.55, stagger: 0 },
        "-=.10"
      );
  }

  // ----- Hover BTN (sama)
  btnExplore.addEventListener("mouseenter", () => {
    if (!window.gsap) return;
    window.gsap.to(btnExplore, {
      y: -2,
      boxShadow: "0 6px 18px rgba(200,170,110,.45)",
      duration: 0.25,
      ease: "power3.out",
    });
  });
  btnExplore.addEventListener("mouseleave", () => {
    if (!window.gsap) return;
    window.gsap.to(btnExplore, {
      y: 0,
      boxShadow: "0 8px 22px rgba(0,0,0,.35)",
      duration: 0.25,
      ease: "power3.inOut",
    });
  });

  // ----- Click Explore (identik)
  btnExplore.addEventListener("click", async () => {
    audioCtl?.playClickSfx?.();
    if (!audioCtl?.userInteracted) {
      audioCtl?.setUserInteracted?.(true);
      await audioCtl?.startBgIfAllowed?.();
    }

    // Fade out onboarding overlay (anime.js fallback sederhana)
    if (window.anime) {
      window.anime({
        targets: onboard,
        opacity: [1, 0],
        duration: 360,
        easing: "easeInOutCubic",
        complete: () => {
          onboard.style.display = "none";
        },
      });
    } else {
      onboard.style.opacity = "0";
      onboard.style.display = "none";
    }

    lockInteractions(false);

    const zCover = map.getMinZoom();
    const targetZ = Math.min(map.getMaxZoom(), zCover + 0.9);
    map.flyTo([H / 2, W / 2], targetZ, {
      animate: true,
      duration: 0.9,
      easeLinearity: 0.24,
    });

    // Setelah fly selesai -> animasi ikon muncul (persis)
    map.once("moveend", () => {
      const nodes = iconsPane.querySelectorAll(".prov-icon");
      iconsPane.classList.remove("icons-hidden");
      if (window.anime) {
        window.anime({
          targets: nodes,
          opacity: [0, 1],
          translateY: [12, 0],
          scale: [0.6, 1],
          filter: ["blur(3px)", "blur(0px)"],
          delay: window.anime.stagger(90, { from: "center", start: 120 }),
          duration: 560,
          easing: "cubicBezier(.2,.8,.2,1)",
        });
      } else {
        nodes.forEach((n) => {
          n.style.opacity = "1";
          n.style.transform = "none";
        });
      }
    });
  });

  // optional: expose API jika butuh di masa depan
  return { lockInteractionsInitial: () => lockInteractions(true) };
}
