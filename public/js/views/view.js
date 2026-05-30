export class View {
    constructor() {
        this.adminForm   = document.getElementById("adminForm");
        this.table       = document.getElementById("adminTable");
        this.editForm    = document.getElementById("editForm");
        this.titleAdminEdit = document.getElementById("titleAdminEdit");
        this.adminTitle  = document.getElementById("adminTitle");
        this.btnSubmit   = document.getElementById("btnSubmit");
        this.btnCancel   = document.getElementById("btnCancel");
    }

    bindFormSubmit(handler) { this.adminForm.onsubmit = handler; }
    bindListClick(handler)  { this.table.onclick = handler; }
    bindCancel(handler)     { this.btnCancel.onclick = handler; }

    fillForm() {
        this.btnSubmit.textContent = "Guardar cambios";
        this.btnCancel.style.display = "inline-block";
    }

    clearForm() {
        this.btnSubmit.textContent = "Añadir";
        this.btnCancel.style.display = "none";
        const trHighlight = document.querySelector("tr.highlightTable");
        trHighlight?.classList.remove("highlightTable");
        this.adminForm.reset();
    }
}

// ─── PUNTOS ────────────────────────────────────────────────────────────────────

export class ViewWaypoints extends View {
    constructor() { super(); }

    getFormData() {
        const fd = new FormData(this.adminForm);
        return {
            id:     fd.get("id"),
            tipo:   String(fd.get("tipo")   || "").trim(),
            codigo: String(fd.get("codigo") || "").trim()
        };
    }

    fillForm(item) {
        document.getElementById("puntoId").value = item.id;
        document.getElementById("opcTipo").value = item.tipo;
        document.getElementById("opcTipo").dispatchEvent(new Event("change"));
        document.getElementById("codigo").value  = item.codigo;
        this.titleAdminEdit.innerText = "Modificar punto";
        super.fillForm();
    }

    clearForm() {
        super.clearForm();
        document.getElementById("puntoId").value = "";
        this.titleAdminEdit.innerText = "Agregar nuevo punto";
    }

    render(items) {
        this.renderEditForm();
        this.renderTable(items);
    }

    renderEditForm() {
        this.editForm.innerHTML = `
            <input type="hidden" name="id" id="puntoId">
            <div class="inputBox">
                <label>Tipo:</label>
                <div class="selectBox">
                    <select id="opcTipo" name="tipo">
                        <option value="PUERTA">PUERTA</option>
                        <option value="VIA">VÍA</option>
                    </select>
                </div>
            </div>
            <div class="inputBox">
                <label>Código:</label>
                <input id="codigo" type="text" name="codigo" class="textInput" required placeholder="Ej: T4-K66">
            </div>`;
        this.adminTitle.innerText     = "📍 GESTIÓN DE PUNTOS (PUERTAS Y VÍAS)";
        this.titleAdminEdit.innerText = "Agregar nuevo punto";
    }

    renderTable(items) {
        let tableHTML = `
            <tr>
                <th>ID</th><th>Tipo</th><th>Código de Puerta/Vía</th><th>Acciones</th>
            </tr>`;
        items.forEach(item => {
            tableHTML += `<tr>
                <td><b>${item.id}</b></td>
                <td>${item.tipo}</td>
                <td>${item.codigo}</td>
                <td>
                    <button class="btnEdit"   data-action="edit"   data-id="${item.id}">Editar</button>
                    <button class="btnDelete" data-action="delete" data-id="${item.id}">Borrar</button>
                </td>
            </tr>`;
        });
        this.table.innerHTML = tableHTML;
    }
}

// ─── OPERADORES ────────────────────────────────────────────────────────────────

export class ViewOperators extends View {
    constructor() { super(); }

    getFormData() {
        const fd = new FormData(this.adminForm);
        return {
            id:       fd.get("id"),
            nombre:   String(fd.get("nombre")   || "").trim(),
            siglas:   String(fd.get("siglas")   || "").trim(),
            color:    String(fd.get("color")    || "").trim(),
            urlIcono: String(fd.get("urlIcono") || "").trim()
        };
    }

    fillForm(item) {
        document.getElementById("operatorId").value  = item.id;
        document.getElementById("nombre").value      = item.nombre;
        document.getElementById("siglas").value      = item.siglas;
        document.getElementById("color").value       = item.color;
        document.getElementById("urlIcono").value    = item.urlIcono;
        super.fillForm();
        this.titleAdminEdit.innerText = "Modificar operador";
    }

    clearForm() {
        super.clearForm();
        document.getElementById("operatorId").value = "";
        this.titleAdminEdit.innerText = "Agregar nuevo operador";
    }

