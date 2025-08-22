import Swal from 'sweetalert2';
const bodyTable = document.getElementById("bodyTable");
const url = "";
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
    const loc = winlocation.hash;
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
    const response = await fetch(`url`);
    const { body } = await response.json();
    msg.textContent = ""
    body.forEach(user => {
        bodyTable.innerHTML += `
        <tr id="${user.id}">
            <td data-name="id">${user.id}</td>
            <td data-name="name" value="${user.name}">${user.name}</td>
            <td data-name="email" value="${user.email}">${user.email}</td>
            <td data-name="password" value="${user.password}">${user.password}</td>
            <td>${user.rol}</td> 
            <td>
                <!--to make queries faster, we are going to put the user ID in a data-link-->

                <button type="button" class="btn btn-danger m-1">Eliminar</button>
                <button type="button" class="btn btn-info m-1">Actualizar</button>
            </td> 
        </tr> 
        `;
    });
};

//callback function for the button/event click for add new user
async function addUser() {
    window.location.href = "#/addUser";
    content.innerHTML = `
        <div class="container">
            <form id="formUser">
                <div class="row d-block ">
                    <div class="col">
                        <label for="name">Nombre</label>
                        <input type="text" id="name" name="name" class="form-control" placeholder="Nombre" required>
                    </div>
                    <div class="col">
                        <label for="email">Correo electronico</label>
                        <input type="email" id="email" name="email" class="form-control" placeholder="Nombre" required>
                    </div>
                    <div class="col">
                        <label for="password">Contraseña</label>
                        <input type="password" id="password" name="password" class="form-control" placeholder="Password" required>
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
                    <button type="submit" class="btn btn-success mx-1" id="send">Registrar usuario</button>
                </div>
                <div id="msg" class="text-danger"></div>
            </form>
            <div class="col">
                <button id="ret" type="button" class="btn btn-primary m-1">Regresar</button>
            </div>
        </div>
    `;

    const ret = document.getElementById("ret");
    const form = document.getElementById("formUser");
    const msg = document.getElementById("msg")

    ret.addEventListener("click", () => {
        location.hash = ""
        location.reload();
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        let data = new FormData(form);

        data = Object.fromEntries(data.entries());

        if (data.rol == "Seleccione...") {
            msg.innerHTML = `<p class="text-danger">Seleccione un rol</p>`;

        } else {
            try {
                const res = await fetch(`url`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

            } catch (er) {
                msg.innerHTML = `<p class="text-danger">Ocurrio un error, intentelo de nuevo</p>`
            }
        }
    });
};



