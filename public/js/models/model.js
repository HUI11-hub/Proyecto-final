import { createRepo } from '../factory.js';

export class Model {
    constructor(kind) {
        this.factory = createRepo(kind);
        this.items = [];
    }

    async load() {
        this.items = await this.factory.load();
        return this.items;
    }

    getItems() {
        return this.items;
    }

    async addItem(item) {
        await this.factory.create(item);
    }

    async updateItem(item) {
        const id = item.id || item.ulid;
        await this.factory.update(id, item);
    }

    async deleteItem(id) {
        await this.factory.delete(id);
    }

    findById(id) {
        return this.items.find(item => item.id === id);
    }

    findByUlid(ulid) {
        return this.items.find(item => String(item.ulid).trim() === String(ulid).trim());
    }

    validateItem(item) {
        if (item.codigo && item.codigo.trim() === "") {
            alert("El código no puede estar vacío");
            return false;
        }
        return true;
    }
}