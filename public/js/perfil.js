// ── Sesión ────────────────────────────────────────────────────────────────────
const user = JSON.parse(sessionStorage.getItem("user"));
if (!user || !user.token) {
    document.location = "login.html";
}

function getHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
    };
}

// ── Rellenar datos en pantalla ────────────────────────────────────────────────
async function cargarPerfil() {
    try {
        const response = await fetch(`/api/v1/users/${user.id}`, {
            headers: getHeaders()
        });

        if (response.status === 401 || response.status === 403) {
            alert("Sesión expirada. Vuelve a iniciar sesión.");
            sessionStorage.removeItem("user");
            document.location = "login.html";
            return;
        }

        const data   = await response.json();
        const perfil = data.user;

        document.getElementById("perfilId").textContent    = perfil.id;
        document.getElementById("perfilEmail").textContent = perfil.email;
        document.getElementById("perfilRol").textContent   = perfil.role.toUpperCase();

        // Prellenar el campo de nuevo email con el actual
        document.getElementById("nuevoEmail").value = perfil.email;

    } catch (err) {
        console.error("Error al cargar perfil:", err);
    }
}

// ── Cambiar email ─────────────────────────────────────────────────────────────
const emailFeedback = document.getElementById("emailFeedback");
const nuevoEmailInput = document.getElementById("nuevoEmail");
let emailAjaxTimeout = null;

nuevoEmailInput.addEventListener("input", () => {
    clearTimeout(emailAjaxTimeout);
    const email = nuevoEmailInput.value.trim();
    if (email === user.name) {
        emailFeedback.textContent = "";
        return;
    }
    emailAjaxTimeout = setTimeout(async () => {
        if (!email.includes("@")) return;
        try {
            const encoded  = encodeURIComponent(email);
            const response = await fetch(`/api/v1/users/email/${encoded}`);
            if (response.status === 204) {
                emailFeedback.textContent = "❌ Ese email ya está en uso";
                emailFeedback.style.color = "red";
            } else if (response.status === 404) {
                emailFeedback.textContent = "✅ Email disponible";
                emailFeedback.style.color = "green";
            }
        } catch {
            emailFeedback.textContent = "";
        }
    }, 500);
});

document.getElementById("formEmail").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nuevoEmail = nuevoEmailInput.value.trim();

    if (!nuevoEmail) return;
    if (nuevoEmail === user.name) {
        alert("Ese ya es tu email actual.");
        return;
    }
    if (emailFeedback.style.color === "red") {
        alert("El email introducido ya está en uso.");
        return;
    }

    try {
        const response = await fetch(`/api/v1/users/${user.id}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify({ email: nuevoEmail })
        });

        if (response.ok) {
            alert("Email actualizado correctamente. Vuelve a iniciar sesión.");
            sessionStorage.removeItem("user");
            document.location = "login.html";
        } else {
            const err = await response.json().catch(() => ({}));
            alert("Error al actualizar email: " + (err.message || response.status));
        }
    } catch (err) {
        console.error(err);
        alert("Error de conexión.");
    }
});

// ── Cambiar contraseña ────────────────────────────────────────────────────────
document.getElementById("formPassword").addEventListener("submit", async (e) => {
    e.preventDefault();

    const actual  = document.getElementById("passwordActual").value;
    const nueva   = document.getElementById("passwordNueva").value;
    const repetir = document.getElementById("passwordRepeat").value;

    if (nueva !== repetir) {
        alert("Las contraseñas nuevas no coinciden.");
        return;
    }
    if (nueva.length < 4) {
        alert("La contraseña debe tener al menos 4 caracteres.");
        return;
    }

    // Verificar contraseña actual intentando un login
    try {
        const loginCheck = await fetch("/access_token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: user.name, password: actual })
        });

        if (!loginCheck.ok) {
            alert("La contraseña actual no es correcta.");
            return;
        }
    } catch {
        alert("Error de conexión al verificar contraseña.");
        return;
    }

    // Actualizar contraseña
    try {
        const response = await fetch(`/api/v1/users/${user.id}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify({ password: nueva })
        });

        if (response.ok) {
            alert("Contraseña cambiada correctamente. Vuelve a iniciar sesión.");
            sessionStorage.removeItem("user");
            document.location = "login.html";
        } else {
            const err = await response.json().catch(() => ({}));
            alert("Error al cambiar contraseña: " + (err.message || response.status));
        }
    } catch (err) {
        console.error(err);
        alert("Error de conexión.");
    }
});

cargarPerfil();