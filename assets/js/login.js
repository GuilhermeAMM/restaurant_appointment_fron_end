const form = document.getElementById("login-form");
const btnSubmit = document.getElementById("btn-submit");
const errorDiv = document.getElementById("error-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  
  errorDiv.innerHTML = "";
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = '<span class="spinner-border"></span>Entrando...';

  try {
    const response = await fetch(
      "https://testes.globalhost.app.br/api/login/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("access_token", data.access);

      setTimeout(() => {
        window.location.href = "pages/home.html";
      }, 1000);
    } else {
      errorDiv.innerHTML = `
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            ${data.detail || "Usuário ou senha incorretos"}
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
    btnSubmit.innerHTML = "Entrar";
  }
});

const words = [
  "em segundos.",
  "com facilidade.",
  "sem complicação.",
  "em poucos cliques.",
];

const texts = [
  "Gerencie reservas, evite filas e aumente as vendas.",
  "Controle horários e ofereça uma experiência melhor ao cliente.",
  "Tudo organizado em um único lugar, chega de planilhas!",
  "Facilite para o cliente com PAGAMENTOS ONLINE.",
];

const wordEl = document.getElementById("dynamic-word");
const textEl = document.getElementById("dynamic-text");

let index = 0;

function changeText() {
  textEl.style.opacity = 0;

  setTimeout(() => {
    wordEl.textContent = words[index];
    textEl.textContent = texts[index];
    textEl.style.opacity = 1;

    index = (index + 1) % words.length;
  }, 3000);
}

changeText();
setInterval(changeText, 3000);
