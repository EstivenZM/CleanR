const standsModal = new bootstrap.Modal(document.getElementById("standsModal"));
const locationName = document.getElementById("locationName");
import url from '../middleware.js';


let map = document.querySelectorAll(".map");
let place = "";

map.forEach((div) => {
    div.addEventListener("click", (e) => {
        const id = e.target.id;
        place = id;

        standsModal.show();
        const taskAlert = document.getElementById("taskAlert");
        taskAlert.innerHTML = "";

        locationName.textContent = div.textContent;
        getTasks();
    });
});
async function getTasks() {
    const response = await fetch(`${url}/tasks/tasksArea`);
    const data = await response.json();
    const tasks = data.result;
    const taskContainer = document.querySelector(".taskContainer");
    const observation = document.getElementById("observation");
    const submitBtn = document.getElementById("submitBtn");

    taskContainer.innerHTML = "";
    let found = false; 

    tasks.forEach((task) => {
        if (task.location_name === place) {
            found = true;

            const div = document.createElement("div");
            div.classList.add("mb-1");

            div.innerHTML = `
                <input 
                    type="checkbox" 
                    class="me-1 task-checkbox" 
                    id="inputTask${task.id_task}" 
                    data-id="${task.id_task}"
                    ${task.status === "completada" ? "checked disabled" : ""}
                >
                <label for="inputTask${task.id_task}">
                    ${task.name} - ${task.status}
                </label>
            `;
            taskContainer.appendChild(div);
        }
    });

    if (!found) {
        taskContainer.innerHTML = "<p class='alert alert-primary text-primary'>No hay tareas para esta ubicación</p>";
        submitBtn.disabled = true;
        observation.disabled = true;
    } else {
        submitBtn.disabled = false;
        observation.disabled = false;
    }

    formTasks.reset();
}

const formTasks = document.getElementById("formTasks");

formTasks.addEventListener("submit", async (e) => {
    e.preventDefault();

    const checkboxes = document.querySelectorAll(".task-checkbox:checked");
    const observation = document.getElementById("observation").value;
    const id_user = localStorage.getItem("id_user");
    const registration_date = new Date().toISOString().slice(0, 19).replace("T", " ");
    const result = "exitosa";
    let flag = false;

    for (const checkbox of checkboxes) {
        if (!checkbox.disabled) {
            const taskId = checkbox.dataset.id;
            await updateTaskStatus(taskId, "completada");
            const newRegister = {
                id_task: taskId,
                id_user: id_user,
                registration_date: registration_date,
                observation: observation,
                result: result,
            };
            await newRegisterTask(newRegister);
            flag = true;
        }
    }


    if (!flag || checkboxes.length === 0) {
        taskAlert.innerHTML = `<div class="alert alert-danger text-danger">Por favor, selecciona al menos una tarea.</div>`;
        return;
    }

    taskAlert.innerHTML = `<div class="alert alert-success text-success">Tareas registradas con exito</div>`;

    setTimeout(() => {
        const standsModalInstance = bootstrap.Modal.getInstance(document.getElementById("standsModal"));
        standsModalInstance.hide();
    }, 2000);
});

async function updateTaskStatus(taskId, status) {
    const response = await fetch(`${url}/tasks/updateState/${taskId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
    });
    return response.json();
}

async function newRegisterTask(newRegister) {
    const response = await fetch(`${url}/registers/sendRegister`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newRegister),
    });
    return response.json();
}

