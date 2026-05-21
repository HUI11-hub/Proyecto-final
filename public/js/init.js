if (typeof(Storage) !== "undefined") {
    if (!localStorage.getItem("users")) {
        localStorage.setItem("users", JSON.stringify([
            {name: "pablo@bt.es", password: "pablo1234", rol: "public"},
            {name: "elena@bt.es", password: "elena1234", rol: "manager"}
        ]))
    }
    if (!localStorage.getItem("operations")) {
        localStorage.setItem("operations", JSON.stringify([
            {ulid: "ulid1", tipo: "VUELO", codigo: "IB1234", sentido: "LLEGADA", origen: "España", destino: "Francia", horaProgramada: "2026-04-24T12:30", horaEstimada: "2026-04-24T15:00", estado: "PROGRAMADO", operadorId: 1, puntoId: 1},
            {ulid: "ulid2", tipo: "TREN", codigo: "AVE1234", sentido: "SALIDA", origen: "Madrid", destino: "Barcelona", horaProgramada: "2026-04-25T11:30", horaEstimada: "2026-04-25T13:15", estado: "PROGRAMADO", operadorId: 2, puntoId: 2},
            {ulid: "ulid3", tipo: "TREN", codigo: "AVE5678", sentido: "LLEGADA", origen: "Toledo", destino: "Cádiz", horaProgramada: "2026-04-01T09:30", horaEstimada: "2026-04-01T11:05", estado: "RETRASADO", operadorId: 3, puntoId: 3},
            {ulid: "ulid4", tipo: "VUELO", codigo: "RA1234", sentido: "SALIDA", origen: "Alemania", destino: "España", horaProgramada: "2026-04-13T10:30", horaEstimada: "2026-04-13T14:05", estado: "EN RUTA", operadorId: 1, puntoId: 4},
            {ulid: "ulid5", tipo: "VUELO", codigo: "RA1266", sentido: "LLEGADA", origen: "España", destino: "Reino Unido", horaProgramada: "2026-04-13T16:30", horaEstimada: "2026-04-13T19:15", estado: "CANCELADO", operadorId: 3, puntoId: 6},
            {ulid: "ulid6", tipo: "VUELO", codigo: "IB5678", sentido: "LLEGADA", origen: "España", destino: "Grecia", horaProgramada: "2026-04-13T08:30", horaEstimada: "2026-04-13T09:45", estado: "LLEGADO", operadorId: 2, puntoId: 5},
            {ulid: "ulid7", tipo: "VUELO", codigo: "IB9012", sentido: "LLEGADA", origen: "España", destino: "Islas Baleares", horaProgramada: "2026-04-13T09:00", horaEstimada: "2026-04-13T09:55", estado: "EMBARCANDO", operadorId: 4, puntoId: 4},
            {ulid: "ulid8", tipo: "TREN", codigo: "REN1234", sentido: "SALIDA", origen: "Bajadoz", destino: "Valencia", horaProgramada: "2026-04-06T08:30", horaEstimada: "2026-04-06T12:05", estado: "RETRASADO", operadorId: 3, puntoId: 2},
            {ulid: "ulid9", tipo: "TREN", codigo: "REN5678", sentido: "SALIDA", origen: "Galicia", destino: "Navarra", horaProgramada: "2026-04-13T08:30", horaEstimada: "2026-04-13T09:50", estado: "EMBARCANDO", operadorId: 4, puntoId: 3},
            {ulid: "ulid10", tipo: "TREN", codigo: "REN9012", sentido: "LLEGADA", origen: "Valencia", destino: "Bajadoz", horaProgramada: "2026-04-13T10:30", horaEstimada: "2026-04-13T12:05", estado: "EN RUTA", operadorId: 1, puntoId: 2},
        ]))
    }
    if (!localStorage.getItem("operators")) {
        localStorage.setItem("operators", JSON.stringify([
            {id: 1, nombre: "Gonzalo", siglas: "GON", color: "#ff00aa", urlIcono: ""},
            {id: 2, nombre: "Lucía", siglas: "LUC", color: "#00aaff", urlIcono: ""},
            {id: 3, nombre: "Jesús", siglas: "JES", color: "#00ee44", urlIcono: ""},
            {id: 4, nombre: "Paula", siglas: "PAU", color: "#eeee44", urlIcono: ""},
        ]))
    }
    if (!localStorage.getItem("waypoints")) {
        localStorage.setItem("waypoints", JSON.stringify([
            {id: 1, tipo: "PUERTA", codigo: "H3-A09"},
            {id: 2, tipo: "VIA", codigo: "T1-G12"},
            {id: 3, tipo: "VIA", codigo: "K9-W04"},
            {id: 4, tipo: "PUERTA", codigo: "U6-S11"},
            {id: 5, tipo: "PUERTA", codigo: "P1-V07"},
            {id: 6, tipo: "PUERTA", codigo: "L4-X12"}
        ]))
    }
}