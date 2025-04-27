// Function to handle user registration
async function registerUser(name, email, password) {
    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
  
      return data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }
  
  // Function to handle user login
  async function loginUser(email, password) {
    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
  
      // Store token in localStorage for future authenticated requests
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
  
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }
  
  // Function to check if user is logged in
  window.isLoggedIn = function() {
    return localStorage.getItem("token") !== null;
  };
  
  // Function to logout user
  window.logoutUser = function() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };
  
  // Function to get user profile
  async function getUserProfile() {
    try {
      if (!window.isLoggedIn()) {
        throw new Error("User not logged in");
      }
  
      const token = localStorage.getItem("token");
  
      const response = await fetch("/api/profile", {
        headers: {
          Authorization: token,
        },
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to get profile");
      }
  
      return data;
    } catch (error) {
      console.error("Profile error:", error);
      throw error;
    }
  }
  
  // Add event listeners when DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, attaching auth event listeners");
  
    const signupBtn = document.getElementById("signup-btn");
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
  
    if (!signupBtn || !loginBtn || !logoutBtn) {
      console.error("One or more buttons not found in the DOM");
    }
  
    // Sign up button click handler
    signupBtn.addEventListener("click", async () => {
      console.log("Signup button clicked");
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      // Simple validation
      if (!name || !email || !password) {
        window.showStatusMessage("Please fill in all fields", true);
        return;
      }
  
      try {
        const data = await registerUser(name, email, password);
        window.showStatusMessage(data.message || "Registration successful!", false);
  
        // Clear form fields
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
  
        // Redirect to discover page after successful signup
        setTimeout(() => {
          window.goToPage(1); // Navigate to discover page (index 1)
        }, 2000); // Longer delay to ensure message is seen
      } catch (error) {
        window.showStatusMessage(error.message || "Registration failed", true);
      }
    });
  
    // Login button click handler
    loginBtn.addEventListener("click", async () => {
      console.log("Login button clicked");
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;
  
      // Simple validation
      if (!email || !password) {
        window.showStatusMessage("Please enter both email and password", true);
        return;
      }
  
      try {
        const data = await loginUser(email, password);
        window.showStatusMessage(data.message || "Login successful!", false);
  
        // Update UI for logged in user
        window.updateUIForLoggedInUser(data.user);
  
        // Redirect to discover page after successful login
        setTimeout(() => {
          window.goToPage(1); // Navigate to discover page (index 1)
        }, 2000); // Longer delay to ensure message is seen
      } catch (error) {
        window.showStatusMessage(error.message || "Login failed", true);
      }
    });
  
    // Logout button click handler
    logoutBtn.addEventListener("click", () => {
      console.log("Logout button clicked");
      window.logoutUser();
  
      // Update UI for logged out state
      document.getElementById("auth-form").style.display = "block";
      document.getElementById("user-account").style.display = "none";
  
      // Clear login form fields
      document.getElementById("login-email").value = "";
      document.getElementById("login-password").value = "";
  
      window.showStatusMessage("You have been logged out", false);
    });
  });