import Swal from 'sweetalert2';

const bodyTable = document.getElementById("bodyTable");
const url = "http://localhost:3000";
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
        const con = confirm("Estas seguro de que quieres eliminar al usuario")
        if (con) {
            const response = await fetch(`url`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: [{ "id": id }]
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
            <form id="formUser">
                <div class="row d-block>
                    <div class="col">
                        <p><b>Identificador del usuario</b></p>
                    </div>
                    <div class="col">
                        <label for="name">Nombre</label>
                        <input type="text" id="name" name="name" class="form-control" placeholder="Nombre" value="${data.name}" required>
                    </div>
                    <div class="col">
                        <label for="email">Correo electronico</label>
                        <input type="email" id="email" name="email" class="form-control" placeholder="Nombre" value="${data.email}" required>
                    </div>
                    <div class="col">
                        <label for="password">Contraseña</label>
                        <input type="text" id="password" name="password" class="form-control" placeholder="Password" value="${data.password}" required>
                    </div>
                    <div class="col">
                        <label for="rol">Rol del usuario</label>
                        <select class="form-select" id="rol" name="rol">
                            <option selected>Seleccione...</option>
                            <option value="tutor">Tutor</option>
                            <option value="administrador">Administrador</option>
                            <option value="empleado">Empleado/a</option>
                        </select>
                    </div>
                </div>
            </form>
        `,
            confirmButtonText: "Actualizar",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            preConfirm: async () => {
                const form = document.getElementById("formUser");
                let dataForm = new FormData(form);
                dataForm = Object.fromEntries(dataForm.entries());

                //add id of the object
                dataForm["id"] = data.id

                try {
                    await fetch("url", {
                        method: 'PUT',
                        headers: {
                            'Content-Type': "application/json"
                        },
                        body: JSON.stringify(dataForm) //that dataForm contais changes updates
                    });
                    location.reload();
                } catch (er) {
                    console.error(er);
                }
                //update changes
                location.reload();
            }
        });
    }
});

//FUNCTIONS
//function for print users in the table
async function printUsers() {
    msg.textContent = "Cargando..."
    try {
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
        <tr id="${user.id}">
            <td data-name="id" scope="row">${user.id_user}</td>
            <td data-name="name" value="${user.fullname}">${user.fullname}</td>
            <td data-name="email" value="${user.email}">${user.email}</td>
            <td data-name="password" value="${user.password}">${user.password}</td>
            <td>${user.rol}</td> 
            <td class="p-1 flex justify-evenly">
                <button type="button" class="btn btn-danger rounded-pill">Eliminar</button>
                <button type="button" class="btn btn-info rounded-pill">Actualizar</button>
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
                <form id="formUser" class="p-4 bg-white rounded-4 shadow">
                    <div class="mb-3">
                        <label for="name" class="form-label fw-bold">Nombre</label>
                        <input type="text" id="name" name="name" class="form-control" placeholder="Nombre" required>
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label fw-bold">Correo electrónico</label>
                        <input type="email" id="email" name="email" class="form-control" placeholder="Correo" required>
                    </div>
                    <div class="mb-3">
                        <label for="rol" class="form-label fw-bold">Rol del usuario</label>
                        <select id="rol" name="rol" class="form-select" required>
                        <option selected disabled>Seleccione...</option>
                        <option value="tutor">Tutor</option>
                        <option value="admin">Administrador</option>
                        <option value="employee">Empleado/a</option>
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
    const ret = document.getElementById("ret");
    const formUser = document.getElementById("formUser");
    const confirmations = document.getElementById("confirmations");
    let send = true

    ret.addEventListener("click", () => {
        location.hash = ""
        location.reload();
    });

    //validate email
    formUser.addEventListener("change", async (e) => {
        if (e.target.id == "email") {
            const email = e.target.value;

            const res = await fetch(`${url}/users/user?email=${email}`)
            const { OK } = await res.json();

            if (OK) {
                confirmations.children[0].outerHTML = "<p class='text-danger'>Este email ya existe</p>";

                send = false
            } else {
                confirmations.children[0].outerHTML = "<p></p>";
                send = true
            }
        }
    });

    formUser.addEventListener("submit", async (e) => {
        e.preventDefault();
       
        let data = new FormData(formUser);
        data = Object.fromEntries(data.entries());

       if (!data.rol) {
        confirmations.children[1].outerHTML = "<p> class='text-danger'>Asegurese de haber escogido de un rol</p>"
       }
        
        // try {
        //     const res = await fetch(`${url}/users/insertUser`, {
        //         method: "POST",
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify(data)
        //     });
        //     formUser.reset();
        //     location.href = "";
        //     window.reload();

        // } catch (er) {
        //     console.error(er);

           
        // }

    });
};



