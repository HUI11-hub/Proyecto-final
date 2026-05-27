export const API_BASE = '/api/v1';

export class ApiFactory {
    constructor(endpoint) {
        this.endpoint = `${API_BASE}/${endpoint}`;
    }

    getHeaders() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        const headers = { 'Content-Type': 'application/json' };
        if (user && user.token) {
            headers['Authorization'] = `Bearer ${user.token}`;
        }
        return headers;
    }

    // Normaliza el objeto que devuelve el backend al formato { id, ... }
    // El backend devuelve { "punto": { "puntoId": 1, ... } }
    // El frontend necesita { "id": 1, ... }
    _normalize(data) {
        // spots: { punto: { puntoId, tipo, codigo, operaciones } }
        if (data && data.punto) {
            const p = data.punto;
            return { id: p.puntoId, tipo: p.tipo, codigo: p.codigo, operaciones: p.operaciones ?? [] };
        }
        // operators: { operador: { operadorId, nombre, siglas, color, urlIcono, operaciones } }
        if (data && data.operador) {
            const o = data.operador;
            return { id: o.operadorId, nombre: o.nombre, siglas: o.siglas, color: o.color, urlIcono: o.urlIcono, operaciones: o.operaciones ?? [] };
        }
        // operations: { operacion: { operacionId, ... } }
        if (data && data.operacion) {
            const op = data.operacion;
            return { id: op.operacionId, ...op };
        }
        return data;
    }

    async load() {
        try {
            const response = await fetch(this.endpoint, { headers: this.getHeaders() });
            if (!response.ok) return [];
            const data = await response.json();

            if (this.endpoint.includes('operators') && data.operadores) {
                return data.operadores.map(item => {
                    const o = item.operador || item;
                    return { id: o.operadorId ?? o.id, nombre: o.nombre, siglas: o.siglas, color: o.color, urlIcono: o.urlIcono, operaciones: o.operaciones ?? [] };
                });
            }
            if (this.endpoint.includes('spots') && data.puntos) {
                return data.puntos.map(item => {
                    const p = item.punto || item;
                    return { id: p.puntoId ?? p.id, tipo: p.tipo, codigo: p.codigo, operaciones: p.operaciones ?? [] };
                });
            }
            if (this.endpoint.includes('operations') && data.operaciones) {
                return data.operaciones.map(item => {
                    const op = item.operacion || item;
                    return { id: op.operacionId ?? op.id, ...op };
                });
            }
            return data;
        } catch (error) {
            console.error(`Error GET ${this.endpoint}:`, error);
            return [];
        }
    }

    async create(item) {
        const payload = { ...item };
        delete payload.id;

        if (this.endpoint.includes('operations')) {
            console.log("📦 PAQUETE ORIGINAL DEL FORMULARIO:", payload);
            if (payload.estado)  payload.estado  = String(payload.estado).toLowerCase();
            if (payload.tipo)    payload.tipo     = String(payload.tipo).toLowerCase();
            if (payload.sentido) payload.sentido  = String(payload.sentido).toLowerCase();
            if (payload['Hora Prog.']) { payload.horaProgramada = payload['Hora Prog.']; delete payload['Hora Prog.']; }
            if (payload['Hora Est.'])  { payload.horaEstimada   = payload['Hora Est.'];  delete payload['Hora Est.']; }
            if (payload.Operador)      { payload.operadorId = Number(payload.Operador);  delete payload.Operador; }
            if (payload['Puerta/Vía']) { payload.puntoId = Number(payload['Puerta/Vía']); delete payload['Puerta/Vía']; }
            console.log("🚀 PAQUETE TRADUCIDO LISTO PARA ENVIAR:", payload);
        }

        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`💥 ERROR DEL BACK-END (${response.status}):`, errorText);
            alert(`El servidor rechazó los datos (Error ${response.status}). Revisa la consola.`);
            throw new Error("POST abortado");
        }
        
        // Leer y normalizar el objeto creado para obtener el id real
        const data = await response.json();
        return this._normalize(data);
    }

    async update(id, item) {
        const payload = { ...item };
        delete payload.id;

        const response = await fetch(`${this.endpoint}/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`ERROR DEL BACK-END (${response.status}):`, errorText);
            alert(`El servidor rechazó la edición (Error ${response.status}).`);
            throw new Error("PUT abortado");
        }
    }

    async delete(id) {
        await fetch(`${this.endpoint}/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });
    }
}

export function createRepo(kind) {
    switch (kind) {
        case "operations": return new ApiFactory("operations");
        case "operators":  return new ApiFactory("operators");
        case "waypoints":
        case "spots":
        case "puntos":
            return new ApiFactory("spots");
        default: throw new Error(`Colección no soportada: '${kind}'`);
    }
}