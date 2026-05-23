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

    async load() {
        try {
            const response = await fetch(this.endpoint, { headers: this.getHeaders() });
            if (!response.ok) return [];
            const data = await response.json();
            
            if (this.endpoint.includes('operators') && data.operadores) {
                return data.operadores.map(item => item.operador || item);
            }
            if (this.endpoint.includes('spots') && data.puntos) {
                return data.puntos.map(item => item.punto || item);
            }
            if (this.endpoint.includes('operations') && data.operaciones) {
                return data.operaciones.map(item => item.operacion || item);
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
        
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(payload) 
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`ERROR DEL BACK-END (${response.status}):`, errorText);
            alert(`El servidor rechazó los datos (Error ${response.status}).`);
            throw new Error("POST abortado");
        }
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
        case "operators": return new ApiFactory("operators");
        case "waypoints": 
        case "spots": 
        case "puntos": 
            return new ApiFactory("spots");
        default: throw new Error(`Colección no soportada: '${kind}'`);
    }
}