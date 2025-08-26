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

/* ----------------------------------- Welcome user--------------------------- */
let userName = sessionStorage.getItem("userName")
let welcomeNameUser = document.getElementById("nameUser")
welcomeNameUser.innerHTML=userName


/*------------------------------------See how many pending tasks--------------------------------*/


async function getTasks() {
    const res = await fetch("http://localhost:3000/tasks")
    const data = await res.json()
    return data
}

async function viewTask() {
    let counter = 0
    let tasks = await getTasks()

    tasks.result.forEach(task => {
        if (task.status == "pendiente") {
            counter += 1
        }
    });

    let numberTask = document.getElementById("numberTask")
    numberTask.innerHTML = counter

}

viewTask()

