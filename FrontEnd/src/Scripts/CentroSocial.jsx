import React, { useEffect, useState } from "react";
import "../HojasEstilo/CentroSocial.css";
import axios from "axios";
import { useAuth } from "./AuthContext";

/* Componente CentroSocial: muestra un panel social donde el usuario puede buscar
y seguir a otros miembros. Usa AuthContext para obtener el usuario actual y cargar
sus amigos desde el backend. La función buscarUsuarios permite filtrar usuarios
por nombre, excluyendo al propio usuario y a los que ya sigue. Las funciones seguir
y dejar actualizan tanto el backend como el estado local sin recargar la página.
Incluye además una sección visual con noticias, imágenes, videos y audios del mundo
del fútbol, junto a un panel lateral con buscador y lista de amigos. */


export default function CentroSocial() {

    const { user } = useAuth();
    const [amigos, setAmigos] = useState([]);

    const [busqueda, setBusqueda] = useState("");
    const [resultados, setResultados] = useState([]);

    // ===============================
    // Cargar amigos (usuarios que sigo)
    // ===============================
    const cargarAmigos = async () => {
        if (!user) return;

        try {
            const res = await axios.get(
                `http://localhost:3001/api/seguidores/siguiendo/${user.id_usuario}`
            );
            setAmigos(res.data);
        } catch (err) {
            console.error("Error cargando amigos:", err);
        }
    };

    useEffect(() => {
        cargarAmigos();
    }, [user]);

    // ===============================
    // Buscar usuarios por nombre (solo al presionar Enter)
    // ===============================
    const buscarUsuarios = async (nombre) => {
        console.log("🔍 Buscando:", nombre);
        
        if (nombre.trim() === "") {
            console.log("❌ Búsqueda vacía");
            setResultados([]);
            return;
        }

        try {
            const url = `http://localhost:3001/api/usuarios/buscar?nombre=${nombre}`;
            console.log("📡 URL:", url);
            
            const res = await axios.get(url);
            console.log("✅ Respuesta del servidor:", res.data);

            // Filtrar: excluir al usuario actual y a los que ya sigue
            const usuariosAmigos = amigos.map(a => a.id_usuario);
            console.log("👥 Amigos actuales:", usuariosAmigos);
            console.log("👤 Usuario actual ID:", user.id_usuario);
            
            const resultadosFiltrados = res.data.filter(
                u => u.id_usuario !== user.id_usuario && !usuariosAmigos.includes(u.id_usuario)
            );

            console.log("📋 Resultados después de filtrar:", resultadosFiltrados);
            setResultados(resultadosFiltrados);
        } catch (err) {
            console.error("❌ Error buscando usuarios:", err);
            setResultados([]);
        }
    };

    // Manejar Enter en el input
    const manejarEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            buscarUsuarios(busqueda);
        }
    };

    // ===============================
    // Seguir usuario
    // ===============================
    const seguir = async (idSeguido) => {
        if (!user) return;

        // Evitar que se siga a uno mismo
        if (idSeguido === user.id_usuario) {
            console.warn("No puedes seguirte a ti mismo");
            return;
        }

        try {
            await axios.post("http://localhost:3001/api/seguidores/seguir", {
                seguidor_id: user.id_usuario,
                seguido_id: idSeguido
            });

            // Actualizar estado localmente inmediatamente
            const nuevoAmigo = resultados.find(u => u.id_usuario === idSeguido);
            if (nuevoAmigo) {
                setAmigos([...amigos, nuevoAmigo]);
            }
            
            // Actualizar resultados para mostrar que ya lo sigo
            setResultados(resultados.filter(u => u.id_usuario !== idSeguido));
        } catch (err) {
            console.error("Error al seguir:", err);
            alert("Error al seguir: " + (err.response?.data?.error || err.message));
        }
    };

    // ===============================
    // Dejar de seguir usuario
    // ===============================
    const dejar = async (idSeguido) => {
        try {
            await axios.delete("http://localhost:3001/api/seguidores/dejar", {
                data: {
                    seguidor_id: user.id_usuario,
                    seguido_id: idSeguido
                }
            });

            // Actualizar estado localmente inmediatamente
            const usuarioDejar = amigos.find(a => a.id_usuario === idSeguido);
            setAmigos(amigos.filter(a => a.id_usuario !== idSeguido));
            
            // Si hay búsqueda activa, volver a mostrar este usuario en resultados
            if (busqueda.trim() !== "" && usuarioDejar) {
                setResultados([...resultados, usuarioDejar]);
            }
        } catch (err) {
            console.error("Error al dejar:", err);
            alert("Error al dejar de seguir: " + (err.response?.data?.error || err.message));
        }
    };

    // ===============================
    // Render del componente
    // ===============================
    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4" style={{ color: "#16A34A" }}>
                🌍 Centro Social Futbol.AI
            </h2>

            <div className="row">

                
                {/* SECCIÓN IZQUIERDA - Acordeón */}
                <div className="col-md-8">
                    <div className="accordion" id="accordionRedes">

                        {/* Selección Colombia */}
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingColombia">
                                <button
                                    className="accordion-button"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseColombia"
                                    aria-expanded="true"
                                    aria-controls="collapseColombia"
                                >
                                    🇨🇴 Selección Colombia
                                </button>
                            </h2>
                            <div
                                id="collapseColombia"
                                className="accordion-collapse collapse show"
                                aria-labelledby="headingColombia"
                                data-bs-parent="#accordionRedes"
                            >
                                <div className="accordion-body text-center">
                                    <img
                                        src="/assets/centrosocial/colombia.jpg"
                                        alt="Selección Colombia"
                                        className="img-fluid rounded mb-3"
                                        style={{ maxHeight: "220px", objectFit: "cover" }}
                                    />
                                    <p>
                                        Sigue a la Selección Colombia para conocer convocatorias, resultados
                                        y momentos destacados del equipo nacional.
                                    </p>
                                    <div className="d-flex justify-content-center gap-3">
                                        <a
                                            href="https://www.instagram.com/fcfseleccioncol/"
                                            target="_blank"
                                            className="btn btn-outline-danger"
                                            rel="noopener noreferrer"
                                        >
                                            Instagram
                                        </a>
                                        <a
                                            href="https://twitter.com/FCFSeleccionCol"
                                            target="_blank"
                                            className="btn btn-outline-primary"
                                            rel="noopener noreferrer"
                                        >
                                            X (Twitter)
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FIFA */}
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingFifa">
                                <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseFifa"
                                    aria-expanded="false"
                                    aria-controls="collapseFifa"
                                >
                                    🌐 FIFA - Copa del Mundo
                                </button>
                            </h2>
                            <div
                                id="collapseFifa"
                                className="accordion-collapse collapse"
                                aria-labelledby="headingFifa"
                                data-bs-parent="#accordionRedes"
                            >
                                <div className="accordion-body text-center">
                                    <img
                                        src="/assets/centrosocial/fifa.jpg"
                                        alt="FIFA World Cup"
                                        className="img-fluid rounded mb-3"
                                        style={{ maxHeight: "220px", objectFit: "cover" }}
                                    />
                                    <p>
                                        Mantente al día con las noticias y videos oficiales de la FIFA y las
                                        competiciones internacionales más importantes del mundo.
                                    </p>

                                    {/* Video de YouTube embebido */}
                                    <div className="ratio ratio-16x9 mb-3">
                                        <iframe
                                            width="560"
                                            height="315"
                                            src="https://www.youtube.com/embed/BNpP2JfdGM4?si=iH-kv1auxnBoBcn8"
                                            title="YouTube video player"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            referrerPolicy="strict-origin-when-cross-origin"
                                            allowFullScreen
                                        ></iframe>
                                    </div>

                                    <a
                                        href="https://www.youtube.com/fifa"
                                        target="_blank"
                                        className="btn btn-danger"
                                        rel="noopener noreferrer"
                                    >
                                        🔴 Ver canal de la FIFA
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Fans del fútbol */}
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingFans">
                                <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseFans"
                                    aria-expanded="false"
                                    aria-controls="collapseFans"
                                >
                                    🎉 Comunidad de Fans
                                </button>
                            </h2>
                            <div
                                id="collapseFans"
                                className="accordion-collapse collapse"
                                aria-labelledby="headingFans"
                                data-bs-parent="#accordionRedes"
                            >
                                <div className="accordion-body text-center">
                                    <div className="row">
                                        {["fans1.jpg", "fans2.jpg", "fans3.jpg"].map((img, i) => (
                                            <div className="col-md-4 mb-3" key={i}>
                                                <img
                                                    src={`/assets/centrosocial/${img}`}
                                                    alt={`Fan ${i + 1}`}
                                                    className="img-fluid rounded shadow-sm"
                                                    style={{ maxHeight: "180px", objectFit: "cover" }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <p>
                                        Los fanáticos del fútbol comparten su pasión desde todas partes del mundo 🌎
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Audios y Retransmisiones */}
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingAudios">
                                <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseAudios"
                                    aria-expanded="false"
                                    aria-controls="collapseAudios"
                                >
                                    🎧 Audios y Retransmisiones
                                </button>
                            </h2>
                            <div
                                id="collapseAudios"
                                className="accordion-collapse collapse"
                                aria-labelledby="headingAudios"
                                data-bs-parent="#accordionRedes"
                            >
                                <div className="accordion-body">
                                    <div className="mb-4 text-center">
                                        <h5>🏟️ Nacional genera miedo: Contundente victoria en el clásico frente al DIM</h5>
                                        <p>
                                            Revive la narración y análisis del triunfo de Atlético Nacional en el clásico paisa. 
                                            Un partido lleno de intensidad y dominio verde.
                                        </p>
                                        <audio controls className="w-100">
                                            <source src="/assets/audios/nacional_america.mp3" type="audio/mpeg" />
                                            Tu navegador no soporta la reproducción de audio.
                                        </audio>
                                    </div>

                                    <div className="mb-4 text-center">
                                        <h5>⚔️ 8 equipos por 2 cupos: Millonarios, Santa Fe, América, Cali... ¿Quién entra?</h5>
                                        <p>
                                            Un análisis de la recta final del campeonato colombiano, donde varios clubes pelean 
                                            por un lugar en los cuadrangulares.
                                        </p>
                                        <audio controls className="w-100">
                                            <source src="/assets/audios/equipos_cupos.mp3" type="audio/mpeg" />
                                            Tu navegador no soporta la reproducción de audio.
                                        </audio>
                                    </div>

                                    <div className="text-center">
                                        <h5>🇨🇴 La Selección Colombia y su nuevo reto en la Liga de Naciones Femenina</h5>
                                        <p>
                                            Escucha los detalles del próximo desafío del combinado femenino colombiano en la 
                                            Liga de Naciones, con entrevistas y reacciones exclusivas.
                                        </p>
                                        <audio controls className="w-100">
                                            <source src="/assets/audios/colombia.mp3" type="audio/mpeg" />
                                            Tu navegador no soporta la reproducción de audio.
                                        </audio>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ======================================
                    SECCIÓN DERECHA — BUSCADOR + AMIGOS
                ======================================= */}
                <div className="col-md-4">
                    <div className="card shadow-sm p-3">

                        {/* BUSCADOR */}
                        <h5 className="text-center mb-2" style={{ color: "#004488" }}>
                            🔍 Buscar usuarios
                        </h5>

                        <input
                            className="form-control mb-2"
                            placeholder="Escribe un nombre... (presiona Enter)"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            onKeyDown={manejarEnter}
                        />

                        {/* Resultados */}
                        {resultados.length > 0 && (
                            <ul className="list-group mb-3">
                                {resultados.map((u) => (
                                    <li
                                        key={u.id_usuario}
                                        className="list-group-item d-flex justify-content-between"
                                    >
                                        {u.nombre}
                                        <button
                                            className="btn btn-sm btn-success"
                                            onClick={() => seguir(u.id_usuario)}
                                        >
                                            Seguir
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* AMIGOS */}
                        <h5 className="text-center mt-3" style={{ color: "#004488" }}>
                            👥 Mis Amigos
                        </h5>

                        <ul className="list-group list-group-flush">
                            {amigos.length === 0 && (
                                <li className="list-group-item text-center">
                                    Aún no sigues a nadie
                                </li>
                            )}

                            {amigos.map((a) => (
                                <li
                                    key={a.id_usuario}
                                    className="list-group-item d-flex justify-content-between"
                                >
                                    {a.nombre}
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => dejar(a.id_usuario)}
                                    >
                                        Dejar
                                    </button>
                                </li>
                            ))}
                        </ul>

                    </div>
                </div>

            </div>
        </div>
    );
}
 