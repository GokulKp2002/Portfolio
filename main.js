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

// Certificate Lightbox Modal Logic
const certCards = document.querySelectorAll('.cert-card');
const certModal = document.getElementById('cert-modal');
const certModalImg = document.getElementById('cert-modal-img');
const certModalTitle = document.getElementById('cert-modal-title');
const certModalClose = document.getElementById('cert-modal-close');
const certModalBackdrop = document.getElementById('cert-modal-backdrop');

function openCertModal(card) {
  const imgSrc = card.getAttribute('data-img');
  const title = card.getAttribute('data-title');
  
  if (imgSrc) {
    certModalImg.src = imgSrc;
    certModalTitle.textContent = title || 'Certificate';
    certModal.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevents background scroll
  }
}

function closeCertModal() {
  certModal.classList.remove('open');
  document.body.style.overflow = ''; // Restore background scroll
  // Delay clearing image to allow close transition to finish
  setTimeout(() => {
    certModalImg.src = '';
    certModalTitle.textContent = '';
  }, 250);
}

certCards.forEach(card => {
  card.addEventListener('click', () => openCertModal(card));
});

certModalClose.addEventListener('click', closeCertModal);
certModalBackdrop.addEventListener('click', closeCertModal);

// Close modal on escape key press
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && certModal.classList.contains('open')) {
    closeCertModal();
  }
});

// ── 3D TILT EFFECT FOR CARDS ──
const tiltCards = document.querySelectorAll('.timeline-item, .project-card, .edu-card, .cert-card');

tiltCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    // Calculate tilt angle (max 10 degrees rotation)
    const angleX = (yc - y) / yc * 10; 
    const angleY = (x - xc) / xc * 10;
    
    card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  });
});


