/* ── SUBTLE TINY DOT ANIMATION ── */
(function () {
  const canvas = document.getElementById('dot-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H, dots = [], scrollY = 0;

  const COUNT  = 120;
  const COLOR  = '37,99,235';

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeDot() {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r:  0.8 + Math.random() * 0.9,
      a:  0.08 + Math.random() * 0.18,
    };
  }

  function init() { resize(); dots = Array.from({ length: COUNT }, makeDot); }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const shift = scrollY * 0.02;

    dots.forEach(d => {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0) d.x = W;
      if (d.x > W) d.x = 0;
      if (d.y < 0) d.y = H;
      if (d.y > H) d.y = 0;

      const py = (d.y - shift % H + H) % H;
      ctx.beginPath();
      ctx.arc(d.x, py, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${COLOR},${d.a})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); dots = Array.from({ length: COUNT }, makeDot); }, { passive: true });
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });
  init(); draw();
})();
/* ── END ── */

// Scroll-based section animation
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

sections.forEach(s => observer.observe(s));

// Active nav link on scroll
const sectionIds = ['about', 'experience', 'projects', 'education', 'certificates', 'contact'];

function setActiveNav() {
  let current = sectionIds[0];
  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= 120) current = id;
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav();

// Smooth scroll on nav click
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Close mobile sidebar
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  });
});

// Mobile sidebar toggle
const menuBtn = document.getElementById('mobile-menu-btn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');

menuBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
});

overlay.addEventListener('click', () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('open');
});
