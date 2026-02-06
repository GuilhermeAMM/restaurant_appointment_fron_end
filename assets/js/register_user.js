const form = document.getElementById("register-form");
const btnSubmit = document.getElementById("btn-submit");
const errorDiv = document.getElementById("error-message");

function voltar() {
  window.location.href = `../pages/settings.html`;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const password = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("password_confirm").value;

  errorDiv.innerHTML = "";

  if (password !== passwordConfirm) {
    errorDiv.innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        As senhas não coincidem. Por favor, verifique.
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                `;
    return;
  }

  const formData = {
    first_name: document.getElementById("first_name").value,
    last_name: document.getElementById("last_name").value,
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: password,
    password_confirm: passwordConfirm,
  };

  btnSubmit.disabled = true;
  btnSubmit.innerHTML = '<span class="spinner-border"></span>Cadastrando...';

  try {
    const response = await fetch(
      "https://testes.globalhost.app.br/api/register/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      },
    );

    const data = await response.json();

    if (response.ok) {
      errorDiv.innerHTML = `
                        <div class="alert alert-success alert-dismissible fade show" role="alert">
                            Cadastro realizado com sucesso! Redirecionando...
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                    `;

      if (data.access) {
        localStorage.setItem("access_token", data.access);
      }

      setTimeout(() => {
        window.location.href = "register_busness.html";
      }, 1500);
    } else {
      errorDiv.innerHTML = `
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            ${data.detail || "Erro ao cadastrar. Verifique os dados informados."}
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
    btnSubmit.innerHTML = "Criar Conta";
  }
});
