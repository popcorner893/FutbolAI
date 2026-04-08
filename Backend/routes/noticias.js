const express = require("express");
const router = express.Router();
const noticiasController = require("../controllers/noticiasController");

/* Módulo de rutas encargado de gestionar el recurso “noticias”. Define
   endpoints para listar todas las noticias, obtener una noticia específica
   por su ID, crear nuevas publicaciones, actualizarlas y eliminarlas.
   Cada ruta delega su funcionalidad al noticiasController, que contiene
   la lógica directa con la base de datos. Este script organiza el CRUD
   completo de noticias y actúa como puente entre el cliente y el backend. */


// Obtener todas las noticias
router.get("/", noticiasController.obtenerNoticias);

// Obtener una noticia por ID
router.get("/:id", noticiasController.obtenerNoticia);

// Crear una nueva noticia
router.post("/", noticiasController.crearNoticia);

// Actualizar una noticia
router.put("/:id", noticiasController.actualizarNoticia);

// Eliminar una noticia
router.delete("/:id", noticiasController.eliminarNoticia);

module.exports = router;