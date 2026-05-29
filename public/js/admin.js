import { Punto } from "./models/Punto.js";
import { Operador } from "./models/Operador.js";
import { Operation } from "./models/Operation.js";
import { View, ViewWaypoints, ViewOperators, ViewOperations } from "./views/view.js";
import { Controller } from "./controllers/controller.js";
import { createRepo } from "./factory.js";

const currentUserAdmin = JSON.parse(sessionStorage.getItem("user"));

if (!currentUserAdmin || currentUserAdmin.rol !== "gestor") {
    alert("Acceso denegado. Esta zona es exclusiva para GESTORES");
    document.location = "main.html";
}

const view = new View();

const viewWaypoints = new ViewWaypoints();
const modelWaypoints = new Punto(createRepo("waypoints"));
const controllerWaypoints = new Controller(modelWaypoints, viewWaypoints);

const viewOperators = new ViewOperators();
const modelOperators = new Operador(createRepo("operators"));
const controllerOperators = new Controller(modelOperators, viewOperators);

const viewOperations = new ViewOperations();
const modelOperations = new Operation(createRepo("operations"));
const controllerOperations = new Controller(modelOperations, viewOperations);
controllerWaypoints.load();

function showAdminSection(seccion) {
    if (seccion === 'puntos') {
        controllerWaypoints.load();
    } else if (seccion === 'operadores') {
        controllerOperators.load();
    } else if (seccion === 'operaciones') {
        controllerOperations.load();
    }

    view.clearForm();
}

window.showAdminSection = showAdminSection;