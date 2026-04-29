const express = require("express");
const cors = require("cors");
const config = require("./config/env");
const taskRoutes = require("./routes/task.routes");
const loggerAcademico = require("./middlewares/logger.middleware");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(loggerAcademico);

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "TaskFlow API" });
});

app.use("/api/v1/tasks", taskRoutes);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`TaskFlow API escuchando en http://localhost:${config.port}`);
});
