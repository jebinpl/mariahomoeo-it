// ===== Session Timeout (10 minutes) =====
let idleTimer;
const USER_IDLE_LIMIT  = 5  * 60 * 1000;   // 5 minutes
const ADMIN_IDLE_LIMIT = 30 * 60 * 1000;   // 30 minutes

function getIdleLimit() {
  const role = localStorage.getItem("role");

  if (role === "admin") {
    return ADMIN_IDLE_LIMIT;
  }

  // default → normal user
  return USER_IDLE_LIMIT;
}

function resetIdleTimer() {
  if (localStorage.getItem("loggedIn") !== "true") return;

  clearTimeout(idleTimer);
  idleTimer = setTimeout(logoutUser, getIdleLimit());
}


function logoutUser() {
  if (localStorage.getItem("loggedIn") !== "true") return;

  const role = localStorage.getItem("role");
  const time = role === "admin" ? "30 minutes" : "5 minutes";

  alert(`⚠️ Session expired due to inactivity (${time}). Please login again.`);

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

