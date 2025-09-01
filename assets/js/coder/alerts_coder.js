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

import url from '../middleware.js'

// Mostrar alertas propias
function renderAlerts(alerts) {
  const container = document.getElementById("alerts-list");
  container.innerHTML = "";

  if (!alerts || alerts.length === 0) {
    container.textContent = "No hay ninguna alerta";
    return;
  }

  alerts.forEach(alert => {
    const card = document.createElement("div");
    card.className = "alert-card bg-purple text-white p-3 my-3 rounded-4";
    card.innerHTML = `
    <div class="motivo d-flex justify-content-between align-items-center bg-dark rounded-3 p-2">
      <span><strong>Motivo:</strong> ${alert.alert_type}</span>
      <button type="button" class="btn-alerts" data-id="${alert.id_alert}" > X </button>
    </div>
    <p class="mt-2 fs-8 fw-bold"><strong>Lugar:</strong> ${alert.location_name}</p>
    <p class="mt-1 fs-9 fw-bold">${alert.message}</p>
  `;

    container.appendChild(card);
  });


  // ELIMINAR ALERTA
  document.querySelectorAll('.btn-alerts').forEach(button => {
    button.addEventListener('click', async (e) => {
      const idAlert = e.target.getAttribute('data-id');
      try {
        const res = await fetch(`${url}/alerts/alerts/${idAlert}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Error al eliminar la alerta');
        loadAlerts();
      } catch (error) {
        console.error(error);
      }
    });
  });
}

async function loadAlerts() {
  try {
    const userId = parseInt(localStorage.getItem("id_user"))
    const res = await fetch(`${url}/alerts/user/${userId}`);

    if (!res.ok) throw new Error("Error en la respuesta");
    const data = await res.json();
    renderAlerts(data);
  } catch (err) {
    console.error("Error al cargar alertas:", err);
    const container = document.getElementById("alerts-list");
    container.textContent = "Error al cargar las alertas";
  }
}
loadAlerts();



