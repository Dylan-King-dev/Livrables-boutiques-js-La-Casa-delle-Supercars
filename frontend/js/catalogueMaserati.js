const filterToggle = document.getElementById("filterToggle");
const filterPanel = document.getElementById("filterPanel");
const filterOptions = Array.from(document.querySelectorAll(".filter-option"));
const cards = Array.from(document.querySelectorAll(".card[data-category]"));

// Apply the selected filter to cards and update UI state.
const setFilter = (value, label) => {
  filterOptions.forEach((btn) => btn.classList.toggle("active", btn.dataset.filter === value));
  cards.forEach((card) => {
    const match = value === "all" || card.dataset.category === value;
    card.classList.toggle("is-hidden", !match);
  });
  filterToggle.textContent = label || value;
  filterToggle.setAttribute("aria-expanded", "false");
  filterPanel.classList.remove("open");
  filterPanel.setAttribute("aria-hidden", "true");
};

// Toggle the filter dropdown panel.
filterToggle.addEventListener("click", () => {
  const isOpen = filterPanel.classList.toggle("open");
  filterToggle.setAttribute("aria-expanded", String(isOpen));
  filterPanel.setAttribute("aria-hidden", String(!isOpen));
});

filterOptions.forEach((btn) => {
  // Apply the clicked filter option.
  btn.addEventListener("click", () => {
    const value = btn.dataset.filter;
    setFilter(value, btn.textContent.trim());
  });
});

// Close the panel when clicking outside of it.
document.addEventListener("click", (event) => {
  if (!filterPanel.contains(event.target) && event.target !== filterToggle) {
    filterPanel.classList.remove("open");
    filterToggle.setAttribute("aria-expanded", "false");
    filterPanel.setAttribute("aria-hidden", "true");
  }
});
