//-------------------logout-------------------
function logout() {
    localStorage.removeItem("fullname");
    localStorage.removeItem("email");
    localStorage.removeItem("rol");
    localStorage.removeItem("id_user");
    sessionStorage.removeItem("auth");
    window.location.href = "../../index.html";
}
const btnLogOut = document.getElementById("btnLogOut");
if (btnLogOut) {
    btnLogOut.addEventListener("click", () => {
        logout();
    });
}

let auth = sessionStorage.getItem("auth");
if (auth != "true") {
  window.location.href = "/CleanR/index.html";
}

const url = "https://cleanr-back.onrender.com";

export default url
