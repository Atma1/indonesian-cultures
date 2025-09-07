// src/ui/dock.js
// Builder Dock (ikon, tooltip, ripple, spotlight, underline, magnify)

export function buildDefaultDockItems({ showModal, toastEl }) {
  return [
    {
      id: "profile",
      label: "User Profile",
      icon: "assets/menus/user-profile.png",
      action: () => showModal("pmodal"),
    },
    {
      id: "game",
      label: "Game",
      icon: "assets/menus/game.png",
      action: () => showModal("gmodal"),
    },
    {
      id: "shortcuts",
      label: "Pintasan Cepat",
      icon: "assets/menus/shortcut.png",
      action: () => showModal("qmodal"),
    },
    {
      id: "event",
      label: "Event",
      icon: "assets/menus/event.png",
      action: () => showModal("emodal"),
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "assets/menus/dashboard.png",
      action: () => {
        window.open(
          "https://push-indonesia.vercel.app/premium",
          "_blank",
          "noopener,noreferrer"
        );
      },
    },
    {
      id: "subscription",
      label: "Subscription",
      icon: "assets/menus/subscription.png",
      action: () => showModal("smodal"),
    },
  ];
}

export function initDock({ container, underline, spotlight, items, audioCtl }) {
  if (!container || !underline || !spotlight || !Array.isArray(items)) return;

  const dockEls = [];

  items.forEach((it) => {
    const wrap = document.createElement("div");
    wrap.className = "dock-item";
    wrap.innerHTML = `
      <button type="button" aria-label="${it.label}" data-id="${it.id}">
        <img class="dock-icon" src="${it.icon}" alt="" />
        <span class="dock-tip">${it.label}</span>
        <span class="ripple" hidden></span>
      </button>`;
    container.appendChild(wrap);

    const btn = wrap.querySelector("button");

    btn.addEventListener("mouseenter", () => {
      audioCtl?.playHoverSfx?.();
      wrap.classList.add("show-tip");
      gsap.to(underline, { opacity: 1, duration: 0.18, ease: "power2.out" });
    });

    btn.addEventListener("mouseleave", () => {
      wrap.classList.remove("show-tip");
    });

    btn.addEventListener("click", (e) => {
      it.action?.();

      // Ripple
      const r = wrap.querySelector(".ripple");
      r.hidden = false;
      const rect = btn.getBoundingClientRect();
      const rx = e.clientX - rect.left;
      const ry = e.clientY - rect.top;
      r.style.setProperty("--rx", rx + "px");
      r.style.setProperty("--ry", ry + "px");
      gsap.fromTo(
        r,
        { opacity: 0.85 },
        {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => (r.hidden = true),
        }
      );

      // Ring
      const ring = document.createElement("span");
      ring.style.cssText =
        `position:absolute; left:${rx}px; top:${ry}px; width:8px; height:8px; border-radius:999px;` +
        `transform:translate(-50%,-50%) scale(1); box-shadow:0 0 0 0 rgba(233,213,150,.35); pointer-events:none;`;
      r.appendChild(ring);
      gsap.to(ring, {
        duration: 0.6,
        ease: "expo.out",
        boxShadow: "0 0 0 80px rgba(233,213,150,0)",
        onComplete: () => ring.remove(),
      });
    });

    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") btn.click();
    });

    dockEls.push(wrap);
  });

  // Intro animation
  gsap.set(container, { opacity: 0, y: 16, filter: "blur(6px)" });
  gsap.set(dockEls, { opacity: 0, y: 10, scale: 0.92 });
  gsap
    .timeline({ defaults: { ease: "power3.out" } })
    .to(container, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.55,
      delay: 0.15,
    })
    .to(
      dockEls,
      { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.06 },
      "-=.25"
    );

  // Magnify
  const sigma = 90,
    maxScale = 1.8,
    yLift = 14;
  const quick = dockEls.map((el) => ({
    s: gsap.quickTo(el, "scale", { duration: 0.18, ease: "power3.out" }),
    y: gsap.quickTo(el, "y", { duration: 0.18, ease: "power3.out" }),
  }));

  function updateMagnify(clientX) {
    const dockRect = container.getBoundingClientRect();
    spotlight.style.setProperty("--x", `${clientX - dockRect.left}px`);

    let best = { idx: -1, scale: 1 };
    dockEls.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const dist = Math.abs(clientX - cx);
      const k = Math.exp(-(dist * dist) / (2 * sigma * sigma));
      const scale = 1 + (maxScale - 1) * k;
      const lift = yLift * k;
      quick[i].s(scale);
      quick[i].y(-lift);
      if (scale > best.scale) best = { idx: i, scale };
    });

    if (best.idx >= 0) {
      const r = dockEls[best.idx].getBoundingClientRect();
      const w = Math.max(32, 34 + (best.scale - 1) * 18);
      const left = r.left - dockRect.left + (r.width - w) / 2;
      gsap.to(underline, {
        left,
        width: w,
        duration: 0.22,
        ease: "power3.out",
        overwrite: true,
      });
    }
  }

  container.addEventListener("mousemove", (e) => {
    updateMagnify(e.clientX);
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    gsap.to(spotlight, { duration: 0.22, ease: "power2.out", "--x": x + "px" });
  });

  container.addEventListener("mouseenter", (e) => {
    spotlight.style.opacity = 1;
    updateMagnify(e.clientX);
  });

  container.addEventListener("mouseleave", () => {
    spotlight.style.opacity = 0;
    gsap.to(underline, { opacity: 0, duration: 0.2 });
    dockEls.forEach((_, i) => {
      quick[i].s(1);
      quick[i].y(0);
    });
  });
}
