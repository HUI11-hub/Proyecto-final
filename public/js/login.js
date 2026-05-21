let inputEmail = document.getElementById("inputEmail");
let inputPassword = document.getElementById("inputPassword");
let btnLogin = document.getElementById("btnLogin");

btnLogin.onclick = () => {
    console.log("Hola")
    let users = JSON.parse(localStorage.getItem("users"))
    for (let i = 0; i < users.length; i++) {
        if (users[i]["name"] === inputEmail.value) {
            console.log("Usuario encontrado");
            if (users[i]["password"] === inputPassword.value) {
                sessionStorage.setItem("user", JSON.stringify(users[i]));
                document.location = "main.html"
            } else {
                console.log("Contraseña incorrecta");
            };
            break
        };
        console.log("Next...");
    };
    console.log("Terminado");
};