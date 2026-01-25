 $("#price").maskMoney();
      const btnSubmit = document.getElementById("btn-submit");
      const errorDiv = document.getElementById("error-message");
      const urlParams = new URLSearchParams(window.location.search);
      const appointmentId = urlParams.get("id");
      const methodValue = urlParams.get("method");
      const url = appointmentId
        ? `https://testes.globalhost.app.br/api/appointment/${appointmentId}/`
        : `https://testes.globalhost.app.br/api/appointment/`;
      // Verificar se usuário está autenticado
      if (!localStorage.getItem("access_token")) {
        window.location.href = "login.html";
      }

      btnSubmit.textContent = appointmentId
        ? "Atualizar Agendamento"
        : "Cadastrar";

      function getMethod(method) {
        const methods = {
          patch: "PATCH",
          post: "POST",
        };
        return methods[method];
      }

      function voltar() {
        window.location.href = `home.html`;
      }

      // ----- LOAD CUSTOMER ------
      async function loadCustomers() {
        const customerSelect = document.getElementById("customer");
        try {
          const response = await fetchWithAuth(
            "https://testes.globalhost.app.br/api/customer/",
          );
          const customers = await response.json();

          const customersOptions = customers.map((customer, index) => {
            return `<option value="${customer.id}">${customer.full_name}</option>`;
          });
          console.log(customerSelect);
          customerSelect.innerHTML =
            `<option value="">Selecione</option>` + customersOptions;
        } catch (error) {
          console.log("Erro ao carregar clientes: ", error);
        }
      }
      loadCustomers();

      async function loadAppointmentData() {
        try {
          const response = await fetchWithAuth(url);
          const appointmentData = await response.json();

          console.log(appointmentData);
          document.getElementById("customer").value =
            appointmentData.customer_id || "";
          document.getElementById("number_people").value =
            appointmentData.number_people || "";
          document.getElementById("start_at").value =
            moment(appointmentData.start_at).format("YYYY-MM-DDTHH:mm") || "";
          document.getElementById("payment_method").value =
            appointmentData.payment_method || "";
          document.getElementById("price").value = appointmentData.price || "";
          document.getElementById("observation").value =
            appointmentData.observation || "";
        } catch (error) {
          errorDiv.innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        Erro ao carregar agendamento: ${error.message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>`;
        }
      }

      if (appointmentId) {
        loadAppointmentData();
      }

      document
        .querySelector("form")
        .addEventListener("submit", async function (e) {
          e.preventDefault();

          // Configure Number format
          const price = document.getElementById("price").value;
          const customerIdStr = document.getElementById("customer").value;
          const customerIdint = Number.parseInt(customerIdStr, 10);
          const priceValue = parseFloat(
            price.replace(/[^0-9,]*/g, "").replace(",", "."),
          );

          console.log(customerIdint);
          console.log(priceValue);
          const formDataAppointment = {
            observation: document.getElementById("observation").value,
            start_at: document.getElementById("start_at").value,
            number_people: document.getElementById("number_people").value,
            payment_method: document.getElementById("payment_method").value,
            customer_id: customerIdint,
            price: priceValue,
          };

          errorDiv.innerHTML = "";
          btnSubmit.disabled = true;
          btnSubmit.innerHTML =
            '<span class="spinner-border"></span>Cadastrando...';
          sendDataAppointment();

          async function sendDataAppointment() {
            const method = getMethod(methodValue);

            try {
              const response = await fetchWithAuth(url, {
                method: method,
                body: JSON.stringify(formDataAppointment),
              });

              const data = await response.json();

              if (response.ok) {
                errorDiv.innerHTML = `
                            <div class="alert alert-success alert-dismissible fade show" role="alert">
                                Agendamento cadastrado com sucesso!
                                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                            </div>
                        `;

                setTimeout(() => {
                  window.location.href = "home.html";
                }, 1500);
              } else {
                errorDiv.innerHTML = `
                            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                ${data.detail || "Erro ao cadastrar agendamento"}
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
              btnSubmit.innerHTML = appointmentId
                ? "Atualizar Agendamento"
                : "Cadastar";
            }
          }
        });