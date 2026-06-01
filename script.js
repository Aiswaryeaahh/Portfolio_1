document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initTypewriter();
  initTabs();
  initFilters();
  initContactForm();
});

/* --- THEME TOGGLE LOGIC --- */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Retrieve saved theme or default to system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
  } else {
    body.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode! 🎨`);
  });
}

/* --- SCROLLING NAVBAR LOGIC --- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navLinksContainer = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link');

  // Change navbar height on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Toggle mobile menu
  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
  });

  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navLinksContainer.classList.remove('active');
    });
  });
}

/* --- HERO TYPEWRITER ANIMATION --- */
function initTypewriter() {
  const element = document.getElementById('typewriter');
  const words = [
    "Tech Enthusiast",
    "MERN Stack Developer",
    "Co-Lead @ Mulearn",
    "CS Student",
    "Blockchain Explorer"
  ];
  
  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIdx];
    
    if (isDeleting) {
      // Remove characters
      element.textContent = currentWord.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 50; // Speed up when deleting
    } else {
      // Add characters
      element.textContent = currentWord.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 100; // Normal typing speed
    }

    // Word complete states
    if (!isDeleting && charIdx === currentWord.length) {
      // Wait at the end of word
      isDeleting = true;
      typingSpeed = 2000;
    } else if (isDeleting && charIdx === 0) {
      // Move to next word
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      typingSpeed = 500; // Pause before starting new word
    }

    setTimeout(type, typingSpeed);
  }

  // Start the animation
  setTimeout(type, 500);
}

/* --- TIMELINE EXPERIENCE TABS --- */
function initTabs() {
  const tabLeadership = document.getElementById('tab-leadership');
  const tabEducation = document.getElementById('tab-education');
  const paneLeadership = document.getElementById('pane-leadership');
  const paneEducation = document.getElementById('pane-education');

  function switchTab(activeBtn, activePane, inactiveBtn, inactivePane) {
    if (!activeBtn.classList.contains('active')) {
      activeBtn.classList.add('active');
      activePane.classList.add('active');
      inactiveBtn.classList.remove('active');
      inactivePane.classList.remove('active');
    }
  }

  tabLeadership.addEventListener('click', () => {
    switchTab(tabLeadership, paneLeadership, tabEducation, paneEducation);
  });

  tabEducation.addEventListener('click', () => {
    switchTab(tabEducation, paneEducation, tabLeadership, paneLeadership);
  });
}

/* --- PROJECTS FILTERING --- */
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Deactivate current active button
      document.querySelector('.filter-btn.active').classList.remove('active');
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // Remove active scaling animations first
        card.style.transform = 'scale(0.95)';
        card.style.opacity = '0';

        setTimeout(() => {
          if (filterValue === 'all' || category === filterValue) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.transform = 'scale(1)';
              card.style.opacity = '1';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        }, 300);
      });
    });
  });
}

/* --- CONTACT FORM AND TOAST NOTIFICATION --- */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitBtn = form.querySelector('button[type="submit"]');

    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending... ⏳';

    // Send email using FormSubmit AJAX endpoint
    fetch('https://formsubmit.co/ajax/aiswaryavs420@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: nameInput.value,
        email: emailInput.value,
        message: messageInput.value
      })
    })
    .then(response => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;

      if (response.ok) {
        showToast(`Thank you, ${nameInput.value}! Your message has been sent successfully. 🚀`);
        form.reset();
      } else {
        showToast('Something went wrong. Please try again or contact me directly. ⚠️');
      }
    })
    .catch(error => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      showToast('Network error. Please check your connection and try again. ⚠️');
    });
  });
}

/* --- CUSTOM TOAST NOTIFICATION --- */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="font-size: 1.1rem;">🔔</span>
    <div>${message}</div>
  `;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 50);

  // Auto remove toast
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4000);
}
