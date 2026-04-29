const STORAGE_KEY = "taskflow.tasks";

// Guardo aqui todos los elementos del DOM que voy a necesitar.
const form = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const priorityInput = document.querySelector("#task-priority");
const list = document.querySelector("#task-list");
const template = document.querySelector("#task-template");
const emptyState = document.querySelector("#empty-state");
const statusText = document.querySelector("#status-text");
const clearCompletedButton = document.querySelector("#clear-completed");
const filterButtons = document.querySelectorAll(".filter-btn");

const stats = {
  total: document.querySelector("#stat-total"),
  pending: document.querySelector("#stat-pending"),
  completed: document.querySelector("#stat-completed"),
  progress: document.querySelector("#stat-progress"),
  progressLabel: document.querySelector("#progress-label"),
  progressBar: document.querySelector("#progress-bar"),
};

let tasks = loadTasks();
let activeFilter = "all";

// Estructura base de una tarea dentro de la aplicacion.
function createTask(title, priority) {
  return {
    id: crypto.randomUUID(),
    title,
    priority,
    completed: false,
    createdAt: new Date().toISOString(),
  };
}

// Intento cargar tareas guardadas; si algo falla, empiezo con una lista vacia.
function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

// Cada cambio importante se guarda para que siga igual al recargar la pagina.
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// El filtro activo decide que tareas se pintan en pantalla.
function getFilteredTasks() {
  if (activeFilter === "pending") {
    return tasks.filter((task) => !task.completed);
  }

  if (activeFilter === "completed") {
    return tasks.filter((task) => task.completed);
  }

  return tasks;
}

// Formato corto en espanol para mostrar la fecha de creacion.
function formatDate(dateValue) {
  return new Intl.DateTimeFormat("es", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateValue));
}

// Dibujo la lista usando el template del HTML.
function renderTasks() {
  list.innerHTML = "";

  const visibleTasks = getFilteredTasks();
  emptyState.classList.toggle("hidden", visibleTasks.length > 0);

  visibleTasks.forEach((task) => {
    const node = template.content.firstElementChild.cloneNode(true);
    const checkbox = node.querySelector(".task-toggle");
    const title = node.querySelector(".task-title");
    const meta = node.querySelector(".task-meta");
    const badge = node.querySelector(".priority-badge");
    const deleteButton = node.querySelector(".delete-btn");

    node.dataset.id = task.id;
    node.classList.toggle("is-completed", task.completed);
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Marcar "${task.title}" como completada`);
    title.textContent = task.title;
    meta.textContent = `Creada el ${formatDate(task.createdAt)}`;
    badge.textContent = task.priority;
    badge.dataset.priority = task.priority;
    deleteButton.setAttribute("aria-label", `Eliminar "${task.title}"`);

    list.append(node);
  });
}

// Recalculo los numeros del panel lateral cada vez que cambia algo.
function renderStats() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  stats.total.textContent = total;
  stats.pending.textContent = pending;
  stats.completed.textContent = completed;
  stats.progress.textContent = `${progress}%`;
  stats.progressLabel.textContent = `${completed} de ${total}`;
  stats.progressBar.style.width = `${progress}%`;
  statusText.textContent = `${getFilteredTasks().length} tareas visibles`;
  clearCompletedButton.disabled = completed === 0;
  clearCompletedButton.classList.toggle("opacity-50", completed === 0);
}

// Punto unico para refrescar toda la interfaz.
function render() {
  renderTasks();
  renderStats();
}

// Cambia el filtro y actualiza tambien el estado visual de los botones.
function setFilter(filter) {
  activeFilter = filter;

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  render();
}

// Al enviar el formulario creo la tarea y la guardo en primer lugar.
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const priority = priorityInput.value;

  if (!title) {
    titleInput.focus();
    return;
  }

  tasks.unshift(createTask(title, priority));
  saveTasks();
  form.reset();
  priorityInput.value = "media";
  titleInput.focus();
  render();
});

// Escucho cambios en los checkboxes para completar o reabrir tareas.
list.addEventListener("change", (event) => {
  if (!event.target.matches(".task-toggle")) {
    return;
  }

  const item = event.target.closest(".task-item");
  const task = tasks.find((currentTask) => currentTask.id === item.dataset.id);

  if (task) {
    task.completed = event.target.checked;
    saveTasks();
    render();
  }
});

// Delegacion de eventos para borrar tareas aunque se hayan creado despues.
list.addEventListener("click", (event) => {
  if (!event.target.matches(".delete-btn")) {
    return;
  }

  const item = event.target.closest(".task-item");
  tasks = tasks.filter((task) => task.id !== item.dataset.id);
  saveTasks();
  render();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

clearCompletedButton.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  render();
});

// Primera carga de la app.
render();
