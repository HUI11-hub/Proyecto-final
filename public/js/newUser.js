let inputEmail = document.getElementById("inputEmail");
let inputPassword = document.getElementById("inputPassword");
let inputPassword2 = document.getElementById("inputPassword2");
let btnRegister = document.getElementById("btnRegister");

btnRegister.onclick = function(e) {
    e.preventDefault();
    
    if (inputPassword.value !== inputPassword2.value) {
        alert("Las contraseñas no coinciden");
        return;
    }
    
    alert("Usuario registrado localmente");
    document.location = "login.html";
};