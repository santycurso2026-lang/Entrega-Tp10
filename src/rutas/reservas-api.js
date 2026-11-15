const express = require("express");
const { validarReserva } = require("../middleware/reservas");
const { validarReemplazoReserva } = require("../middleware/cambios-reserva");
const { validarActualizacionReserva } = require("../middleware/cambios-reserva");
function crearRouterReservasApi(controlador) {
  const router = express.Router();
  router.get("/", controlador.listarApi);
  router.get("/estado", controlador.estado);
  router.get("/:id", controlador.obtenerApi);
  router.post("/", validarReserva, controlador.crearApi);
  router.delete("/:id", controlador.eliminarApi);
 
router.put(
  "/:id",
  validarReemplazoReserva, // Valida los 7 campos obligatorios
  controlador.reemplazarApi,
);

router.patch("/:id", validarActualizacionReserva, controlador.actualizarApi);
return router;
}

module.exports = { crearRouterReservasApi };
