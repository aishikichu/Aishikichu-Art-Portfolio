// ===================================
// AISHIKICHU ART PORTFOLIO — script.js
// ===================================

// ─── LOADER ───────────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  // Short delay so logo is visible for a moment
  setTimeout(() => loader.classList.add('hidden'), 900);
});

// ─── THEME TOGGLE ─────────────────────────────────────────────────────────────
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');

// Declare early to avoid Temporal Dead Zone issues
let starColor, lineColor;

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('aishi-theme', theme);
  updateConstellationColors(theme);
}

// Initialise from localStorage, then system preference
const savedTheme = localStorage.getItem('aishi-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

// ─── CONSTELLATION CANVAS ─────────────────────────────────────────────────────
const canvas = document.getElementById('constellation');
const ctx    = canvas.getContext('2d');

let W, H, stars = [], mouse = { x: -1000, y: -1000 };
const STAR_COUNT   = 110;
const LINK_DIST    = 135;
const PARALLAX     = 0.018;  // how much stars drift toward cursor

function updateConstellationColors(theme) {
  if (theme === 'dark') {
    starColor = 'rgba(210,195,255,';
    lineColor = 'rgba(167,139,250,';
  } else {
    starColor = 'rgba(90,65,150,';
    lineColor = 'rgba(100,70,180,';
  }
}
// default on load (applyTheme calls this too)
updateConstellationColors(html.getAttribute('data-theme') || 'dark');

class Star {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.ox = this.x;                    // origin
    this.oy = this.y;
    this.vx = (Math.random() - 0.5) * 0.18;
    this.vy = (Math.random() - 0.5) * 0.18;
    this.r  = 0.8 + Math.random() * 1.6;
    this.a  = 0.35 + Math.random() * 0.55;
  }
  update() {
    // Drift
    this.x += this.vx;
    this.y += this.vy;
    // Soft parallax toward cursor
    this.x += (mouse.x - W / 2) * PARALLAX * 0.01;
    this.y += (mouse.y - H / 2) * PARALLAX * 0.01;
    // Wrap edges
    if (this.x < -10) this.x = W + 10;
    if (this.x > W + 10) this.x = -10;
    if (this.y < -10) this.y = H + 10;
    if (this.y > H + 10) this.y = -10;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = starColor + this.a + ')';
    ctx.fill();
  }
}

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function initStars() {
  stars = [];
  for (let i = 0; i < STAR_COUNT; i++) stars.push(new Star());
}

function drawLines() {
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx   = stars[i].x - stars[j].x;
      const dy   = stars[i].y - stars[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < LINK_DIST) {
        const alpha = (1 - dist / LINK_DIST) * 0.45;
        ctx.beginPath();
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(stars[j].x, stars[j].y);
        ctx.strokeStyle = lineColor + alpha + ')';
        ctx.lineWidth   = 0.6;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  drawLines();
  stars.forEach(s => { s.update(); s.draw(); });
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => { resize(); initStars(); });
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

resize();
initStars();
animate();

// ─── NAVBAR SCROLL + ACTIVE LINK ──────────────────────────────────────────────
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 130) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

// ─── MOBILE MENU ──────────────────────────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ─── LIGHTBOX ─────────────────────────────────────────────────────────────────
const galleryImages = [
  { src: 'Images/0Manntaaaa.png',        alt: 'Commission artwork' },
  { src: 'Images/1 tamako.png',          alt: 'Tamako commission' },
  { src: 'Images/aisheeekeee.png',       alt: 'Fox character artwork' },
  { src: 'Images/chrissbrown.png',       alt: 'Commission artwork' },
  { src: 'Images/codehhhhhhh.png',       alt: 'Sketch artwork' },
  { src: 'Images/filipino boys.png',     alt: 'Group commission' },
  { src: 'Images/manntatatata.png',      alt: 'Commission artwork' },
  { src: 'Images/manta feet.png',        alt: 'Commission artwork' },
  { src: 'Images/manta kek.png',         alt: 'Commission artwork' },
  { src: 'Images/manta kik.png',         alt: 'Commission artwork' },
  { src: 'Images/mantatatatatata.png',   alt: 'Commission artwork' },
  { src: 'Images/poookiee14324.png',     alt: 'Commission artwork' },
  { src: 'Images/TAAMA,MAAMAMA.png',     alt: 'Commission artwork' },
  { src: 'Images/iconiii.jpg',           alt: 'Character artwork' },
  { src: 'Images/mantadsajdhsadhasdhs.png', alt: 'Commission artwork' },
];

let currentIndex   = 0;
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightboxImg');
const lightboxCtr  = document.getElementById('lightboxCounter');

function openLightbox(index) {
  currentIndex = index;
  updateLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
function updateLightbox() {
  const item    = galleryImages[currentIndex];
  lightboxImg.src = item.src;
  lightboxImg.alt = item.alt;
  lightboxCtr.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
}

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  updateLightbox();
});
document.getElementById('lightboxNext').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % galleryImages.length;
  updateLightbox();
});
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  { currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length; updateLightbox(); }
  if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % galleryImages.length; updateLightbox(); }
});

// ─── GALLERY ITEM CLICK ───────────────────────────────────────────────────────
document.querySelectorAll('.gallery-item').forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
const revealEls = document.querySelectorAll(
  '.gallery-item, .price-card, .rules-card, .contact-card, .about-grid, .commsheet-wrap'
);
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), 55 * i);
    }
  });
}, { threshold: 0.07 });

revealEls.forEach(el => revealObserver.observe(el));
