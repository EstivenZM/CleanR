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
    <div class="d-flex justify-content-between align-items-center">
      <span class="tag fw-bold bg-dark px-2 py-1 rounded-pill">MIS ALERTAS</span>
    </div>
    <p class="mt-2 fs-6 fw-bold"><strong>Lugar:</strong> ${alert.location_name}</p>
    <p class="mt-2 fs-6 fw-bold"><strong>Motivo:</strong> ${alert.alert_type}</p>
    <p class="mt-3 fs-5 fw-bold">${alert.message}</p>
  `;

  container.appendChild(card);
});
  }

  async function loadAlerts() {
  try {
    const res = await fetch("http://localhost:3000/alerts/user");
    const data = await res.json();
    renderAlerts(data);
  } catch (err) {
    console.error("Error al cargar alertas:", err);
  }
}



    let auth = sessionStorage.getItem("auth")
    if(auth != "true"){
        window.location.href = "../../index.html";
    }

