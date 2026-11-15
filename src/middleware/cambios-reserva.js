const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
const turnosPermitidos = ["Mañana", "Tarde", "Noche"];

// Validación de reemplazo de reserva (PUT /api/reservas/:id)
function validarReemplazoReserva(req, res, next) {
  const datos = req.body;

  // 1. Validar que el cuerpo exista, sea un objeto y no un arreglo
  if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
    return res
      .status(400)
      .json({ error: "Enviá un objeto JSON válido con todos los campos." });
  }

  const permitidos = [
    "estudiante",
    "email",
    "sala",
    "fecha",
    "turno",
    "personas",
    "estado",
  ];

  const llaves = Object.keys(datos);

  // 2. Rechazar campos desconocidos, _id o operadores de Mongo (ej: $set)
  for (const campo of llaves) {
    if (!permitidos.includes(campo) || campo.startsWith("$")) {
      return res
        .status(400)
        .json({ error: `El campo ${campo} no está permitido en PUT.` });
    }
  }

  // 3. PUT EXIGE LOS 7 CAMPOS (Omitir uno debe dar 400)
  for (const campo of permitidos) {
    if (datos[campo] === undefined) {
      return res
        .status(400)
        .json({ error: `Falta el campo obligatorio: ${campo}` });
    }
  }

  // Validaciones individuales de los campos (similar a lo que pide el esquema)
  if (typeof datos.estudiante !== "string" || !datos.estudiante.trim()) {
    return res.status(400).json({ error: "Estudiante inválido." });
  }
  if (typeof datos.email !== "string" || !datos.email.includes("@")) {
    return res.status(400).json({ error: "Email inválido." });
  }
  if (!salasPermitidas.includes(datos.sala)) {
    return res.status(400).json({ error: "Sala inválida." });
  }
  if (!turnosPermitidos.includes(datos.turno)) {
    return res.status(400).json({ error: "Turno inválido." });
  }

  // Validar estado
  const estadosPermitidos = ["pendiente", "confirmada"];
  const estadoLimpio =
    typeof datos.estado === "string"
      ? datos.estado.toLowerCase().trim()
      : datos.estado;
  if (!estadosPermitidos.includes(estadoLimpio)) {
    return res
      .status(400)
      .json({ error: "El estado debe ser 'pendiente' o 'confirmada'." });
  }

  // Validar personas (número o texto numérico entre 1 y 6)
  let personasNum = Number(datos.personas);
  if (
    typeof datos.personas === "object" ||
    Array.isArray(datos.personas) ||
    isNaN(personasNum) ||
    !Number.isInteger(personasNum) ||
    personasNum < 1 ||
    personasNum > 6
  ) {
    return res
      .status(400)
      .json({ error: "Personas debe ser un entero entre 1 y 6." });
  }

  // Dejamos los datos limpios listos para el servicio
  req.cambiosValidos = {
    estudiante: datos.estudiante.trim(),
    email: datos.email.trim(),
    sala: datos.sala,
    fecha: String(datos.fecha).trim(),
    turno: datos.turno,
    personas: personasNum,
    estado: estadoLimpio,
  };

  next();
}

// Validación de actualización parcial (PATCH /api/reservas/:id)
function validarActualizacionReserva(req, res, next) {
  const datos = req.body;

  if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
    return res.status(400).json({ error: "Enviá un objeto JSON." });
  }

  for (const campo of Object.keys(datos)) {
    if ((campo !== "personas" && campo !== "estado") || campo.startsWith("$")) {
      return res
        .status(400)
        .json({ error: "Solo se puede cambiar personas o estado." });
    }
  }

  if (datos.personas === undefined && datos.estado === undefined) {
    return res.status(400).json({ error: "Enviá personas o estado." });
  }

  const cambios = {};

  if (datos.personas !== undefined) {
    let personasNum = Number(datos.personas);
    if (
      typeof datos.personas === "object" ||
      Array.isArray(datos.personas) ||
      isNaN(personasNum) ||
      !Number.isInteger(personasNum) ||
      personasNum < 1 ||
      personasNum > 6
    ) {
      return res.status(400).json({
        error: "El número de personas debe estar comprendido entre 1 y 6.",
      });
    }
    cambios.personas = personasNum;
  }

  if (datos.estado !== undefined) {
    const estadosPermitidos = ["pendiente", "confirmada"];
    const estadoLimpio =
      typeof datos.estado === "string"
        ? datos.estado.toLowerCase().trim()
        : datos.estado;

    if (!estadosPermitidos.includes(estadoLimpio)) {
      return res.status(400).json({
        error: "El estado debe ser 'pendiente' o 'confirmada'.",
      });
    }
    cambios.estado = estadoLimpio;
  }

  req.cambiosValidos = cambios;
  next();
}

module.exports = { validarReemplazoReserva, validarActualizacionReserva };
