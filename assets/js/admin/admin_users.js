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
import url from '../middleware.js';
import Swal from 'sweetalert2';


const bodyTable = document.getElementById("bodyTable");
const add = document.getElementById("addUser");
const content = document.getElementById("content");
const msg = document.getElementById("msg")


//EVENTS
document.addEventListener("DOMContentLoaded", () => {
    const loc = location.hash;
    if (loc == "#/addUser") {
        addUser();
    } else {
        printUsers()
    }
});

window.addEventListener("hashchange", () => {
    const loc = location.hash;
    if (loc == "#/addUser") {
        addUser();
    } else {
        location.reload();
    }
});

add.addEventListener("click", addUser);

//update and delete the client
bodyTable.addEventListener("click", async (e) => {

    //code for when delete user
    if (e.target.textContent == "Eliminar") {
        //obtain the user id
        const id = e.target.parentNode.parentNode.id
        try {
            await fetch(`${url}/users/deleteUser`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "id_user": id })
            });

            location.reload();
        } catch (er) {
            Swal.fire({
                text: "Ocurrio un error al alctualizar el cliente, intentalo de nuevo",
                icon: "error",
                confirmButtonText: "OK",
                preConfirm: () => { location.reload() }
            });
        }



        //code for when update user
    } else if (e.target.textContent == "Actualizar") {
        //obtain the father element html
        const dataElementHTML = e.target.parentNode.parentNode;
        let data = {} //this object will save the data obtained from DOM

        //this cycle will bring all the DOM fields and store them in an object and then paint them on the form to update it
        for (let element of dataElementHTML.children) {
            if (element.dataset.name != undefined) {
                data[element.dataset.name] = element.textContent
            }
        };

        Swal.fire({
            title: 'Actualizar cliente',
            html: `
            <form id="formUser" class="p-4 bg-white rounded-4">
                <div class="mb-3">
                    <label for="name" class="form-label fw-bold">Nombre</label>
                    <input type="text" id="name" name="fullname" class="form-control" placeholder="Nombre" value="${data.name}" required>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label fw-bold">Correo electrónico</label>
                    <input type="email" id="email" name="email" class="form-control" placeholder="Correo" value="${data.email}" required>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label fw-bold">Contraseña</label>
                    <div class="input-group">
                    <input type="password" id="password" name="password" class="form-control" placeholder="Contraseña" value="${data.password}" required>
                    <button class="btn btn-outline-secondary" type="button" id="btnShowPsw">Mostrar</button>
                </div>
                <div class="mb-3">
                    <label for="rol" class="form-label fw-bold">Rol del usuario</label>
                    <select id="rol" name="rol" class="form-select">
                        <option value="tutor" selected>Tutor</option>
                        <option value="admin">Administrador</option>
                        <option value="worker">Empleado/a</option>
                    </select>
                </div>
            </form>
            `,
            confirmButtonText: "Actualizar",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            didOpen: () => { // js for html in the Swal.fire
                const btnShowPsw = document.getElementById("btnShowPsw");
                const password = document.getElementById("password");

                btnShowPsw.addEventListener("click", () => {
                    btnShowPsw.textContent = password.textContent == "Mostrar" ? "Ocultar" : "Mostrar";
                    password.type = (password.type === "password") ? "text" : "password"; // It exchanges the types depending on what type of input it 
                })
            },
            preConfirm: async () => {
                const form = document.getElementById("formUser");
                let dataForm = new FormData(form);
                dataForm = Object.fromEntries(dataForm.entries());

                //add id of the object
                dataForm["id_user"] = data.id


                const res = await fetch(`${url}/users/updateUser`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify(dataForm) //that dataForm contais changes updates
                });

                const { OK } = await res.json()

                if (!OK) {
                    Swal.fire({
                        text: "Ocurrio un error al alctualizar el cliente, intentalo de nuevo",
                        icon: "error",
                        confirmButtonText: "OK",
                        preConfirm: () => { location.reload() }
                    });
                    location.reload();
                } else {
                    location.reload();
                }
            }
        });
    }
});

