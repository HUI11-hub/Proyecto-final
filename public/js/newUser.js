document.addEventListener("DOMContentLoaded", () => {
    const btnRegister = document.getElementById("btnRegister") || document.querySelector("button");
    const inputEmail = document.getElementById("inputEmail") || document.querySelector("input[type='email']");
    const inputPassword = document.getElementById("inputPassword") || document.querySelector("input[type='password']");
    const inputPassword2 = document.getElementById("inputPassword2") || document.querySelectorAll("input[type='password']")[1];

    if (btnRegister) {
        btnRegister.addEventListener("click", async (e) => {
            e.preventDefault();
            
            if (inputPassword.value !== inputPassword2.value) {
                alert("Las contraseñas no coinciden");
                return;
            }
            
            try {
                const response = await fetch('/api/v1/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: inputEmail.value,
                        password: inputPassword.value,
                        role: "manager"
                    })
                });

                if (response.ok || response.status === 201) {
                    alert("¡Cuenta creada en la base de datos!");
                    document.location = "login.html";
                } else {
                    const errorData = await response.json();
                    alert("Error del servidor: " + (errorData.message || "Es posible que el correo ya exista"));
                }
            } catch (error) {
                console.error("Error de conexión:", error);
                alert("Fallo al conectar con el servidor");
            }
        });
    }
});