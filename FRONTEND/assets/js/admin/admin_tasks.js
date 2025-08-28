let tbody = document.getElementById("tbody")
let selectContainer = document.getElementById("viewLocations")
let buttonCreateTask = document.getElementById("createNewTask")

buttonCreateTask.addEventListener("click", async () => {
    let locations = await getLocations()
    locations.result.forEach(location => {
        selectContainer.innerHTML += `
        <option value="${location.id_location}">${location.name}</option>
        `
    })
})


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
                <button class="btn editTask put-btn" data-bs-toggle="modal" data-bs-target="#editTaskModal" type="button" data-id="${task.id_task}">Editar</button>
                
                <button class="btn deleteTask delete-btn" type="button" data-id="${task.id_task}">Borrar</button>
            </td>
        </tr>
        `
    });


    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", async () => {
            try {
                const id = button.getAttribute("data-id")
                await deleteTask(id)

            } catch (error) {
                console.log("ERROR", error);
            }

        });
    });

    document.querySelectorAll(".put-btn").forEach(button => {
        button.addEventListener("click", async () => {
            try {
                const id = button.getAttribute("data-id")
                await editTask(id)

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
    const res = await fetch("http://localhost:3000/locations/locations")
    const data = await res.json()
    return data
}



async function getTasks() {
    try {
        const res = await fetch("http://localhost:3000/tasks/tasksArea")
        const data = await res.json()
        return data
    } catch (error) {
        console.log("ERROR", error);
    }

}

async function createTask(newTask) {
    try {
        const res = await fetch(`http://localhost:3000/tasks/sendTask`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTask)
        });

        const data = await res.json()
        console.log("Tarea creada", data);

        if (res.ok == false) {
            alert("Tarea no creada")
        }

    } catch (error) {
        console.error("Error en POST:", error);
    }
}

async function editTask(taskChanged) {
    try {
        const res = await fetch(`http://localhost:3000/tasks`)
    } catch (error) {
        console.log("ERROR", error);
    }
}


async function deleteTask(id) {
    try {
        const res = await fetch(`http://localhost:3000/tasks/tasks/${id}`, {
            method: "DELETE"
        })

        const data = res.json()
        console.log("Tarea eliminada", data);
    } catch (error) {
        console.log("ERROR", error);

    }
}




