const urlParams = new URLSearchParams(window.location.search);
const appointmentId = urlParams.get("id");
const message = document.getElementById("error-message");

// Verificar autenticação
if (!localStorage.getItem("access_token")) {
  window.location.href = "../index.html";
}

// Função para voltar
function goBack() {
  window.history.back();
}

// Função para Pagamento
async function paymentStripe() {
  message.innerHTML = message.innerHTML = `
                        <div class="alert alert-success alert-dismissible fade show" role="alert">
                            Enviando email com pagamento da reserva Aguarde.....
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                    `;
  try {
    const response = await fetchWithAuth(
      `https://testes.globalhost.app.br/api/payments/checkout/${appointmentId}`,
    );
    const data = await response.json();
    console.log(data);

    if (response.ok) {
      message.innerHTML = `
                        <div class="alert alert-success alert-dismissible fade show" role="alert">
                            <i class="fa-regular fa-circle-check"></i>
                            ${data.message}
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                    `;
    } else {
      message.innerHTML = `
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            <i class="fa-regular fa-circle-check"></i>
                            Erro ao processar pagamento
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                    `;
    }
  } catch (error) {
    message.innerHTML = `
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            <i class="fa-regular fa-circle-check"></i>
                            Erro ao conectar com o servidor
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                    `;
  } finally {
    setTimeout(() => {
      loadAppointmentDetails();
    }, 3000);
  }
}

// Formatação de data (exemplo: "2026-01-25T14:30:00" -> "25 de Janeiro de 2026 às 14:30")
function formatDateTime(dateString) {
  const date = new Date(dateString);
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleDateString("pt-BR", options).replace(",", " às");
}

// Formatação de data simples (exemplo: "2026-01-18T10:30:00" -> "18/01/2026 às 10:30")
function formatDateTimeSimple(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} às ${hours}:${minutes}`;
}

// Formatação de moeda (exemplo: 150.50 -> "R$ 150,50")
function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// Formatação de status (retorna classe CSS apropriada)
function getStatusClass(status) {
  const statusMap = {
    CONFIRMED: "badge-confirmed",
    SCHEDULED: "badge-pending",
    CANCELED: "badge-cancelled",
  };
  return statusMap[status] || "badge-pending";
}

// Exemplo: Carregar dados do agendamento da API
async function loadAppointmentDetails() {
  try {
    // Obter ID da URL (exemplo: appointment_detail.html?id=123)
    const urlParams = new URLSearchParams(window.location.search);
    const appointmentId = urlParams.get("id");

    if (!appointmentId) {
      console.error("ID do agendamento não encontrado na URL");
      return;
    }

    // Fazer requisição para API
    const response = await fetchWithAuth(
      `https://testes.globalhost.app.br/api/appointment/${appointmentId}/`,
      {
        method: "GET",
      },
    );
    const data = await response.json();
    console.log(data);

    if (response.ok) {
      // Atualizar elementos da página com dados reais
      document.getElementById("customer").textContent =
        data.customer_name || "—";
      document.getElementById("location").textContent =
        data.location_name || "—";
      document.getElementById("start_at").textContent = data.start_at
        ? formatDateTime(data.start_at)
        : "—";

      const statusElement = document.getElementById("status");
      statusElement.className = "badge-status " + getStatusClass(data.status);
      statusElement.textContent = data.status_label;

      document.getElementById("price").textContent = data.price
        ? formatCurrency(data.price)
        : "R$ 0,00";
      document.getElementById("payment_method").textContent =
        data.payment_method_label || "—";
      document.getElementById("number_people").textContent = data.number_people
        ? `${data.number_people} ${data.number_people === 1 ? "pessoa" : "pessoas"}`
        : "—";
      document.getElementById("observation").textContent =
        data.observation || "—";
      document.getElementById("created_at").textContent = data.created_at
        ? formatDateTimeSimple(data.created_at)
        : "—";
      document.getElementById("updated_at").textContent = data.updated_at
        ? formatDateTimeSimple(data.updated_at)
        : "—";
    } else {
      console.error("Erro ao carregar agendamento:", data);
      alert("Erro ao carregar detalhes do agendamento");
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro ao conectar com o servidor");
  }
}

// Carregar dados quando a página carregar
loadAppointmentDetails();
