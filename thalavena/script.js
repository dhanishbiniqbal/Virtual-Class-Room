function showLoginForm(role) {
  document.querySelector(".buttonDiv").style.display = "none";
  // document.querySelector(".register-form").style.display = "none";
  document.querySelector(".login-form").style.display = "block";
  localStorage.setItem("role", role);
}

function goHome() {
  window.location.href = "index.html"; // or wherever your home is
}

async function login() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const selectedRole = localStorage.getItem("role");

  if (!email || !password) {
    alert("Email and password required!");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    console.log("Login response:", result); // Debugging

    if (response.ok) {
      // Check if account is approved
      if (result.user.status === "Pending") {
        alert("Account pending approval. Contact admin.");
        return;
      }

      // Verify role matches
      if (result.user.role !== selectedRole) {
        alert("Incorrect role selected!");
        return;
      }

      // Store user data and redirect
      localStorage.setItem("currentUser", JSON.stringify(result.user));
      alert("Login successful!");

      if (selectedRole === "teacher") window.location.href = "teacher-dashboard.html";
      else if (selectedRole === "student") window.location.href = "student-dashboard.html";
      else if (selectedRole === "admin") window.location.href = "admindashboard.html";
    } else {
      alert(result.message || "Login failed!");
    }
  } catch (err) {
    alert("Server error!");
    console.error(err);
  }
}

  function showRegisterModal() {
            document.getElementById("registerModal").style.display = "block";
            document.getElementById("register-form").reset();
        }

        function closeRegisterModal() {
            document.getElementById("registerModal").style.display = "none";
        }

        // Event handlers
        document.getElementById("register-form").addEventListener("submit", async function (e) {
            e.preventDefault();
            await register();
        });

        // Action functions
        async function register() {
            const email = document.getElementById("register-email").value.trim();
            const name = document.getElementById("register-UserName").value.trim();
            const password = document.getElementById("register-password").value.trim();
            const confirmPassword = document.getElementById("register-confirm-password").value.trim();
            const role = document.getElementById("register-role").value;
            const status = "Pending";

            if (!email || !password || !confirmPassword || !name) {
                alert("All fields are required!");
                return;
            }

            if (!email.endsWith("@gmail.com")) {
                alert("Only Gmail addresses allowed!");
                return;
            }

            if (password.length !== 8) {
                alert("Password must be 8 characters!");
                return;
            }

            if (password !== confirmPassword) {
                alert("Passwords don't match!");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password, role, name,status }),
                });

                const result = await response.json();

                if (response.ok) {
                    alert("Registration successful!");
                    closeRegisterModal();
                    loadUsers(); // Refresh users list
                } else {
                    alert(result.message || "Registration failed!");
                }
            } catch (err) {
                console.error(err);
            }
        }
