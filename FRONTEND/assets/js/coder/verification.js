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

// Función para mostrar alertas en el DOM
function renderAlerts(alerts) {
  const container = document.getElementById("alerts-container");
  container.innerHTML = ""; 

  if (!alerts || alerts.length === 0) {
    container.textContent = "No hay alertas para mostrar";
    return;
  }

  alerts.forEach(alert => {
    const div = document.createElement("div");
    div.textContent = `ID: ${alert.id} - Status: ${alert.status}`;
    container.appendChild(div);
  });
}

// Función para hacer fetch al backend según status
async function loadAlerts(status = "verification") {
  try {
    // Si quieres que sea dinámico según status
    const res = await fetch(`http://localhost:3000/alerts/${status}`);
    if (!res.ok) throw new Error("No se pudieron cargar las alertas");

    const data = await res.json();
    renderAlerts(data.result);
  } catch (err) {
    console.error(err);
    const container = document.getElementById("alerts-container");
    container.textContent = "Error al cargar las alertas";
  }
}


  loadAlerts();


