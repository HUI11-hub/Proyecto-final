import { Model } from "./model.js";

export class Operation extends Model {
    constructor(factory) {
        super(factory);
    }

    setItems(items) {
        super.setItems(items);

        this.items = items.map((x) => ({
            ulid: String(x.ulid ?? this.generateULID()).trim(),
            tipo: String(x.tipo ?? "").trim(),
            codigo: String(x.codigo ?? "").trim(),
            sentido: String(x.sentido ?? "").trim(),
            origen: String(x.origen ?? "").trim(),
            destino: String(x.destino ?? "").trim(),
            horaProgramada: String(x.horaProgramada ?? "").trim(),
            horaEstimada: String(x.horaEstimada ?? "").trim(),
            estado: String(x.estado ?? "").trim(),
            operadorId: Number(x.operadorId ?? 0),
            puntoId: Number(x.puntoId ?? 0)
        }));

        super._calcIdULID();
    }

    async load() {
        const items = await this.factory.load();
        this.setItems(items);
        return this.getItems();
    }

    addItem({ tipo, codigo, sentido, origen, destino, horaProgramada, horaEstimada, estado, operadorId, puntoId }) {
        const t = String(tipo).trim();
        const c = String(codigo).trim();
        const se = String(sentido).trim();
        const o = String(origen).trim();
        const d = String(destino).trim();
        const hp = String(horaProgramada).trim();
        const he = String(horaEstimada).trim();
        const e = String(estado).trim();
        const op = Number(operadorId);
        const pt = Number(puntoId);

        if (!this.validateItem({ tipo: t, sentido: se, origen: o, destino: d, estado: e })) return;

        this.items.push({
            ulid: this.generateULID(),
            tipo: t,
            codigo: c,
            sentido: se,
            origen: o,
            destino: d,
            horaProgramada: hp,
            horaEstimada: he,
            estado: e,
            operadorId: op,
            puntoId: pt
        });
    }

    updateItem(ulid, { tipo, codigo, sentido, origen, destino, horaProgramada, horaEstimada, estado, operadorId, puntoId }) {
        const t = String(tipo).trim();
        const c = String(codigo).trim();
        const se = String(sentido).trim();
        const o = String(origen).trim();
        const d = String(destino).trim();
        const hp = String(horaProgramada).trim();
        const he = String(horaEstimada).trim();
        const e = String(estado).trim();
        const op = Number(operadorId);
        const pt = Number(puntoId);

        if (!this.validateItem({ tipo: t, sentido: se, origen: o, destino: d, estado: e })) return;

        const item = this.findByUlid(String(ulid).trim());
        if (!item) {
            alert("La operación no existe.");
            return;
        };

        item.tipo = t;
        item.codigo = c;
        item.sentido = se;
        item.origen = o;
        item.destino = d;
        item.horaProgramada = hp;
        item.horaEstimada = he;
        item.estado = e;
        item.operadorId = op;
        item.puntoId = pt;
    }

    validateItem({ tipo, sentido, origen, destino, estado }) {
        if (tipo !== "VUELO" && tipo !== "TREN") {
            alert('El tipo de punto debe ser "VUELO" o "TREN"');
            return false;
        }

        if (sentido !== "SALIDA" && sentido !== "LLEGADA") {
            alert('El sentido debe ser "SALIDA" o "LLEGADA"');
            return false;
        }

        if (origen.length < 3) {
            alert("El origen debe tener al menos 3 caracteres.");
            return false;
        }

        if (destino.length < 3) {
            alert("El destino debe tener al menos 3 caracteres.");
            return false;
        }

        if (estado !== "PROGRAMADO" && estado !== "EN RUTA" && estado !== "CANCELADO" && estado !== "EMBARCANDO" && estado !== "LLEGADO" && estado !== "RETRASADO") {
            alert('El estado debe ser "PROGRAMADO", "EN RUTA", "CANCELADO", "EMBARCANDO", "LLEGADO" o "RETRASADO"');
            return false;
        }

        return true;
    }

    generateULID() {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let ulid = '';
        for (let i = 0; i < 26; i++) {
            ulid += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return ulid;
    }
}