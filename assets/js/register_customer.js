const form = document.getElementById("register-customer-form");
const btnSubmit = document.getElementById("btn-submit");
const errorDiv = document.getElementById("error-message");
const urlParams = new URLSearchParams(window.location.search);
const customerId = urlParams.get("id");
const methodValue = urlParams.get("method");
const url = customerId
  ? `https://testes.globalhost.app.br/api/customer/${customerId}/`
  : `https://testes.globalhost.app.br/api/customer/`;
btnSubmit.innerHTML = customerId ? "Atualizar Cliente" : "Cadastrar";

function getMethod(method) {
  const methods = {
    patch: "PATCH",
    post: "POST",
  };
  return methods[method];
}

// Verificar se usuário está autenticado
if (!localStorage.getItem("access_token")) {
  window.location.href = "../index.html";
}

async function loadCustomerData() {
  try {
    const response = await fetchWithAuth(url);
    const customerData = await response.json();

    console.log(customerData);
    document.getElementById("full_name").value = customerData.full_name || "";
    document.getElementById("phone").value = customerData.phone || "";
    document.getElementById("email").value = customerData.email || "";
  } catch (error) {
    errorDiv.innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        Erro ao carregar cliente: ${error.message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>`;
  }
}

function voltar() {
  window.location.href = `customers.html`;
}

// Carregar dados se for edição
if (customerId) {
  loadCustomerData();
}

// Máscara Telefone
document.getElementById("phone").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length <= 11) {
    value = value.replace(/^(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
  }
  e.target.value = value;
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const full_name = document.getElementById("full_name").value;
  const phone = document.getElementById("phone").value.replace(/\D/g, "");
  const email = document.getElementById("email").value;

  errorDiv.innerHTML = "";
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = '<span class="spinner-border"></span>Entrando...';

  async function sendData() {
    const method = getMethod(methodValue);

    try {
      const response = await fetchWithAuth(url, {
        method: method,
        body: JSON.stringify({
          full_name: full_name,
          phone: phone,
          email: email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        errorDiv.innerHTML = `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        Cliente ${customerId ? "atualizado" : "cadastrado"} com sucesso!
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                    `;

        setTimeout(() => {
          window.location.href = "customers.html";
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
      btnSubmit.innerHTML = customerId ? "Atualizar Cliente" : "Cadastrar";
    }
  }
  sendData();
});
