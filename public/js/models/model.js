export class Model {
    constructor(factory) {
        this.factory = factory;
        this.items = [];
        this.nextId = 1;
    }

    getItems() {
        return this.items.map(x => ({ ...x }));
    }

    findById(id) {
        return this.items.find(x => x.id === id) || null;
    }

    findByUlid(ulid) {
        return this.items.find(x => x.ulid === ulid) || null;
    }

    setItems(items) {
        if (!Array.isArray(items)) throw new Error("El modelo espera un array.");
    }

    async save() {
        await this.factory.save(this.items);
    }

    _calcId() {
        let max = 0;
        for (const it of this.items) {
            const n = Number(it.id);
            if (Number.isFinite(n)) max = Math.max(max, n);
        }
        this.nextId = max + 1;
    }

    _calcIdULID() {
        let max = "00000000000000000000000000";
        for (const it of this.items) {
            if (it.ulid > max) max = it.ulid;
        }
        this.nextId = max;
    }

    removeItem(id) {
        const before = this.items.length;
        this.items = this.items.filter(x => x.id !== id);
        return this.items.length !== before;
    }

    removeItemULID(ulid) {
        const before = this.items.length;
        this.items = this.items.filter(x => x.ulid !== ulid);
        return this.items.length !== before;
    }
}