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

    let alerts = [];

// Cargar alertas desde backend
async function loadAlerts() {
  try {
    const res = await fetch("http://localhost:3000/alerts"); 
    if (!res.ok) throw new Error("No se pudieron cargar las alertas");

    const data = await res.json();
    alerts = data.result; 
    renderAlerts();
  } catch (error) {
    console.error("Error al cargar alertas", error);
  }
}


// Renderizar alertas en pantalla
function renderAlerts() {
  const container = document.getElementById("alerts-list");
  container.innerHTML = "";

  if (alerts.length === 0) {
    container.innerHTML = `<p class="text-white text-center">No hay alertas disponibles </p>`;
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
      <p class="mt-3 fs-5 fw-bold">${alert.message}</p>
    `;

    // Evento de botón LISTO
    const doneButton = card.querySelector("button");
    doneButton.addEventListener("click", () => Done(alert.id_alert));


    container.appendChild(card);
  });
}

// Marcar alerta como completada y redirigir a verificación
async function Done(id) {
  try {
    const res = await fetch(`http://localhost:3000/alerts/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) throw new Error("No se pudo completar la alerta");

    // Redirigir al trabajador a la página de verificación
    window.location.href = "/pages/coder/verification.html?id=" + id;


  } catch (error) {
    console.error("Error al completar la alerta:", error);
  }
}

// Inicializar
loadAlerts();

});