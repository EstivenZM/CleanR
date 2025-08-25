document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        Swal.fire({
            icon: "warning",
            title: "Oops...",
            text: "Todos los campos son obligatorios.",
            customClass: {
                confirmButton: 'btn-confirm-alert',
                icon: 'icon-alert'
            }
        });

        return;
    }

    try {
        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, rol})
        });

        const data = await res.json();

        if (!res.ok) {
            Swal.fire({
                icon: "error",
                title: "¡Error!",
                text: data.message || "Se ha producido un error inesperado."
            });

            return;
        }

        // Guardar la información del usuario en sessionStorage. / Save user information to sessionStorage.
        sessionStorage.setItem("userName", data.user.name);
        sessionStorage.setItem("userRole", data.user.rol);

        Swal.fire({
            icon: "success",
            title: `¡Bienvenido ${data.user.name}!`,
            text: `Rol: ${data.user.rol}`,
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            if(data.user.rol === 'admin') {
                window.location.href = "...";
            } else {
                window.location.href = "...";
            }
        });

    } catch (error) {

        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No se pudo conectar al servidor."
        });
    }
});
