function renderBoard() {
    let operaciones = JSON.parse(localStorage.getItem("operations")) || [];
    let operadores = JSON.parse(localStorage.getItem("operators")) || [];
    let puntos = JSON.parse(localStorage.getItem("waypoints")) || [];
    let searchCode = document.getElementById("searchCode").value.toLowerCase().trim();
    let filterStatus = document.getElementById("filterStatus").value;
    let sortData = document.getElementById("sortData").value;
    let opsFiltradas = operaciones.filter(ope => {
        let coincideCodigo = ope.codigo.toLowerCase().includes(searchCode);
        let coincideEstado = filterStatus === "TODOS" || ope.estado === filterStatus;
        return coincideCodigo && coincideEstado;
    });

    opsFiltradas.sort((a, b) => {
        if (sortData === "horaEstimada") {
            return new Date(a.horaEstimada) - new Date(b.horaEstimada);
        } else if (sortData === "codigo") {
            return a.codigo.localeCompare(b.codigo);
        } else if (sortData === "origen") {
            return a.origen.localeCompare(b.origen);
        } else if (sortData === "destino") {
            return a.destino.localeCompare(b.destino);
        }
        return 0;
    });

    let salidas = opsFiltradas.filter(ope => ope.sentido === "SALIDA");
    let llegadas = opsFiltradas.filter(ope => ope.sentido === "LLEGADA");
    document.getElementById("departuresBoard").innerHTML = crearTablaHTML(salidas, operadores, puntos);
    document.getElementById("arrivalsBoard").innerHTML = crearTablaHTML(llegadas, operadores, puntos);
}

function crearTablaHTML(listaOps, operadores, puntos) {
    if (listaOps.length === 0) {
        return "<p class='noOps'>No hay operaciones programadas.</p>";
    }
    let html = `
        <table>
            <tr>
                <th>Hora Est.</th>
                <th>Código</th>
                <th>Ruta</th>
                <th>Operador</th>
                <th>Puerta</th>
                <th>Estado</th>
            </tr>
    `;

    listaOps.forEach(ope => {
        let opNombre = operadores.find(o => o.id == ope.operadorId)?.nombre || "N/A";
        let ptCodigo = puntos.find(p => p.id == ope.puntoId)?.codigo || "N/A";
        let colorEstado = ope.estado === "RETRASADO" ? "#ffcccc" :
                          ope.estado === "CANCELADO" ? "#ff9999" :
                          ope.estado === "EMBARCANDO" ? "#ccffcc" : "#eeeeee";
        let horaMuestra = ope.horaEstimada.replace("T", " a las ");

        html += `<tr>
            <td><b>${horaMuestra}</b></td>
            <td style="color: #0056b3;"><b>${ope.codigo}</b></td>
            <td>${ope.origen} ➔ ${ope.destino}</td>
            <td>${opNombre}</td>
            <td><b>${ptCodigo}</b></td>
            <td><span class="estadoTable" style="background: ${colorEstado};">${ope.estado}</span></td>
        </tr>`;
    });

    html += `</table>`;
    return html;
}

document.getElementById("searchCode").addEventListener("input", renderBoard);
document.getElementById("filterStatus").addEventListener("change", renderBoard);
document.getElementById("sortData").addEventListener("change", renderBoard);

renderBoard();
setInterval(() => {
    console.log("Recarga del tablero de vuelos...");
    renderBoard();
}, 60000);