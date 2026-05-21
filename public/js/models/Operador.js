import { Model } from "./model.js";

export class Operador extends Model {
    constructor(factory) {
        super(factory);
    }

    setItems(items) {
        super.setItems(items);

        this.items = items.map((x, i) => ({
            id: x.id ?? i + 1,
            nombre: String(x.nombre ?? "").trim(),
            siglas: String(x.siglas ?? "").trim(),
            color: String(x.color ?? "").trim(),
            urlIcono: String(x.urlIcono ?? "").trim(),
        }));

        super._calcId();
    }

    async load() {
        const items = await this.factory.load();
        this.setItems(items);
        return this.getItems();
    }

    addItem({ nombre, siglas, color, urlIcono }) {
        const n = String(nombre).trim();
        const s = String(siglas).trim();

        if (!this.validateItem({ nombre: n, siglas: s })) return;

        this.items.push({
            id: this.nextId++,
            nombre: n,
            siglas: s,
            color: String(color).trim(),
            urlIcono: String(urlIcono).trim()
        });
    }

    updateItem(id, { nombre, siglas, color, urlIcono }) {
        const n = String(nombre).trim();
        const s = String(siglas).trim();

        if (!this.validateItem({ nombre: n })) return;

        const item = this.findById(Number(id));
        if (!item) {
            alert("El operador no existe.");
            return;
        }

        item.nombre = n;
        item.siglas = s;
        item.color = String(color).trim();
        item.urlIcono = String(urlIcono).trim();
    }

    validateItem({ nombre }) {
        console.log(nombre.length);
        if (nombre.length < 2) {
            alert("El nombre debe tener al menos 2 caracteres.");
            return false;
        }

        return true;
    }
}