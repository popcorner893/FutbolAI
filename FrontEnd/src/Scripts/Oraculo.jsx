import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import "../HojasEstilo/Oraculo.css";
import * as tf from "@tensorflow/tfjs";
import scaler from "../Multimedia/scaler_params.json";

/* Componente que carga ligas, equipos y un modelo de IA para predecir resultados.
   Obtiene logos locales, consulta equipos desde la BD y organiza su estructura.
   Carga un modelo TensorFlow.js tipo GraphModel y lo usa para generar predicciones.
   Incluye un fondo animado con canvas, controles Select para elegir liga y equipos,
   y una función que estandariza features usando parámetros del scaler cargado.
   handlePrediccion crea un tensor con los datos procesados y ejecuta el modelo,
   mostrando goles estimados y un nivel de confianza.
   El componente renderiza selectores, panel de predicción y resultado final. */


const Oraculo = () => {
  const [ligas, setLigas] = useState({});
  const [ligaSeleccionada, setLigaSeleccionada] = useState(null);
  const [equipo1, setEquipo1] = useState(null);
  const [equipo2, setEquipo2] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [modelo, setModelo] = useState(null);
  const [cargandoModelo, setCargandoModelo] = useState(true);

  // === Cargar ligas y equipos desde la BD ===
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // === 1. Cargar logos locales de LIGAS ===
        const logosLocales = import.meta.glob("/src/Multimedia/Logos/**/*.png", {
          eager: true,
        });

        const estructura = {};

        Object.entries(logosLocales).forEach(([ruta, contenido]) => {
          const partes = ruta.split("/");
          const nombreCarpeta = partes[partes.length - 2];
          const nombreLiga = nombreCarpeta.replace(/_/g, " ");

          const nombreArchivo = partes[partes.length - 1].replace(".png", "");

          // Caso donde La_Liga.png coincide con carpeta La_Liga
          if (nombreArchivo.toLowerCase() === nombreCarpeta.toLowerCase()) {
            if (!estructura[nombreLiga]) estructura[nombreLiga] = {
              logoLiga: contenido.default,
              equipos: []
            };
          }
        });

        // === 2. Cargar equipos desde la BD ===
        const res = await axios.get("http://localhost:3001/api/equipos");
        console.log(res);

        const equipos = res.data;  // ← AQUÍ ESTÁ EL CAMBIO
        if (!Array.isArray(equipos)) {
          console.error("La API devolvió un formato inesperado:", equipos);
          return;
        }

        equipos.forEach(eq => {
          if (!estructura[eq.liga]) {
            // Si la liga existe pero no tiene logo, igual la creamos
            estructura[eq.liga] = {
              logoLiga: null,
              equipos: []
            };
          }

          estructura[eq.liga].equipos.push({
            label: eq.nombre,
            value: eq.nombre,
            logo: eq.logo,
            fullData: eq
          });
        });

setLigas(estructura);


      } catch (error) {
        console.error("Error cargando datos del Oráculo:", error);
      }
    };

    cargarDatos();
  }, []);



  // === Cargar modelo TensorFlow.js (GraphModel) ===
  useEffect(() => {
    const cargarModelo = async () => {
      try {
        const modelUrl = `${window.location.origin}/modelo_oraculo_tfjs/model.json`;
        console.log("Cargando modelo GraphModel desde:", modelUrl);
        const model = await tf.loadGraphModel(modelUrl);
        setModelo(model);
        setCargandoModelo(false);
        console.log("✅ Modelo cargado correctamente");
      } catch (err) {
        console.error("❌ Error al cargar el modelo:", err);
      }
    };
    cargarModelo();
  }, []);

  // === Fondo dinámico ===
  useEffect(() => {
  const canvas = document.getElementById("network-bg");
  if (!canvas) return;
  const parent = canvas.parentElement;
  const ctx = canvas.getContext("2d");

  // Configurar tamaño inicial
  const setCanvasSize = () => {
    const rect = parent.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  };
  setCanvasSize();

  // Generar puntos
  const numPoints = 80;
  const points = Array.from({ length: numPoints }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    radius: 2 + Math.random() * 2,
  }));

  let rafId;
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < numPoints; i++) {
      for (let j = i + 1; j < numPoints; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.strokeStyle = `rgba(0, 255, 100, ${1 - dist / 140})`;
          ctx.lineWidth = 0.4;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }
    for (let p of points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#00ff88";
      ctx.shadowBlur = 6;
      ctx.shadowColor = "#00ff88";
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    }
    rafId = requestAnimationFrame(draw);
  };
  draw();

  // Glow random
  const glowInterval = setInterval(() => {
    const p = points[Math.floor(Math.random() * points.length)];
    const old = p.radius;
    p.radius = old * 3;
    setTimeout(() => (p.radius = old), 300);
  }, 600);

  // Resize dinámico con ResizeObserver
  const observer = new ResizeObserver(() => {
    setCanvasSize();
  });
  observer.observe(parent);

  return () => {
    clearInterval(glowInterval);
    observer.disconnect();
    cancelAnimationFrame(rafId);
  };
}, []);



  // === Función de predicción ===
