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