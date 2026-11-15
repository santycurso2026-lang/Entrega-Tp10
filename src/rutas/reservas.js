// Router de Reservas

const express = require("express");
// 1. Importa también 'validarReserva' desde tu archivo de middleware
const {
  prepararAreaReservas,
  validarReserva,
} = require("../middleware/reservas");

function crearRouterReservas(controladorReservas) {
  const router = express.Router();

  // Middleware específico para el área de reservas
  router.use(prepararAreaReservas);

  // Rutas mapeadas a los métodos del controlador
  router.get("/", controladorReservas.listar);
  router.get("/nueva", controladorReservas.mostrarFormulario);
  router.get("/estado", controladorReservas.estado);

  router.post("/", validarReserva, controladorReservas.crear);
  router.get("/:id", controladorReservas.mostrarDetalle);

  return router;
}

module.exports = { crearRouterReservas };
