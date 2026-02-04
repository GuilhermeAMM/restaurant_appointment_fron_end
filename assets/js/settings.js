// ==================== AUTENTICAÇÃO ====================
const accessToken = localStorage.getItem("access_token");
if (!accessToken) {
  window.location.href = "../index.html";
}

async function connectStripe() {
  try {
    const response = await fetchWithAuth(
      `https://testes.globalhost.app.br/api/establishment/stripe/connect?establishment_id=${establishmentId}`,
    );
    if (response.ok) {
      const data = await response.json();
      window.open(data.url, "_blank");
    }
  } catch (error) {
    console.log(error);
  }
}

async function loadPaymentsStatus(){
  try {
    const response = await fetchWithAuth('https://testes.globalhost.app.br/api/stripe/status');
    if (response.ok){
      const data = await response.json();
      console.log(data);
      const statusStripe = document.getElementById("status-stripe");
      if (data.connected){
        statusStripe.innerHTML = `
        <p class="icon-status-connected">
            <i class="fa-solid fa-rss"></i>
            ${data.status}
        </p>`
      }
      else {
         statusStripe.innerHTML = `
        <p class="icon-status-desconnected">
            <i class="fa-solid fa-circle-exclamation"></i>
            ${data.status}
        </p>`

      }
     
    }
  }
  catch (error){
  }
}

async function loadPaymentValue(){
  try {
    const response = await fetchWithAuth('https://testes.globalhost.app.br/api/stripe/payments_value');
    if (response.ok) {
      const data = await response.json();
      document.getElementById("total-value").innerText = `R$ ${data.total}`
    }
  }
  catch(error) {
    console.log(error);
  }
}

let establishmentId = null;

async function loadUser() {
  try {
    const response = await fetchWithAuth("https://testes.globalhost.app.br/api/register/");
    if (response.ok) {
      const data = await response.json();
      document.getElementById("name-user").innerHTML = `
      <p>
        <i class="fa-solid fa-user"></i>
        ${data.first_name} ${data.last_name}
      </p>`;
      document.getElementById("email-user").innerHTML = `
      <p>
        <i class="fa-regular fa-envelope"></i>
        ${data.email}
      </p> `;
      document.getElementById("username").innerHTML = `
      <p>
        <i class="fa-solid fa-circle-user"></i>
        ${data.username}
      </p> `;
    }
  }
  catch(error){
    console.log(error);
  }
};


async function loadEstablishment() {
  try {
    const response = await fetchWithAuth(
      "https://testes.globalhost.app.br/api/establishment/",
    );
    if (response.ok) {
      const data = await response.json();
      const establishment = data[0];
      establishmentId = establishment.id;
      document.getElementById("establishment").innerHTML = `
      <p>
        <i class="fa-regular fa-building"></i>
          ${establishment.name}
      </p>`;
      document.getElementById("adress").innerHTML = `
       <p>
          <i class="fa-solid fa-location-dot"></i>
          ${establishment.adress}, ${establishment.number}, ${establishment.city}-${establishment.state}
        </p>`;
      document.getElementById("phone").innerHTML = `
      <p>
        <i class="fa-solid fa-phone"></i>
          ${establishment.phone}
      </p>`;
      document.getElementById("cnpj").innerHTML = `
      <div class="display-flex-settings-cnpj">
        <strong><p class="mr-5">CNPJ:</p></strong>
        <p>${establishment.cnpj}</p>
      </div>
      `
    }
  } catch (error) {
    console.log(error);
  }
}

function updateEstablishments() {
  if (!establishmentId) {
    console.error("Erro ao carregar Estabelecimento");
    return;
  }

  window.location.href = `register_busness.html?id=${establishmentId}&method=patch`;
}

function updateUser(userId) {
  window.location.href = `register_user.html?id=${userId}&method=patch`;
}

// Inicializar
window.addEventListener("load", async () => {
  await loadUser();
  await loadEstablishment();
  await loadPaymentsStatus();
  await loadPaymentValue();
});
