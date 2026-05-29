let operaciones = [];
let operadores  = [];
let puntos      = [];

function getHeaders() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const headers = {};
    if (user && user.token) {
        headers["Authorization"] = `Bearer ${user.token}`;
    }
    return headers;
}

async function cargarDatos() {
    try {
        const [resOps, resOpers, resPuntos] = await Promise.all([
            fetch("/api/v1/operations", { headers: getHeaders() }),
            fetch("/api/v1/operators",  { headers: getHeaders() }),
            fetch("/api/v1/spots",      { headers: getHeaders() })
        ]);

        if (resOps.ok) {
            const data = await resOps.json();
            operaciones = (data.operaciones ?? []).map(item => item.operacion ?? item);
        } else {
            operaciones = [];
        }

        if (resOpers.ok) {
            const data = await resOpers.json();
            operadores = (data.operadores ?? []).map(item => {
                const o = item.operador ?? item;
                return { id: o.operadorId ?? o.id, nombre: o.nombre, siglas: o.siglas, color: o.color };
            });
        } else {
            operadores = [];
        }

        if (resPuntos.ok) {
            const data = await resPuntos.json();
            puntos = (data.puntos ?? []).map(item => {
                const p = item.punto ?? item;
                return { id: p.puntoId ?? p.id, codigo: p.codigo, tipo: p.tipo };
            });
        } else {
            puntos = [];
        }

    } catch (err) {
        console.error("Error cargando datos del tablero:", err);
    }

    renderBoard();
}

function renderBoard() {
    const searchCode   = document.getElementById("searchCode").value.toLowerCase().trim();
    const filterStatus = document.getElementById("filterStatus").value;
    const sortData     = document.getElementById("sortData").value;

    let opsFiltradas = operaciones.filter(op => {
        const coincideCodigo = (op.codigo ?? "").toLowerCase().includes(searchCode);
        const coincideEstado = filterStatus === "TODOS" || op.estado === filterStatus;
        return coincideCodigo && coincideEstado;
    });

    opsFiltradas.sort((a, b) => {
        if (sortData === "horaEstimada") return new Date(a.horaEstimada) - new Date(b.horaEstimada);
        if (sortData === "codigo")       return (a.codigo ?? "").localeCompare(b.codigo ?? "");
        if (sortData === "origen")       return (a.origen  ?? "").localeCompare(b.origen  ?? "");
        if (sortData === "destino")      return (a.destino ?? "").localeCompare(b.destino ?? "");
        return 0;
    });

    const salidas  = opsFiltradas.filter(op => op.sentido === "SALIDA"  || op.sentido === "salida");
    const llegadas = opsFiltradas.filter(op => op.sentido === "LLEGADA" || op.sentido === "llegada");

    document.getElementById("departuresBoard").innerHTML = crearTablaHTML(salidas);
    document.getElementById("arrivalsBoard").innerHTML   = crearTablaHTML(llegadas);
}

function crearTablaHTML(listaOps) {
    if (listaOps.length === 0) {
        return "<p class='noOps'>No hay operaciones programadas.</p>";
    }

    const colorEstado = {
        RETRASADO:   "#ffcccc",
        CANCELADO:   "#ff9999",
        EMBARCANDO:  "#ccffcc",
        "EN RUTA":   "#cce5ff",
        LLEGADO:     "#e2e3e5",
        PROGRAMADO:  "#eeeeee"
    };

    let html = `
    <table>
        <tr>
            <th>Hora Est.</th>
            <th>Código</th>
            <th>Ruta</th>
            <th>Operador</th>
            <th>Puerta</th>
            <th>Estado</th>
        </tr>`;

    listaOps.forEach(op => {
        const operador   = operadores.find(o => o.id == op.operadorId);
        const punto      = puntos.find(p => p.id == op.puntoId);
        const nombreOp   = operador ? operador.nombre : "—";
        const codigoPt   = punto    ? punto.codigo    : "—";
        const color      = colorEstado[op.estado] ?? "#eeeeee";
        const hora       = (op.horaEstimada ?? "").replace("T", " ").slice(0, 16);

        html += `
        <tr>
            <td><b>${hora}</b></td>
            <td style="color:#0056b3;"><b>${op.codigo ?? "—"}</b></td>
            <td>${op.origen ?? "—"} ➔ ${op.destino ?? "—"}</td>
            <td>${nombreOp}</td>
            <td><b>${codigoPt}</b></td>
            <td><span class="estadoTable" style="background:${color};">${op.estado ?? "—"}</span></td>
        </tr>`;
    });

    html += `</table>`;
    return html;
}

document.getElementById("searchCode").addEventListener("input",   renderBoard);
document.getElementById("filterStatus").addEventListener("change", renderBoard);
document.getElementById("sortData").addEventListener("change",     renderBoard);

cargarDatos();
setInterval(() => {
    console.log("Recarga del tablero...");
    cargarDatos();
}, 60000);