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
            return await response.json();
        } catch (error) {
            console.error(`Error GET ${this.endpoint}:`, error);
            return [];
        }
    }

    async create(item) {
        await fetch(this.endpoint, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(item)
        });
    }

    async update(id, item) {
        await fetch(`${this.endpoint}/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(item)
        });
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
        case "waypoints": return new ApiFactory("spots"); // Conectamos waypoints con /spots
        default: throw new Error("Colección no soportada");
    }
}