// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set dark theme by default
  document.body.classList.add('dark-theme');
  
  // Initialize page
  initSidebar();
  initQuotesGrid();
  initCategoryFilter();
  initAnimations();
  
  // Update the days counter
  updateDaysCounter();
});

// Initialize sidebar navigation
function initSidebar() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all nav items
      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
      });
      
      // Add active class to clicked nav item
      this.parentElement.classList.add('active');
      
      // Get the target section id from href
      const targetId = this.getAttribute('href').substring(1);
      
      // Hide all page sections
      document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
      });
      
      // Show the target section
      const targetSection = document.getElementById(`${targetId}-page`);
      if (targetSection) {
        targetSection.classList.add('active');
        // Animate the page content
        animatePageContent(targetSection);
      }
    });
  });
}

// Initialize quotes grid with data from quotes.js
function initQuotesGrid() {
  const quotesGrid = document.getElementById('quotes-grid');
  
  if (!quotesGrid) return;
  
  // Clear existing quotes
  quotesGrid.innerHTML = '';
  
  // Create and append quote cards
  quotes.forEach(quote => {
    const quoteCard = createQuoteCard(quote);
    quotesGrid.appendChild(quoteCard);
  });
}

// Create a quote card element
function createQuoteCard(quote) {
  const card = document.createElement('div');
  card.className = 'quote-card';
  card.dataset.category = quote.category;
  
  card.innerHTML = `
    <p class="quote-text">"${quote.text}"</p>
    <p class="quote-author">— ${quote.author}</p>
    <span class="quote-category ${quote.category}">${quote.category}</span>
  `;
  
  return card;
}

// Initialize category filter
function initCategoryFilter() {
  const categoryButtons = document.querySelectorAll('.category-btn');
  
  categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Get the selected category
      const category = this.dataset.category;
      
      // Show/hide quotes based on selected category
      filterQuotes(category);
    });
  });
}

// Filter quotes by category
function filterQuotes(category) {
  const quoteCards = document.querySelectorAll('.quote-card');
  
  quoteCards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'block';
      // Animate card appearance
      gsap.fromTo(card, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    } else {
      card.style.display = 'none';
    }
  });
}

// Initialize GSAP animations
function initAnimations() {
  // Sidebar animations
  gsap.from(".sidebar", { 
    x: -50, 
    opacity: 0, 
    duration: 0.8, 
    ease: "power3.out" 
  });
  
  // Logo animation
  gsap.from(".logo-container", { 
    y: -20, 
    opacity: 0, 
    duration: 0.6, 
    delay: 0.3, 
    ease: "back.out(1.7)" 
  });
  
  // Nav items staggered animation
  gsap.from(".nav-item", {
    x: -30,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    delay: 0.5,
    ease: "power2.out"
  });
  
  // Tracker animation
  gsap.from(".days-clean-tracker", {
    y: 30,
    opacity: 0,
    duration: 0.7,
    delay: 1,
    ease: "elastic.out(1, 0.5)"
  });
  
  // Animate progress bar
  gsap.from(".progress-fill", {
    width: 0,
    duration: 1.5,
    delay: 1.2,
    ease: "power2.inOut"
  });
  
  // Animate watermark and buy me coffee button
  gsap.from([".watermark", ".bmc-button"], {
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 1.5,
    stagger: 0.2,
    ease: "power2.out"
  });
  
  // Animate initial page content
  const activeSection = document.querySelector('.page-section.active');
  if (activeSection) {
    animatePageContent(activeSection);
  }
  
  // Add hover animations for guidance cards
  const guidanceCards = document.querySelectorAll('.guidance-card');
  guidanceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card.querySelector('.guidance-icon'), {
        scale: 1.2,
        duration: 0.3,
        ease: "back.out(1.7)"
      });
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card.querySelector('.guidance-icon'), {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    });
  });
  
  // Add pulse animation to days counter
  const daysCount = document.getElementById('days-count');
  if (daysCount) {
    gsap.to(daysCount, {
      scale: 1.1,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }
}

// Animate page content
function animatePageContent(section) {
  // Reset all animations
  gsap.set(section.querySelectorAll('*'), {
    clearProps: "all"
  });
  
  // Animate header
  gsap.from(section.querySelector('.page-header'), {
    y: -30,
    opacity: 0,
    duration: 0.6,
    ease: "power2.out"
  });
  
  // Animate quranic guidance card
  if (section.querySelector('.quranic-guidance-card')) {
    gsap.from(section.querySelector('.quranic-guidance-card'), {
      y: 50,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: "power2.out"
    });
  }
  
  // Animate category buttons
  if (section.querySelectorAll('.category-btn').length > 0) {
    gsap.from(section.querySelectorAll('.category-btn'), {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      delay: 0.4,
      ease: "power2.out"
    });
  }
  
  // Animate quote cards
  if (section.querySelectorAll('.quote-card').length > 0) {
    gsap.from(section.querySelectorAll('.quote-card'), {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.05,
      delay: 0.6,
      ease: "power2.out"
    });
  }
  
  // Animate guidance section
  if (section.querySelector('.guidance-section')) {
    gsap.from(section.querySelector('.section-title'), {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.8,
      ease: "power2.out"
    });
    
    gsap.from(section.querySelectorAll('.guidance-card'), {
      y: 40,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      delay: 1,
      ease: "power2.out"
    });
  }
}

// Update days counter animation
function updateDaysCounter() {
  const daysCount = document.getElementById('days-count');
  if (!daysCount) return;
  
  const targetDays = parseInt(daysCount.textContent);
  
  gsap.from({ days: 0 }, {
    days: targetDays,
    duration: 2,
    ease: "power2.out",
    onUpdate: function() {
      daysCount.textContent = Math.round(this.targets()[0].days);
    }
  });
}