// ==================== AUTENTICAÇÃO ====================
const accessToken = localStorage.getItem("access_token");
if (!accessToken) {
  window.location.href = "../index.html";
}

// ==================== FORMATAÇÃO ====================
function formatDateTime(isoString) {
  if (!isoString) return "—";

  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function getStatusConfig(status) {
  const configs = {
    CONFIRMED: { class: "badge-confirmed", text: "Confirmado" },
    SCHEDULED: { class: "badge-pending", text: "Agendado" },
    CANCELED: { class: "badge-cancelled", text: "Cancelado" },
  };

  return configs[status] || { class: "badge-pending", text: text };
}

// ==================== RENDERIZAÇÃO ====================
function renderAppointmentRow(appointment) {
  const statusConfig = getStatusConfig(
    appointment.status,
    appointment.status_label,
  );

  return `
                <tr>
                    <td>${appointment.customer_name || "—"}</td>
                    <td>${appointment.number_people || "—"}</td>
                    <td>${formatDateTime(appointment.start_at)}</td>
                    <td>
                        <span class="badge-status ${statusConfig.class}">
                            ${statusConfig.text}
                        </span>
                    </td>
                    <td class="text-end-new">
                        <button class="btn-detail btn btn-sm btn-outline-secondary" onclick="viewAppointment(${appointment.id})">
                            Detalhes
                        </button>
                        <button class="btn-update btn btn-sm btn-outline-warning" onclick="updateAppointment(${appointment.id})">
                            Atualizar
                        </button>
                        <button class="btn-cancel btn btn-sm btn-outline-danger" onclick="cancelAppointment(${appointment.id})">
                            Cancelar
                        </button>
                    </td>
                </tr>
            `;
}

function renderEmptyState(message) {
  return `
                <tr>
                    <td colspan="5" class="text-center text-muted py-4">
                        ${message}
                    </td>
                </tr>
            `;
}

function renderErrorState(message) {
  return `
                <tr>
                    <td colspan="5" class="text-center text-danger py-4">
                        ${message}
                    </td>
                </tr>
            `;
}

function updateTable(htmlContent) {
  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = htmlContent;
}

// ==================== AÇÕES ====================
function viewAppointment(appointmentId) {
  window.location.href = `appointment_detail.html?id=${appointmentId}`;
}

function createAppointment() {
  window.location.href = `register_appointment.html?method=post`;
}

function updateAppointment(customerId) {
  window.location.href = `register_appointment.html?id=${customerId}&method=patch`;
}

async function cancelAppointment(appointmentId) {
  const confirmed = confirm(
    "Tem certeza que deseja cancelar este agendamento?",
  );
  if (!confirmed) return;

  try {
    const response = await fetchWithAuth(
      `https://testes.globalhost.app.br/api/appointment/${appointmentId}/`,
      {
        method: "DELETE",
      },
    );

    if (response.ok) {
      alert("Agendamento cancelado com sucesso!");
      loadAppointments();
    } else {
      alert("Erro ao cancelar agendamento");
    }
  } catch (error) {
    console.error("Erro ao cancelar agendamento:", error);
    alert("Erro ao cancelar agendamento");
  }
}
// ==================== CARREGAMENTO ====================
async function loadAppointments() {
  const urlParams = new URLSearchParams(window.location.search);
  const customerId = urlParams.get("id");

  let urlSearch;
  if (!customerId) {
    urlSearch = "https://testes.globalhost.app.br/api/appointment/";
  } else {
    urlSearch = `https://testes.globalhost.app.br/api/filter-appointment-customer/${customerId}/`;
  }

  try {
    const response = await fetchWithAuth(urlSearch);
    const appointments = await response.json();

    if (!appointments || appointments.length === 0) {
      updateTable(renderEmptyState("Nenhum agendamento encontrado"));
      return;
    }

    const rowsHtml = appointments.map(renderAppointmentRow).join("");
    updateTable(rowsHtml);
  } catch (error) {
    console.error("Erro ao carregar agendamentos:", error);
    updateTable(
      renderErrorState("Erro ao carregar agendamentos. Tente novamente."),
    );
  }
}

// Inicializar
loadAppointments();
