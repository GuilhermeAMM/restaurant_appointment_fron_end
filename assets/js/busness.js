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
      function renderEstablishmentRow(establishment) {
        return `
                <tr>
                    <td>${establishment.name || "—"}</td>
                    <td>${establishment.cnpj || "—"}</td>
                    <td>${establishment.adress} , ${establishment.number} , ${establishment.city} 
                    , ${establishment.state  || "—"}</td>
                    <td class="text-end-new">
                        <button class="btn-update btn btn-sm btn-outline-warning" onclick="updateEstablishments(${establishment.id})">
                            Atualizar
                        </button>
                        <button class="btn-cancel btn btn-sm btn-outline-danger" onclick="excludeEstablishments(${establishment.id})">
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
      function viewEstablishments(establishmentsId) {
        window.location.href = `home.html?id=${establishmentsId}&`;
      }

      function updateEstablishments(establishmentsId) {
        window.location.href = `register_busness.html?id=${establishmentsId}&method=patch`;
      }

      function addEstablishments() {
        window.location.href = `register_busness.html?method=post`;
      }

      async function excludeEstablishments(establishmentsId) {
        const confirmed = confirm(
          "Tem certeza que deseja excluir este Estabelecimento?",
        );
        if (!confirmed) return;

        try {
          const response = await fetchWithAuth(
            `https://testes.globalhost.app.br/api/establishments/${establishmentsId}/`,
            {
              method: "DELETE",
            },
          );

          if (response.ok) {
            alert("Estabelecimento excluído com sucesso!");
            loadEstablishments();
          } else {
            alert("Erro ao excluir Estabelecimento");
          }
        } catch (error) {
          console.error("Erro ao excluir Estabelecimento:", error);
          alert("Erro ao excluir Estabelecimento");
        }
      }

      // ==================== CARREGAMENTO ====================
      async function loadEstablishments() {
        try {
          const response = await fetchWithAuth(
            "https://testes.globalhost.app.br/api/establishment/",
          );
          const establishments = await response.json();

          if (!establishments || establishments.length === 0) {
            updateTable(renderEmptyState("Nenhum estabelecimento cadastrado"));
            return;
          }

          const rowsHtml = establishments.map(renderEstablishmentRow).join("");
          updateTable(rowsHtml);
        } catch (error) {
          console.error("Erro ao carregar Estabelecimentos:", error);
          updateTable(
            renderErrorState("Erro ao carregar Estabelecimentos. Tente novamente."),
          );
        }
      }

      // Inicializar
      loadEstablishments();