export class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    async load() {
        this.view.bindFormSubmit((e) => this.handleSubmit(e));
        this.view.bindCancel((e) => this.handleCancel(e));
        this.view.bindListClick((e) => this.handleListClick(e));

        const items = await this.model.load();
        this.view.render(items);
    }

    handleSubmit(e) {
        e.preventDefault();
        const data = this.view.getFormData();

        if (data.id) {
            this.model.updateItem(data.id, data)
        } else if (data.ulid) {
            this.model.updateItem(data.ulid, data)
        } else {
            this.model.addItem(data);
        }

        this.view.renderTable(this.model.getItems());
        this.view.clearForm();
        this.model.save();
    }

    handleCancel() {
        this.view.clearForm();
    }

    handleListClick(e) {
        e.preventDefault();
        const btn = e.target.closest("button[data-action][data-id]");
        if (!btn) return;

        const trHighlightAux = document.querySelector("tr.highlightTable");
        trHighlightAux?.classList.remove("highlightTable");

        const trHighlight = e.target.closest("tr");
        trHighlight.classList.add("highlightTable");

        const { action, id } = btn.dataset;

        if (action === "delete") {
            this.model.removeItem(Number(id));
            this.view.renderTable(this.model.getItems());
            this.model.save();
            this.view.clearForm();
            return;
        }

        if (action === "deleteUlid") {
            this.model.removeItemULID(id); //id es ulid
            this.view.renderTable(this.model.getItems());
            this.model.save();
            this.view.clearForm();
            return;
        }

        if (action === "edit") {
            const item = this.model.findById(Number(id));
            if (!item) return;
            this.view.fillForm(item);
            this.model.save();
        }

        if (action === "editUlid") {
            const item = this.model.findByUlid(String(id).trim()); //id es ulid
            if (!item) return;
            this.view.fillForm(item);
            this.model.save();
        }
    }
}