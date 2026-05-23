class StorageFactory {
    constructor(key) {
        this.key = key;
    }

    load() {
        return JSON.parse(localStorage.getItem(this.key)) || [];
    }

    save(data) {
        localStorage.setItem(this.key, JSON.stringify(data));
    }
}

export function createRepo(kind) {
    return new StorageFactory(kind);
}