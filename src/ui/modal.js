// src/ui/modals.js
export function initModals() {
  const MODALS = ["qmodal", "smodal", "pmodal", "gmodal", "emodal"];
  const scrimOf = (id) => document.getElementById(id.replace("modal", "scrim"));

  function showModal(id) {
    const modal = document.getElementById(id);
    const scrim = scrimOf(id);
    if (!modal || !scrim) return;
    modal.classList.add("active");
    scrim.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    gsap.fromTo(
      modal,
      { opacity: 0, scale: 0.95, filter: "blur(10px)" },
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.35,
        ease: "power3.out",
      }
    );
  }

  function hideModal(id) {
    const modal = document.getElementById(id);
    const scrim = scrimOf(id);
    if (!modal || !scrim || !modal.classList.contains("active")) return;
    gsap.to(modal, {
      opacity: 0,
      scale: 0.98,
      filter: "blur(8px)",
      duration: 0.22,
      ease: "power3.inOut",
      onComplete: () => {
        modal.classList.remove("active");
        scrim.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        gsap.set(modal, { clearProps: "opacity,filter,transform" });
      },
    });
  }

  const anyModalOpen = () =>
    MODALS.some((id) =>
      document.getElementById(id)?.classList.contains("active")
    );

  // Scrim click closes
  MODALS.forEach((id) => {
    const scr = scrimOf(id);
    if (scr) scr.addEventListener("click", () => hideModal(id));
  });

  // ESC closes the top-most open modal
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const openId = MODALS.find((id) =>
        document.getElementById(id)?.classList.contains("active")
      );
      if (openId) {
        hideModal(openId);
        e.preventDefault();
      }
    }
  });

  // Wire specific close buttons (persis seperti sebelumnya)
  document
    .getElementById("scloseBtn")
    ?.addEventListener("click", () => hideModal("smodal"));
  document
    .getElementById("pCloseX")
    ?.addEventListener("click", () => hideModal("pmodal"));
  document
    .getElementById("gQuit")
    ?.addEventListener("click", () => hideModal("gmodal"));
  document
    .getElementById("eCloseBtn")
    ?.addEventListener("click", () => hideModal("emodal"));

  return { showModal, hideModal, anyModalOpen };
}
