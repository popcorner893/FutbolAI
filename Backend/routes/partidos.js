/* Archivo de rutas encargado de gestionar el recurso “partidos”.
   Define endpoints para listar todos los partidos, obtener uno por ID,
   registrar nuevos encuentros, actualizar información existente y
   eliminar registros. Cada operación se delega al partidosController,
   que maneja la lógica de acceso a la base de datos. Este módulo
   organiza el CRUD completo de partidos y sirve como puente entre
   el cliente y el backend. */


const express = require("express");
const router = express.Router();
const controller = require("../controllers/partidosController");

console.log("📌 Rutas de partidos cargadas");

router.get("/", controller.listar);
router.get("/:id", controller.obtener);
router.post("/", controller.crear);
router.put("/:id", controller.actualizar);
router.delete("/:id", controller.eliminar);

module.exports = router;
