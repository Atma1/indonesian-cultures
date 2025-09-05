// src/audio/index.js
export function createAudio(sounds, opts = {}) {
  const hoverVol = opts.hoverVol ?? 0.5;
  const clickVol = opts.clickVol ?? 0.6;
  const bgVol = opts.bgVol ?? 0.45;
  const hoverThrottleMs = opts.hoverThrottleMs ?? 150;

  const audio = {
    hover: new Audio(sounds.hoverSfx),
    click: new Audio(sounds.clickSfx),
    bg: new Audio(sounds.bgMusic),
  };

  // default setup persis seperti sebelumnya
  audio.hover.preload = "auto";
  audio.hover.volume = hoverVol;

  audio.click.preload = "auto";
  audio.click.volume = clickVol;

  audio.bg.preload = "auto";
  audio.bg.loop = true;
  audio.bg.volume = bgVol;

  const state = {
    userInteracted: false,
    lastHoverAt: 0,
    uiBound: false,
    button: null,
    hotkey: "m",
  };

  const setBtn = (on) => {
    if (!state.button) return;
    state.button.textContent = on ? "🎵 BG Music: ON" : "🎵 BG Music: OFF";
  };

  async function startBgIfAllowed() {
    try {
      await audio.bg.play();
      setBtn(true);
      return true;
    } catch {
      // autoplay bisa ditolak oleh browser
      setBtn(false);
      return false;
    }
  }

  function pauseBg() {
    audio.bg.pause();
    setBtn(false);
  }

  function toggleBg() {
    if (audio.bg.paused) return startBgIfAllowed();
    pauseBg();
    return false;
  }

  function bindUI({ button, hotkey = "m" } = {}) {
    if (state.uiBound) return; // cegah double-binding
    state.uiBound = true;

    state.button = button || null;
    state.hotkey = (hotkey || "m").toLowerCase();

    // Set label awal (OFF by default)
    setBtn(false);

    // Click pada tombol
    if (state.button) {
      state.button.addEventListener("click", async () => {
        await toggleBg();
      });
    }

    // Hotkey (M)
    window.addEventListener("keydown", async (e) => {
      if ((e.key || "").toLowerCase() === state.hotkey) {
        await toggleBg();
      }
    });
  }

  function setUserInteracted(v = true) {
    state.userInteracted = !!v;
  }

  function playHoverSfx() {
    if (!state.userInteracted) return;
    const now = performance.now();
    if (now - state.lastHoverAt < hoverThrottleMs) return;
    state.lastHoverAt = now;
    try {
      audio.hover.currentTime = 0;
      audio.hover.play();
    } catch {}
  }

  function playClickSfx() {
    try {
      audio.click.currentTime = 0;
      audio.click.play();
    } catch {}
  }

  return {
    // raw elements kalau perlu
    hover: audio.hover,
    click: audio.click,
    bg: audio.bg,

    // state & helpers
    get userInteracted() {
      return state.userInteracted;
    },
    setUserInteracted,

    // controls
    startBgIfAllowed,
    pauseBg,
    toggleBg,
    bindUI,

    // sfx
    playHoverSfx,
    playClickSfx,
  };
}
