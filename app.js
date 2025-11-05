// Typing Animation
const typingText = document.getElementById('typingText');
const roles = [
  'Machine Learning Engineer',
  'Full-Stack Developer',
  'AI Researcher',
  'Problem Solver'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function type() {
  const currentRole = roles[roleIndex];
  
  if (isDeleting) {
    typingText.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
    typingSpeed = 50;
  } else {
    typingText.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
    typingSpeed = 100;
  }
  
  if (!isDeleting && charIndex === currentRole.length) {
    isDeleting = true;
    typingSpeed = 2000;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    typingSpeed = 500;
  }
  
  setTimeout(type, typingSpeed);
}

// Start typing animation
type();

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScrollTop = scrollTop;
});

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close menu when clicking a link
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section');

function setActiveLink() {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', setActiveLink);

// Smooth Scroll for Navigation Links
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop - 70,
        behavior: 'smooth'
      });
    }
  });
});

// Smooth scroll for hero buttons
const heroButtons = document.querySelectorAll('.hero-buttons a[href^="#"]');

heroButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = button.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop - 70,
        behavior: 'smooth'
      });
    }
  });
});

// Intersection Observer for Fade-in Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe all elements with fade-in class
const fadeElements = document.querySelectorAll('.skill-category, .project-card, .highlight-card, .leadership-card, .contact-card');

fadeElements.forEach(element => {
  element.classList.add('fade-in');
  observer.observe(element);
});

// Project Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked button
    button.classList.add('active');
    
    const filterValue = button.getAttribute('data-filter');
    
    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      
      if (filterValue === 'all') {
        card.classList.remove('hidden');
        setTimeout(() => {
          card.style.display = 'flex';
        }, 10);
      } else if (category === filterValue) {
        card.classList.remove('hidden');
        setTimeout(() => {
          card.style.display = 'flex';
        }, 10);
      } else {
        card.classList.add('hidden');
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  });
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoading = submitBtn.querySelector('.btn-loading');
const successMessage = document.getElementById('successMessage');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Clear previous errors
  document.querySelectorAll('.error-message').forEach(msg => msg.textContent = '');
  
  // Get form values
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  
  // Validation
  let isValid = true;
  
  if (name === '') {
    document.getElementById('nameError').textContent = 'Name is required';
    isValid = false;
  }
  
  if (email === '') {
    document.getElementById('emailError').textContent = 'Email is required';
    isValid = false;
  } else if (!isValidEmail(email)) {
    document.getElementById('emailError').textContent = 'Please enter a valid email';
    isValid = false;
  }
  
  if (message === '') {
    document.getElementById('messageError').textContent = 'Message is required';
    isValid = false;
  }
  
  if (!isValid) {
    return;
  }
  
  // Show loading state
  btnText.style.display = 'none';
  btnLoading.style.display = 'flex';
  submitBtn.disabled = true;
  
  // Simulate form submission
  setTimeout(() => {
    // Hide loading state
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    submitBtn.disabled = false;
    
    // Show success message
    successMessage.style.display = 'flex';
    
    // Reset form
    contactForm.reset();
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 5000);
  }, 2000);
});

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Particles Animation (Simple Implementation)
const particlesContainer = document.getElementById('particles');
const particleCount = 50;

function createParticle() {
  const particle = document.createElement('div');
  particle.style.position = 'absolute';
  particle.style.width = Math.random() * 4 + 1 + 'px';
  particle.style.height = particle.style.width;
  particle.style.background = 'rgba(0, 212, 255, 0.5)';
  particle.style.borderRadius = '50%';
  particle.style.left = Math.random() * 100 + '%';
  particle.style.top = Math.random() * 100 + '%';
  particle.style.animation = `particleFloat ${Math.random() * 10 + 5}s ease-in-out infinite`;
  particle.style.animationDelay = Math.random() * 5 + 's';
  
  particlesContainer.appendChild(particle);
}

// Add particle animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes particleFloat {
    0%, 100% {
      transform: translate(0, 0) scale(1);
      opacity: 0.3;
    }
    25% {
      transform: translate(20px, -20px) scale(1.2);
      opacity: 0.6;
    }
    50% {
      transform: translate(-15px, -40px) scale(0.8);
      opacity: 0.4;
    }
    75% {
      transform: translate(15px, -20px) scale(1.1);
      opacity: 0.5;
    }
  }
`;
document.head.appendChild(style);

// Create particles
for (let i = 0; i < particleCount; i++) {
  createParticle();
}

// Parallax Effect on Mouse Move
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX / window.innerWidth - 0.5;
  mouseY = e.clientY / window.innerHeight - 0.5;
});

function updateParallax() {
  const heroContent = document.querySelector('.hero-content');
  
  if (heroContent && window.pageYOffset < window.innerHeight) {
    const offsetX = mouseX * 20;
    const offsetY = mouseY * 20;
    heroContent.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  }
  
  requestAnimationFrame(updateParallax);
}

updateParallax();

// Add animation delay to skill categories
const skillCategories = document.querySelectorAll('.skill-category');
skillCategories.forEach((category, index) => {
  category.style.animationDelay = `${index * 0.1}s`;
});

// Add animation delay to project cards
const projectCardsArray = document.querySelectorAll('.project-card');
projectCardsArray.forEach((card, index) => {
  card.style.animationDelay = `${index * 0.1}s`;
});

// Add animation delay to highlight cards
const highlightCards = document.querySelectorAll('.highlight-card');
highlightCards.forEach((card, index) => {
  card.style.animationDelay = `${index * 0.1}s`;
});

console.log('Portfolio website loaded successfully! 🚀');
