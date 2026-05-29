const inputEmail     = document.getElementById("inputNewEmail");
const inputPassword  = document.getElementById("inputNewPassword");
const inputPassword2 = document.getElementById("inputVerifyPassword");
const btnCreate      = document.getElementById("btnCreateAccount");

if (inputEmail && btnCreate) {
    // Elemento de feedback del email (lo inyectamos dinámicamente)
    const emailFeedback = document.createElement("small");
    emailFeedback.style.cssText = "margin-top:4px; display:block; font-size:0.85em;";
    inputEmail.parentElement.appendChild(emailFeedback);

    let emailDisponible = false;  // flag: el AJAX confirmó que el email no existe
    let ajaxTimeout     = null;   // para debounce

    /**
     * Comprueba con AJAX si el email ya existe en el sistema.
     * El endpoint devuelve 204 si existe, 404 si no existe.
     */
    async function comprobarEmail(email) {
        emailFeedback.textContent = "⏳ Comprobando...";
        emailFeedback.style.color = "#888";
        emailDisponible = false;

        if (!email || !email.includes("@")) {
            emailFeedback.textContent = "";
            return;
        }

        try {
            const encoded  = encodeURIComponent(email);
            const response = await fetch(`/api/v1/users/email/${encoded}`, {
                method: "GET"
            });

            if (response.status === 404) {
                // 404 = no existe → disponible
                emailFeedback.textContent = "✅ Email disponible";
                emailFeedback.style.color = "green";
                emailDisponible = true;
            } else if (response.status === 204) {
                // 204 = ya existe
                emailFeedback.textContent = "❌ Este email ya está registrado";
                emailFeedback.style.color = "red";
                emailDisponible = false;
            } else {
                emailFeedback.textContent = "";
            }
        } catch {
            emailFeedback.textContent = "";
        }
    }

    // Comprobación AJAX con debounce (espera 500ms tras dejar de escribir)
    inputEmail.addEventListener("input", () => {
        clearTimeout(ajaxTimeout);
        ajaxTimeout = setTimeout(() => comprobarEmail(inputEmail.value.trim()), 500);
    });

    btnCreate.addEventListener("click", async (e) => {
        e.preventDefault();

        const email     = inputEmail.value.trim();
        const password  = inputPassword.value;
        const password2 = inputPassword2.value;

        if (!email || !password) {
            alert("El email y la contraseña son obligatorios.");
            return;
        }

        if (password !== password2) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        if (password.length < 4) {
            alert("La contraseña debe tener al menos 4 caracteres.");
            return;
        }

        if (!emailDisponible) {
            alert("Comprueba que el email es válido y no está ya registrado.");
            return;
        }

        try {
            const response = await fetch("/api/v1/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password,
                    role: "publico"   // siempre se registra como público
                })
            });

            if (response.ok || response.status === 201) {
                alert("¡Cuenta creada correctamente! Ya puedes iniciar sesión.");
                document.location = "login.html";
            } else {
                const err = await response.json().catch(() => ({}));
                alert("Error del servidor: " + (err.message || `Error ${response.status}`));
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });
}