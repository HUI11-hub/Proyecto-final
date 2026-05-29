const currentUser = JSON.parse(sessionStorage.getItem("user"));
if (!currentUser || currentUser.rol !== "gestor") {
    alert("Acceso denegado. Esta zona es exclusiva para GESTORES.");
    document.location = "main.html";
}

function getHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${currentUser.token}`
    };
}

const container = document.getElementById("usersContainer");

async function cargarUsuarios() {
    try {
        const response = await fetch("/api/v1/users", { headers: getHeaders() });

        if (!response.ok) {
            container.innerHTML = `<p>Error al cargar usuarios (${response.status}).</p>`;
            return;
        }

        const data  = await response.json();
        const users = data.users.map(item => item.user ?? item);
        renderTabla(users);

    } catch (err) {
        console.error("Error cargando usuarios:", err);
        container.innerHTML = `<p>Error de conexión.</p>`;
    }
}

function renderTabla(users) {
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
        const rolLabel = u.role === "GESTOR"   ? "GESTOR"
                       : u.role === "INACTIVO" ? "INACTIVO"
                       : "PÚBLICO";
        const rolColor = u.role === "GESTOR"   ? "hsl(210,100%,40%)"
                       : u.role === "INACTIVO" ? "#999"
                       : "hsl(210,60%,60%)";

        let acciones = "";
        if (!esMismo) {
            if (u.role !== "GESTOR") {
                acciones += `<button class="btnEdit" onclick="cambiarRol(${u.id}, 'gestor')">→ GESTOR</button> `;
            }
            if (u.role !== "PUBLICO") {
                acciones += `<button class="btnEdit" onclick="cambiarRol(${u.id}, 'publico')">PÚBLICO</button> `;
            }
            if (u.role !== "INACTIVO") {
                acciones += `<button class="btnChange" onclick="cambiarRol(${u.id}, 'inactivo')" style="background:#aaa;">Desactivar</button> `;
            } else {
                acciones += `<button class="btnChange" onclick="cambiarRol(${u.id}, 'publico')" style="background:hsl(210,60%,60%);">Activar</button> `;
            }
            acciones += `<button class="btnDelete" onclick="eliminarUsuario(${u.id}, '${u.email}')">Eliminar</button>`;
        } else {
            acciones = `<em style="color:#888;">(tú)</em>`;
        }

        html += `
        <tr>
            <td>${u.id}</td>
            <td>${u.email}</td>
            <td><span style="background:${rolColor};color:#fff;padding:2px 8px;border-radius:4px;">${rolLabel}</span></td>
            <td>${acciones}</td>
        </tr>`;
    });

    html += `</table>`;
    container.innerHTML = html;
}

window.cambiarRol = async function(userId, nuevoRol) {
    const etiquetas = { gestor: "GESTOR", publico: "PÚBLICO", inactivo: "INACTIVO" };
    const confirmar = confirm(`¿Cambiar el rol de este usuario a ${etiquetas[nuevoRol]}?`);
    if (!confirmar) return;

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
    const confirmar = confirm(
        `¿Eliminar al usuario "${email}"?\n\nEsta acción también eliminará TODOS sus datos asociados y no se puede deshacer.`
    );
    if (!confirmar) return;

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