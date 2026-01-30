const form = document.getElementById("form-send-email");
const btnSubmit = document.getElementById("btn-submit");
const errorDiv = document.getElementById("error-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const emailValue = document.getElementById("email").value;
  try {
    const response = await fetch(
      "https://testes.globalhost.app.br/api/auth/password-reset/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailValue,
        }),
      },
    );

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      errorDiv.innerHTML = `
                            <div class="alert alert-success alert-dismissible fade show" role="alert">
                                ${data.message}
                                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                            </div>
                `;
      setTimeout(() => {
        window.location.href = "/index.html";
      }, 3000);
    } else {
      errorDiv.innerHTML = `
                            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                ${data.detail || "Erro ao enviar email"}
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
