// ===== Dark / Light Mode Toggle =====
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check saved preference or system preference
const savedTheme = localStorage.getItem('webmcp-theme');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
  html.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
} else if (systemDark) {
  html.setAttribute('data-theme', 'dark');
  themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('webmcp-theme', next);
  themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
});

// ===== Mobile Menu =====
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.getElementById('navLinks');

mobileMenu.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = mobileMenu.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
  }
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = mobileMenu.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
  });
});

// ===== Scroll Animations (Intersection Observer) =====
const animateElements = document.querySelectorAll('.animate-on-scroll');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
});

animateElements.forEach(el => observer.observe(el));

// ===== FAQ Accordion =====
function toggleFaq(button) {
  const item = button.closest('.faq-item');
  const isOpen = item.classList.contains('open');

  // Close all FAQs
  document.querySelectorAll('.faq-item').forEach(faq => {
    faq.classList.remove('open');
  });

  // Toggle the clicked one
  if (!isOpen) {
    item.classList.add('open');
  }
}

// ===== Copy Endpoint =====
function copyEndpoint() {
  const url = 'https://api.webmcp.com/v1/mcp';
  const btn = document.getElementById('copyEndpoint');

  navigator.clipboard.writeText(url).then(() => {
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 2000);
  }).catch(() => {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = url;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 2000);
  });
}

// ===== Nav Scroll Effect =====
let lastScrollY = 0;
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > 100) {
    nav.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
  } else {
    nav.style.boxShadow = 'none';
  }
  lastScrollY = scrollY;
}, { passive: true });

// ===== Animated Counters =====
function animateCounter(element, target, duration) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);
    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Observe stat numbers
const statNumbers = document.querySelectorAll('.hero-stats .stat-number');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.textContent, 10);
      if (!isNaN(target)) {
        animateCounter(el, target, 1500);
      }
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => statsObserver.observe(el));

// ===== Smooth anchor scroll offset (compensate for fixed nav) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      const navHeight = document.querySelector('.nav').offsetHeight;
      const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});
