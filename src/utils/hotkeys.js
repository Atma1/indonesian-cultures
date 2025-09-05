// src/utils/hotkeys.js
// Registrasi hotkeys global tanpa mengubah perilaku eksisting.
// Saat Escape ditekan dan tidak ada modal yang aktif -> tutup sidebar.

export function registerGlobalHotkeys({ anyModalOpen, onEscapeNoModal }) {
  function onKeyDown(e) {
    if (e.key === "Escape") {
      // jika ada modal aktif, biarkan modul modal yang handle
      if (typeof anyModalOpen === "function" && anyModalOpen()) return;
      if (typeof onEscapeNoModal === "function") {
        onEscapeNoModal();
      }
    }
  }

  window.addEventListener("keydown", onKeyDown);

  // kembalikan fungsi untuk unbind bila sewaktu-waktu perlu cleanup
  return function unregister() {
    window.removeEventListener("keydown", onKeyDown);
  };
}
