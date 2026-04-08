/* Archivo de rutas encargado de exponer los servicios del módulo “oráculo”.
   Define un endpoint POST para ejecutar consultas enviadas al controlador
   oracleQuery y otro GET para obtener el listado de equipos mediante
   getEquipos. Este router actúa como puente entre las peticiones del
   cliente y las funciones que gestionan la conexión y consultas hacia
   la base de datos Oracle u origen externo asociado. */


const express = require("express");
const { oracleQuery, getEquipos } = require("../controllers/oraculoController.js");

const router = express.Router();

router.post("/query", oracleQuery);
router.get("/equipos", getEquipos);


module.exports = router;