    render(items) {
        this.renderEditForm();
        this.renderTable(items);
    }

    renderEditForm() {
        this.editForm.innerHTML = `
            <input type="hidden" name="id" id="operatorId">
            <div class="inputBox">
                <label>Nombre: </label>
                <input type="text" id="nombre" name="nombre" class="textInput" required placeholder="Ej: Gonzalo">
            </div>
            <div class="inputBox">
                <label>Siglas: </label>
                <input type="text" id="siglas" name="siglas" class="textInput" required placeholder="Ej: IBE">
            </div>
            <div class="inputBox">
                <label>Color: </label>
                <input type="color" id="color" name="color" class="textInput">
            </div>
            <div class="inputBox">
                <label>URL Icono: </label>
                <input type="text" id="urlIcono" name="urlIcono" class="textInput" placeholder="https://...">
            </div>`;
        this.adminTitle.innerText     = "🧑‍✈️ GESTIÓN DE OPERADORES";
        this.titleAdminEdit.innerText = "Agregar nuevo operador";
    }

    renderTable(items) {
        let tableHTML = `
            <tr>
                <th>ID</th><th>Nombre</th><th>Siglas</th><th>Color</th><th>Acciones</th>
            </tr>`;
        items.forEach(item => {
            tableHTML += `<tr>
                <td><b>${item.id}</b></td>
                <td>${item.nombre}</td>
                <td>${item.siglas}</td>
                <td><span style="background:${item.color};padding:2px 10px;border-radius:4px;">${item.color}</span></td>
                <td>
                    <button class="btnEdit"   data-action="edit"   data-id="${item.id}">Editar</button>
                    <button class="btnDelete" data-action="delete" data-id="${item.id}">Borrar</button>
                </td>
            </tr>`;
        });
        this.table.innerHTML = tableHTML;
    }
}

// ─── OPERACIONES ───────────────────────────────────────────────────────────────

export class ViewOperations extends View {
    constructor() {
        super();
        this._operadores = [];
        this._puntos     = [];
    }

    // Inyecta los datos de la API antes de renderizar
    setOperadoresYPuntos(operadores, puntos) {
        this._operadores = operadores;
        this._puntos     = puntos;
    }

    getFormData() {
        const fd = new FormData(this.adminForm);
        return {
            ulid:           String(fd.get("ulid")           || "").trim(),
            tipo:           String(fd.get("tipo")           || "").trim(),
            codigo:         String(fd.get("codigo")         || "").trim(),
            sentido:        String(fd.get("sentido")        || "").trim(),
            origen:         String(fd.get("origen")         || "").trim(),
            destino:        String(fd.get("destino")        || "").trim(),
            horaProgramada: String(fd.get("horaProgramada") || "").trim(),
            horaEstimada:   String(fd.get("horaEstimada")   || "").trim(),
            estado:         String(fd.get("estado")         || "").trim(),
            operatorId:     Number(fd.get("operatorId")     || 0),
            spotId:        Number(fd.get("spotId")        || 0)
        };
    }

    fillForm(item) {
        document.getElementById("operationId").value             = item.ulid;
        document.getElementById("opcTipoOperacion").value        = item.tipo;
        document.getElementById("opcTipoOperacion").dispatchEvent(new Event("change"));
        document.getElementById("codigoOperacion").value         = item.codigo;
        document.getElementById("opcSentido").value              = item.sentido;
        document.getElementById("opcSentido").dispatchEvent(new Event("change"));
        document.getElementById("origen").value                  = item.origen;
        document.getElementById("destino").value                 = item.destino;
        document.getElementById("horaProgramada").value          = item.horaProgramada;
        document.getElementById("horaEstimada").value            = item.horaEstimada;
        document.getElementById("opcEstado").value               = item.estado;
        document.getElementById("opcEstado").dispatchEvent(new Event("change"));
        document.getElementById("opcOperatorId").value           = item.operatorId;
        document.getElementById("opcOperatorId").dispatchEvent(new Event("change"));
        document.getElementById("opcSpotId").value              = item.spotId;
        document.getElementById("opcSpotId").dispatchEvent(new Event("change"));
        super.fillForm();
        this.titleAdminEdit.innerText = "Modificar operación";
    }

    clearForm() {
        super.clearForm();
        document.getElementById("operationId").value = "";
        this.titleAdminEdit.innerText = "Agregar nueva operación";
    }

    render(items) {
        this.renderEditForm();
        this.renderTable(items);
    }

