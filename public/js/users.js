const currentUser = JSON.parse(sessionStorage.getItem("user"));
if (!currentUser || currentUser.rol !== "gestor") {
    alert("Acceso denegado. Esta zona es exclusiva para Gestores.");
    document.location = "main.html";
}

function getHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${currentUser.token}`
    };
}

const container = document.getElementById("usersContainer");
let todosLosUsuarios = [];

async function cargarUsuarios() {
    try {
        const response = await fetch("/api/v1/users", { headers: getHeaders() });

        if (!response.ok) {
            container.innerHTML = `<p>Error al cargar usuarios (${response.status}).</p>`;
            return;
        }

        const data  = await response.json();
        todosLosUsuarios = data.users.map(item => item.user ?? item);
        filtrarUsuarios();

    } catch (err) {
        console.error("Error cargando usuarios:", err);
        container.innerHTML = `<p>Error de conexión.</p>`;
    }
}

window.filtrarUsuarios = function() {
    const busqueda = (document.getElementById("searchUser")?.value ?? "").toLowerCase().trim();
    const filtrados = todosLosUsuarios.filter(u =>
        u.email.toLowerCase().includes(busqueda)
    );
    renderTabla(filtrados);
};

function renderTabla(users) {
    if (users.length === 0) {
        container.innerHTML = `<p style="color:#888;">No se encontraron usuarios.</p>`;
        return;
    }

    const colorRol = {
        GESTOR:   "hsl(210,100%,40%)",
        PUBLICO:  "hsl(210,60%,60%)",
        INACTIVO: "#999"
    };

    let html = `
    <table class="shadowPanel" id="usersTable">
        <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
        </tr>`;

    users.forEach(u => {
        const esMismo  = u.id === currentUser.id;
        const rol      = (u.role ?? "").toUpperCase();
        const color    = colorRol[rol] ?? "#ccc";

        let acciones = "";
        if (esMismo) {
            acciones = `<em style="color:#888;">(tú)</em>`;
        } else {
            if (rol !== "GESTOR") {
                acciones += `<button class="btnEdit" onclick="cambiarRol(${u.id}, 'gestor')">→ GESTOR</button> `;
            }
            if (rol !== "PUBLICO") {
                acciones += `<button class="btnEdit" onclick="cambiarRol(${u.id}, 'publico')">→ PÚBLICO</button> `;
            }
            if (rol !== "INACTIVO") {
                acciones += `<button class="btnChange" onclick="cambiarRol(${u.id}, 'inactivo')" style="background:#aaa;color:#fff;">Desactivar</button> `;
            } else {
                acciones += `<button class="btnChange" onclick="cambiarRol(${u.id}, 'publico')" style="background:hsl(210,60%,60%);color:#fff;">Activar</button> `;
            }
            acciones += `<button class="btnDelete" onclick="eliminarUsuario(${u.id}, '${u.email}')">Eliminar</button>`;
        }

        html += `
        <tr>
            <td>${u.id}</td>
            <td>${u.email}</td>
            <td><span style="background:${color};color:#fff;padding:2px 8px;border-radius:4px;font-size:0.85em;">${rol}</span></td>
            <td style="display:flex;gap:6px;flex-wrap:wrap;">${acciones}</td>
        </tr>`;
    });

    html += `</table>`;
    container.innerHTML = html;
}

window.cambiarRol = async function(userId, nuevoRol) {
    const etiquetas = { gestor: "GESTOR", publico: "PÚBLICO", inactivo: "INACTIVO" };
    if (!confirm(`¿Cambiar el rol de este usuario a ${etiquetas[nuevoRol]}?`)) return;

    try {
        const response = await fetch(`/api/v1/users/${userId}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify({ role: nuevoRol })
        });

        if (response.ok) {
            cargarUsuarios();
        } else {
            const err = await response.json().catch(() => ({}));
            alert("Error al cambiar rol: " + (err.message || response.status));
        }
    } catch (err) {
        console.error(err);
        alert("Error de conexión.");
    }
};

window.eliminarUsuario = async function(userId, email) {
    if (!confirm(
        `¿Eliminar al usuario "${email}"?\n\nEsta acción también eliminará TODOS sus datos asociados y no se puede deshacer.`
    )) return;

    try {
        const response = await fetch(`/api/v1/users/${userId}`, {
            method: "DELETE",
            headers: getHeaders()
        });

        if (response.ok || response.status === 204) {
            cargarUsuarios();
        } else {
            const err = await response.json().catch(() => ({}));
            alert("Error al eliminar usuario: " + (err.message || response.status));
        }
    } catch (err) {
        console.error(err);
        alert("Error de conexión.");
    }
};

cargarUsuarios();