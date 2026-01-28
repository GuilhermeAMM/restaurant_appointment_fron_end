const btnSubmit = document.getElementById("btn-submit");
const errorDiv = document.getElementById("error-message");
const urlParams = new URLSearchParams(window.location.search);
const busnessId = urlParams.get("id");
const methodValue = urlParams.get("method");
const url = busnessId
  ? `https://testes.globalhost.app.br/api/busness/${busnessId}/`
  : `https://testes.globalhost.app.br/api/busness/`;

function voltar() {
  window.location.href = `busness.html`;
}

// Verificar se usuário está autenticado
if (!localStorage.getItem("access_token")) {
  window.location.href = "login.html";
}

// Máscara CNPJ
document.getElementById("cnpj").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length <= 14) {
    value = value.replace(/^(\d{2})(\d)/, "$1.$2");
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
    value = value.replace(/(\d{4})(\d)/, "$1-$2");
  }
  e.target.value = value;
});

// Máscara CEP
document.getElementById("cep").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length <= 8) {
    value = value.replace(/^(\d{5})(\d)/, "$1-$2");
  }
  e.target.value = value;
});

// Máscara Telefone
document.getElementById("telefone").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length <= 11) {
    value = value.replace(/^(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
  }
  e.target.value = value;
});

// Buscar endereço pelo CEP
document.getElementById("cep").addEventListener("blur", async function (e) {
  const cep = e.target.value.replace(/\D/g, "");

  if (cep.length === 8) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        document.getElementById("endereco").value = data.logradouro;
        document.getElementById("cidade").value = data.localidade;
        document.getElementById("estado").value = data.uf;
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  }
});

document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = {
    name: document.getElementById("name").value,
    cnpj: document.getElementById("cnpj").value.replace(/\D/g, ""),
    cep: document.getElementById("cep").value.replace(/\D/g, ""),
    phone: document.getElementById("telefone").value.replace(/\D/g, ""),
    adress: document.getElementById("endereco").value,
    city: document.getElementById("cidade").value,
    number: document.getElementById("numero").value,
    state: document.getElementById("estado").value,
  };

  errorDiv.innerHTML = "";
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = '<span class="spinner-border"></span>Cadastrando...';

  try {
    const response = await fetchWithAuth(
      "https://testes.globalhost.app.br/api/establishment/",
      {
        method: "POST",
        body: JSON.stringify(formData),
      },
    );

    const data = await response.json();

    if (response.ok) {
      errorDiv.innerHTML = `
                        <div class="alert alert-success alert-dismissible fade show" role="alert">
                            Estabelecimento cadastrado com sucesso!
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                    `;

      setTimeout(() => {
        window.location.href = "busness.html";
      }, 1500);
    } else {
      errorDiv.innerHTML = `
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            ${data.detail || "Erro ao cadastrar estabelecimento"}
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
    btnSubmit.innerHTML = "Cadastrar Estabelecimento";
  }
});
