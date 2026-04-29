const { randomUUID } = require("crypto");

let tasks = [];

function obtenerTodas() {
  return tasks;
}

function crearTarea(data) {
  const nuevaTarea = {
    id: randomUUID(),
    title: data.title,
    priority: data.priority,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.unshift(nuevaTarea);
  return nuevaTarea;
}

function actualizarTarea(id, data) {
  const task = tasks.find((currentTask) => currentTask.id === id);

  if (!task) {
    throw new Error("NOT_FOUND");
  }

  if (typeof data.title === "string") {
    task.title = data.title;
  }

  if (typeof data.priority === "string") {
    task.priority = data.priority;
  }

  if (typeof data.completed === "boolean") {
    task.completed = data.completed;
  }

  return task;
}

function reemplazarOrden(taskIds) {
  const taskMap = new Map(tasks.map((task) => [task.id, task]));
  const orderedTasks = taskIds.map((id) => taskMap.get(id)).filter(Boolean);
  const missingTasks = tasks.filter((task) => !taskIds.includes(task.id));

  tasks = [...orderedTasks, ...missingTasks];
  return tasks;
}

function eliminarTarea(id) {
  const initialLength = tasks.length;
  tasks = tasks.filter((task) => task.id !== id);

  if (tasks.length === initialLength) {
    throw new Error("NOT_FOUND");
  }
}

module.exports = {
  obtenerTodas,
  crearTarea,
  actualizarTarea,
  reemplazarOrden,
  eliminarTarea,
};
