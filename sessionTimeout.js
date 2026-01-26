// ===== Session Timeout (10 minutes) =====
let idleTimer;
const IDLE_LIMIT = 10 * 60 * 1000; // 10 minutes

function resetIdleTimer() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(logoutUser, IDLE_LIMIT);
}

function logoutUser() {
  alert("Session expired due to inactivity. Please login again.");

  // 🔹 Firebase logout (if using auth)
  firebase.auth().signOut().then(() => {
    location.reload(); // or redirect to login page
  });

  // 🔹 If NOT using Firebase Auth, use this instead:
  // location.href = "login.html";
}

// Detect user activity
["mousemove", "keydown", "click", "scroll", "touchstart"].forEach(event => {
  window.addEventListener(event, resetIdleTimer);
});

// Start timer on page load
resetIdleTimer();
