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
        const res = await fetch("http://localhost:3000/users/login", {
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
        function saveUserData() {
            localStorage.setItem("fullname", data.user.fullname);
            localStorage.setItem("email", data.user.email);
            localStorage.setItem("rol", data.user.rol);+
            localStorage.setItem("id_user", data.user.id_user);
        }
        
            // const user = {
            //  id_user: data.user.id_user,
            //   fullname: data.user.fullname,
            //   email: data.user.email,
            //   rol: data.user.rol
            // };
            // localStorage.setItem("user", JSON.stringify(user));



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
                    window.location.href = "../../../pages/admin/admin_home.html";
                    saveUserData()
                    break;
                case 'worker':
                    window.location.href = "../../../pages/worker/home_worker.html";
                    saveUserData()
                    break;
                case 'tutor':
                    window.location.href = "../../../pages/coder/verification.html";
                    saveUserData()
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
