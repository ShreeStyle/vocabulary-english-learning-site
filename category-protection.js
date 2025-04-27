// category-protection.js - Add protection to categories in discover page

document.addEventListener("DOMContentLoaded", function() {
    // Get all category boxes
    const categoryBoxes = document.querySelectorAll('.category-box');
    
    // Add click event listeners to each category box
    categoryBoxes.forEach(box => {
      box.addEventListener('click', function() {
        // Check if user is logged in
        if (!window.isLoggedIn()) {
          window.showStatusMessage("Please sign up and log in first to access this content", true);
          // Redirect to join/login page
          window.goToPage(2);
          return;
        }
        
        // If user is logged in, handle the category click
        const categoryName = this.querySelector('span').textContent;
        alert(`${categoryName} section is now available! Welcome to ShreeSoundWaves.`);
        // You can add additional functionality here
      });
    });
    
    // Also protect album covers
    const albumCovers = document.querySelectorAll('.album-cover');
    albumCovers.forEach(cover => {
      cover.addEventListener('click', function() {
        if (!window.isLoggedIn()) {
          window.showStatusMessage("Please sign up and log in first to view album details", true);
          window.goToPage(2);
          return;
        }
        
        // Handle album click for logged-in users
        const albumImg = this.querySelector('img');
        const albumName = albumImg ? albumImg.alt : "Album";
        alert(`Now viewing: ${albumName}`);
      });
    });
  });