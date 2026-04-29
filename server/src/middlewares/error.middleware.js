function errorHandler(err, req, res, next) {
  if (err.message === "NOT_FOUND") {
    return res.status(404).json({ error: "Recurso no encontrado" });
  }

  console.error(err);
  return res.status(500).json({ error: "Error interno del servidor" });
}

module.exports = errorHandler;
