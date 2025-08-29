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
async function loadTutorAlerts() {
  const id_user = localStorage.getItem("id_user"); // lo recuperas del login
  const res = await fetch(`http://localhost:3000/alerts/tutor/${id_user}`);
  const data = await res.json();

  const container = document.getElementById("tutor-alerts-list");
  container.innerHTML = "";

  if (data.result.length === 0) {
    container.innerHTML = `<p class="text-center text-muted">No has creado alertas todavía.</p>`;
    return;
  }

  data.result.forEach(alert => {
    const card = document.createElement("div");
    card.className = "alert-card bg-info text-white p-3 my-3 rounded-4";

    card.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <span class="fw-bold">ID: ${alert.id_alert}</span>
        <span class="badge bg-dark">${alert.status}</span>
      </div>
      <p class="mt-3 fs-5">${alert.message}</p>
      <small class="text-light">Creado: ${new Date(alert.created_at).toLocaleString()}</small>
    `;

    container.appendChild(card);
  });
}


    let auth = sessionStorage.getItem("auth")
    if(auth != "true"){
        window.location.href = "../../index.html";
    }
