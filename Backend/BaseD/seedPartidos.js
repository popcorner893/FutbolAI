
const { db } = require("./connection");

/* Aquí, se crean las correspondencias de partidos para llenar la tabla partidos, teniendo en cuenta que es una tabla que depende de las claves
internas de otras tablas */

async function seedPartidos() {
  const partidos = [
    [529, 541, '2025-10-12 20:00:00', 2, 2],
    [157, 165, '2025-10-15 18:30:00', 3, 1],
    [530, 533, '2025-10-18 21:00:00', 2, 0],
    [536, 548, '2025-10-20 19:45:00', 1, 1],
    [33, 50, '2025-10-22 20:00:00', 0, 2],
    [42, 49, '2025-10-25 17:30:00', 1, 0],
    [47, 40, '2025-10-28 16:00:00', 3, 2],
    [541, 529, '2025-11-26 21:00:00', 1, 0],
    [165, 157, '2025-11-28 18:00:00', 1, 3],
    [532, 536, '2025-12-03 20:45:00', 2, 2]
  ];

  try {
    for (const p of partidos) {
      await db.query(
        `INSERT INTO partidos 
        (equipo_local_id, equipo_visitante_id, fecha, marcador_local, marcador_visitante)
         VALUES (?, ?, ?, ?, ?)`,
        p
      );
    }

    console.log("🎉 Partidos insertados correctamente");
  } catch (error) {
    console.error("❌ Error insertando partidos:", error);
  }
}

module.exports = { seedPartidos };