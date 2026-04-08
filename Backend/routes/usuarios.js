/* Archivo de rutas encargado de gestionar todas las operaciones relacionadas
   con usuarios, incluyendo autenticación (login), registro y recuperación
   de contraseña. También expone rutas CRUD para listar, crear, editar y
   eliminar usuarios, además de una búsqueda por nombre. Este módulo actúa
   como intermediario entre las solicitudes del cliente y las funciones del
   controlador que interactúan con la base de datos. */


const express = require("express");
const router = express.Router();
const controller = require("../controllers/usuariosController");

const { loginUsuario, registrarUsuario } = require("../controllers/usuariosController");
const { forgotPassword } = require("../controllers/usuariosController");

router.post("/login", loginUsuario);
router.post("/register", registrarUsuario);
router.post("/forgot-password", forgotPassword);

console.log("📌 Rutas de usuarios cargadas");

router.get("/buscar", controller.buscarUsuarioPorNombre);

router.get("/", controller.listar);
router.get("/:id", controller.obtenerUno);
router.post("/", controller.crear);
router.put("/:id", controller.actualizar);
router.delete("/:id", controller.eliminar);


module.exports = router;
