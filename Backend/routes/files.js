const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

/* Módulo encargado de gestionar archivos en el servidor. Configura una
   carpeta local para almacenar documentos y usa Multer para recibir archivos
   manteniendo su nombre original. Incluye rutas para listar todo lo que hay
   en la carpeta Files, subir un archivo desde el cliente y descargar uno
   solicitado por nombre. Utiliza fs para operaciones de lectura y verificación,
   y Express Router para estructurar las peticiones. Este script implementa
   un CRUD básico orientado exclusivamente al manejo de archivos. */


const router = express.Router();

// Carpeta destino
const carpeta = path.join(__dirname, "../Files");
if (!fs.existsSync(carpeta)) fs.mkdirSync(carpeta);

// Configuración Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, carpeta);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // mantiene nombre original
  }
});

const upload = multer({ storage });

// --- LISTAR archivos ---
router.get("/", (req, res) => {
  fs.readdir(carpeta, (err, files) => {
    if (err) return res.status(500).json({ error: "Error leyendo carpeta" });
    res.json({ files });
  });
});

// --- SUBIR archivo ---
router.post("/upload", upload.single("archivo"), (req, res) => {
  res.json({ success: true, file: req.file.filename });
});

// --- DESCARGAR archivo ---
router.get("/download/:file", (req, res) => {
  const archivo = path.join(carpeta, req.params.file);
  
  if (!fs.existsSync(archivo)) {
    return res.status(404).send("Archivo no encontrado");
  }

  res.download(archivo);
});

module.exports = router;
