const express = require("express");
const taskController = require("../controllers/task.controller");

const router = express.Router();

router.get("/", taskController.obtenerTareas);
router.post("/", taskController.crearTarea);
router.patch("/order", taskController.reordenarTareas);
router.patch("/:id", taskController.actualizarTarea);
router.delete("/:id", taskController.eliminarTarea);

module.exports = router;
