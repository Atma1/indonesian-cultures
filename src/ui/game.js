// src/ui/game.js
import { PROVINCES } from "../data/provinces.js";

export function initGame() {
  // ===== grab DOM =====
  const gScrim = document.getElementById("gscrim");
  const gModal = document.getElementById("gmodal");
  const gRound = document.getElementById("gRound");
  const gScore = document.getElementById("gScore");
  const gStreak = document.getElementById("gStreak");
  const qText = document.getElementById("qText");
  const qSub = document.getElementById("qSub");
  const answersEl = document.getElementById("answers");
  const gQuit = document.getElementById("gQuit");
  const gNext = document.getElementById("gNext");
  const gProg = document.getElementById("gProg");

  // ===== utils =====
  const shuffle = (arr) => arr.slice().sort(() => Math.random() - 0.5);

  function uniqueCultureBank() {
    const entries = [];
    PROVINCES.forEach((p) =>
      (p.culture || []).forEach((c) => {
        const name = (c?.d || "").trim();
        if (!name) return;
        entries.push({ key: name.toLowerCase(), name, provId: p.id });
      })
    );

    const by = new Map();
    entries.forEach((e) => {
      if (!by.has(e.key)) by.set(e.key, []);
      by.get(e.key).push(e);
    });

    const uniques = [];
    by.forEach((list) => {
      const set = new Set(list.map((x) => x.provId));
      if (set.size === 1) uniques.push({ name: list[0].name, provId: list[0].provId });
    });
    return uniques;
  }

  function makeQuestions() {
    const bank = uniqueCultureBank();
    const total = Math.min(5, bank.length, PROVINCES.length);
    const items = shuffle(bank)
      .slice(0, total)
      .map((item) => {
        const wrongs = shuffle(PROVINCES.filter((p) => p.id !== item.provId))
          .slice(0, 3)
          .map((p) => p.id);
        return {
          question: `Budaya “${item.name}” berasal dari provinsi mana?`,
          correctProv: item.provId,
          options: shuffle([item.provId, ...wrongs]),
        };
      });
    return { total, items };
  }

  // ===== state =====
  let state = {
    round: 0,
    total: 0,
    score: 0,
    streak: 0,
    questions: [],
    current: null,
  };

  // ===== modal helpers =====
  function openModal() {
    gScrim.classList.add("active");
    gModal.classList.add("active");
  }
  function closeModal() {
    gScrim.classList.remove("active");
    gModal.classList.remove("active");
  }

  // ===== screens =====
  function showIntro() {
    // isi intro
    gRound.textContent = "Round 0/0";
    gScore.textContent = "Score: 0";
    gStreak.textContent = "Streak: 0";
    qText.textContent = "Siap bermain?";
    qSub.textContent = "Pilih jawaban yang benar di bawah ini.";
    answersEl.innerHTML = ""; // tidak ada opsi saat intro
    gProg.style.width = "0%";

    // tombol jadi Start
    gNext.textContent = "Start";
    gNext.style.display = "inline-block";
    gNext.onclick = startGame;

    openModal();
  }

  function renderQuestion() {
    const q = state.questions[state.round];
    state.current = q;

    gRound.textContent = `Round ${state.round + 1}/${state.total}`;
    gScore.textContent = `Score: ${state.score}`;
    gStreak.textContent = `Streak: ${state.streak}`;

    qText.textContent = q.question;
    qSub.textContent = "Pilih jawaban yang benar di bawah ini.";
    gNext.style.display = "none";

    answersEl.innerHTML = q.options
      .map(
        (opt, i) =>
          `<button type="button" class="ans" data-value="${opt}">${i + 1}. ${opt}</button>`
      )
      .join("");

    gProg.style.width = `${(state.round / state.total) * 100}%`;
  }

  function showNoData() {
    gRound.textContent = "Round 0/0";
    gScore.textContent = "Score: 0";
    gStreak.textContent = "Streak: 0";
    qText.textContent = "Belum ada cukup data budaya unik 😅";
    qSub.textContent =
      "Tambahkan budaya yang berbeda untuk setiap provinsi (hindari nama budaya yang sama persis di banyak provinsi).";
    answersEl.innerHTML = "";
    gNext.style.display = "none";
    gProg.style.width = "0%";
    openModal();
  }

  // ===== game flow =====
  function startGame() {
    const gen = makeQuestions();
    if (gen.total === 0) return showNoData();

    state = {
      round: 0,
      total: gen.total,
      score: 0,
      streak: 0,
      questions: gen.items,
      current: null,
    };

    // pastikan next berfungsi sebagai nextRound selama game
    gNext.onclick = nextRound;

    renderQuestion();
  }

  function finalizeAnswer(selectedProv) {
    const correct = state.current.correctProv;

    // mark benar/salah
    answersEl.querySelectorAll(".ans").forEach((btn) => {
      const val = btn.dataset.value;
      if (val === correct) btn.classList.add("correct");
      if (val === selectedProv && selectedProv !== correct)
        btn.classList.add("wrong");
      btn.disabled = true;
    });

    if (selectedProv === correct) {
      state.score += 10;
      state.streak += 1;
    } else {
      state.streak = 0;
    }

    gScore.textContent = `Score: ${state.score}`;
    gStreak.textContent = `Streak: ${state.streak}`;

    gNext.textContent = state.round === state.total - 1 ? "Finish" : "Next";
    gNext.style.display = "inline-block";
  }

  function nextRound() {
    if (state.round < state.total - 1) {
      state.round++;
      renderQuestion();
    } else {
      endGame();
    }
  }

  function endGame() {
    gRound.textContent = `Round ${state.total}/${state.total}`;
    qText.textContent = "Game Selesai!";
    qSub.textContent = `Score akhir kamu: ${state.score}`;
    answersEl.innerHTML = "";
    gProg.style.width = "100%";

    gNext.textContent = "Main Lagi";
    gNext.style.display = "inline-block";
    gNext.onclick = startGame; // mulai lagi
  }

  // ===== events =====
  gQuit.onclick = closeModal;

  // tombol Start selalu hidup walau intro nggak dipanggil duluan
  gNext.onclick = startGame;

  // delegation untuk jawaban
  answersEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".ans");
    if (!btn || btn.disabled) return;
    finalizeAnswer(btn.dataset.value);
  });

  // keyboard
  document.addEventListener("keydown", (e) => {
    if (!gModal.classList.contains("active")) return;
    if (e.key === "Escape") return closeModal();

    if (["1", "2", "3", "4"].includes(e.key)) {
      const idx = Number(e.key) - 1;
      const btn = answersEl.children[idx];
      if (btn && !btn.disabled) btn.click();
    }
    if (e.key === "Enter" && gNext.style.display !== "none") {
      gNext.click();
    }
  });

  // expose: bisa panggil intro dari dock
  return { showIntro, startGame };
}
