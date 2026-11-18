// North Star Bakery - Touchstone 4
// Favorites and contact form are demonstrations; no message is sent.
const treats = [
  { id: "breads", label: "Breads" },
  { id: "pastries", label: "Pastries" },
  { id: "cakes", label: "Cakes & Celebrations" }
];
const storageKeys = { favorites: "northStarFavorites", name: "northStarVisitorName" };

function readFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKeys.favorites) || "[]");
    return Array.isArray(stored) ? stored.filter(id => treats.some(t => t.id === id)) : [];
  } catch { return []; }
}
function renderFavorites(favorites) {
  const area = document.getElementById("favorite-options");
  const summary = document.getElementById("favorites-summary");
  area.innerHTML = "";
  treats.forEach(treat => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "favorite-button";
    button.textContent = treat.label;
    button.setAttribute("aria-pressed", String(favorites.includes(treat.id)));
    button.addEventListener("click", () => toggleFavorite(treat.id));
    area.appendChild(button);
  });
  const selected = treats.filter(treat => favorites.includes(treat.id)).map(treat => treat.label);
  summary.textContent = selected.length ? "Saved favorites: " + selected.join(", ") : "No favorites selected yet.";
}
function toggleFavorite(id) {
  const favorites = readFavorites();
  const updated = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
  localStorage.setItem(storageKeys.favorites, JSON.stringify(updated));
  renderFavorites(updated);
}
function setupFavorites() {
  if (!document.getElementById("favorite-options")) return;
  renderFavorites(readFavorites());
  document.getElementById("clear-favorites").addEventListener("click", () => {
    localStorage.removeItem(storageKeys.favorites);
    renderFavorites([]);
  });
}
function showError(field, message) {
  document.getElementById(field.id + "-error").textContent = message;
  field.setAttribute("aria-invalid", String(Boolean(message)));
}
function validateContact(form) {
  const fields = { name: form.elements.name, email: form.elements.email, message: form.elements.message };
  const checks = [
    { field: fields.name, error: fields.name.value.trim().length < 2 ? "Please enter at least 2 characters for your name." : "" },
    { field: fields.email, error: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim()) ? "" : "Please enter a valid email address." },
    { field: fields.message, error: fields.message.value.trim().length < 10 ? "Please write a message of at least 10 characters." : "" }
  ];
  checks.forEach(check => showError(check.field, check.error));
  const invalid = checks.find(check => check.error);
  if (invalid) invalid.field.focus();
  return !invalid;
}
function setupContact() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const name = form.elements.name;
  name.value = localStorage.getItem(storageKeys.name) || "";
  name.addEventListener("input", () => {
    localStorage.setItem(storageKeys.name, name.value);
    showError(name, "");
  });
  [form.elements.email, form.elements.message].forEach(field => field.addEventListener("input", () => showError(field, "")));
  form.addEventListener("submit", event => {
    event.preventDefault();
    const valid = validateContact(form);
    document.getElementById("form-status").textContent = valid
      ? "Your information looks good! This is a demo, so no message was sent."
      : "Please correct the highlighted fields above.";
  });
}
document.addEventListener("DOMContentLoaded", () => { setupFavorites(); setupContact(); });
