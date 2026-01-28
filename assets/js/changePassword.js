const form = document.getElementById("form-change-password");
const btnSubmit = document.getElementById("btn-submit");
const errorDiv = document.getElementById("error-message");
const urlParams = new URLSearchParams(window.location.search);
const uid = urlParams.get("uid");
const token = urlParams.get("token");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const password = document.getElementById("password").value;
  const password_confirm = document.getElementById("password_confirm").value;
  try {
    const response = await fetch(
      "https://testes.globalhost.app.br/api/auth/password-reset/confirm",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password,
          password_confirm: password_confirm,
          uid: uid,
          token: token,
        }),
      },
    );

    const data = await response.json();
    if (response.ok) {
      console.log(data);
      errorDiv.innerHTML = `
                            <div class="alert alert-success alert-dismissible fade show" role="alert">
                                ${data.message}
                                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                            </div>
                `;
      setTimeout(() => {
        window.location.href = "index.html";
      }, 3000);
    } else {
      errorDiv.innerHTML = `
                            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                ${data.message || "Erro ao cadastrar senha"}
                                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                            </div>
                        `;
    }
  } catch (error) {
    console.log(error);
    errorDiv.innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        Erro na conexÃ£o: ${error.message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                `;
  }
});
