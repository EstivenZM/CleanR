    let auth = sessionStorage.getItem("auth")
    if(auth != "true"){
        window.location.href = "../../index.html";
    }



document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("mainNavbar");
  const footer = document.getElementById("footer");
  const headerContainer = document.getElementById("navbarContainerHeader");

  // -------------------------------
  // Mover navbar según pantalla
  // -------------------------------
  function moveNavbarBasedOnScreenWidth() {
    if (window.innerWidth < 768) {
      if (!footer.contains(navbar)) footer.appendChild(navbar);
    } else {
      if (!headerContainer.contains(navbar)) headerContainer.appendChild(navbar);
    }
  }
  moveNavbarBasedOnScreenWidth();
  window.addEventListener("resize", moveNavbarBasedOnScreenWidth);

  // -------------------------------
  // Alertas en proceso
  // -------------------------------
  let alerts = [];

  // Renderizar alertas
  function renderAlerts(alerts) {
    const container = document.getElementById("alerts-list");
    container.innerHTML = "";

    if (!alerts || alerts.length === 0) {
      container.textContent = "No hay alertas en proceso";
      return;
    }

    alerts.forEach(alert => {
  const card = document.createElement("div");
  card.className = "alert-card bg-purple text-white p-3 my-3 rounded-4";

  card.innerHTML = `
    <div class="d-flex justify-content-between align-items-center">
      <span class="tag fw-bold bg-dark px-2 py-1 rounded-pill">TUTOR</span>
      <button class="btn btn-custom btn-dark btn-sm rounded-pill">LISTO!</button>
    </div>
    <p class="mt-2 fs-6 fw-bold"><strong>Lugar:</strong> ${alert.location_name}</p>
    <p class="mt-2 fs-6 fw-bold"><strong>Motivo:</strong> ${alert.alert_type}</p>
    <p class="mt-3 fs-5 fw-bold">${alert.message}</p>
  `;

  const doneButton = card.querySelector("button");
  doneButton.addEventListener("click", () => markAlertDone(alert.id_alert));

  container.appendChild(card);
});

  }

  // Marcar alerta como lista
  async function markAlertDone(id_alert) {
    try {
      await fetch(`http://localhost:3000/alerts/${id_alert}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });

      // Eliminar de la lista local y re-renderizar
      alerts = alerts.filter(a => a.id_alert !== id_alert);
      renderAlerts(alerts);

    } catch (err) {
      console.error("Error al marcar alerta como lista:", err);
    }
  }

  // Cargar alertas en proceso
  async function loadAlerts() {
    try {
      const res = await fetch("http://localhost:3000/alerts/alerts");   
      const data = await res.json();
      alerts = data.result;
      renderAlerts(alerts);
    } catch (err) {
      console.error("Error al cargar alertas:", err);
      const container = document.getElementById("alerts-list");
      container.textContent = "Error al cargar las alertas";
    }
  }

  loadAlerts();
});
