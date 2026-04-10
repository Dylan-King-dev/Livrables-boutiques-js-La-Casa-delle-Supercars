const totalEl = document.getElementById("payTotal");
const countEl = document.getElementById("payCount");

if (countEl) {
  countEl.textContent = localStorage.getItem("lacasa_order_count") || "0";
}

if (totalEl) {
  totalEl.textContent = localStorage.getItem("lacasa_order_total") || "Sur devis";
}
