import "../HojasEstilo/Home.css";
import React, { useState, useEffect } from "react";

/* Componente Home: muestra la página principal del sitio con noticias,
partidos recientes y una encuesta interactiva. Usa estados para controlar
el carrusel automático, el slide actual y si el usuario ya votó. El carrusel
avanza cada 5 segundos y permite navegación manual. También contiene un bloque
de artículos secundarios y una encuesta del día con formulario. La sección
de partidos renderiza marcadores recientes usando datos locales. */


function Home() {
  const [showOraculo, setShowOraculo] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [votado, setVotado] = useState(false);

  const toggleOraculo = () => setShowOraculo(!showOraculo);

  // Carrusel (noticias principales)
  const slides = [
    { img: "/LuisDiaz.png", titulo: "Lucho Díaz brilla con doblete ante el Real Madrid" },
    { img: "/noticia2.jpg", titulo: "Colombia clasifica a semifinales de la Copa América" },
    { img: "/noticia3.png", titulo: "Messi supera nuevo récord histórico en el Inter Miami" },
  ];

  // Auto-play del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  // Artículos secundarios
  const articulos = [
    {
      categoria: "Fútbol",
      imagen: "/articulo1.png",
      titulo:
        "Oblak: 'Portería a cero nos está costando mucho y yo soy el más enfadado'",
    },
    {
      categoria: "Noticias",
      imagen: "/articulo2.png",
      titulo: "El salto de calidad del Atlético tiene nombre: Álex Baena",
    },
    {
      categoria: "Champions",
      imagen: "/articulo3.png",
      titulo: "Barrios enciende las alarmas en el Atlético",
    },
    {
      categoria: "Opinión",
      imagen: "/articulo4.png",
      titulo:
        "Uno a uno del Atlético contra el Betis: valoración y comentarios",
    },
  ];

  const handleVotar = (e) => {
    e.preventDefault();
    setVotado(true);
  };

  return (
    <div>
      {/* Partidos recientes */}
      <div className="zona zona-partidos">
        {[
          { escudo1: "/barcelona.png", marcador: "2 : 0", escudo2: "/madrid.png" },
          { escudo1: "/liverpool.png", marcador: "1 : 1", escudo2: "/chelsea.png" },
          { escudo1: "/psg.png", marcador: "3 : 2", escudo2: "/bayern.png" },
          { escudo1: "/inter.png", marcador: "1 : 4", escudo2: "/milan.png" },
        ].map((p, i) => (
          <div className="partido" key={i}>
            <div className="partido-contenido">
              <img src={p.escudo1} alt="Equipo 1" className="escudo-grande" />
              <div className="marcador">{p.marcador}</div>
              <img src={p.escudo2} alt="Equipo 2" className="escudo-grande" />
            </div>
          </div>
        ))}
      </div>

      {/* Noticias principales y encuestas */}
      <div className="zona zona-articulos">
        {/* Carrusel principal */}
        <div className="articulo-principal">
          <div className="carrusel-slider">
            <div
              className="slides"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((s, i) => (
                <div className="slide" key={i}>
                  <img src={s.img} alt={s.titulo} />
                  <div className="titulo-articulo">{s.titulo}</div>
                </div>
              ))}
            </div>

            <button className="prev" onClick={prevSlide}>
              ‹
            </button>
            <button className="next" onClick={nextSlide}>
              ›
            </button>

            <div className="dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`dot ${i === currentSlide ? "active" : ""}`}
                  onClick={() => setCurrentSlide(i)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Encuestas */}
        <div
          className={`encuesta-dia ${votado ? "encuesta-votada" : ""}`}
        >
          {!votado ? (
            <>
              <h3>Encuesta del día</h3>
              <form className="form-encuesta" onSubmit={handleVotar}>
                <p>¿Quién crees que ganará la Champions 2025?</p>
                <label>
                  <input type="radio" name="champions" /> Real Madrid
                </label>
                <label>
                  <input type="radio" name="champions" /> Manchester City
                </label>
                <label>
                  <input type="radio" name="champions" /> PSG
                </label>
                <label>
                  <input type="radio" name="champions" /> Bayern Múnich
                </label>

                <div className="encuesta-abierta">
                  <p>¿Qué jugador colombiano destacará este año?</p>
                  <input
                    type="text"
                    placeholder="Escribe tu respuesta..."
                    required
                  />
                </div>

                <button type="submit">Votar</button>
              </form>
            </>
          ) : (
            <div className="mensaje-votado">
              <h2>Ya has votado</h2>
            </div>
          )}
        </div>
      </div>

      {/* Rejilla de artículos secundarios */}
      <div className="rejilla-articulos">
        {articulos.map((a, i) => (
          <div className="panel" key={i}>
            <div className="categoria">{a.categoria}</div>
            <img src={a.imagen} alt={a.categoria} className="imagen-articulo" />
            <div className="titulo">{a.titulo}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;

