const btnLogin = document.getElementById("btnLogin") || document.querySelector("button");
const inputEmail = document.getElementById("inputEmail") || document.querySelector("input[type='email']");
const inputPassword = document.getElementById("inputPassword") || document.querySelector("input[type='password']");

if (btnLogin) {
    btnLogin.addEventListener("click", async (e) => {
        e.preventDefault(); 
        
        try {
            const response = await fetch('/access_token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: inputEmail.value, 
                    password: inputPassword.value
                })
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.access_token || data.token; 
                sessionStorage.setItem("user", JSON.stringify({
                    name: inputEmail.value,
                    rol: "manager", 
                    token: token
                }));

                document.location = "main.html";
            } else {
                alert("Acceso denegado: El servidor no reconoce esas credenciales.");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
        }
    });
}