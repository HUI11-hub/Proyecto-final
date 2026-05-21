const inputNewEmail = document.getElementById("inputNewEmail");
const inputNewPassword = document.getElementById("inputNewPassword");
const inputVerifyPassword = document.getElementById("inputVerifyPassword");
const btnCreateAccount = document.getElementById("btnCreateAccount");

btnCreateAccount.addEventListener("click", (event) => {
    event.preventDefault(); 
    const email = inputNewEmail.value;
    const password = inputNewPassword.value;
    const verifyPassword = inputVerifyPassword.value;
    if (!email || !password || !verifyPassword) {
        alert("Por favor, rellena todos los campos.");
        return;
    }
    if (password !== verifyPassword) {
        alert("Las contraseñas no coinciden.");
        return;
    }
    if (password.length <= 8 || !/\d/.test(password)) {
        alert("La contraseña debe tener más de 8 caracteres y al menos un número.");
        return;
    }
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const emailExists = users.some(user => user.name === email);

    if (emailExists) {
        alert("Ese email ya está registrado.");
        return;
    }
    const newUser = {
        name: email,
        password: password,
        rol: "public"
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Cuenta creada con éxito. Ahora puedes iniciar sesión.");
    document.location = "login.html"; 
});