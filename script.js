window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('done');
      document.body.classList.add('loaded');
    }
  }, 1500);
});

document.addEventListener('DOMContentLoaded', () => {
  
  const smoothWrapper = document.getElementById('smooth-wrapper');
  const smoothContent = document.getElementById('smooth-content');
  if (smoothWrapper && smoothContent && window.innerWidth > 1024) {
    let currentScroll = 0;
    let targetScroll = 0;
    let ease = 0.08;
    
    function updateScrollHeight() {
      document.body.style.height = `${smoothContent.getBoundingClientRect().height}px`;
    }
    
    updateScrollHeight();
    window.addEventListener('resize', updateScrollHeight);
    const resizeObserver = new ResizeObserver(updateScrollHeight);
    resizeObserver.observe(smoothContent);
    
    function physicsScroll() {
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

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop - 70,
            behavior: 'smooth'
          });
        }
      }
      if (hamburger && navMenu) {
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
  const showToast = (message, isError) => {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '-300px';
    toast.style.padding = '15px 25px';
    toast.style.color = 'white';
    toast.style.borderRadius = '8px';
    toast.style.fontFamily = 'inherit';
    toast.style.zIndex = '10000';
    toast.style.transition = 'right 0.3s ease';
    
    if (isError) {
      toast.style.background = 'crimson';
    } else {
      toast.style.background = 'linear-gradient(135deg, var(--violet, #8A2BE2), var(--cyan, #00FFFF))';
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => { toast.style.right = '20px'; }, 100);
    setTimeout(() => {
      toast.style.right = '-300px';
      setTimeout(() => { toast.remove(); }, 300);
    }, 3500);
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = contactForm.querySelectorAll('input, textarea');
      let isValid = true;
      inputs.forEach(input => {
        if (!input.value.trim()) isValid = false;
      });
      
      if (isValid) {
        showToast('Message sent successfully!', false);
        contactForm.reset();
      } else {
        showToast('Please fill in all fields.', true);
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