/* ==========================================================================
   PlaceTrack — auth.js
   Frontend-only validation for login, register and admin-login.
   No real authentication, no password storage.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------------- Student Login ---------------- */
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      const email = document.getElementById("login-email");
      const password = document.getElementById("login-password");

      ptClearError(email);
      ptClearError(password);

      if (!ptIsEmail(email.value.trim())) {
        ptShowError(email, "Enter a valid email address.");
        valid = false;
      }
      if (password.value.length < 6) {
        ptShowError(password, "Password must be at least 6 characters.");
        valid = false;
      }

      if (!valid) return;

      // Frontend-only: no real auth. Just remember a display name for the session.
      const displayName = email.value.split("@")[0];
      sessionStorage.setItem("pt_user_name", displayName.charAt(0).toUpperCase() + displayName.slice(1));
      ptToast("Login successful. Redirecting…", "success");
      setTimeout(() => (window.location.href = "dashboard.html"), 700);
    });
  }

  /* ---------------- Student Register ---------------- */
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;

      const fullName = document.getElementById("reg-fullname");
      const email = document.getElementById("reg-email");
      const password = document.getElementById("reg-password");
      const confirm = document.getElementById("reg-confirm");
      const college = document.getElementById("reg-college");
      const branch = document.getElementById("reg-branch");
      const cgpa = document.getElementById("reg-cgpa");
      const gradYear = document.getElementById("reg-gradyear");

      [fullName, email, password, confirm, college, branch, cgpa, gradYear].forEach(ptClearError);

      if (fullName.value.trim().length < 2) {
        ptShowError(fullName, "Enter your full name.");
        valid = false;
      }
      if (!ptIsEmail(email.value.trim())) {
        ptShowError(email, "Enter a valid email address.");
        valid = false;
      }
      if (password.value.length < 6) {
        ptShowError(password, "Password must be at least 6 characters.");
        valid = false;
      }
      if (confirm.value !== password.value || confirm.value === "") {
        ptShowError(confirm, "Passwords do not match.");
        valid = false;
      }
      if (college.value.trim().length < 2) {
        ptShowError(college, "Enter your college name.");
        valid = false;
      }
      if (branch.value === "") {
        ptShowError(branch, "Select your branch.");
        valid = false;
      }
      const cgpaVal = parseFloat(cgpa.value);
      if (isNaN(cgpaVal) || cgpaVal < 0 || cgpaVal > 10) {
        ptShowError(cgpa, "Enter a CGPA between 0 and 10.");
        valid = false;
      }
      const yearVal = parseInt(gradYear.value, 10);
      if (isNaN(yearVal) || yearVal < 2024 || yearVal > 2030) {
        ptShowError(gradYear, "Enter a valid graduation year.");
        valid = false;
      }

      if (!valid) return;

      PT.write("pt_profile", {
        fullName: fullName.value.trim(),
        email: email.value.trim(),
        college: college.value.trim(),
        branch: branch.value,
        cgpa: cgpaVal.toFixed(2),
        graduationYear: yearVal,
        phone: "",
        skills: [],
      });
      sessionStorage.setItem("pt_user_name", fullName.value.trim().split(" ")[0]);
      ptToast("Account created. Please log in.", "success");
      setTimeout(() => (window.location.href = "login.html"), 900);
    });
  }

  /* ---------------- Admin Login ---------------- */
  const adminForm = document.getElementById("admin-login-form");
  if (adminForm) {
    adminForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      const email = document.getElementById("admin-email");
      const password = document.getElementById("admin-password");

      ptClearError(email);
      ptClearError(password);

      if (!ptIsEmail(email.value.trim())) {
        ptShowError(email, "Enter a valid admin email address.");
        valid = false;
      }
      if (password.value.length < 6) {
        ptShowError(password, "Password must be at least 6 characters.");
        valid = false;
      }

      if (!valid) return;

      sessionStorage.setItem("pt_admin", "true");
      ptToast("Welcome back, Admin. Redirecting…", "success");
      setTimeout(() => (window.location.href = "admin-dashboard.html"), 700);
    });
  }
});
