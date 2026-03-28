const header = document.querySelector('header');
const menuBtn = document.getElementById('menuBtn');
const overlay = document.getElementById('overlay');
const menuPanel = document.getElementById('menuPanel');
const backdrop  = document.getElementById('backdrop');
const heroLeft = document.querySelector('.hero-left');
const heroRight = document.querySelector('.hero-right');
const menuItemsList = document.getElementById('menuItems');
const menuSubheader = document.getElementById('menuSubheader');
const menuSubImg = document.getElementById('menuSubImg');
const menuBack = document.getElementById('menuBack');

const bars = menuBtn ? menuBtn.querySelectorAll('.bar') : [];

// Hover sound setup (replace paths with your actual files)
const hoverSoundLeft = new Audio('../assets/img/maserati/Son_GT2.mp3');
const hoverSoundRight = new Audio('../assets/img/porsche/Son_911_GT3.mp3');

// Many browsers require a user gesture before audio can play
let audioUnlocked = false;
function unlockAudioOnce() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  // Prime the audio elements silently
  [hoverSoundLeft, hoverSoundRight].forEach((a) => {
    a.volume = 0.5;
    a.muted = true;
    a.play().catch(() => {});
    a.pause();
    a.currentTime = 0;
    a.muted = false;
  });
  window.removeEventListener('click', unlockAudioOnce);
  window.removeEventListener('keydown', unlockAudioOnce);
}
window.addEventListener('click', unlockAudioOnce);
window.addEventListener('keydown', unlockAudioOnce);

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

function openMenu() {
  overlay.classList.add('open');     // makes overlay clickable
  menuPanel.classList.add('open');   // slides the panel in
  backdrop.classList.add('open');    // fades the dark backdrop in
  menuBtn.classList.add('is-open');
  bars.forEach((bar) => bar.classList.add('x'));
}
 
function closeMenu() {
  resetMenu();
  menuPanel.classList.remove('open');   // slides panel back out
  backdrop.classList.remove('open');    // fades backdrop out
  menuBtn.classList.remove('is-open');
  bars.forEach((bar) => bar.classList.remove('x'));
 
  setTimeout(() => {
    overlay.classList.remove('open');
  }, 550);
}

function toggleMenu() {
  if (menuPanel.classList.contains('open')) {
    closeMenu();
  } else {
    openMenu();
  }
}

if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
if (backdrop) backdrop.addEventListener('click', closeMenu);

const submenuItems = [
  'TOUT VOIR',
  'SPORT',
  'SUPER SPORT',
  'SUV',
  'ELECTRIQUE',
  'CLASSIQUE',
];

const defaultMenuHtml = menuItemsList ? menuItemsList.innerHTML : '';
let isTransitioningMenu = false;

function openSubmenu(imageSrc) {
  if (!menuItemsList || !menuPanel) return;
  if (isTransitioningMenu) return;
  isTransitioningMenu = true;
  menuPanel.classList.add('submenu-transition');
  if (menuSubImg) menuSubImg.src = imageSrc || '';
  setTimeout(() => {
    menuPanel.classList.add('submenu-open');
    menuItemsList.classList.remove('main-menu');
    menuItemsList.innerHTML = submenuItems.map((item) => `<li class="menu-item">${item}</li>`).join('');
    menuPanel.classList.remove('submenu-transition');
    isTransitioningMenu = false;
  }, 900);
}

function resetMenu() {
  if (!menuItemsList || !menuPanel) return;
  if (isTransitioningMenu) return;
  isTransitioningMenu = true;
  menuPanel.classList.remove('submenu-open');
  if (menuSubImg) menuSubImg.src = '';
  menuItemsList.innerHTML = defaultMenuHtml;
  menuItemsList.classList.add('main-menu');
  isTransitioningMenu = false;
}

if (menuItemsList) {
  menuItemsList.addEventListener('click', (e) => {
    const trigger = e.target.closest('.menu-item--has-submenu');
    if (!trigger) return;
    e.preventDefault();
    openSubmenu(trigger.dataset.image);
  });
}

if (menuBack) {
  menuBack.addEventListener('click', (e) => {
    e.preventDefault();
    resetMenu();
  });
}

function playHoverSound(audio) {
  if (!audioUnlocked) return;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function stopHoverSound(audio) {
  audio.pause();
  audio.currentTime = 0;
}

 
 
if (heroLeft) {
  heroLeft.addEventListener('mouseenter', () => playHoverSound(hoverSoundLeft));
  heroLeft.addEventListener('mouseleave', () => stopHoverSound(hoverSoundLeft));
}
if (heroRight) {
  heroRight.addEventListener('mouseenter', () => playHoverSound(hoverSoundRight));
  heroRight.addEventListener('mouseleave', () => stopHoverSound(hoverSoundRight));
}
