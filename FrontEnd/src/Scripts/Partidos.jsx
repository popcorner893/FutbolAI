import "../HojasEstilo/Partidos.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

/* Componente que muestra la programación de partidos según la fecha seleccionada.
   Usa useState para controlar la fecha activa y alternar la visualización.
   partidosPorFecha contiene los datos de ejemplo usados para renderizar marcadores,
   equipos, horarios y plataformas de transmisión. El usuario puede cambiar la fecha
   desde un panel de botones, lo que actualiza dinámicamente la lista mostrada.
   Cada partido incluye escudos, resultado y enlaces a plataformas de streaming.
   El componente organiza toda la vista en paneles visuales para facilitar la
   navegación y consulta rápida del calendario deportivo. */

function Partidos() {
  const [partidos, setPartidos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const hoy = new Date();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // 1) traer partidos
        const resPartidos = await axios.get("http://localhost:3001/api/partidos");

        // 2) traer equipos (con logos)
        const resEquipos = await axios.get("http://localhost:3001/api/equipos");

        setPartidos(resPartidos.data);
        setEquipos(resEquipos.data);
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  if (cargando) return <p>Cargando partidos...</p>;

  // Crear un mapa id_equipo → logo para acceder rápido
  const mapaEquipos = {};
  equipos.forEach((eq) => {
    mapaEquipos[eq.id_equipo] = eq.logo;
  });

  // Insertar logos en los partidos
  const partidosConLogos = partidos.map((p) => {
  const fechaJS = new Date(p.fecha);
  const esProximo = fechaJS >= hoy;

  return {
    ...p,
    fechaJS,
    escudo_local: mapaEquipos[p.equipo_local_id] || "",
    escudo_visitante: mapaEquipos[p.equipo_visitante_id] || "",
    marcador_local: esProximo ? 0 : p.marcador_local,
    marcador_visitante: esProximo ? 0 : p.marcador_visitante
  };
});


  // Separar partidos pasados y futuros
  const partidosPasados = partidosConLogos.filter((p) => p.fechaJS < hoy);
  const partidosProximos = partidosConLogos.filter((p) => p.fechaJS >= hoy);

  const renderPartido = (p) => (
    <div className="zona-programacion" key={p.id_partido}>
      <div className="panel-partido">

        <div className="equipos">
          {/* LOCAL */}
          <div className="equipo">
            <div className="info-equipo">
              <img
                src={p.escudo_local}
                alt={p.equipo_local}
                onError={(e) => (e.target.src = "/placeholder.png")}
              />
              <span>{p.equipo_local}</span>
            </div>
            <span className="resultado">{p.marcador_local}</span>
          </div>

          {/* VISITANTE */}
          <div className="equipo">
            <div className="info-equipo">
              <img
                src={p.escudo_visitante}
                alt={p.equipo_visitante}
                onError={(e) => (e.target.src = "/placeholder.png")}
              />
              <span>{p.equipo_visitante}</span>
            </div>
            <span className="resultado">{p.marcador_visitante}</span>
          </div>
        </div>

        <div className="hora">
          {p.fechaJS.toLocaleString("es-CO", {
            hour: "2-digit",
            minute: "2-digit",
            weekday: "short",
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="zona-principal">
      <h2>Partidos próximos</h2>
      {partidosProximos.length > 0
        ? partidosProximos.map(renderPartido)
        : <p>No hay partidos próximos.</p>
      }

      <h2 style={{ marginTop: "30px" }}>Partidos pasados</h2>
      {partidosPasados.length > 0
        ? partidosPasados.map(renderPartido)
        : <p>No hay partidos pasados.</p>
      }
    </div>
  );
}

export default Partidos;
