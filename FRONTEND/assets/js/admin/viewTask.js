document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('mainNavbar');
    const footer = document.getElementById('footer');
    const headerContainer = document.getElementById('navbarContainerHeader');

    function moveNavbarBasedOnScreenWidth() {
        if (window.innerWidth < 768) {
            if (!footer.contains(navbar)) {
                footer.appendChild(navbar);
            }
        } else {
            if (!headerContainer.contains(navbar)) {
                headerContainer.appendChild(navbar);
            }
        }
    }

    moveNavbarBasedOnScreenWidth();

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

    const response = await fetch(`${url}/tasks/viewTasksAdmin`)
    const { body } = await response.json();

    body.forEach(task => {
        console.log(task.id_task, task.name_task, task.ubication, task.status, task.user);
        
    });
}



