const API_BASE = '/api/v1';

class ApiFactory {
    constructor(endpoint) {
        this.endpoint = `${API_BASE}/${endpoint}`;
    }

    async load() {
        try {
            const response = await fetch(this.endpoint);
            if (!response.ok) throw new Error('Error de red al cargar');
            return await response.json();
        } catch (error) {
            console.error(`Error cargando ${this.endpoint}:`, error);
            return [];
        }
    }

    async create(item) {
        try {
            await fetch(this.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
        } catch (error) {
            console.error(`Error creando en ${this.endpoint}:`, error);
        }
    }

    async update(id, item) {
        try {
            await fetch(`${this.endpoint}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
        } catch (error) {
            console.error(`Error actualizando en ${this.endpoint}:`, error);
        }
    }

    async delete(id) {
        try {
            await fetch(`${this.endpoint}/${id}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error(`Error borrando en ${this.endpoint}:`, error);
        }
    }
}

export function createRepo(kind) {
    switch (kind) {
        case "operations": return new ApiFactory("operations");
        case "operators": return new ApiFactory("operators");
        case "waypoints": return new ApiFactory("spots");
        default: throw new Error("Clase no soportada: " + kind);
    }
}