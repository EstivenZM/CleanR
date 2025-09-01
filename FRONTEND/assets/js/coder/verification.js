document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('mainNavbar');
    const footer = document.getElementById('footer');
    const headerContainer = document.getElementById('navbarContainerHeader');

    function moveNavbarBasedOnScreenWidth() {
        if (window.innerWidth < 768) {
            // Mover al footer si no está allí
            if (!footer.contains(navbar)) {
                footer.appendChild(navbar);
            }
        } else {
            // Mover de vuelta al header si no está allí
            if (!headerContainer.contains(navbar)) {
                headerContainer.appendChild(navbar);
            }
        }
    }
    // Ejecutar al cargar la página
    moveNavbarBasedOnScreenWidth();
    // Ejecutar cuando cambia el tamaño de la pantalla
    window.addEventListener('resize', moveNavbarBasedOnScreenWidth);

});
import url from '../middleware.js';

async function loadVerifiedAlerts() {
  try {
    const res = await fetch(`${url}/alerts/alertsReady`);
    if (!res.ok) throw new Error(`Error en la respuesta: ${res.status}`);
    const data = await res.json();
    const alerts = data.result;
  
    renderAlerts(alerts);
  } catch (err) {
    console.error("Error al cargar alertas:", err);
    const container = document.getElementById("alerts-container");
    container.textContent = "Error al cargar alertas";
  }
}
loadVerifiedAlerts();

function renderAlerts(alerts) {
  const container = document.getElementById("alerts-container");
  container.innerHTML = ""; // limpiar contenido previo
  if (!alerts || alerts.length === 0) {
    container.textContent = "No hay alertas para mostrar";
    return;
  }

  alerts.forEach(alert => {
    const card = document.createElement("div");
    card.className = "alert-card bg-purple text-white p-3 my-3 rounded-4";
    card.innerHTML = `
      <div class="motivo d-flex justify-content-between align-items-center bg-dark rounded-3 p-2">
        <span><strong>Motivo:</strong> ${alert.alert_type}</span>

      </div>
      <p class="mt-2 fs-8 fw-bold"><strong>Lugar:</strong> ${alert.location_name}</p>
      <p class="mt-1 fs-9 fw-bold">${alert.message}</p>
    `;
    container.appendChild(card);
  });


}
