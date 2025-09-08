// src/ui/subscription.js

/* ===== Helpers ===== */
const $ = (sel, root = document) => root.querySelector(sel);
const currency = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

/* ===== DOM refs ===== */
let sModal, sScrim, sCloseBtn, planGrid, billTabs, toastEl;

/* ===== Data Plan (edit sesuai kebutuhan) ===== */
const PLANS = {
  premium: {
    name: "Premium",
    tagline: "Semua fitur tanpa batas",
    features: [
      "Akses seluruh peta & galeri HD",
      "Mini-game & event premium",
      "Profil & penyimpanan favorit",
      "Mode musik & SFX eksklusif",
      "Prioritas dukungan",
    ],
    priceWeekly: 25000,
    priceMonthly: 75000,
    priceYearly: 75000 * 12 * 0.8, // –20%
    trialDays: 3,
  },
  free: {
    name: "Free",
    tagline: "Coba dulu versi gratis",
    features: [
      "Peta dasar & beberapa ikon",
      "Sidebar dasar",
      "Tanpa event premium",
    ],
  },
};

const PRICE = (period) => {
  switch (period) {
    case "weekly":
      return { suffix: "/minggu", get: (p) => p.priceWeekly };
    case "monthly":
      return { suffix: "/bulan", get: (p) => p.priceMonthly };
    case "yearly":
      return { suffix: "/tahun", get: (p) => p.priceYearly };
    default:
      return { suffix: "/bulan", get: (p) => p.priceMonthly };
  }
};

/* ===== Utils ===== */
function showToast(msg = "Tersimpan") {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toastEl.classList.remove("show"), 1600);
}

function getCurrentPeriod() {
  const active = billTabs?.querySelector("button.seg.active");
  return active?.dataset?.period || "monthly";
}

function renderPlans(period = "monthly") {
  const { suffix, get } = PRICE(period);

  const free = `
    <article class="card plan">
      <div class="plan-head">
        <div class="plan-name">Free</div>
        <div class="plan-tag">${PLANS.free.tagline}</div>
      </div>
      <div class="plan-price"><span>Rp 0</span><small>${suffix}</small></div>
      <ul class="plan-list">${PLANS.free.features
        .map((f) => `<li>• ${f}</li>`)
        .join("")}</ul>
      <div class="plan-cta">
        <button type="button" class="btn" data-action="try-free">Mulai Gratis</button>
      </div>
    </article>
  `;

  const p = PLANS.premium;
  const priceNum = Math.round(get(p));
  const premium = `
    <article class="card plan featured">
      <div class="plan-head">
        <div class="plan-name">Premium</div>
        <div class="plan-tag">${p.tagline}</div>
        ${period === "yearly" ? `<div class="badge">Hemat 20%</div>` : ``}
      </div>
      <div class="plan-price">
        <span>${currency(priceNum)}</span><small>${suffix}</small>
      </div>
      <div class="plan-sub">
        ${
          p.trialDays
            ? `Termasuk uji coba <b>${p.trialDays} hari</b>. Batalkan kapan saja.`
            : ``
        }
      </div>
      <ul class="plan-list">${p.features
        .map((f) => `<li>• ${f}</li>`)
        .join("")}</ul>
      <div class="plan-cta">
        <button type="button" class="btn gold" data-buy="premium" data-period="${period}">
          Beli Premium
        </button>
        <div class="tiny-note">Pembayaran aman • Pajak mengikuti wilayah</div>
      </div>
    </article>
  `;

  planGrid.innerHTML = free + premium;

  // Try Free
  planGrid
    .querySelector('[data-action="try-free"]')
    ?.addEventListener("click", () => {
      closeSubscription();
      showToast("Mode Free diaktifkan");
    });

  // Beli
  planGrid.querySelectorAll("[data-buy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const plan = btn.getAttribute("data-buy");
      const per = btn.getAttribute("data-period");

      try {
        const price =
          plan === "premium" && per === "weekly"
            ? 25000
            : plan === "premium" && per === "monthly"
            ? 75000
            : plan === "premium" && per === "yearly"
            ? 75000 * 12 * 0.8
            : 0;

        const res = await fetch(
          "https://push-indonesia.vercel.app/api/transactions",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              transaction_details: { gross_amount: price },
              item_details: [
                { id: plan, price, quantity: 1, name: `${plan} (${per})` },
              ],
              payment_type: "subscription",
            }),
          }
        );

        const data = await res.json();

        if (data.data?.token) {
          showToast("Membuka pembayaran…");
          try {
            window.snap.pay(data.data.token, {
              onSuccess: (result) => {
                console.log("Success:", result);
                showToast("Pembayaran berhasil!");
              },
              onPending: (result) => {
                console.log("Pending:", result);
                showToast("Pembayaran tertunda…");
              },
              onError: (result) => {
                console.error("Error:", result);
                showToast("Terjadi error pada pembayaran");
              },
              onClose: () => {
                console.warn("User menutup popup");
                showToast("Pembayaran dibatalkan");
              },
            });
          } catch (snapErr) {
            console.error("Snap error:", snapErr);
            showToast("Tidak bisa membuka Snap");
          }
        } else {
          showToast("Gagal membuat transaksi");
          console.error("API response:", data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        showToast("Terjadi error saat menghubungi server");
      }
    });
  });
}

