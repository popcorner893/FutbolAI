/* Este módulo define las rutas del recurso “equipos” dentro del servidor.
   Usa Express Router para crear endpoints que permiten listar todos los
   equipos, obtener uno por ID, crear nuevos registros, actualizarlos y
   eliminarlos de la base de datos. Cada ruta llama a su función respectiva
   en el equiposController, que contiene la lógica principal. El script
   actúa como intermediario entre las solicitudes del cliente y las
   operaciones realizadas en la BD, estructurando el CRUD completo. */


const express = require("express");
const router = express.Router();
const controller = require("../controllers/equiposController");

console.log("📌 Rutas de equipos cargadas");

router.get("/", controller.listar);
router.get("/:id", controller.obtener);
router.post("/", controller.crear);
router.put("/:id", controller.actualizar);
router.delete("/:id", controller.eliminar);

module.exports = router;
