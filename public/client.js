document.addEventListener("DOMContentLoaded", () => {
    // Current page tracker
    let currentPage = 0
    const totalPages = 3
    const pages = document.querySelectorAll(".page")
    const navLinks = document.querySelectorAll(".nav-link")
  
    // Update active navigation link
    function updateNavActive() {
      navLinks.forEach((link) => {
        const linkPage = Number.parseInt(link.getAttribute("data-page"))
        if (linkPage === currentPage) {
          link.classList.add("active")
        } else {
          link.classList.remove("active")
        }
      })
    }
  
    // Navigate to specific page - EXPORTED to window for access from auth.js
    window.goToPage = (pageIndex) => {
      if (pageIndex < 0 || pageIndex >= totalPages) return
  
      // Update pages position
      pages.forEach((page, index) => {
        page.style.transform = `translateX(${(index - pageIndex) * 100}%)`
  
        // Update z-index
        if (index === pageIndex) {
          page.style.zIndex = 1
        } else {
          setTimeout(() => {
            page.style.zIndex = 0
          }, 800) // Match transition time
        }
      })
  
      currentPage = pageIndex
      updateNavActive()
    }
  
    // Swipe detection variables
    let touchStartX = 0
    let touchEndX = 0
    let touchStartY = 0
    let touchEndY = 0
  
    // Add touch event listeners
    document.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX
      touchStartY = e.changedTouches[0].screenY
    })
  
    document.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX
      touchEndY = e.changedTouches[0].screenY
      handleSwipe()
    })
  
    // Handle the swipe gesture
    function handleSwipe() {
      const swipeThresholdX = 100
      const swipeThresholdY = 100
  
      // Calculate horizontal and vertical swipe distances
      const swipeDistanceX = touchEndX - touchStartX
      const swipeDistanceY = touchStartY - touchEndY // Reverse for up/down
  
      // Check if horizontal swipe is stronger
      if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY)) {
        if (swipeDistanceX < -swipeThresholdX) {
          // Swiped left - go to next page
          window.goToPage(currentPage + 1)
        } else if (swipeDistanceX > swipeThresholdX) {
          // Swiped right - go to previous page
          window.goToPage(currentPage - 1)
        }
      }
      // Check for vertical swipe (swipe up only)
      else if (swipeDistanceY > swipeThresholdY) {
        // Swiped up - go to discover page if on home
        if (currentPage === 0) {
          window.goToPage(1)
        }
      }
    }
  
    // Add click handlers for navigation
    document.querySelector(".swipe-left").addEventListener("click", () => {
      window.goToPage(currentPage - 1)
    })
  
    document.querySelector(".swipe-right").addEventListener("click", () => {
      window.goToPage(currentPage + 1)
    })
  
    document.querySelector(".swipe-up").addEventListener("click", () => {
      if (currentPage === 0) {
        window.goToPage(1)
      }
    })
  
    // Navigation links
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const pageIndex = Number.parseInt(link.getAttribute("data-page"))
        window.goToPage(pageIndex)
      })
    })
  
    // Initialize active state
    updateNavActive()
  
    // Form tabs functionality
    document.querySelectorAll(".form-tab").forEach((tab) => {
      tab.addEventListener("click", function () {
        // Update active tab
        document.querySelectorAll(".form-tab").forEach((t) => t.classList.remove("active"))
        this.classList.add("active")
  
        // Show correct form
        const formType = this.getAttribute("data-form")
        if (formType === "signup") {
          document.getElementById("signup-form").style.display = "block"
          document.getElementById("login-form").style.display = "none"
        } else {
          document.getElementById("signup-form").style.display = "none"
          document.getElementById("login-form").style.display = "block"
        }
      })
    })
  
    // Check if user is already logged in
    function checkLoginStatus() {
      // Implement your login status check here.
      // This is a placeholder. Replace with your actual logic.
      console.log("Checking login status...")
    }
  
    checkLoginStatus()
  })
  
  // Display status message - EXPORTED to window for access from auth.js
  window.showStatusMessage = (message, isError = false) => {
    const statusElement = document.getElementById("status-message")
    if (!statusElement) {
      console.error("Status message element not found!")
      return
    }
  
    console.log("Showing status message:", message, isError ? "error" : "success")
  
    statusElement.textContent = message
    statusElement.className = "status-message"
    statusElement.classList.add(isError ? "status-error" : "status-success")
    statusElement.style.display = "block"
  
    // Hide after 5 seconds
    setTimeout(() => {
      statusElement.style.display = "none"
    }, 5000)
  }
  
  // Update UI for logged in user
  window.updateUIForLoggedInUser = (user) => {
    // Hide auth form and show user account
    document.getElementById("auth-form").style.display = "none"
    document.getElementById("user-account").style.display = "block"
  
    // Update user info section
    const userInfoElement = document.getElementById("user-info")
    userInfoElement.innerHTML = `
          <p><strong>User ID:</strong> ${user.id}</p>
          <p><strong>Username:</strong> ${user.username}</p>
      `
  }
  