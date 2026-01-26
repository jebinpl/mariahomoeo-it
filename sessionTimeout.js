// ===== Session Timeout (10 minutes) =====
let idleTimer;
const IDLE_LIMIT = 02 * 60 * 1000; // 10 minutes

function resetIdleTimer() {
  // ⛔ do nothing if user is not logged in
  if (localStorage.getItem("loggedIn") !== "true") return;

  clearTimeout(idleTimer);
  idleTimer = setTimeout(logoutUser, IDLE_LIMIT);
}

function logoutUser() {
  // ⛔ prevent repeat execution
  if (localStorage.getItem("loggedIn") !== "true") return;

  alert("⚠️ Session expired due to inactivity (10 minutes). Please login again.");

  localStorage.clear();
  clearTimeout(idleTimer);
  location.reload();
}

// Detect user activity
["mousemove", "keydown", "click", "scroll", "touchstart"].forEach(event => {
  window.addEventListener(event, resetIdleTimer);
});

// Start timer ONLY if logged in
if (localStorage.getItem("loggedIn") === "true") {
  resetIdleTimer();
}
