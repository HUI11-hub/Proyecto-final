import { Model } from "./model.js";

export class Punto extends Model {
    constructor(factory) {
        super(factory);
    }

    setItems(items) {
        super.setItems(items);

        this.items = items.map((x, i) => ({
            id: x.id ?? i + 1,
            tipo: String(x.tipo ?? "").trim(),
            codigo: String(x.codigo ?? "").trim(),
        }));

        super._calcId();
    }

    async load() {
        const items = await this.factory.load();
        this.setItems(items);
        return this.getItems();
    }

    addItem({ tipo, codigo }) {
        const t = String(tipo).trim();
        if (!this.validateItem({ tipo: t, codigo })) return;

        this.items.push({
            id: this.nextId++,
            tipo: t,
            codigo: String(codigo).trim()
        });
    }

    updateItem(id, { tipo, codigo }) {
        const t = String(tipo).trim();
        if (!this.validateItem({ tipo: t, codigo })) return;

        const item = this.findById(Number(id));
        if (!item) {
            alert("El punto no existe.");
            return;
        }

        item.tipo = t;
        item.codigo = String(codigo).trim();
    }

    validateItem({ tipo, codigo }) {
        if (tipo !== "PUERTA" && tipo !== "VIA") {
            alert('El tipo de punto debe ser "PUERTA" o "VIA"');
            return false;
        }

        if (this.items.some(p => p.codigo.toLowerCase() === String(codigo).toLowerCase())) {
            alert("Ya existe un punto con ese código. Por favor, elige otro.");
            return false;
        }

        return true;
    }
}