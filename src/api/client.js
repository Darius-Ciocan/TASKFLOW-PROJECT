const API_BASE_URL = "http://localhost:3000/api/v1";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "No se pudo completar la peticion");
  }

  return data;
}

const taskApi = {
  getTasks() {
    return request("/tasks");
  },

  createTask(data) {
    return request("/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateTask(id, data) {
    return request(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  reorderTasks(taskIds) {
    return request("/tasks/order", {
      method: "PATCH",
      body: JSON.stringify({ taskIds }),
    });
  },

  deleteTask(id) {
    return request(`/tasks/${id}`, {
      method: "DELETE",
    });
  },
};
