export class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    load() {
        this.view.bindFormSubmit((e) => this.handleSubmit(e));
        this.view.bindCancel((e) => this.handleCancel(e));
        this.view.bindListClick((e) => this.handleListClick(e));

        const items = this.model.getItems();
        this.view.render(items);
    }

    handleSubmit(e) {
        e.preventDefault();
        const data = this.view.getFormData();

        if (!this.model.validateItem(data)) return;

        if (data.id) {
            this.model.updateItem(data);
        } else if (data.ulid) {
            this.model.updateItem(data);
        } else {
            this.model.addItem(data);
        }

        this.model.save();
        this.view.renderTable(this.model.getItems());
        this.view.clearForm();
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
        trHighlight?.classList.add("highlightTable");

        const { action, id } = btn.dataset;

        if (action === "delete" || action === "deleteUlid") {
            this.model.deleteItem(id);
            this.model.save();
            this.view.renderTable(this.model.getItems());
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