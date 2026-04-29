const taskService = require("../services/task.service");

const VALID_PRIORITIES = ["alta", "media", "baja"];

function normalizeTitle(value) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function validatePriority(priority) {
  return VALID_PRIORITIES.includes(priority);
}

function obtenerTareas(req, res) {
  res.status(200).json(taskService.obtenerTodas());
}

function crearTarea(req, res) {
  const title = normalizeTitle(req.body.title);
  const priority = req.body.priority || "media";

  if (title.length < 3 || title.length > 80) {
    return res.status(400).json({
      error: "El titulo es obligatorio y debe tener entre 3 y 80 caracteres.",
    });
  }

  if (!validatePriority(priority)) {
    return res.status(400).json({
      error: "La prioridad debe ser alta, media o baja.",
    });
  }

  const nuevaTarea = taskService.crearTarea({ title, priority });
  return res.status(201).json(nuevaTarea);
}

function actualizarTarea(req, res, next) {
  try {
    const { id } = req.params;
    const data = {};

    if ("title" in req.body) {
      const title = normalizeTitle(req.body.title);

      if (title.length < 3 || title.length > 80) {
        return res.status(400).json({
          error: "El titulo debe tener entre 3 y 80 caracteres.",
        });
      }

      data.title = title;
    }

    if ("priority" in req.body) {
      if (!validatePriority(req.body.priority)) {
        return res.status(400).json({
          error: "La prioridad debe ser alta, media o baja.",
        });
      }

      data.priority = req.body.priority;
    }

    if ("completed" in req.body) {
      if (typeof req.body.completed !== "boolean") {
        return res.status(400).json({
          error: "El campo completed debe ser booleano.",
        });
      }

      data.completed = req.body.completed;
    }

    const tareaActualizada = taskService.actualizarTarea(id, data);
    return res.status(200).json(tareaActualizada);
  } catch (error) {
    return next(error);
  }
}

function reordenarTareas(req, res) {
  const { taskIds } = req.body;

  if (!Array.isArray(taskIds) || !taskIds.every((id) => typeof id === "string")) {
    return res.status(400).json({
      error: "taskIds debe ser un array de IDs.",
    });
  }

  const tareasOrdenadas = taskService.reemplazarOrden(taskIds);
  return res.status(200).json(tareasOrdenadas);
}

function eliminarTarea(req, res, next) {
  try {
    taskService.eliminarTarea(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  obtenerTareas,
  crearTarea,
  actualizarTarea,
  reordenarTareas,
  eliminarTarea,
};
