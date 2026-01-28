// ==================== AUTENTICAÇÃO ====================
const accessToken = localStorage.getItem("access_token");
if (!accessToken) {
  window.location.href = "login.html";
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

// ==================== RENDERIZAÇÃO ====================
function renderCustomerRow(customer) {
  return `
                <tr>
                    <td>${customer.full_name || "—"}</td>
                    <td>${customer.phone || "—"}</td>
                    <td>${customer.email || "—"}</td>
                    <td>${formatDateTime(customer.created_at)}</td>
                    <td class="text-end-new">
                        <button class="btn-detail btn btn-sm btn-outline-secondary" onclick="viewCustomer(${customer.id})">
                            Ver Agendamentos
                        </button>
                        <button class="btn-update btn btn-sm btn-outline-warning" onclick="updateCustomer(${customer.id})">
                            Atualizar
                        </button>
                        <button class="btn-cancel btn btn-sm btn-outline-danger" onclick="excludeCustomer(${customer.id})">
                            Excluir
                        </button>
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
function viewCustomer(customerId) {
  window.location.href = `home.html?id=${customerId}&`;
}

function updateCustomer(customerId) {
  window.location.href = `register_customer.html?id=${customerId}&method=patch`;
}

function addCustomer() {
  window.location.href = `register_customer.html?method=post`;
}

async function excludeCustomer(customerId) {
  const confirmed = confirm("Tem certeza que deseja excluir este cliente?");
  if (!confirmed) return;

  try {
    const response = await fetchWithAuth(
      `https://testes.globalhost.app.br/api/customer/${customerId}/`,
      {
        method: "DELETE",
      },
    );

    if (response.ok) {
      alert("Cliente excluído com sucesso!");
      loadCustomers();
    } else {
      alert("Erro ao excluir cliente");
    }
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);
    alert("Erro ao excluir cliente");
  }
}

// ==================== CARREGAMENTO ====================
async function loadCustomers() {
  try {
    const response = await fetchWithAuth(
      "https://testes.globalhost.app.br/api/customer/",
    );
    const customers = await response.json();

    if (!customers || customers.length === 0) {
      updateTable(renderEmptyState("Nenhum cliente cadastrado"));
      return;
    }

    const rowsHtml = customers.map(renderCustomerRow).join("");
    updateTable(rowsHtml);
  } catch (error) {
    console.error("Erro ao carregar agendamentos:", error);
    updateTable(
      renderErrorState("Erro ao carregar agendamentos. Tente novamente."),
    );
  }
}

// Inicializar
loadCustomers();
