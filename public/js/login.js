const btnLogin     = document.getElementById("btnLogin");
const inputEmail   = document.getElementById("inputEmail");
const inputPassword = document.getElementById("inputPassword");

/**
 * Decodifica la parte payload de un JWT (sin verificar firma).
 * Devuelve el objeto claims o null si falla.
 */
function decodeJwtPayload(token) {
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch {
        return null;
    }
}

/**
 * Dado el array de scopes del JWT, devuelve el rol más alto:
 * "gestor" > "publico" > "inactivo"
 */
function rolFromScopes(scopes) {
    if (!Array.isArray(scopes)) return "publico";
    if (scopes.includes("gestor"))  return "gestor";
    if (scopes.includes("publico")) return "publico";
    return "inactivo";
}

if (btnLogin) {
    btnLogin.addEventListener("click", async (e) => {
        e.preventDefault();

        const email    = inputEmail.value.trim();
        const password = inputPassword.value;

        if (!email || !password) {
            alert("Por favor, introduce email y contraseña.");
            return;
        }

        try {
            const response = await fetch("/access_token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: email, password })
            });

            if (!response.ok) {
                alert("Acceso denegado: credenciales incorrectas.");
                return;
            }

            const data  = await response.json();
            const token = data.access_token || data.token;

            // Decodificar el JWT para leer uid, email y scopes reales
            const payload = decodeJwtPayload(token);
            if (!payload) {
                alert("Error al procesar el token del servidor.");
                return;
            }

            const rol = rolFromScopes(payload.scopes);

            // Usuario inactivo: no puede entrar
            if (rol === "inactivo") {
                alert("Tu cuenta está inactiva. Contacta con un gestor.");
                return;
            }

            // Guardar sesión con el rol real del servidor
            sessionStorage.setItem("user", JSON.stringify({
                id:    payload.uid,
                name:  payload.email,   // email del claim 'email' del JWT
                rol,                    // "gestor" o "publico"
                token
            }));

            document.location = "main.html";

        } catch (error) {
            console.error("Error de conexión:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });
}