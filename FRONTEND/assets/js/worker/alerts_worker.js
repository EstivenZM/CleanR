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
});
import url from '../middleware.js';
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
    <div class="d-flex justify-content-between align-items-center mb-2">
      <span class="tag tutor-label fw-bolder text-uppercase px-3 py-1 rounded-pill">TUTOR</span>
      <button class="btn btn-custom btn-dark btn-sm rounded-pill">LISTO!</button>
    </div>
    <div class="motivo">
      <strong>Motivo:</strong> ${alert.alert_type}
    </div>
    <p class="mt-2  fs-8 fw-bold"><strong>Lugar:</strong> ${alert.location_name}</p>
    <p class="mt-1  fs-9 fw-bold">${alert.message}</p>
  `;

      const doneButton = card.querySelector("button");
      doneButton.addEventListener("click", () => markAlertDone(alert.id_alert));

      container.appendChild(card);
    });
  }
  // Cargar alertas 
  async function loadAlertsLocation() {
    try {
      const res = await fetch(`${url}/alerts/viewAlerts`);
      const data = await res.json();
      alerts = data.result;
      renderAlerts(alerts);
    } catch (err) {
      console.error("Error al cargar alertas:", err);
      const container = document.getElementById("alerts-list");
      container.textContent = "Error al cargar las alertas";
    }
  }

  loadAlertsLocation();

  // Cambiar estado de alerta de "en proceso" a "listo"
  async function markAlertDone(id_alert) {
    try {
      await fetch(`${url}/alerts/markDoneAlert/${id_alert}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });

      // Eliminar la alerta marcada de la lista local y re-renderizar
      alerts = alerts.filter(a => a.id_alert !== id_alert);
      renderAlerts(alerts);

    } catch (err) {
      console.error("Error al marcar alerta como lista:", err);
    }
  }