function ensureRendered() {
  if (!planGrid) return;
  if (!planGrid.childElementCount) {
    renderPlans(getCurrentPeriod());
  }
}

/* ===== Public API ===== */
export function openSubscription(defaultPeriod = null) {
  const period = defaultPeriod || getCurrentPeriod();
  renderPlans(period);
  sScrim?.setAttribute("aria-hidden", "false");
  sModal?.setAttribute("aria-hidden", "false");
}

export function closeSubscription() {
  sScrim?.setAttribute("aria-hidden", "true");
  sModal?.setAttribute("aria-hidden", "true");
}

/* ===== Register & Init ===== */
export function registerSubscriptionUI() {
  sModal = $("#smodal");
  sScrim = $("#sscrim");
  sCloseBtn = $("#scloseBtn");
  planGrid = $("#planGrid");
  billTabs = $("#billTabs");
  toastEl = $("#toast");

  if (!sModal || !sScrim || !planGrid) return;

  // Default tab safety (jaga-jaga bila HTML tak set .active)
  if (billTabs && !billTabs.querySelector("button.seg.active")) {
    billTabs
      .querySelector('button[data-period="monthly"]')
      ?.classList.add("active");
  }

  // 1) Pre-render sekali setelah load — FIX setelah refresh isi langsung ada
  renderPlans(getCurrentPeriod());

  // 2) Close handlers
  sCloseBtn?.addEventListener("click", closeSubscription);
  sScrim?.addEventListener("click", closeSubscription);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sModal.getAttribute("aria-hidden") === "false")
      closeSubscription();
  });

  // 3) Segmented billing
  billTabs?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-period]");
    if (!btn) return;
    billTabs.querySelectorAll("button").forEach((b) => {
      const active = b === btn;
      b.classList.toggle("active", active);
      b.setAttribute("aria-selected", String(active));
    });
    renderPlans(btn.dataset.period);
  });

  billTabs?.addEventListener("keydown", (e) => {
    const btns = [...billTabs.querySelectorAll("button[data-period]")];
    const i = btns.findIndex((b) => b.classList.contains("active"));
    if (["ArrowRight", "ArrowLeft"].includes(e.key)) {
      e.preventDefault();
      const next =
        e.key === "ArrowRight"
          ? (i + 1) % btns.length
          : (i - 1 + btns.length) % btns.length;
      btns[next].focus();
      btns[next].click();
    }
  });

  // 4) Delegasi tombol pembuka (support <a href="#">)
  document.addEventListener("click", (e) => {
    const opener = e.target.closest('[data-open="subscribe"]');
    if (!opener) return;
    if (opener.tagName === "A") e.preventDefault();
    ensureRendered();
    openSubscription(getCurrentPeriod());
  });

  // Expose opsional buat debug
  window.openSubscription = openSubscription;
}

// Auto-init bila diimport langsung
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", registerSubscriptionUI);
} else {
  registerSubscriptionUI();
}
