const currentUser = JSON.parse(sessionStorage.getItem("user"));
if (!currentUser || currentUser.rol !== "manager") {
    alert("Acceso denegado. Esta zona es solo para Gestores.");
    document.location = "main.html";
}
function renderUsersTable() {
    const container = document.getElementById("usersContainer");
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let tableHTML = `
        <table class="shadowPanel" id="adminTable">
            <tr>
                <th>Email</th>
                <th>Rol</th>
                <th>Acción</th>
            </tr>
    `;
    users.forEach((user, index) => {
        let actionButton = "";
        if (user.rol === "public") {
            actionButton = `<button class="btnChange" onclick="changeRole(${index}, 'manager')" style="background-color: hsl(210, 100%, 50%);">Cambiar a GESTOR</button>`;
        } else {
            actionButton = `<button class="btnChange" onclick="changeRole(${index}, 'public')" style="background-color: hsl(210, 100%, 20%);">Cambiar a PÚBLICO</button>`;
        }

        tableHTML += `
            <tr>
                <td style="padding: 8px;">${user.name}</td>
                <td style="padding: 8px;">${user.rol === 'manager' ? 'GESTOR' : 'PÚBLICO'}</td>
                <td style="padding: 8px;">${actionButton}</td>
            </tr>
        `;
    });

    tableHTML += `</table>`;
    container.innerHTML = tableHTML;
}
window.changeRole = function(userIndex, newRole) {
    let users = JSON.parse(localStorage.getItem("users"));
    if (newRole === "public") {
        const managerCount = users.filter(u => u.rol === "manager").length;
        if (managerCount <= 1) {
            alert("No puedes degradar a este usuario. Debe quedar al menos un GESTOR en el sistema.");
            return; 
        }
    }
    users[userIndex].rol = newRole;
    localStorage.setItem("users", JSON.stringify(users));
    if (users[userIndex].name === currentUser.name && newRole === "public") {
        sessionStorage.setItem("user", JSON.stringify(users[userIndex]));
        alert("Te has degradado a ti mismo. Serás redirigido al tablero público.");
        document.location = "main.html";
        return;
    }
    renderUsersTable();
};
renderUsersTable();