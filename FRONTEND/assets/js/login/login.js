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
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            Swal.fire({
                icon: "error",
                title: "¡Error!",
                text: data.message || "Se ha producido un error inesperado.",
                customClass: {
                    confirmButton: 'btn-confirm-alert',
                    icon: 'icon-alert'
                }
            });
            return;
        }

        // Guardar datos del usuario en localStorage. / Save user data in localStorage.
        function saveData() {
            localStorage.setItem("fullname", data.user.fullname);
            localStorage.setItem("email", data.user.email);
            localStorage.setItem("rol", data.user.rol);
        }
        

        Swal.fire({
            icon: "success",
            title: `¡Bienvenido ${data.user.fullname}!`,
            text: `Rol: ${data.user.rol}`,
            timer: 2000,
            showConfirmButton: false,
            customClass: {
                confirmButton: 'btn-confirm-alert',
                icon: 'icon-alert'
            }
        }).then(() => {
            switch (data.user.rol) {
                case 'admin':
                    window.location.href = "../../../pages/admin/home_admin.html";
                    break;
                case 'worker':
                    window.location.href = "../../../pages/worker/home_worker.html";
                    break;
                case 'tutor':
                    window.location.href = "../../../pages/coder/new_alert.html";
                    break;
            }
        });

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No se pudo conectar al servidor.",
            customClass: {
                confirmButton: 'btn-confirm-alert',
                icon: 'icon-alert'
            }
        });
    }
});
