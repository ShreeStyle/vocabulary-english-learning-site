// client.js - Main client-side functionality

// Global variables
let currentPage = 0;
const totalPages = 3;

// Helper function to display status messages
window.showStatusMessage = function(message, isError) {
  const statusMessage = document.getElementById("status-message");
  if (!statusMessage) return;
  
  statusMessage.textContent = message;
  statusMessage.style.display = "block";
  
  // Clear existing classes
  statusMessage.classList.remove("status-success", "status-error");
  
  // Add appropriate class
  if (isError) {
    statusMessage.classList.add("status-error");
  } else {
    statusMessage.classList.add("status-success");
  }
  
  // Auto hide after 5 seconds
  setTimeout(() => {
    statusMessage.style.display = "none";
  }, 5000);
};

// Function to update UI for logged-in user
window.updateUIForLoggedInUser = function(user) {
  if (!user) {
    const userData = localStorage.getItem("user");
    if (userData) {
      user = JSON.parse(userData);
    } else {
      return; // No user data available
    }
  }
  
  // Update user info section
  const userInfo = document.getElementById("user-info");
  if (userInfo) {
    userInfo.innerHTML = `
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
    `;
  }
  
  // Show user account section, hide login form
  document.getElementById("auth-form").style.display = "none";
  document.getElementById("user-account").style.display = "block";
};

// Function to go to a specific page with authentication check
window.goToPage = function(pageIndex) {
  if (pageIndex < 0 || pageIndex >= totalPages) return;
  
  // Check if trying to access Discover page (index 1) without being logged in
  if (pageIndex === 1 && !window.isLoggedIn()) {
    window.showStatusMessage("Please sign up and log in first to access the Discover page", true);
    window.goToPage(2); // Redirect to Join/Login page instead
    return;
  }
  
  // Save current page
  const oldPage = currentPage;
  currentPage = pageIndex;
  
  // Calculate transform values
  const pages = document.querySelectorAll('.page');
  pages.forEach((page, index) => {
    const offset = index - pageIndex;
    page.style.transform = `translateX(${offset * 100}%)`;
    page.style.zIndex = index === pageIndex ? "1" : "0";
  });
  
  // Update active navigation link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    const linkPage = parseInt(link.getAttribute('data-page'));
    if (linkPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  // If navigating to discover page (page 1) after login/signup
  if (pageIndex === 1 && window.isLoggedIn()) {
    const user = JSON.parse(localStorage.getItem("user"));
    // Add welcome message to the fun-way-text element
    const funWayText = document.querySelector('.fun-way-text');
    if (funWayText && user) {
      funWayText.innerHTML = `Welcome ${user.name}! Learn English the fun way through my rockin' playlist!`;
    }
  }
};

// Function to check category boxes in discover page
function setupCategoryBoxes() {
  const categoryBoxes = document.querySelectorAll('.category-box');
  
  categoryBoxes.forEach(box => {
    box.addEventListener('click', function() {
      if (!window.isLoggedIn()) {
        window.showStatusMessage("Please sign up and log in first to access this feature", true);
        window.goToPage(2); // Redirect to Join/Login page
        return;
      }
      
      // If logged in, handle the category click (you can add specific functionality later)
      const categoryType = this.querySelector('span').textContent;
      console.log(`${categoryType} category clicked`);
    });
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  // Check if user is already logged in
  if (window.isLoggedIn()) {
    window.updateUIForLoggedInUser();
  }
  
  // Set up navigation links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', function() {
      const pageIndex = parseInt(this.getAttribute('data-page'));
      window.goToPage(pageIndex);
    });
  });
  
  // Set up swipe indicators
  document.querySelector('.swipe-left').addEventListener('click', function() {
    if (currentPage > 0) {
      window.goToPage(currentPage - 1);
    }
  });
  
  document.querySelector('.swipe-right').addEventListener('click', function() {
    if (currentPage < totalPages - 1) {
      window.goToPage(currentPage + 1);
    }
  });
  
  // Form tab switching
  const formTabs = document.querySelectorAll('.form-tab');
  formTabs.forEach((tab) => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs
      formTabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Show corresponding form
      const formType = this.getAttribute('data-form');
      if (formType === 'signup') {
        document.getElementById('signup-form').style.display = 'block';
        document.getElementById('login-form').style.display = 'none';
      } else {
        document.getElementById('signup-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
      }
    });
  });
  
  // Set up category boxes in discover page
  setupCategoryBoxes();
  
  // Start on home page
  window.goToPage(0);
});