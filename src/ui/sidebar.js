// src/ui/sidebar.js
// Mengelola open/close sidebar + render chip budaya per provinsi

export function initSidebar({ assets }) {
  const backdrop = document.getElementById("backdrop");
  const sidebar = document.getElementById("sidebar");
  const sbIcon = document.getElementById("sbIcon");
  const sbTitle = document.getElementById("sbTitle");
  const sbSubtitle = document.getElementById("sbSubtitle");
  const sbList = document.getElementById("sbList");

  function renderChips(prov) {
    sbList.innerHTML = "";
    (prov.culture || []).forEach((it) => {
      const chip = document.createElement("div");
      chip.className = "chip";
      chip.innerHTML = `<img src="${assets.icons[prov.id]}" alt=""><strong>${
        it.t
      }</strong> ${it.d}`;
      sbList.appendChild(chip);
    });
  }

  function openSidebar(prov) {
    sbIcon.src = assets.icons[prov.id];
    sbTitle.textContent = prov.id;
    sbSubtitle.textContent = "Budaya & Warisan • " + prov.id;
    renderChips(prov);
    backdrop.classList.add("active");

    // animasi identik seperti sebelumnya
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

  // klik backdrop menutup sidebar (seperti semula)
  backdrop.addEventListener("click", closeSidebar);

  // API publik
  const isOpen = () => backdrop.classList.contains("active");
  return { openSidebar, closeSidebar, isOpen, backdropEl: backdrop };
}
