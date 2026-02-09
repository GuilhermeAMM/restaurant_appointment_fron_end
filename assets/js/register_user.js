const btnSubmit = document.getElementById("btn-submit");
const errorDiv = document.getElementById("error-message");
const urlParams = new URLSearchParams(window.location.search);
const methodValue = urlParams.get("method");
const getUrl = "https://testes.globalhost.app.br/api/register/";
const updateUrl = `https://testes.globalhost.app.br/api/update_user/`;

btnSubmit.innerHTML = methodValue ? "Atualizar Cliente" : "Cadastrar";

function voltar() {
  window.location.href = `settings.html`;
}

async function loadUsersData() {
  try {
    const response = await fetchWithAuth(
      `https://testes.globalhost.app.br/api/register/`,
    );
    const userData = await response.json();

    document.getElementById("first_name").value = userData.first_name || "";
    document.getElementById("last_name").value = userData.last_name || "";
    document.getElementById("username").value = userData.username || "";
    document.getElementById("email").value = userData.email || "";
  } catch (error) {
    errorDiv.innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        Erro ao carregar Usuario: ${error.message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>`;
  }
}

if (methodValue) {
  if (!localStorage.getItem("access_token")) {
    window.location.href = "../index.html";
  }
  loadUsersData();
}

document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = {
    first_name: document.getElementById("first_name").value,
    last_name: document.getElementById("last_name").value,
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    password_confirm: document.getElementById("password_confirm").value,
  };

  errorDiv.innerHTML = "";
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = '<span class="spinner-border"></span>Cadastrando...';

  async function sendData() {
    const method = methodValue ? "PATCH" : "POST";
    const url = methodValue ? updateUrl : getUrl;

    try {
      const response = await fetchWithAuth(url, {
        method,
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        errorDiv.innerHTML = `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        Cliente ${methodValue ? "atualizado" : "cadastrado"} com sucesso!
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                    `;

        setTimeout(() => {
          window.location.href = "settings.html";
        }, 1000);
      } else {
        errorDiv.innerHTML = `
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            ${data.detail || "Dados incorretos"}
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                    `;
      }
    } catch (error) {
      errorDiv.innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        Erro na conexão: ${error.message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                `;
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = methodValue
        ? "Atualizar Estabelecimento"
        : "Cadastrar";
    }
  }
  sendData();
});
