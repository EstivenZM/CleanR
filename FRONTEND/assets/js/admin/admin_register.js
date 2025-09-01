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



document.addEventListener("DOMContentLoaded", getRegisters) //for when the page load get all taks without filters

async function getRegisters() {
    const table = document.getElementById("table");
    const msg = document.getElementById("msg");
    msg.textContent = "Cargando...";
    try {
        const response = await fetch(`${url}/registers/viewRegistersAdmin`);
        const { body } = await response.json();

        msg.textContent = ""
        body.forEach(register => {
            const fecha = new Date(register.registration_date);

            const date = fecha.toISOString().split("T")[0];

            const hour = fecha.toTimeString().split(" ")[0];
            const clas = register.status == "completada" ? "bg-success-subtle" : "bg-danger-subtle"

            table.innerHTML += `
            <tr>
                <td class="${clas}" scope="row">${register.id_task}</td>
                <td class="${clas}" scope="row">${register.name_task}</td>
                <td class="${clas}" scope="row">${register.ubication}</td>
                <td class="${clas}" scope="row">${register.status}</td>
                <td class="${clas}" scope="row">${register.user}</td>   
                <td class="${clas}" scope="row">${date} ${hour}</td>                           
            </tr>`;

        });
    } catch (er) {
        console.error(er);
        msg.innerHTML = "<p class='text-red-600 font-bold'>Ocurrio un error al traer los registros</p>"
    }
};

//section for filters

//Clean form and filters 
// const formFilter = document.getElementById("formFilter");
// const cleanForm = document.getElementById("clean");

// cleanForm.addEventListener("click", () => {
//     formFilter.reset();

//     getViewTasks();
// });

// formFilter.addEventListener("change", (e) => {
//     let dataFilters = new FormData(formFilter);
//     dataFilters = Object.fromEntries(dataFilters.entries());

//     if (dataFilters.employee) {
//         dataFilters.employee = true
//     } else dataFilters.employee = false
//     console.log(dataFilters);
// });

