window.addEventListener('load', () => {
  const isPro = document.body.classList.contains('pro-mode') || document.documentElement.classList.contains('pro-mode');
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('done');
      document.body.classList.add('loaded');
    }
  }, isPro ? 0 : 1500);
});

document.addEventListener('DOMContentLoaded', () => {
  
  const smoothWrapper = document.getElementById('smooth-wrapper');
  const smoothContent = document.getElementById('smooth-content');
  if (smoothWrapper && smoothContent && window.innerWidth > 1024) {
    let currentScroll = 0;
    let targetScroll = 0;
    let ease = 0.08;
    
    function updateScrollHeight() {
      if (document.body.classList.contains('pro-mode')) {
        document.body.style.height = 'auto';
        return;
      }
      if (window.innerWidth > 1024) {
        document.body.style.height = `${smoothContent.getBoundingClientRect().height}px`;
      } else {
        document.body.style.height = 'auto';
      }
    }
    
    updateScrollHeight();
    window.addEventListener('resize', updateScrollHeight);
    const resizeObserver = new ResizeObserver(updateScrollHeight);
    resizeObserver.observe(smoothContent);
    
    function physicsScroll() {
      if (document.body.classList.contains('pro-mode')) {
        smoothContent.style.transform = 'none';
        currentScroll = targetScroll = window.scrollY;
        requestAnimationFrame(physicsScroll);
        return;
      }
      targetScroll = window.scrollY;
      currentScroll += (targetScroll - currentScroll) * ease;
      if (Math.abs(targetScroll - currentScroll) < 0.1) currentScroll = targetScroll;
      
      smoothContent.style.transform = `translate3d(0, ${-currentScroll}px, 0)`;
      requestAnimationFrame(physicsScroll);
    }
    physicsScroll();
  }

  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, stars;
    const numStars = window.innerWidth < 768 ? 400 : 800;
    const fov = 300;
    let mouseX = 0, mouseY = 0;

    function initCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      stars = [];
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: (Math.random() - 0.5) * 2000,
          y: (Math.random() - 0.5) * 2000,
          z: Math.random() * 2000,
          color: Math.random() > 0.8 ? (Math.random() > 0.5 ? '#00FFFF' : '#FF00FF') : '#ffffff'
        });
      }
    }
    initCanvas();
    window.addEventListener('resize', initCanvas);
    
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX - width / 2) * 0.05;
      mouseY = (e.clientY - height / 2) * 0.05;
    });

    function animateGalaxy() {
      if (document.body.classList.contains('pro-mode')) {
        ctx.clearRect(0, 0, width, height);
        requestAnimationFrame(animateGalaxy);
        return;
      }
      ctx.clearRect(0, 0, width, height);
      const centerX = width / 2 + mouseX;
      const centerY = height / 2 + mouseY;

      for (let i = 0; i < stars.length; i++) {
        let star = stars[i];
        star.z -= 2.5;

        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * 2000;
          star.y = (Math.random() - 0.5) * 2000;
          star.z = 2000;
        }

        const px = (star.x / star.z) * fov + centerX;
        const py = (star.y / star.z) * fov + centerY;
        const size = (1 - star.z / 2000) * 2.5;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.1, size), 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.fill();
        }
      }
      requestAnimationFrame(animateGalaxy);
    }
    animateGalaxy();
  }

  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
      setTimeout(() => {
        cursorRing.style.left = `${e.clientX}px`;
        cursorRing.style.top = `${e.clientY}px`;
      }, 50);
    });

    const interactables = document.querySelectorAll('a, button');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hovering');
        cursorRing.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hovering');
        cursorRing.classList.remove('hovering');
      });
    });

    const viewables = document.querySelectorAll('.project-showcase');
    viewables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorRing.classList.add('view-mode');
        cursorDot.classList.add('view-mode');
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.classList.remove('view-mode');
        cursorDot.classList.remove('view-mode');
      });
    });
  }

  const magneticWraps = document.querySelectorAll('.magnetic-wrap');
  magneticWraps.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      if (document.body.classList.contains('pro-mode')) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const maxDist = 12;
      const moveX = (distX / (rect.width / 2)) * maxDist;
      const moveY = (distY / (rect.height / 2)) * maxDist;
      
      el.style.transform = `translate(${moveX}px, ${moveY}px)`;
      el.style.transition = 'transform 0.1s ease-out';
    });
    
    el.addEventListener('mouseleave', () => {
      if (document.body.classList.contains('pro-mode')) {
        el.style.transform = 'none';
        return;
      }
      el.style.transform = 'translate(0px, 0px)';
      el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
  });

  const splitTexts = document.querySelectorAll('.split-text');
  splitTexts.forEach(el => {
    const text = el.textContent;
    el.textContent = '';
    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.className = 'char';
      span.style.transitionDelay = `${i * 0.04}s`;
      if (char === ' ') {
        span.style.whiteSpace = 'pre';
      }
      el.appendChild(span);
    });
  });

  const scrollProgress = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('back-to-top');
  const bttCircle = document.getElementById('btt-circle');

  window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const innerHeight = window.innerHeight;
    const scrollPercent = window.scrollY / (scrollHeight - innerHeight);
    
    if (scrollProgress) {
      scrollProgress.style.width = `${scrollPercent * 100}%`;
    }
    
    if (backToTop) {
      if (window.scrollY > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
    
    if (bttCircle) {
      const circumference = 125.66;
      bttCircle.style.strokeDashoffset = circumference - (circumference * scrollPercent);
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseFloat(entry.target.getAttribute('data-target'));
        if (document.body.classList.contains('pro-mode')) {
          entry.target.innerText = target;
          observer.unobserve(entry.target);
          return;
        }
        const duration = 2000;
        let startTimestamp = null;
        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          entry.target.innerText = Math.floor(progress * target);
          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            entry.target.innerText = target;
          }
        };
        window.requestAnimationFrame(step);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(counter => counterObserver.observe(counter));

  const typedText = document.getElementById('typed-text');
  if (typedText) {
    const phrases = ['BSITWMA Student', 'Web Developer', 'Content Creator', 'Gamer & Athlete'];
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;

    const type = () => {
      if (document.body.classList.contains('pro-mode')) {
        typedText.textContent = 'Web Developer & IT Specialist';
        setTimeout(type, 800);
        return;
      }
      const currentPhrase = phrases[currentPhraseIndex];
      if (isDeleting) {
        typedText.textContent = currentPhrase.substring(0, currentCharIndex - 1);
        currentCharIndex--;
      } else {
        typedText.textContent = currentPhrase.substring(0, currentCharIndex + 1);
        currentCharIndex++;
      }

      let typeSpeed = isDeleting ? 35 : 75;

      if (!isDeleting && currentCharIndex === currentPhrase.length) {
        typeSpeed = 2200;
        isDeleting = true;
      } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        typeSpeed = 400;
      }
      setTimeout(type, typeSpeed);
    };
    setTimeout(type, 800);
  }

  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href.includes(current) && current !== '') {
        link.classList.add('active');
      }
    });
  });

  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          e.preventDefault();
          window.scrollTo({
            top: targetSection.offsetTop - 70,
            behavior: 'smooth'
          });
        }
      }
      if (hamburger && navMenu && link.classList.contains('nav-link')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active') ? 'true' : 'false');
    });
  }

  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(reveal => revealObserver.observe(reveal));

  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = `${width}%`;
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  skillFills.forEach(skill => skillObserver.observe(skill));

  const showcases = document.querySelectorAll('.project-showcase');
  showcases.forEach(showcase => {
    const imgs = showcase.querySelectorAll('.gallery-img');
    const dots = showcase.querySelectorAll('.gal-dot');
    const prevBtn = showcase.querySelector('.gal-prev');
    const nextBtn = showcase.querySelector('.gal-next');
    let currentIdx = 0;
    let autoTimer;

    const show = (idx) => {
      if (idx < 0) idx = imgs.length - 1;
      if (idx >= imgs.length) idx = 0;
      currentIdx = idx;
      
      imgs.forEach(img => img.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      if (imgs[currentIdx]) imgs[currentIdx].classList.add('active');
      if (dots[currentIdx]) dots[currentIdx].classList.add('active');
    };

    const next = () => show(currentIdx + 1);
    const prev = () => show(currentIdx - 1);

    const startAuto = () => {
      clearInterval(autoTimer);
      autoTimer = setInterval(next, 4500);
    };

    const pauseAuto = () => {
      clearInterval(autoTimer);
      setTimeout(startAuto, 7000);
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => { prev(); pauseAuto(); });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => { next(); pauseAuto(); });
    }
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => { show(idx); pauseAuto(); });
    });

    startAuto();

    if (window.matchMedia('(min-width: 768px)').matches) {
      showcase.addEventListener('mousemove', (e) => {
        const rect = showcase.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;
        showcase.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      showcase.addEventListener('mouseleave', () => {
        showcase.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        showcase.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        setTimeout(() => { showcase.style.transition = ''; }, 600);
      });
    }
  });

  const home = document.getElementById('home');
  const profileFrames = document.querySelectorAll('.profile-frame');
  
  if (home && window.matchMedia('(min-width: 768px)').matches) {
    home.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      profileFrames.forEach(frame => {
        frame.style.transform = `translate(${x}px, ${y}px)`;
      });
    });

    home.addEventListener('mouseleave', () => {
      profileFrames.forEach(frame => {
        frame.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        frame.style.transform = 'translate(0px, 0px)';
        setTimeout(() => { frame.style.transition = ''; }, 500);
      });
    });
  }

  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formStatus = document.getElementById('form-status');
  const copyEmailBtn = document.getElementById('copy-email-btn');

  // ============================================================
  // Contact Form Engine
  // - Supports Web3Forms for silent background delivery (local & live)
  // - Supports FormSubmit for live hosted sites (GitHub Pages, etc.)
  // - Provides immediate delivery fallback so messages are never lost
  // ============================================================
  let WEB3FORMS_ACCESS_KEY = localStorage.getItem('web3forms_key') || '';

  // ============================================================
  // Confetti Particle Celebration Effect
  // ============================================================
  const triggerConfetti = (originX, originY) => {
    let container = document.getElementById('confetti-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'confetti-container';
      container.className = 'confetti-canvas-container';
      document.body.appendChild(container);
    }

    const colors = ['#00ffff', '#c084fc', '#10b981', '#fbbf24', '#38bdf8', '#ffffff', '#f43f5e'];
    const count = 60;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-particle';
      container.appendChild(p);

      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 8 + 6;
      const isCircle = Math.random() > 0.45;

      p.style.backgroundColor = color;
      p.style.width = `${size}px`;
      p.style.height = isCircle ? `${size}px` : `${size * 1.5}px`;
      p.style.borderRadius = isCircle ? '50%' : '2px';
      p.style.boxShadow = `0 0 12px ${color}`;

      const angle = (Math.random() * 360) * (Math.PI / 180);
      const velocity = Math.random() * 280 + 130;
      let vx = Math.cos(angle) * velocity;
      let vy = Math.sin(angle) * velocity - 130; // upward bias

      let posX = originX;
      let posY = originY;
      let rotation = Math.random() * 360;
      let rotSpeed = (Math.random() - 0.5) * 28;
      let wobble = Math.random() * 10;
      const wobbleSpeed = Math.random() * 0.12 + 0.05;

      const startTime = performance.now();
      const duration = 1400 + Math.random() * 500;

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = elapsed / duration;

        if (progress >= 1) {
          p.remove();
          return;
        }

        wobble += wobbleSpeed;
        posX += vx * 0.016 + Math.sin(wobble) * 1.2;
        posY += vy * 0.016;
        vy += 380 * 0.016; // gravity
        vx *= 0.98; // air drag
        rotation += rotSpeed;
        const opacity = 1 - Math.pow(progress, 2.5);

        p.style.transform = `translate3d(${posX}px, ${posY}px, 0) rotate(${rotation}deg)`;
        p.style.opacity = opacity;

        requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    }
  };

  const showToast = (title, message = '', isError = false) => {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `custom-toast ${isError ? 'toast-error' : 'toast-success'}`;
    toast.innerHTML = `
      <div class="toast-icon">
        <i class="fas ${isError ? 'fa-circle-exclamation' : 'fa-check'}"></i>
      </div>
      <div class="toast-body">
        <div class="toast-header-row">
          <span class="toast-tag">${isError ? 'NOTICE' : 'DELIVERED'}</span>
          <span class="toast-time">Just now</span>
        </div>
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-desc">${message}</div>` : ''}
      </div>
      <div class="toast-progress"></div>
    `;
    container.appendChild(toast);
    
    setTimeout(() => { toast.classList.add('show'); }, 40);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => { toast.remove(); }, 400);
    }, 4500);
  };

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('navinmdm0@gmail.com').then(() => {
        showToast('Email Copied!', 'navinmdm0@gmail.com copied to clipboard', false);
        copyEmailBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
          copyEmailBtn.innerHTML = '<i class="far fa-copy"></i>';
        }, 2000);
      }).catch(() => {
        showToast('Direct Email', 'navinmdm0@gmail.com', false);
      });
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const messageInput = document.getElementById('form-message');
      
      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';
      
      // Validation
      if (!name || !email || !message) {
        showToast('Missing Fields', 'Please fill in your name, email, and message.', true);
        if (formStatus) {
          formStatus.style.display = 'flex';
          formStatus.className = 'form-status status-error';
          formStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please fill in your name, email, and message.';
        }
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Invalid Email', 'Please enter a valid email address.', true);
        if (formStatus) {
          formStatus.style.display = 'flex';
          formStatus.className = 'form-status status-error';
          formStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Invalid email address.';
        }
        if (emailInput) emailInput.focus();
        return;
      }

      // Set loading state with flight animation
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.classList.add('is-sending');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-circle-notch fa-spin"></i>';
      
      if (formStatus) {
        formStatus.style.display = 'flex';
        formStatus.style.opacity = '1';
        formStatus.style.transform = 'translateY(0)';
        formStatus.className = 'form-status status-loading';
        formStatus.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> <span>Sending your message...</span>';
      }

      const subject = `Portfolio Contact from ${name}`;

      // Helper for pleasurable, impressive celebration display
      const handleSuccess = (senderName) => {
        // Confetti explosion from the submit button center!
        const btnRect = submitBtn.getBoundingClientRect();
        triggerConfetti(btnRect.left + btnRect.width / 2, btnRect.top + btnRect.height / 2);

        // Haptic feedback if supported (mobile / tablet)
        if (navigator.vibrate) {
          try { navigator.vibrate([30, 60, 40]); } catch (err) {}
        }

        // Transform button into emerald celebration state
        submitBtn.classList.remove('is-sending');
        submitBtn.classList.add('is-success');
        submitBtn.innerHTML = '<span>Message Delivered!</span><i class="fas fa-check"></i>';

        // Show sleek top floating glass toast
        const displayName = senderName ? senderName : 'Thank you';
        showToast('Message Delivered!', `${displayName}, your message is safely in Navin's inbox.`, false);

        // Update form status with sleek animated confirmation
        if (formStatus) {
          formStatus.style.display = 'flex';
          formStatus.className = 'form-status status-success';
          formStatus.innerHTML = `
            <div style="display: flex; align-items: center; gap: 14px; width: 100%;">
              <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.5); display: flex; align-items: center; justify-content: center; color: #34d399; font-size: 1.05rem; flex-shrink: 0; box-shadow: 0 0 16px rgba(16,185,129,0.4);">
                <i class="fas fa-check"></i>
              </div>
              <div style="display: flex; flex-direction: column; gap: 2px;">
                <div style="font-weight: 700; color: #ffffff; font-size: 0.94rem; letter-spacing: 0.2px;">Message Received!</div>
                <div style="color: #cbd5e1; font-size: 0.82rem;">Thank you! Your message was delivered directly to <strong>navinmdm0@gmail.com</strong>.</div>
              </div>
            </div>
          `;
          
          // Smoothly auto-fade after 6 seconds
          setTimeout(() => {
            if (formStatus && formStatus.classList.contains('status-success')) {
              formStatus.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
              formStatus.style.opacity = '0';
              formStatus.style.transform = 'translateY(-6px)';
              setTimeout(() => {
                formStatus.style.display = 'none';
                formStatus.style.opacity = '';
                formStatus.style.transform = '';
                formStatus.style.transition = '';
              }, 600);
            }
          }, 6000);
        }

        contactForm.reset();

        // Restore button back gracefully after 4.5 seconds
        setTimeout(() => {
          submitBtn.classList.remove('is-success');
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }, 4500);
      };

      // 1. Try Web3Forms if key is available
      if (WEB3FORMS_ACCESS_KEY) {
        try {
          const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
              access_key: WEB3FORMS_ACCESS_KEY,
              name: name,
              email: email,
              message: message,
              subject: subject,
              from_name: name
            })
          });
          const data = await res.json();
          if (data.success) {
            handleSuccess(name);
            return;
          }
        } catch (err) {
          console.warn('Web3Forms error:', err);
        }
      }

      // 2. If hosted online (http/https), try FormSubmit AJAX
      if (window.location.protocol.startsWith('http')) {
        try {
          const res = await fetch('https://formsubmit.co/ajax/navinmdm0@gmail.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
              name: name,
              email: email,
              message: message,
              _subject: subject,
              _template: 'table',
              _captcha: 'false'
            })
          });
          const data = await res.json();
          if (data.success === 'true' || data.success === true) {
            handleSuccess(name);
            return;
          }
        } catch (err) {
          console.warn('FormSubmit error:', err);
        }
      }

      // 3. Fallback notice if not sent silently via API
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;

      if (formStatus) {
        formStatus.style.display = 'flex';
        formStatus.className = 'form-status status-info';
        formStatus.innerHTML = '<i class="fas fa-envelope"></i> <span>Direct email: <a href="mailto:navinmdm0@gmail.com" style="color:inherit;text-decoration:underline;">navinmdm0@gmail.com</a></span>';
      }
    });
  }

  const titleOutlines = document.querySelectorAll('.title-outline');
  titleOutlines.forEach(title => {
    title.addEventListener('mouseenter', () => {
      title.style.transition = 'all 0.3s ease';
    });
  });

  const delayedReveals = document.querySelectorAll('.reveal[style*="--delay"]');
  delayedReveals.forEach(el => {
    const delay = el.style.getPropertyValue('--delay');
    if (delay) el.style.transitionDelay = delay;
  });

  // ============================================================
  // Style Mode Switch (Creative vs Professional)
  // ============================================================
  const modeSwitchBtn = document.getElementById('mode-switch-btn');
  const creativeOpt = document.querySelector('.mode-opt.mode-creative');
  const proOpt = document.querySelector('.mode-opt.mode-pro');

  const updateModeUI = (isPro) => {
    if (isPro) {
      document.body.classList.add('pro-mode');
      if (creativeOpt) creativeOpt.classList.remove('active');
      if (proOpt) proOpt.classList.add('active');
      if (typedText) typedText.textContent = 'Web Developer & IT Specialist';
      const allCounters = document.querySelectorAll('.counter');
      allCounters.forEach(c => {
        const t = c.getAttribute('data-target');
        if (t) c.innerText = t;
      });
      const sc = document.getElementById('smooth-content');
      if (sc) sc.style.transform = 'none';
      document.body.style.height = 'auto';
    } else {
      document.body.classList.remove('pro-mode');
      if (creativeOpt) creativeOpt.classList.add('active');
      if (proOpt) proOpt.classList.remove('active');
      const sc = document.getElementById('smooth-content');
      if (sc && window.innerWidth > 1024) {
        document.body.style.height = `${sc.getBoundingClientRect().height}px`;
      }
    }
  };

  const savedMode = localStorage.getItem('portfolio-mode');
  if (savedMode === 'pro') {
    updateModeUI(true);
  }

  if (modeSwitchBtn) {
    modeSwitchBtn.addEventListener('click', () => {
      document.body.classList.add('theme-transitioning');
      const willBePro = !document.body.classList.contains('pro-mode');
      
      if (willBePro) {
        document.body.classList.add('light-mode');
        localStorage.setItem('portfolio-theme', 'light');
      }
      
      updateModeUI(willBePro);
      localStorage.setItem('portfolio-mode', willBePro ? 'pro' : 'creative');

      setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
      }, 400);
    });
  }

  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('portfolio-theme');
  
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
  }
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.add('theme-transitioning');
      document.body.classList.toggle('light-mode');
      
      if (document.body.classList.contains('light-mode')) {
        localStorage.setItem('portfolio-theme', 'light');
      } else {
        localStorage.setItem('portfolio-theme', 'dark');
      }
      
      setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
      }, 700);
    });
  }
});
