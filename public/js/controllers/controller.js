export class Controller {
    constructor(model, view) {
        this.model = model;
        this.view  = view;
    }

    async load() {
        this.view.bindFormSubmit((e) => this.handleSubmit(e));
        this.view.bindCancel((e)     => this.handleCancel(e));
        this.view.bindListClick((e)  => this.handleListClick(e));

        if (typeof this.view.setOperadoresYPuntos === 'function') {
            await this._refreshSelectsData();
        }

        const items = await this.model.load();
        this.view.render(items);
    }

    async _refreshSelectsData() {
        try {
            const { ApiFactory } = await import('../factory.js');
            const [operadores, puntos] = await Promise.all([
                new ApiFactory('operators').load(),
                new ApiFactory('spots').load()
            ]);
            this.view.setOperadoresYPuntos(operadores, puntos);
        } catch (err) {
            console.error('Error cargando operadores/puntos para selects:', err);
            this.view.setOperadoresYPuntos([], []);
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        const data = this.view.getFormData();
        if (!this.model.validateItem(data)) return;

        if (data.id) {
            await this.model.updateItem(data);
        } else if (data.ulid) {
            await this.model.updateItem(data);
        } else {
            await this.model.addItem(data);
        }

        if (typeof this.view.setOperadoresYPuntos === 'function') {
            await this._refreshSelectsData();
        }

        const items = await this.model.load();
        this.view.renderTable(items);
        this.view.clearForm();
    }

    handleCancel() {
        this.view.clearForm();
    }

    async handleListClick(e) {
        e.preventDefault();
        const btn = e.target.closest("button[data-action][data-id]");
        if (!btn) return;

        const { action, id } = btn.dataset;

        if (action === "delete" || action === "deleteUlid") {
            await this.model.deleteItem(id);

            if (typeof this.view.setOperadoresYPuntos === 'function') {
                await this._refreshSelectsData();
            }

            const items = await this.model.load();
            this.view.renderTable(items);
            this.view.clearForm();
            return;
        }

        if (action === "edit" || action === "editUlid") {
            let item = null;
            if (action === "edit") {
                item = this.model.findById(Number(id));
            } else {
                item = this.model.findByUlid(String(id).trim());
            }
            if (!item) return;
            this.view.fillForm(item);
        }
    }
}