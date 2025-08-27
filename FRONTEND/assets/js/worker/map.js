const standsModal = new bootstrap.Modal(document.getElementById("standsModal"));
const locationName = document.getElementById("locationName");
const APP_URL = "http://localhost:3000/";
let map = document.querySelectorAll(".map");
let place = "";

map.forEach((div) => {
    div.addEventListener("click", (e) => {
        const id = e.target.id;
        place = id;

        standsModal.show();
        locationName.textContent = div.textContent;
        getTasks();

       
    });
});
async function getTasks() {
    const response = await fetch(`${APP_URL}tasks/tasksArea`);
    const data = await response.json();
    const tasks = data.result;
    const taskContainer = document.querySelector(".taskContainer");

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
        taskContainer.innerHTML = "<p>No hay tareas para esta ubicación</p>";
    }
}

const formTasks = document.getElementById("formTasks");

formTasks.addEventListener("submit", async (e) => {
    e.preventDefault();

    const checkboxes = document.querySelectorAll(".task-checkbox:checked");

    for (const checkbox of checkboxes) {
        const taskId = checkbox.dataset.id;
        await updateTaskStatus(taskId, "completada");

        //checkbox.disabled = true;
    }

    const standsModalInstance = bootstrap.Modal.getInstance(document.getElementById("standsModal"));
    standsModalInstance.hide();

});

async function updateTaskStatus(taskId, status) {
    const response = await fetch(`${APP_URL}tasks/${taskId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
    });
    return response.json();
}
