const THEME_KEY = "taskflow.theme";

const form = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const priorityInput = document.querySelector("#task-priority");
const searchInput = document.querySelector("#task-search");
const list = document.querySelector("#task-list");
const template = document.querySelector("#task-template");
const emptyState = document.querySelector("#empty-state");
const statusText = document.querySelector("#status-text");
const networkMessage = document.querySelector("#network-message");
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

let tasks = [];
let activeFilter = "all";
let searchTerm = "";
let draggedTaskId = null;
let isLoading = false;

function setLoading(value) {
  isLoading = value;

  if (value) {
    renderNetworkMessage("Cargando tareas desde el servidor...");
  }
}

function renderNetworkMessage(message, isError = false) {
  networkMessage.textContent = message;
  networkMessage.classList.toggle("hidden", !message);
  networkMessage.classList.toggle("is-error", isError);
}

async function runRequest(action, successMessage = "") {
  try {
    renderNetworkMessage("");
    await action();

    if (successMessage) {
      renderNetworkMessage(successMessage);
    }
  } catch (error) {
    renderNetworkMessage(error.message || "No se pudo conectar con el servidor.", true);
  }
}

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

function normalizeTaskTitle(value) {
  return value.trim().replace(/\s+/g, " ").slice(0, 80);
}

function isValidTask(task) {
  return (
    typeof task === "object" &&
    task !== null &&
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    typeof task.completed === "boolean"
  );
}

function getFilteredTasks() {
  return tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      activeFilter === "all" ||
      (activeFilter === "pending" && !task.completed) ||
      (activeFilter === "completed" && task.completed);

    return matchesSearch && matchesStatus;
  });
}

function formatDate(dateValue) {
  return new Intl.DateTimeFormat("es", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateValue));
}

function renderTasks() {
  list.innerHTML = "";

  const visibleTasks = getFilteredTasks();
  emptyState.classList.toggle("hidden", isLoading || visibleTasks.length > 0);

  visibleTasks.forEach((task) => {
    const node = template.content.firstElementChild.cloneNode(true);
    const checkbox = node.querySelector(".task-toggle");
    const title = node.querySelector(".task-title");
    const meta = node.querySelector(".task-meta");
    const badge = node.querySelector(".priority-badge");
    const editButton = node.querySelector(".edit-btn");
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
    editButton.setAttribute("aria-label", `Editar "${task.title}"`);
    deleteButton.setAttribute("aria-label", `Eliminar "${task.title}"`);
    dragHandle.setAttribute("aria-label", `Arrastrar "${task.title}" para ordenar`);

    list.append(node);
  });
}

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
  statusText.textContent = isLoading ? "Cargando..." : `${getFilteredTasks().length} tareas visibles`;
  clearCompletedButton.disabled = completed === 0;
  clearCompletedButton.classList.toggle("opacity-50", completed === 0);
}

function render() {
  renderTasks();
  renderStats();
}

function setFilter(filter) {
  activeFilter = filter;

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  render();
}

async function loadTasksFromApi() {
  setLoading(true);

  try {
    const apiTasks = await taskApi.getTasks();
    tasks = Array.isArray(apiTasks) ? apiTasks.filter(isValidTask) : [];
  } catch (error) {
    renderNetworkMessage(error.message || "No se pudo cargar la API.", true);
  } finally {
    isLoading = false;
    render();
  }
}

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
  render();

  runRequest(async () => {
    tasks = await taskApi.reorderTasks(tasks.map((task) => task.id));
    render();
  });
}

function editTask(taskId) {
  const task = tasks.find((currentTask) => currentTask.id === taskId);

  if (!task) {
    return;
  }

  const newTitle = normalizeTaskTitle(prompt("Edita la tarea:", task.title) ?? "");

  if (!newTitle) {
    return;
  }

  runRequest(async () => {
    const updatedTask = await taskApi.updateTask(taskId, { title: newTitle });
    task.title = updatedTask.title;
    render();
  }, "Tarea editada correctamente.");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = normalizeTaskTitle(titleInput.value);
  const priority = priorityInput.value;

  if (!title) {
    titleInput.focus();
    return;
  }

  await runRequest(async () => {
    const createdTask = await taskApi.createTask({ title, priority });
    tasks.unshift(createdTask);
    form.reset();
    priorityInput.value = "media";
    titleInput.focus();
    render();
  }, "Tarea creada correctamente.");
});

list.addEventListener("change", (event) => {
  if (!event.target.matches(".task-toggle")) {
    return;
  }

  const item = event.target.closest(".task-item");
  const task = tasks.find((currentTask) => currentTask.id === item.dataset.id);

  if (task) {
    const completed = event.target.checked;

    runRequest(async () => {
      const updatedTask = await taskApi.updateTask(task.id, { completed });
      task.completed = updatedTask.completed;
      render();
    });
  }
});

list.addEventListener("click", (event) => {
  if (!event.target.matches(".delete-btn") && !event.target.matches(".edit-btn")) {
    return;
  }

  const item = event.target.closest(".task-item");

  if (event.target.matches(".edit-btn")) {
    editTask(item.dataset.id);
    return;
  }

  if (event.target.matches(".delete-btn")) {
    runRequest(async () => {
      await taskApi.deleteTask(item.dataset.id);
      tasks = tasks.filter((task) => task.id !== item.dataset.id);
      render();
    }, "Tarea eliminada correctamente.");
  }
});

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

searchInput.addEventListener("input", () => {
  searchTerm = normalizeTaskTitle(searchInput.value).toLowerCase();
  render();
});

clearCompletedButton.addEventListener("click", () => {
  const completedTasks = tasks.filter((task) => task.completed);

  runRequest(async () => {
    await Promise.all(completedTasks.map((task) => taskApi.deleteTask(task.id)));
    tasks = tasks.filter((task) => !task.completed);
    render();
  }, "Tareas completadas eliminadas.");
});

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.dataset.theme;
  applyTheme(currentTheme === "dark" ? "light" : "dark");
});

applyTheme(loadTheme());
initParticles();
loadTasksFromApi();
