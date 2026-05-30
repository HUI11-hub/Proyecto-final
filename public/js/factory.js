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

    _normalize(data) {
        if (data && data.punto) {
            const p = data.punto;
            return { id: p.puntoId ?? p.id, tipo: p.tipo, codigo: p.codigo, operaciones: p.operaciones ?? [] };
        }
        if (data && data.operador) {
            const o = data.operador;
            return { id: o.operadorId ?? o.id, nombre: o.nombre, siglas: o.siglas, color: o.color, urlIcono: o.urlIcono, operaciones: o.operaciones ?? [] };
        }
        if (data && data.operacion) {
            const op = data.operacion;
            return {
                ulid:           op.operacionId ?? op.id,
                tipo:           op.tipo,
                codigo:         op.codigo,
                sentido:        op.sentido,
                origen:         op.origen,
                destino:        op.destino,
                horaProgramada: op.horaProgramada,
                horaEstimada:   op.horaEstimada,
                estado:         op.estado,
                operatorId:     op.operatorId ?? op.operadorId,
                spotId:         op.spotId     ?? op.puntoId
            };
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
                    const o = item.operador ?? item;
                    return { id: o.operadorId ?? o.id, nombre: o.nombre, siglas: o.siglas, color: o.color, urlIcono: o.urlIcono, operaciones: o.operaciones ?? [] };
                });
            }
            if (this.endpoint.includes('spots') && data.puntos) {
                return data.puntos.map(item => {
                    const p = item.punto ?? item;
                    return { id: p.puntoId ?? p.id, tipo: p.tipo, codigo: p.codigo, operaciones: p.operaciones ?? [] };
                });
            }
            if (this.endpoint.includes('operations') && data.operaciones) {
                return data.operaciones.map(item => {
                    const op = item.operacion ?? item;
                    return {
                        ulid:           op.operacionId ?? op.id,
                        tipo:           op.tipo,
                        codigo:         op.codigo,
                        sentido:        op.sentido,
                        origen:         op.origen,
                        destino:        op.destino,
                        horaProgramada: op.horaProgramada,
                        horaEstimada:   op.horaEstimada,
                        estado:         op.estado,
                        operatorId:     op.operatorId ?? op.operadorId,
                        spotId:         op.spotId     ?? op.puntoId
                    };
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
        delete payload.ulid;

        if (this.endpoint.includes('operations')) {
            payload.tipo    = String(payload.tipo    || '').toLowerCase();
            payload.sentido = String(payload.sentido || '').toLowerCase();
            payload.estado  = String(payload.estado  || '').toLowerCase();
            payload.operatorId = Number(payload.operatorId || 0);
            payload.spotId     = Number(payload.spotId     || 0);
        }

        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error del servidor (${response.status}):`, errorText);
            alert(`El servidor rechazó los datos (Error ${response.status}). Revisa la consola.`);
            throw new Error('POST abortado');
        }

        const data = await response.json();
        return this._normalize(data);
    }

    async update(id, item) {
        const payload = { ...item };
        delete payload.id;
        delete payload.ulid;

        if (this.endpoint.includes('operations')) {
            if (payload.tipo)    payload.tipo    = payload.tipo.toLowerCase();
            if (payload.sentido) payload.sentido = payload.sentido.toLowerCase();
            if (payload.estado)  payload.estado  = payload.estado.toLowerCase();
        }

        const response = await fetch(`${this.endpoint}/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error del servidor (${response.status}):`, errorText);
            alert(`El servidor rechazó la edición (Error ${response.status}).`);
            throw new Error('PUT abortado');
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
        case 'operations': return new ApiFactory('operations');
        case 'operators':  return new ApiFactory('operators');
        case 'waypoints':
        case 'spots':
        case 'puntos':
            return new ApiFactory('spots');
        default: throw new Error(`Colección no soportada: '${kind}'`);
    }
}
