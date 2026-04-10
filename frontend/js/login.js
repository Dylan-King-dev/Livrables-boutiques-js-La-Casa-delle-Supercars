const passwordInput = document.getElementById("password");
const toggleBtn = document.getElementById("togglePassword");
if (toggleBtn && passwordInput) {
  toggleBtn.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    toggleBtn.setAttribute("aria-label", isHidden ? "Masquer le mot de passe" : "Afficher le mot de passe");
  });
}

const guestBtn = document.getElementById("guestContinue");
if (guestBtn) {
  guestBtn.addEventListener("click", () => {
    if (document.referrer) {
      window.location.href = document.referrer;
    } else {
      window.history.back();
    }
  });
}
