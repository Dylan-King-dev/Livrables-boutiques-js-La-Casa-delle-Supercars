const header = document.querySelector("header");
const menuBtn = document.getElementById("menuBtn");
const overlay = document.getElementById("overlay");
const menuPanel = document.getElementById("menuPanel");
const backdrop = document.getElementById("backdrop");
const heroLeft = document.querySelector(".hero-left");
const heroRight = document.querySelector(".hero-right");
const menuItemsList = document.getElementById("menuItems");
const menuSubheader = document.getElementById("menuSubheader");
const menuSubImg = document.getElementById("menuSubImg");
const menuBack = document.getElementById("menuBack");

const bars = menuBtn ? menuBtn.querySelectorAll(".bar") : [];

// Hover sound setup (replace paths with your actual files)
const hoverSoundLeft = new Audio("../assets/img/maserati/Son_GT2.mp3");
const hoverSoundRight = new Audio("../assets/img/porsche/Son_911_GT3.mp3");

// Many browsers require a user gesture before audio can play
let audioUnlocked = false;
// Unlock audio playback after the first user gesture.
function unlockAudioOnce() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  // Prime the audio elements silently
  // Prime each hover sound instance.
  [hoverSoundLeft, hoverSoundRight].forEach((a) => {
    a.volume = 0.5;
    a.muted = true;
    a.play().catch(() => {});
    a.pause();
    a.currentTime = 0;
    a.muted = false;
  });
  window.removeEventListener("click", unlockAudioOnce);
  window.removeEventListener("keydown", unlockAudioOnce);
}
// Unlock audio on first click.
window.addEventListener("click", unlockAudioOnce);
// Unlock audio on first key press.
window.addEventListener("keydown", unlockAudioOnce);

// Toggle header styling after a scroll threshold.
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Open the slide-in menu.
function openMenu() {
  overlay.classList.add("open"); // makes overlay clickable
  menuPanel.classList.add("open"); // slides the panel in
  backdrop.classList.add("open"); // fades the dark backdrop in
  menuBtn.classList.add("is-open");
  // Turn burger bars into an X.
  bars.forEach((bar) => bar.classList.add("x"));
}

// Close the slide-in menu and reset submenu state.
function closeMenu() {
  resetMenu();
  menuPanel.classList.remove("open"); // slides panel back out
  backdrop.classList.remove("open"); // fades backdrop out
  menuBtn.classList.remove("is-open");
  // Restore burger bars from the X state.
  bars.forEach((bar) => bar.classList.remove("x"));

  // Wait for the close animation before hiding overlay.
  setTimeout(() => {
    overlay.classList.remove("open");
  }, 550);
}

// Toggle between open and closed menu states.
function toggleMenu() {
  if (menuPanel.classList.contains("open")) {
    closeMenu();
  } else {
    openMenu();
  }
}

// Toggle the menu when the burger is clicked.
if (menuBtn) menuBtn.addEventListener("click", toggleMenu);
// Close the menu when clicking the backdrop.
if (backdrop) backdrop.addEventListener("click", closeMenu);

const submenuItems = [
  "TOUT VOIR",
  "SPORT",
  "SUPER SPORT",
  "SUV",
  "ELECTRIQUE",
  "CLASSIQUE",
];

const defaultMenuHtml = menuItemsList ? menuItemsList.innerHTML : "";
let isTransitioningMenu = false;

// Open the submenu view with an optional image preview.
function openSubmenu(imageSrc) {
  if (!menuItemsList || !menuPanel) return;
  if (isTransitioningMenu) return;
  isTransitioningMenu = true;
  menuPanel.classList.add("submenu-transition");
  if (menuSubImg) menuSubImg.src = imageSrc || "";
  // Finish submenu transition after the animation delay.
  setTimeout(() => {
    menuPanel.classList.add("submenu-open");
    menuItemsList.classList.remove("main-menu");
    // Build the submenu list HTML.
    menuItemsList.innerHTML = submenuItems
      .map((item) => `<li class="menu-item">${item}</li>`)
      .join("");
    menuPanel.classList.remove("submenu-transition");
    isTransitioningMenu = false;
  }, 900);
}

// Restore the main menu list and clear submenu state.
function resetMenu() {
  if (!menuItemsList || !menuPanel) return;
  if (isTransitioningMenu) return;
  isTransitioningMenu = true;
  menuPanel.classList.remove("submenu-open");
  if (menuSubImg) menuSubImg.src = "";
  menuItemsList.innerHTML = defaultMenuHtml;
  menuItemsList.classList.add("main-menu");
  isTransitioningMenu = false;
}

if (menuItemsList) {
  // Open submenu when clicking a menu item with a submenu.
  menuItemsList.addEventListener("click", (e) => {
    const trigger = e.target.closest(".menu-item--has-submenu");
    if (!trigger) return;
    e.preventDefault();
    openSubmenu(trigger.dataset.image);
  });
}

if (menuBack) {
  // Go back from submenu to the main menu.
  menuBack.addEventListener("click", (e) => {
    e.preventDefault();
    resetMenu();
  });
}

// Play a hover sound if audio is unlocked.
function playHoverSound(audio) {
  if (!audioUnlocked) return;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

// Stop and reset a hover sound.
function stopHoverSound(audio) {
  audio.pause();
  audio.currentTime = 0;
}

if (heroLeft) {
  // Play sound when hovering the left hero section.
  heroLeft.addEventListener("mouseenter", () => playHoverSound(hoverSoundLeft));
  // Stop sound when leaving the left hero section.
  heroLeft.addEventListener("mouseleave", () => stopHoverSound(hoverSoundLeft));
}
if (heroRight) {
  // Play sound when hovering the right hero section.
  heroRight.addEventListener("mouseenter", () => playHoverSound(hoverSoundRight));
  // Stop sound when leaving the right hero section.
  heroRight.addEventListener("mouseleave", () => stopHoverSound(hoverSoundRight));
}
