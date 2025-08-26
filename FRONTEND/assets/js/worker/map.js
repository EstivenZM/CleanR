const standsModal = new bootstrap.Modal(document.getElementById("standsModal"));
let map = document.querySelectorAll(".map");

map.forEach((div) => {
    div.addEventListener("click", (e) => {
        const id = e.target.id;

        standsModal.show();
        alert("Click en " + div.textContent);
        const formStands = document.getElementById("formStands");
        formStands.addEventListener("submit", (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            console.log(data);
            //formStands.reset();
            // cierro el modal
            //const standsModal = bootstrap.Modal.getInstance(document.getElementById("standsModal"));
            standsModal.hide();
            window.location.reload();
        });
    });
});
