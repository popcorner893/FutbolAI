import React from "react";

/* Componente que muestra el listado de noticias almacenadas; recibe las noticias
como arreglo y una función para eliminarlas. Si no existen registros, informa al
usuario que aún no hay publicaciones. Renderiza cada noticia en una tarjeta que
incluye imagen, categoría, título, contenido y fecha. El botón de eliminación
ejecuta la función onDelete enviando el id del elemento seleccionado. Facilita la
visualización general del contenido creado en el panel administrativo. */


export default function NewsList({ news, onDelete }) {
  if (news.length === 0) {
    return <p className="no-news">No hay noticias publicadas aún.</p>;
  }

  return (
    <div className="news-list">
      {news.map((post) => (
        <div className="news-card" key={post.id}>
          {post.image && (
            <img src={post.image} alt={post.title} className="news-image" />
          )}

          {/* Lista todas las noticias publicadas con anterioridad */}

          <div className="news-content">
            <span className="news-category">{post.category}</span>
            <h3>{post.title}</h3>
            <p>{post.content}</p>

            <div className="news-footer">
              <span>📅 {post.date}</span>
              <button
                className="delete-btn"
                onClick={() => onDelete(post.id)}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