//FUNCTIONS
//function for print users in the table
async function printUsers() {
    try {
        msg.textContent = "Cargando...";
        const response = await fetch(`${url}/users/allUsers`);
        const { body } = await response.json();

        msg.textContent = ""
        body.forEach(user => {

            switch (user.rol) {
                case "tutor":
                    user.rol = "Tutor"
                    break;

                case "admin":
                    user.rol = "Administrador"
                    break;

                case "worker":
                    user.rol = "Empleado/a";

                    break;
            }
            bodyTable.innerHTML += `
        <tr id="${user.id_user}">
            <td data-name="id" scope="row">${user.id_user}</td>
            <td data-name="name" value="${user.fullname}">${user.fullname}</td>
            <td data-name="email" value="${user.email}">${user.email}</td>
            <td data-name="password" value="${user.password}">${user.password}</td>
            <td>${user.rol}</td> 
            <td class="p-1 flex justify-evenly">
                <button type="button" class="btn  rounded-3 action">Eliminar</button>
                <button type="button" class="btn  rounded-3 action">Actualizar</button>
            </td>   
        </tr>`;
        });
    } catch (er) {
        console.error(er);
        msg.innerHTML = "<p class='text-red-600 font-bold'>Ocurrio un error al traer los usuarios</p>"
    }
};

//callback function for the button/event click for add new user
async function addUser() {
    window.location.href = "#/addUser";
    content.innerHTML = `
    <section class="container">
        <div class="row justify-content-center">
            <div class="col-md-6 col-lg-5">
                <form id="formUser" class="p-4 bg-white rounded-4 mt-4">
                    <div class="mb-3">
                        <label for="name" class="form-label fw-bold">Nombre</label>
                        <input type="text" id="name" name="fullname" class="form-control" placeholder="Nombre" required>
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label fw-bold">Correo electrónico</label>
                        <input type="email" id="email" name="email" class="form-control" placeholder="Correo" required>
                    </div>
                     <div class="mb-3">
                        <label for="password" class="form-label fw-bold">Contraseña</label>
                        <div class="input-group">
                        <input type="password" id="password" name="password" class="form-control" placeholder="Contraseña" required >
                        <button class="btn btn-outline-secondary" type="button" id="btnPassword">Mostrar</button>
                    </div>
                    </div>
                    <div class="mb-3">
                        <label for="rol" class="form-label fw-bold">Rol del usuario</label>
                        <select id="rol" name="rol" class="form-select">
                        <option selected disabled>Seleccione...</option>
                        <option value="tutor">Tutor</option>
                        <option value="admin">Administrador</option>
                        <option value="worker">Empleado/a</option>
                        </select>
                    </div>
                    <div class="d-flex gap-2 justify-content-center mt-3">
                        <button type="submit" id="send" class="btn btn-success px-4">
                        Registrar usuario
                        </button>
                        <button type="button" id="ret" class="btn btn-primary px-4">
                        Regresar
                        </button>
                    </div>
                    <div class="text-center mt-3" id="confirmations">
                        <p></p>
                        <p></p> 
                        <p></p>
                    </div>
                </form>
            </div>
        </div>
    </section>
    `;
    //---------------Look password
    const lookpsw = document.getElementById("btnPassword");

    lookpsw.addEventListener("click", () => {
        const passwordInput = document.getElementById("password");
        const type = passwordInput.type === "password" ? "text" : "password"; // It exchanges the types depending on what type of input it has
        passwordInput.type = type;

        lookpsw.textContent = type === "password" ? "Mostrar" : "Ocultar";
    });
    //---------------------------

    const ret = document.getElementById("ret");
    const formUser = document.getElementById("formUser");
    const confim = document.getElementById("confirmations");

    let confimations = {
        "email": true,
        "rol": true
    }

    ret.addEventListener("click", () => {
        location.hash = ""
        location.reload();
    });

    //validate email and rol
    formUser.addEventListener("change", async (e) => {
        //validate email
        if (e.target.id == "email") {
            const email = e.target.value;

            if (email) {
                const res = await fetch(`${url}/users/user?email=${email}`)
                const { OK } = await res.json();
                //the server response with false if the email dont exist and true if the email exist
                if (OK) {
                    confim.children[0].outerHTML = "<p class='text-danger'>Este email ya existe</p>";
                    confirmations.email = false
                } else {
                    confirmations.children[0].outerHTML = "<p></p>";
                    confirmations.email = true
                }
            }
        }

        //validate rol
        if (e.target.id == "rol") {
            confimations.rol = true
            confim.children[1].outerHTML = "<p></p>"

        } else {
            confimations.rol = false
        }
    });

    formUser.addEventListener("submit", async (e) => {
        e.preventDefault();
        let data = new FormData(formUser);
        data = Object.fromEntries(data.entries());

        if (confimations.email && confimations.rol) {
            try {
                await fetch(`${url}/users/insertUser`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                formUser.reset();
                location.href = "";
                window.reload();

            } catch (er) {
                console.log(er);
                confim.children[1].outerHTML = "<p> class='text-danger'>Ocurrio un error, intentelo de nuevo</p>";
            }
        } else {
            confim.children[1].outerHTML = "<p class='text-danger'>Asegurese de haber ingresado todos los campos correctamente</p> "
        }
    });
};