    renderEditForm() {
        const opcionesOperadores = this._operadores.length
            ? this._operadores.map(op => `<option value="${op.id}">${op.nombre}</option>`).join("")
            : `<option value="">— Sin operadores —</option>`;

        const opcionesPuntos = this._puntos.length
            ? this._puntos.map(p => `<option value="${p.id}">${p.codigo} (${p.tipo})</option>`).join("")
            : `<option value="">— Sin puntos —</option>`;

        this.editForm.innerHTML = `
            <input type="hidden" name="ulid" id="operationId">
            <div class="inputBox">
                <label>Tipo:</label>
                <div class="selectBox">
                    <select id="opcTipoOperacion" name="tipo">
                        <option value="VUELO">VUELO</option>
                        <option value="TREN">TREN</option>
                    </select>
                </div>
            </div>
            <div class="inputBox">
                <label>Sentido:</label>
                <div class="selectBox">
                    <select id="opcSentido" name="sentido">
                        <option value="SALIDA">SALIDA</option>
                        <option value="LLEGADA">LLEGADA</option>
                    </select>
                </div>
            </div>
            <div class="inputBox">
                <label>Código:</label>
                <input type="text" id="codigoOperacion" name="codigo" class="textInput" required placeholder="IB1234">
            </div>
            <div class="inputBox">
                <label>Origen:</label>
                <input type="text" id="origen" name="origen" class="textInput" required>
            </div>
            <div class="inputBox">
                <label>Destino:</label>
                <input type="text" id="destino" name="destino" class="textInput" required>
            </div>
            <div class="inputBox">
                <label>Hora Prog.:</label>
                <input type="datetime-local" id="horaProgramada" name="horaProgramada" class="textInput" required>
            </div>
            <div class="inputBox">
                <label>Hora Est.:</label>
                <input type="datetime-local" id="horaEstimada" name="horaEstimada" class="textInput" required>
            </div>
            <div class="inputBox">
                <label>Estado:</label>
                <div class="selectBox">
                    <select id="opcEstado" name="estado">
                        <option value="PROGRAMADO">PROGRAMADO</option>
                        <option value="EN RUTA">EN RUTA</option>
                        <option value="CANCELADO">CANCELADO</option>
                        <option value="EMBARCANDO">EMBARCANDO</option>
                        <option value="LLEGADO">LLEGADO</option>
                        <option value="RETRASADO">RETRASADO</option>
                    </select>
                </div>
            </div>
            <div class="inputBox">
                <label>Operador:</label>
                <div class="selectBox">
                    <select id="opcOperatorId" name="operatorId">
                        ${opcionesOperadores}
                    </select>
                </div>
            </div>
            <div class="inputBox">
                <label>Puerta/Vía:</label>
                <div class="selectBox">
                    <select id="opcSpotId" name="spotId">
                        ${opcionesPuntos}
                    </select>
                </div>
            </div>`;
        this.adminTitle.innerText     = "✈️ GESTIÓN DE OPERACIONES (VUELOS/TRENES)";
        this.titleAdminEdit.innerText = "Agregar nueva operación";
    }

    renderTable(items) {
        let tableHTML = `
            <tr>
                <th>Código</th>
                <th>Ruta</th>
                <th class="hiddenMobile">Horas</th>
                <th>Estado</th>
                <th class="hiddenMobile">Operador</th>
                <th class="hiddenMobile">Puerta</th>
                <th>Acciones</th>
            </tr>`;

        items.forEach(item => {
            const op         = this._operadores.find(o => o.id == item.operatorId);
            const pt         = this._puntos.find(p => p.id == item.spotId);
            const nombreOp   = op ? op.nombre   : "Desconocido";
            const codigoPt   = pt ? pt.codigo   : "Desconocido";

            tableHTML += `<tr>
                <td><b>${item.codigo}</b><br><small style="color:#666;">${item.tipo} - ${item.sentido}</small></td>
                <td>${item.origen} ➔ ${item.destino}</td>
                <td class="hiddenMobile">Prog: ${item.horaProgramada.replace("T"," ")}<br>Est: ${item.horaEstimada.replace("T"," ")}</td>
                <td><span class="estadoTable" style="background:#eee;">${item.estado}</span></td>
                <td class="hiddenMobile">${nombreOp}</td>
                <td class="hiddenMobile">${codigoPt}</td>
                <td>
                    <button class="btnEdit"   data-action="editUlid"   data-id="${item.ulid}">Editar</button>
                    <button class="btnDelete" data-action="deleteUlid" data-id="${item.ulid}">Borrar</button>
                </td>
            </tr>`;
        });

        this.table.innerHTML = tableHTML;
    }
}