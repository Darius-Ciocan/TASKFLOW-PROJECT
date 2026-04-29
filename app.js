const STORAGE_KEY = "taskflow.tasks";
const THEME_KEY = "taskflow.theme";

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
const particleContainer = document.querySelector("#particles");
const themeToggle = document.querySelector("#theme-toggle");

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
let draggedTaskId = null;

// Aplico el tema guardado para que la pagina recuerde si estaba en oscuro.
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);

  const isDark = theme === "dark";
  themeToggle.textContent = isDark ? "Modo claro" : "Modo oscuro";
  themeToggle.setAttribute("aria-label", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
}

function loadTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return prefersDark ? "dark" : "light";
}

// Creo unas particulas decorativas para que la pagina no se vea tan plana.
function initParticles() {
  if (!particleContainer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const colors = ["#2563eb", "#14b8a6", "#f97316"];
  const totalParticles = 34;

  for (let index = 0; index < totalParticles; index += 1) {
    const particle = document.createElement("span");
    const size = Math.floor(Math.random() * 5) + 3;
    const color = colors[index % colors.length];

    particle.className = "particle";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.setProperty("--particle-color", color);
    particle.style.setProperty("--particle-speed", `${Math.random() * 12 + 13}s`);
    particle.style.setProperty("--particle-drift", `${Math.random() * 160 - 80}px`);
    particle.style.animationDelay = `${Math.random() * -18}s`;

    particleContainer.append(particle);
  }
}

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
    const dragHandle = node.querySelector(".drag-handle");

    node.dataset.id = task.id;
    node.draggable = true;
    node.setAttribute("aria-grabbed", "false");
    node.classList.toggle("is-completed", task.completed);
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Marcar "${task.title}" como completada`);
    title.textContent = task.title;
    meta.textContent = `Creada el ${formatDate(task.createdAt)}`;
    badge.textContent = task.priority;
    badge.dataset.priority = task.priority;
    deleteButton.setAttribute("aria-label", `Eliminar "${task.title}"`);
    dragHandle.setAttribute("aria-label", `Arrastrar "${task.title}" para ordenar`);

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

// Muevo una tarea dentro del array y guardo el nuevo orden.
function reorderTasks(draggedId, targetId) {
  if (!draggedId || !targetId || draggedId === targetId) {
    return;
  }

  const fromIndex = tasks.findIndex((task) => task.id === draggedId);
  const toIndex = tasks.findIndex((task) => task.id === targetId);

  if (fromIndex === -1 || toIndex === -1) {
    return;
  }

  const [draggedTask] = tasks.splice(fromIndex, 1);
  tasks.splice(toIndex, 0, draggedTask);
  saveTasks();
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

// Drag and drop: guardo que tarea se arrastra y al soltarla cambio el orden.
list.addEventListener("dragstart", (event) => {
  const item = event.target.closest(".task-item");

  if (!item) {
    return;
  }

  draggedTaskId = item.dataset.id;
  item.classList.add("is-dragging");
  item.setAttribute("aria-grabbed", "true");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", draggedTaskId);
});

list.addEventListener("dragover", (event) => {
  const item = event.target.closest(".task-item");

  if (!item || item.dataset.id === draggedTaskId) {
    return;
  }

  event.preventDefault();
  item.classList.add("is-drag-over");
});

list.addEventListener("dragleave", (event) => {
  const item = event.target.closest(".task-item");

  if (item) {
    item.classList.remove("is-drag-over");
  }
});

list.addEventListener("drop", (event) => {
  const item = event.target.closest(".task-item");

  if (!item) {
    return;
  }

  event.preventDefault();
  reorderTasks(draggedTaskId, item.dataset.id);
});

list.addEventListener("dragend", () => {
  document.querySelectorAll(".task-item").forEach((item) => {
    item.classList.remove("is-dragging", "is-drag-over");
    item.setAttribute("aria-grabbed", "false");
  });
  draggedTaskId = null;
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

clearCompletedButton.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  render();
});

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.dataset.theme;
  applyTheme(currentTheme === "dark" ? "light" : "dark");
});

// Primera carga de la app.
applyTheme(loadTheme());
initParticles();
render();
