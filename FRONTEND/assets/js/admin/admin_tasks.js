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

let tbody = document.getElementById("tbody")
let selectContainer = document.getElementById("viewLocations")
let buttonCreateTask = document.getElementById("createNewTask")


buttonCreateTask.addEventListener("click", async () => {
    let locations = await getLocations()
    locations.forEach(location => {
        selectContainer.innerHTML += `
        <option value="${location.id_location}">${location.name}</option>
        `;
    });
});

showTasksInTable()
async function showTasksInTable() {
    let tasks = await getTasks()
    tasks.result.forEach(task => {
        tbody.innerHTML += `
        <tr>
            <td>${task.id_task}</td>
            <td>${task.name}</td>
            <td>${task.location_name}</td>
            <td>${task.status}</td>

            <td class="d-flex gap-2">
                <button class="btn action put-btn" data-bs-toggle="modal" data-bs-target="#editTaskModal" type="button" data-id="${task.id_task}">Editar</button>
                
                <button class="btn action delete-btn" type="button" data-id="${task.id_task}">Borrar</button>
            </td>
        </tr>
        `
    });

    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", async () => {
            try {
                const id = button.getAttribute("data-id")
                await deleteTask(id)
                location.reload()

            } catch (error) {
                console.log("ERROR", error);
            }

        });
    });

    document.querySelectorAll(".put-btn").forEach(button => {
        button.addEventListener("click", async () => {

            try {
                let idTask = button.getAttribute("data-id")

                let selectEditTask = document.getElementById("locationEditTask")

                let dataTask = await getTasksForId(idTask)

                let nameTaskOld = dataTask.result[0].name

                document.getElementById("nameEditTask").value = nameTaskOld

                let locationTaskOld = dataTask.result[0].location_name


                let locations = await getLocations()
        
                locations.forEach(location => {
                    selectEditTask.innerHTML += `
                        <option value="${location.id_location}">${location.name}</option>`
                })

                let buttonSaveTask = document.getElementById("sendNewTaskChanged")

                buttonSaveTask.addEventListener("click", async (e) => {
                    let newNameTask = document.getElementById("nameEditTask").value
                    let locationEditTask = document.getElementById("locationEditTask").value

                    const taskChanged = {
                        name: newNameTask || nameTaskOld,
                        id_location: locationEditTask || locationTaskOld,
                        status: "pendiente" || dataTask.result[0].status
                    }
                    await editTask(taskChanged, idTask)
                    location.reload()
                })

            } catch (error) {
                console.log("ERROR", error);
            }
        });
    });
}

let sendNewTask = document.getElementById("sendNewTask")
sendNewTask.addEventListener("click", async (e) => {
    e.preventDefault()
    let nameTask = document.getElementById("nameTask").value
    let viewLocations = document.getElementById("viewLocations").value

    const newTask = {
        name: nameTask,
        id_location: viewLocations,
        status: "pendiente"
    }
    await createTask(newTask)
    location.reload()
})

async function getLocations() {
    const res = await fetch(`${url}/locations/viewLocations`)
    const data = await res.json()
    return data
}

async function getTasks() {
    const msg = document.getElementById("msg");
    try {
        msg.textContent = "Cargando..."
        const res = await fetch(`${url}/tasks/tasksArea`)
        const data = await res.json()
        msg.textContent = ""
        return data
    } catch (error) {
        console.error("ERROR", error);
        msg.textContent = "Ocurrio un error"    
    }
}

async function getTasksForId(id) {
    try {
        const res = await fetch(`${url}/tasks/tasksGetEdit/${id}`)
        const data = await res.json()
        return data
    } catch (error) {
        console.error("ERROR", error);
    }

}

async function createTask(newTask) {
    try {
        const res = await fetch(`${url}/tasks/registerTask`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTask)
        });
        const data = await res.json()

        if (res.ok == false) {
            alert("Tarea no creada")
        }

    } catch (error) {
        console.error("Error en POST:", error);
    }
}

async function editTask(newTaskChanged, id) {
    try {
        const res = await fetch(`${url}/tasks/updateTask/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTaskChanged)
        });
        const data = await res.json()
        return data
    } catch (error) {
        console.log("ERROR", error);
    }
}

async function deleteTask(id) {
    try {
        const res = await fetch(`${url}/tasks/deleteTask/${id}`, {
            method: "DELETE"
        });
        const data = res.json()
        console.log("Tarea eliminada", data);
    } catch (error) {
        console.log("ERROR", error);
    }
}


