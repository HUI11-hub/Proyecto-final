class LocalStorageFactory {
    constructor(key) { this.key = key; }

    async load() {
        const raw = localStorage.getItem(this.key);
        return raw ? JSON.parse(raw) : [];
    }

    async save(list) {
        localStorage.setItem(this.key, JSON.stringify(list));
    }
}

export function createRepo(kind) {
    switch (kind) {
        case "operations": return new LocalStorageFactory("operations");
        case "operators": return new LocalStorageFactory("operators");
        case "waypoints": return new LocalStorageFactory("waypoints");
        default: throw new Error("Clase no soportado: " + kind);
    }
}