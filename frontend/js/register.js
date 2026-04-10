const button = document.querySelector('.btn');

button.addEventListener('click', async () => {
  const prenom = document.getElementById('firstName').value;
  const nom = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const mot_de_passe = document.getElementById('password').value;

    // Check si le fdp a bien tout remplie sinon on affiche une alerte pour lui dire que tous les champs sont obligatoires
  if (!prenom || !nom || !email || !mot_de_passe) {
    alert('Tous les champs sont obligatoires');
    return;
  }
  // envoie la requete pour creer le nouvelle utilisateur
  try {
    const response = await fetch('http://localhost:3000/api/utilisateurs/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prenom,
        nom,
        email,
        mot_de_passe
      })
    });

    const data = await response.json();
    // 
    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert('Compte créé avec succès');

    // redirige vers la connexion
    window.location.href = 'login.html';
    // affiche si il y a une erreur
  } catch (error) {
    console.error(error);
    alert('Erreur serveur');
  }
});
