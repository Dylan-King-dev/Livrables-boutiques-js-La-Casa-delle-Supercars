// Bouton "continuer en invité"
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

// Bouton "Créer un compte"
const submitBtn = document.querySelector(".actions .btn");
// recuperer les value des id recuperer au element correspondant dans le html de register.html
if (submitBtn) {
  submitBtn.addEventListener("click", async () => {
    const prenom = document.getElementById("firstName").value.trim();
    const nom = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const mot_de_passe = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value;

    // Vérifications si le formulaire est entierement remplis
    if (!prenom || !nom || !email || !mot_de_passe || !confirm) {
      alert("Tous les champs sont obligatoires.");
      return;
    }
    // verif si le mdp est different de celui enregistrer sur la DB en cas ou kantin essaye de m'arnaquer
    if (mot_de_passe !== confirm) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }
    // envoie en post a la db
    try {
      const response = await fetch("http://localhost:3000/api/utilisateurs/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nom,
          prenom,
          email,
          mot_de_passe
        })
      });
      // on attend la reponse de la db et on la converti en json
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Erreur lors de l'inscription.");
        return;
      }

      alert("Compte créé avec succès !");
      window.location.href = "login.html";

    } catch (error) {
      console.error(error);
      alert("Erreur serveur");
    }
  });
}