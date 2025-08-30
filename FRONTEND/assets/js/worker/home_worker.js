    // let auth = sessionStorage.getItem("auth")
    // if(auth != "true"){
    //     window.location.href = "../../index.html";
    // }



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
let userName = localStorage.getItem("fullname");
let welcomeNameUser = document.getElementById("nameUser")
welcomeNameUser.innerHTML=userName


/*------------------------------------See how many pending tasks--------------------------------*/


async function getTasks() {
    const res = await fetch("http://localhost:3000/tasks/countTasks")
    const data = await res.json()
    return data
}

async function viewTask() {
    let tasks = await getTasks()
    
    let numberTask = document.getElementById("numberTask")
    numberTask.textContent = `Actualmente hay ${tasks.count[0].count_tasks.} tareas pendientes`
}
viewTask()