const handlePrediccion = async () => {
  if (!equipo1 || !equipo2) {
    alert("Por favor selecciona ambos equipos.");
    return;
  }
  if (!modelo) {
    alert("El modelo aún no está cargado.");
    return;
  }

  try {
    // extraemos las stats reales
      const home = equipo1.fullData;
      const away = equipo2.fullData;

      const features = {
      HomeElo: home.Elo,
      AwayElo: away.Elo,

      Form3Home: home.Form3,
      Form5Home: home.Form5,
      Form3Away: away.Form3,
      Form5Away: away.Form5,

      Home_Shots_last3_sum: home.Shots_last3_sum,
      Home_Target_last3_sum: home.Target_last3_sum,
      Home_Fouls_last3_sum: home.Fouls_last3_sum,
      Home_Corners_last3_sum: home.Corners_last3_sum,
      Home_Yellow_last3_sum: home.Yellow_last3_sum,
      Home_Red_last3_sum: home.Red_last3_sum,
      Home_GoalsFor_last3_sum: home.GoalsFor_last3_sum,
      Home_GoalsAgainst_last3_sum: home.GoalsAgainst_last3_sum,

      Home_Shots_last3_mean: home.Shots_last3_mean,
      Home_Target_last3_mean: home.Target_last3_mean,
      Home_Fouls_last3_mean: home.Fouls_last3_mean,
      Home_Corners_last3_mean: home.Corners_last3_mean,
      Home_Yellow_last3_mean: home.Yellow_last3_mean,
      Home_Red_last3_mean: home.Red_last3_mean,
      Home_GoalsFor_last3_mean: home.GoalsFor_last3_mean,
      Home_GoalsAgainst_last3_mean: home.GoalsAgainst_last3_mean,

      Away_Shots_last3_sum: away.Shots_last3_sum,
      Away_Target_last3_sum: away.Target_last3_sum,
      Away_Fouls_last3_sum: away.Fouls_last3_sum,
      Away_Corners_last3_sum: away.Corners_last3_sum,
      Away_Yellow_last3_sum: away.Yellow_last3_sum,
      Away_Red_last3_sum: away.Red_last3_sum,
      Away_GoalsFor_last3_sum: away.GoalsFor_last3_sum,
      Away_GoalsAgainst_last3_sum: away.GoalsAgainst_last3_sum,

      Away_Shots_last3_mean: away.Shots_last3_mean,
      Away_Target_last3_mean: away.Target_last3_mean,
      Away_Fouls_last3_mean: away.Fouls_last3_mean,
      Away_Corners_last3_mean: away.Corners_last3_mean,
      Away_Yellow_last3_mean: away.Yellow_last3_mean,
      Away_Red_last3_mean: away.Red_last3_mean,
      Away_GoalsFor_last3_mean: away.GoalsFor_last3_mean,
      Away_GoalsAgainst_last3_mean: away.GoalsAgainst_last3_mean,
    };



    

    // 3Asegura el orden correcto de features
    const featureArray = scaler.feature_names.map((name) => features[name]);
    const standardized = featureArray.map(
      (val, i) => (val - scaler.mean[i]) / scaler.scale[i]
    );

    // Crea el tensor con los datos escalados
    const inputTensor = tf.tensor2d([standardized]);

    // Predicción
    const outputs = modelo.execute({ input_layer_3: inputTensor });

    // GraphModels a veces devuelven un solo tensor o un array de tensores
    let lambda_home, lambda_away;

    if (Array.isArray(outputs)) {
      lambda_home = outputs[0].dataSync()[0];
      lambda_away = outputs[1].dataSync()[0];
    } else {
      // Si devuelve un solo tensor con dos columnas (shape [1,2])
      const data = outputs.dataSync();
      lambda_home = data[0];
      lambda_away = data[1];
    }

    // Convertimos a valores discretos (por ejemplo, goles esperados)
    const pred_home = Math.max(0, Math.round(lambda_home));
    const pred_away = Math.max(0, Math.round(lambda_away));

    // Confianza simple
    const confianza = 1 - Math.abs(pred_home - pred_away) / 5;

    // Actualiza el estado para que React renderice los goles
    setResultado({ goles1: pred_home, goles2: pred_away, confianza });

    console.log(
      `Predicción: ${pred_home}-${pred_away} (confianza ${(confianza * 100).toFixed(1)}%)`
    );

  } catch (error) {
    console.error("Error en la predicción:", error);
  }
};


  // === Estilos de Select ===
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#fff",
      color: "#000",
      borderColor: state.isFocused ? "var(--verde-inteligente)" : "rgba(22,163,74,0.9)",
      boxShadow: state.isFocused ? `0 6px 16px rgba(22,163,74,0.12)` : "none",
      minHeight: 52,
      borderRadius: 12,
      paddingLeft: 8,
      cursor: "pointer",
    }),
    singleValue: (base) => ({ ...base, color: "#000", fontWeight: 600 }),
    placeholder: (base) => ({ ...base, color: "#333" }),
    menu: (base) => ({ ...base, backgroundColor: "#fff", borderRadius: 10 }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "rgba(22,163,74,0.08)" : "#fff",
      color: "#000",
      padding: 12,
    }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base) => ({ ...base, color: "rgba(0,0,0,0.6)" }),
  };

  return (
    <div className="oraculo-container">
      <main className="zona-principal">
        <div className="oraculo-background">
        <canvas id="network-bg"></canvas>
        <div className="streaks" aria-hidden>
          <div className="streak s1" />
          <div className="streak s2" />
          <div className="streak s3" />
          <div className="streak s4" />
          <div className="streak s5" />
        </div>
      </div>
        <h1>El Oráculo</h1>
        <p>
          El Oráculo usa un modelo de Inteligencia Artificial para predecir el resultado de los partidos.
          <br /> ⚠️ No debe tomarse como consejo de apuestas.
        </p>

        <div className="panel-oraculo">
          <h2>Predicción de Partido</h2>

          <div className="selector-liga">
            <label className="label-select">Liga de Fútbol</label>
            <Select
              options={Object.keys(ligas).map((liga) => ({
                label: (
                  <div className="option-with-icon">
                    <img
                      src={
                        ligas[liga].logoLiga 
                          ? ligas[liga].logoLiga 
                          : "/fallback_liga.png" // opcional si quieres un placeholder
                      }
                      alt={liga}
                    />
                    <span>{liga}</span>
                  </div>
                ),
                value: liga,
              }))}
              onChange={(opt) => {
                setLigaSeleccionada(opt.value);
                setEquipo1(null);
                setEquipo2(null);
                setResultado(null);
              }}
              placeholder="Selecciona una liga..."
              classNamePrefix="custom-select"
              styles={selectStyles}
            />
          </div>


          {ligaSeleccionada && (
            <>
              <div className="selector-equipos-headers">
                <div className="equip-header">Equipo local</div>
                <div className="equip-header">Equipo visitante</div>
              </div>

              <div className="selector-equipos">
                <div className="select-wrap">
                  <Select
                    options={ligas[ligaSeleccionada].equipos.filter(
                      (eq) =>
                        (!equipo2 || eq.value !== equipo2.value)
                    )}
                    value={equipo1}
                    onChange={(val) => {
                      setEquipo1(val);
                      setResultado(null);
                    }}
                    placeholder="Selecciona equipo local"
                    formatOptionLabel={(option) => (
                      <div className="option-with-icon">
                        <img src={option.logo} alt={option.label} />
                        <span>{option.label}</span>
                      </div>
                    )}
                    classNamePrefix="custom-select"
                    styles={selectStyles}
                  />

                </div>

                <div className="select-wrap">
                  <Select
                    options={ligas[ligaSeleccionada].equipos.filter(
                      (eq) =>
                        (!equipo1 || eq.value !== equipo1.value)
                    )}
                    value={equipo2}
                    onChange={(val) => {
                      setEquipo2(val);
                      setResultado(null);
                    }}
                    placeholder="Selecciona equipo visitante"
                    formatOptionLabel={(option) => (
                      <div className="option-with-icon">
                        <img src={option.logo} alt={option.label} />
                        <span>{option.label}</span>
                      </div>
                    )}
                    classNamePrefix="custom-select"
                    styles={selectStyles}
                  />
                </div>
              </div>
            </>
          )}

          {ligaSeleccionada && (
            <div className="separador">
              <div className="linea" />
              <button className="btn-predecir" onClick={handlePrediccion}>
                Predecir
              </button>
              <div className="linea" />
            </div>
          )}

          {resultado && (
            <div className="resultado-wrapper">
              <div className="resultado">
                <div className="resultado-equipo">
                  <img src={equipo1.logo} alt={equipo1.label} className="res-logo" />
                  <h3>{equipo1.label}</h3>
                  <p className="goles">{resultado.goles1}</p>
                </div>

                <div className="resultado-separator" aria-hidden></div>

                <div className="resultado-equipo">
                  <img src={equipo2.logo} alt={equipo2.label} className="res-logo" />
                  <h3>{equipo2.label}</h3>
                  <p className="goles">{resultado.goles2}</p>
                </div>
              </div>
            </div>
          )}
          {resultado?.confianza && (
            <p className="confianza">
              Nivel de confianza: {(resultado.confianza * 100).toFixed(1)}%
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Oraculo;













