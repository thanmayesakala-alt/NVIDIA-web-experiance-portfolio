/**
 * ==========================================================================
 * FUTURISTIC PORTFOLIO DYNAMIC SYSTEM LOGIC
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initializeMobileMenu();
  initializeNavbarScroll();
  initializeScrollSpy();
  initializeScrollReveal();
  initializeParticleBackground();
  initializeContactForm();
  initializeBackToTop();
});

/**
 * 1. Mobile Menu Toggler
 */
function initializeMobileMenu() {
  const hamburger = document.getElementById('hamburger-menu');
  const navLinks = document.getElementById('nav-links-container');
  const links = navLinks.querySelectorAll('a');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when clicking link
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * 2. Sticky Navbar Visual State
 */
function initializeNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Trigger initial call
}

/**
 * 3. Scroll Spy (Active link indicator)
 */
function initializeScrollSpy() {
  const sections = document.querySelectorAll('header[id], section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Trigger active when section occupies middle area
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        navItems.forEach(item => {
          const link = item.querySelector('a');
          if (link && link.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => observer.observe(section));
}

/**
 * 4. Scroll Reveal Animations (Intersection Observer)
 */
function initializeScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.15
  };

  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Animates once
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  revealElements.forEach(el => observer.observe(el));
}

/**
 * 5. High-Performance Canvas Particles
 */
function initializeParticleBackground() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let particles = [];

  // Interactivity tracking
  const mouse = {
    x: null,
    y: null,
    radius: 120
  };

  // Neon Palette
  const colors = [
    'rgba(188, 57, 250, 0.45)', // Neon Purple
    'rgba(0, 240, 255, 0.45)',   // Neon Cyan
    'rgba(59, 130, 246, 0.3)'    // Subtle Accent Blue
  ];

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 2 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 15) + 12;
      this.speedX = (Math.random() * 0.4) - 0.2;
      this.speedY = (Math.random() * 0.4) - 0.2;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      // Basic continuous drift
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around bounds
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;

      // Mouse interactive push/pull force
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.hypot(dx, dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const directionX = forceDirectionX * force * this.density * 0.15;
          const directionY = forceDirectionY * force * this.density * 0.15;

          this.x -= directionX;
          this.y -= directionY;
        }
      }
    }
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles() {
    particles = [];
    // Number of particles relative to viewport screen density
    const numberOfParticles = Math.min((canvas.width * canvas.height) / 10000, 110);

    for (let i = 0; i < numberOfParticles; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particles.push(new Particle(x, y));
    }
  }

  function connectParticles() {
    const maxDistance = 110;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let distance = Math.hypot(dx, dy);

        if (distance < maxDistance) {
          // Fade opacity based on proximity
          const opacity = (1 - (distance / maxDistance)) * 0.12;
          ctx.strokeStyle = `rgba(188, 57, 250, ${opacity})`;
          ctx.lineWidth = 0.55;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    connectParticles();
    animationFrameId = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resizeCanvas);

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Start engine
  resizeCanvas();
  animate();
}

/**
 * 6. Contact Form Transmission Logic (Signal Emulation)
 */
function initializeContactForm() {
  const form = document.getElementById('contact-form-element');
  const statusDiv = document.getElementById('contact-form-status');
  const submitBtn = document.getElementById('form-submit-btn');

  if (!form || !statusDiv || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();

    // Basic regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showStatus('Error: Invalid email format detected. Check network node settings.', 'error');
      return;
    }

    // Submit animation block
    setFormState(true);
    showStatus('TRANSMITTING PACKETS...', '');
    statusDiv.style.display = 'block';
    statusDiv.className = 'form-status';

    setTimeout(() => {
      // Mock API call resolves
      showStatus(`SIGNAL STABLE. Message received from node "${name}". Connection secured.`, 'success');
      form.reset();
      setFormState(false);
    }, 1500);
  });

  function showStatus(text, type) {
    statusDiv.textContent = text;
    statusDiv.className = 'form-status';
    if (type) statusDiv.classList.add(type);
  }

  function setFormState(isSubmitting) {
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => input.disabled = isSubmitting);
    submitBtn.disabled = isSubmitting;

    if (isSubmitting) {
      submitBtn.querySelector('span').textContent = 'TRANSMITTING...';
      submitBtn.querySelector('i').className = 'fa-solid fa-spinner fa-spin';
    } else {
      submitBtn.querySelector('span').textContent = 'Transmit Signal';
      submitBtn.querySelector('i').className = 'fa-solid fa-paper-plane';
    }
  }
}

/**
 * 7. Back To Top Mechanics
 */
function initializeBackToTop() {
  const backToTopBtn = document.getElementById('scroll-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.style.display = 'flex';
      backToTopBtn.style.animation = 'fadeIn 0.3s forwards';
    } else {
      backToTopBtn.style.display = 'none';
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
