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

const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

if (togglePassword && passwordInput) {
  togglePassword.addEventListener("click", () => {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  });
}

const submitBtn = document.getElementById("loginBtn");

if (submitBtn) {
  submitBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const mot_de_passe = document.getElementById("password").value;

    if (!email || !mot_de_passe) {
      alert("Email et mot de passe obligatoires.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/utilisateurs/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          mot_de_passe
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Erreur lors de la connexion.");
        return;
      }

      alert("Connexion réussie !");
      window.location.href = "index.html";

    } catch (error) {
      console.error(error);
      alert("Erreur serveur");
    }
  });
}