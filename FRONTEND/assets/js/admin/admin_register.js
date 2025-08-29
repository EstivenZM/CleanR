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
const url = "http://localhost:3000";


//Clean form and filters 
const formFilter = document.getElementById("formFilter");
const cleanForm = document.getElementById("clean");

document.addEventListener("DOMContentLoaded", getViewTasks) //for when the page load get all taks without filters

cleanForm.addEventListener("click", () => {
    formFilter.reset();

    getViewTasks();
});

formFilter.addEventListener("change", (e) => {
    let dataFilters = new FormData(formFilter);
    dataFilters = Object.fromEntries(dataFilters.entries());
    
    if(dataFilters.employee) {
        dataFilters.employee = true
    } else dataFilters.employee = false
    console.log(dataFilters);
});

async function getViewTasks() {
    const table = document.getElementById("table");
    const msg = document.getElementById("msg");
    msg.textContent = "Cargando...";
    try {
        const response = await fetch(`${url}/tasks/viewTasksAdmin`);
        const { body } = await response.json();

        msg.textContent = ""
        body.forEach(register => {

            switch (register.status ) {
                case "completada":
                    register.status = "Completada"
                    table.innerHTML += `
                    <tr>
                        <td class="bg-success-subtle" scope="row">${register.id_task}</td>
                        <td class="bg-success-subtle" scope="row">${register.name_task}</td>
                        <td class="bg-success-subtle" scope="row">${register.ubication}</td>
                        <td class="bg-success-subtle" scope="row">${register.status}</td>
                        <td class="bg-success-subtle" scope="row">${register.user}</td>   
                        </tr>`;
                    break;

                case "pendiente":
                    register.status = "Pendiente"
                    register.status = "Completada"
                    table.innerHTML += `
                    <tr>
                        <td class="bg-danger-subtle" scope="row">${register.id_task}</td>
                        <td class="bg-danger-subtle" scope="row">${register.name_task}</td>
                        <td class="bg-danger-subtle" scope="row">${register.ubication}</td>
                        <td class="bg-danger-subtle" scope="row">${register.status}</td>
                        <td class="bg-danger-subtle" scope="row">${register.user}</td>   
                        </tr>`;
                    break;
            }

        });
    } catch (er) {
        console.error(er);
        msg.innerHTML = "<p class='text-red-600 font-bold'>Ocurrio un error al traer los usuarios</p>"
    }
};



