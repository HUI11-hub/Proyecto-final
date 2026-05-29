let usernameText = document.getElementById("usernameText");
let exitBtn      = document.getElementById("exitBtn");
let rolBox       = document.querySelector(".rolBox");
let navTable     = document.getElementById("navTable");
let navAdmin     = document.getElementById("navAdmin");
let navUsers     = document.getElementById("navUsers");

if (sessionStorage.getItem("user")) {
    const user = JSON.parse(sessionStorage.getItem("user"));

    // Mostrar email del usuario conectado en la barra
    if (usernameText) usernameText.innerText = user["name"];

    if (user["rol"] === "gestor") {
        // Gestor: mostrar todo
        if (rolBox) {
            rolBox.innerText = "GESTOR";
            rolBox.style.backgroundColor = "hsl(210, 100%, 50%)";
        }
    } else {
        // Público: ocultar admin, usuarios y rolBox
        rolBox?.remove();
        navAdmin?.remove();
        navUsers?.remove();
    }
} else {
    document.location = "login.html";
}

exitBtn.onclick = () => {
    sessionStorage.removeItem("user");
    document.location = "login.html";
};