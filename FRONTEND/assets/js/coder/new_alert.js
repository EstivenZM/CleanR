document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------
  // Mover navbar arriba/abajo según pantalla
  // -------------------------------
  const navbar = document.getElementById("mainNavbar");
  const footer = document.getElementById("footer");
  const headerContainer = document.getElementById("navbarContainerHeader");

  function moveNavbarBasedOnScreenWidth() {
    if (window.innerWidth < 768) {
      if (!footer.contains(navbar)) {
        footer.appendChild(navbar);
      }
    } else {
      if (!headerContainer.contains(navbar)) {
        headerContainer.appendChild(navbar);
      }
    }
  }
  moveNavbarBasedOnScreenWidth();
  window.addEventListener("resize", moveNavbarBasedOnScreenWidth);


  // Cargar ubicaciones en el <select>

  async function loadLocations() {
    const select = document.getElementById("lugar");

    try {
      const res = await fetch("http://localhost:3000/locations");
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

      const locations = await res.json();
      select.innerHTML = '<option value="" disabled selected>Seleccionar...</option>';

      locations.forEach(loc => {
        const option = document.createElement("option");
        option.value = loc.id_location;
        option.textContent = loc.name;
        select.appendChild(option);
      });

    } catch (err) {
      console.error("Error cargando locations:", err);
      select.innerHTML = '<option value="" disabled selected>Error al cargar ubicaciones</option>';
    }
  }

  loadLocations();


  // formulario de la alerta

  const btnSend = document.getElementById("btnSend");

  btnSend.addEventListener("click", async (e) => {
    e.preventDefault();

    // Verificar usuario logueado
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      return Swal.fire("Atención", "Debes iniciar sesión primero", "warning");
    }

    const message = document.getElementById("messageAlert").value.trim();
    const location = document.getElementById("lugar").value;
    const alertType = document.getElementById("alerta").value.trim();
    const userId = localStorage.getItem("id_user");
    //
    if (!alertType || !location || !message) {
      return Swal.fire("Atención", "Completa todos los campos", "warning");
    }
    console.log(message, location, alertType);
    try {

      // Enviar alerta al backend

      const res = await fetch("http://localhost:3000/alerts/newAlerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message,
          id_location: location,
          id_user: userId,
          alert_type: alertType,
        })

      });


      const data = await res.json();

      if (!res.ok) {
        return Swal.fire("Error", data.error || "No se pudo crear la alerta", "error");
      }

      Swal.fire("Éxito", "La alerta fue creada correctamente", "success");

      // Limpiar formulario
      document.getElementById("messageAlert").value = "";
      document.getElementById("alerta").value = "";
      document.getElementById("lugar").value = "";

    } catch (error) {
      console.error("Error enviando alerta:", error);
      Swal.fire("Error", "Error de conexión con el servidor", "error");
    }
  });
});
