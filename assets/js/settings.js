function updateUser(userId) {
  window.location.href = `register_user.html?id=${userId}&method=patch`;
}

async function connectStripe() {
  try {
    const response = await fetchWithAuth(
      `https://testes.globalhost.app.br/api/establishment/stripe/connect?establishment_id=${establishmentId}`,
    );
    if (response.ok) {
      const data = await response.json();
      window.location.href = data.url;
    }
  } catch (error) {
    console.log(error);
  }
}

let establishmentId = null;

async function loadEstablishment() {
  try {
    const response = await fetchWithAuth(
      "https://testes.globalhost.app.br/api/establishment/",
    );
    if (response.ok) {
      const data = await response.json();
      const establishment = data[0];
      establishmentId = establishment.id;
    }
  } catch (error) {
    console.log(error);
  }
}

// Inicializar
window.addEventListener("load", async () => {
  await loadEstablishment();
});
