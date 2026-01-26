// ===== Session Timeout (10 minutes) =====
let idleTimer;
const IDLE_LIMIT = 10 * 60 * 1000; // 10 minutes

function resetIdleTimer() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(logoutUser, IDLE_LIMIT);
}

function logoutUser() {
  alert("⚠️ Session expired due to inactivity (10 minutes). Please login again.");

  localStorage.clear();   // clear login state
  location.reload();      // return to login page
}

// Detect user activity
["mousemove", "keydown", "click", "scroll", "touchstart"].forEach(event => {
  window.addEventListener(event, resetIdleTimer);
});

// Start timer when page loads
resetIdleTimer();
