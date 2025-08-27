// assets/js/new_alert/new_alert.js
document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------
  // Mover navbar arriba/abajo segun pantalla
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

  // -------------------------------
  // Manejo de formulario de alerta
  // -------------------------------
  const btnSend = document.getElementById("btnSend");

  btnSend.addEventListener("click", async (e) => {
    e.preventDefault(); // evitar recarga si está dentro de un form

    const message = document.getElementById("messageAlert").value.trim();
    const location = document.getElementById("lugar").value;
    const alertType = document.getElementById("alerta").value.trim();

    // Recuperar usuario desde localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      return Swal.fire("Error", "Debes iniciar sesión primero", "error");
    }

    // Validación
    if (!alertType || location === "select" || !message) {
      return Swal.fire("Atención", "Completa todos los campos", "warning");
    }

    try {
      const res = await fetch("http://localhost:3000/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `${alertType} - ${message}`,
          id_location: location,
          id_user: user.id_user,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return Swal.fire(
          "Error",
          data.error || "No se pudo crear la alerta",
          "error"
        );
      }

      Swal.fire("Éxito", "La alerta fue creada correctamente", "success");

      // Reset alert fields
      document.getElementById("messageAlert").value = "";
      document.getElementById("alerta").value = "";
      document.getElementById("lugar").value = "select";
    } catch (error) {
      console.error("Error enviando alerta:", error);
      Swal.fire("Error", "Error de conexión con el servidor", "error");
    }
  });
});
