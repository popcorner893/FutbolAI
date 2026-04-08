-- Crear base de datos
CREATE DATABASE IF NOT EXISTS futbol_ai;
USE futbol_ai;


CREATE USER 'un_usr'@'localhost' IDENTIFIED BY 'una_clave';
GRANT ALL PRIVILEGES ON futbol_ai.* TO 'un_usr'@'localhost';
FLUSH PRIVILEGES;


-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('usuario', 'admin') DEFAULT 'usuario',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de equipos
CREATE TABLE IF NOT EXISTS equipos (
    id_equipo INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    liga VARCHAR(100),
    logo VARCHAR(255),

    -- Nuevas columnas
    Elo FLOAT DEFAULT 0,
    Form3 FLOAT DEFAULT 0,
    Form5 FLOAT DEFAULT 0,

    Shots_last3_sum FLOAT DEFAULT 0,
    Target_last3_sum FLOAT DEFAULT 0,
    Fouls_last3_sum FLOAT DEFAULT 0,
    Corners_last3_sum FLOAT DEFAULT 0,
    Yellow_last3_sum FLOAT DEFAULT 0,
    Red_last3_sum FLOAT DEFAULT 0,
    GoalsFor_last3_sum FLOAT DEFAULT 0,
    GoalsAgainst_last3_sum FLOAT DEFAULT 0,

    Shots_last3_mean FLOAT DEFAULT 0,
    Target_last3_mean FLOAT DEFAULT 0,
    Fouls_last3_mean FLOAT DEFAULT 0,
    Corners_last3_mean FLOAT DEFAULT 0,
    Yellow_last3_mean FLOAT DEFAULT 0,
    Red_last3_mean FLOAT DEFAULT 0,
    GoalsFor_last3_mean FLOAT DEFAULT 0,
    GoalsAgainst_last3_mean FLOAT DEFAULT 0
);


-- Tabla de partidos
CREATE TABLE IF NOT EXISTS partidos (
    id_partido INT AUTO_INCREMENT PRIMARY KEY,
    equipo_local_id INT NOT NULL,
    equipo_visitante_id INT NOT NULL,
    fecha DATETIME,
    marcador_local INT DEFAULT 0,
    marcador_visitante INT DEFAULT 0,
    FOREIGN KEY (equipo_local_id) 
        REFERENCES equipos(id_equipo)
        ON DELETE CASCADE,
    FOREIGN KEY (equipo_visitante_id) 
        REFERENCES equipos(id_equipo)
        ON DELETE CASCADE
);

-- Tabla de noticias
CREATE TABLE IF NOT EXISTS noticias (
    id_noticia INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(100),
    contenido LONGTEXT,
    ruta_imagen LONGTEXT,
    autor_id INT,
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (autor_id) 
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
);

-- Tabla seguidores
CREATE TABLE IF NOT EXISTS seguidores (
    id_seguimiento INT AUTO_INCREMENT PRIMARY KEY,
    seguidor_id INT NOT NULL,
    seguido_id INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seguidor_id) 
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,
    FOREIGN KEY (seguido_id) 
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,
    UNIQUE(seguidor_id, seguido_id)
);

-- Tabla mensajes
CREATE TABLE IF NOT EXISTS mensajes (
    id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    texto TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) 
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
);


-- ============================================
-- INSERTAR USUARIOS
-- ============================================
INSERT IGNORE INTO usuarios (nombre, email, password, rol, fecha_registro) VALUES
-- Admin
('Admin FutbolAI', 'admin1@futbolai.com', 'admin123', 'admin', '2024-01-01 10:00:00'),

-- Usuarios regulares
('Luis Díaz', 'luis.diaz@gmail.com', 'password1', 'usuario', '2024-01-15 14:30:00'),
('James Rodríguez', 'james.rodriguez@gmail.com', 'password2', 'usuario', '2024-02-05 09:15:00'),
('Radamel Falcao', 'radamel.falcao@gmail.com', 'password3', 'usuario', '2024-02-10 11:45:00'),
('Andrés Ibargüen', 'andres.ibarguen@gmail.com', 'password4', 'usuario', '2024-02-20 16:20:00'),
('Juan Fernando Quintero', 'juanfernando.quintero@gmail.com', 'password5', 'usuario', '2024-03-01 13:00:00'),
('David Ospina', 'david.ospina@gmail.com', 'password6', 'usuario', '2024-03-05 10:30:00'),
('Yerry Mina', 'yerry.mina@gmail.com', 'password7', 'usuario', '2024-03-10 15:45:00'),
('Díber Cambindo', 'diber.cambindo@gmail.com', 'password8', 'usuario', '2024-03-15 12:15:00'),
('Camilo Vargas', 'camilo.vargas@gmail.com', 'password9', 'usuario', '2024-03-20 14:00:00'),
('Duván Zapata', 'duvan.zapata@gmail.com', 'password10', 'usuario', '2024-03-25 09:45:00');






-- ============================================
-- INSERTAR NOTICIAS (Datos predeterminados de noticiasData.js)
-- ============================================
INSERT INTO noticias (titulo, descripcion, categoria, contenido, ruta_imagen, autor_id, fecha_publicacion) VALUES

(
  'Luis Díaz brilla con doblete en la Premier League',
  'El colombiano marcó dos goles en la victoria del Liverpool sobre el Tottenham.',
  'Actualidad',
  'Luis Díaz fue la figura del encuentro con dos anotaciones espectaculares. El delantero colombiano demostró su calidad ofensiva en el enfrentamiento entre dos de los grandes equipos de la Premier League. Su actuación ha generado expectativa sobre su desempeño en los próximos encuentros de la temporada.',
  '/assets/noticias/luis_diaz_doblete.jpg',
  2,
  '2025-11-15 10:30:00'
),

(
  'James Rodríguez lidera al São Paulo en la Copa Sudamericana',
  'El mediocampista fue clave en la clasificación del club brasileño a semifinales.',
  'Competiciones',
  'James comandó el ataque con gran visión de juego. El experimentado volante colombiano fue fundamental en la estrategia ofensiva del São Paulo, permitiendo que el equipo avanzara en la competición continental. Su liderazgo en el campo ha sido determinante para los aspiraciones del equipo en la Copa Sudamericana.',
  '/assets/noticias/james_sao_paulo.jpg',
  3,
  '2025-11-14 14:15:00'
),

(
  'Selección Colombia sube posiciones en el ranking FIFA',
  'Tras su victoria ante Brasil, la tricolor ascendió al puesto número 11.',
  'Selección',
  'La selección dirigida por Néstor Lorenzo sigue en ascenso. Colombia consolidó su recuperación en el ranking mundial después de una racha positiva de resultados. El equipo nacional ha mostrado una mejoría significativa en sus últimos compromisos internacionales, lo que refleja el trabajo realizado por el técnico y la creciente madurez del grupo.',
  '/assets/noticias/colombia_fifa.jpg',
  4,
  '2025-11-13 11:45:00'
),

(
  'Final de Champions: Real Madrid vs Manchester City',
  'Dos gigantes europeos se enfrentan por la gloria continental.',
  'Competiciones',
  'Será un duelo de titanes entre Guardiola y Ancelotti. Los dos mejores equipos de Europa se preparan para una final épica que promete ser emocionante y tácticamente interesante. Real Madrid y Manchester City llegan como favoritos después de dominar sus ligas respectivas durante toda la temporada.',
  '/assets/noticias/champions_final.jpg',
  1,
  '2025-11-12 16:20:00'
),

(
  'Atlético Nacional anuncia nuevo refuerzo uruguayo',
  'El delantero charrúa firmó por tres temporadas con el equipo paisa.',
  'Fichajes',
  'El nuevo delantero llega procedente del fútbol uruguayo. Atlético Nacional refuerza su delantera con un jugador experimentado que se espera aporte goles y liderazgo al equipo antioqueño. Este fichaje marca un movimiento estratégico del club en busca de reforzar su plantilla para la próxima campaña.',
  '/assets/noticias/nacional_refuerzo.jpg',
  5,
  '2025-11-11 13:00:00'
),

(
  'Messi vuelve a la acción con el Inter de Miami',
  'El argentino regresó tras lesión y anotó un golazo en su reaparición.',
  'Actualidad',
  'Messi volvió a brillar con una actuación memorable. Después de una lesión que lo tuvo fuera de las canchas por varias semanas, el astro argentino demostró que sigue siendo un factor decisivo para Inter Miami. Su regreso ha generado entusiasmo entre los aficionados y reafirma su importancia en el equipo norteamericano.',
  '/assets/noticias/messi_miami.jpg',
  6,
  '2025-11-10 15:30:00'
);


-- ============================================
-- INSERTAR SEGUIDORES
-- ============================================
INSERT IGNORE INTO seguidores (seguidor_id, seguido_id, fecha) VALUES
(2, 3, '2024-01-20 10:00:00'),
(2, 4, '2024-01-25 11:30:00'),
(3, 2, '2024-02-01 09:15:00'),
(3, 5, '2024-02-05 14:45:00'),
(4, 2, '2024-02-10 13:20:00'),
(4, 6, '2024-02-12 16:00:00'),
(5, 3, '2024-02-15 10:30:00'),
(6, 2, '2024-02-20 12:15:00'),
(6, 4, '2024-02-22 15:45:00'),
(7, 2, '2024-03-01 09:00:00'),
(7, 3, '2024-03-02 11:30:00'),
(8, 5, '2024-03-05 14:20:00'),
(9, 2, '2024-03-08 10:15:00'),
(10, 4, '2024-03-10 13:45:00'),
(11, 6, '2024-03-12 16:30:00');


-- ============================================
-- INSERTAR MENSAJES
-- ============================================
INSERT INTO mensajes (id_usuario, texto, fecha) VALUES
(2, '¡Qué partido espectacular de Luis Díaz! Dos goles increíbles 🔥', '2025-11-15 11:00:00'),
(3, 'James está jugando de maravilla en Brasil. Es un orgullo para Colombia 🇨🇴', '2025-11-14 15:30:00'),
(4, 'La final de Champions promete ser emocionante. ¿Quién crees que gana?', '2025-11-12 17:00:00'),
(5, 'Excelente noticia sobre el fichaje de Atlético Nacional. El equipo se refuerza bien', '2025-11-11 14:15:00'),
(6, 'Messi es simplemente increíble. Incluso lesionado es decisivo 👑', '2025-11-10 16:45:00'),
(7, 'Colombia en el Top 11 del ranking FIFA. Vamos mejorando poco a poco 📈', '2025-11-13 12:30:00'),
(8, 'Los partidos de esta semana han estado de lujo. Gran fútbol', '2025-11-20 20:15:00'),
(9, 'Manchester City vs Real Madrid será para la historia. Dos equipos brutales', '2025-11-12 18:45:00'),
(10, 'Luis Díaz es el futuro del fútbol colombiano. Mucho potencial', '2025-11-15 12:00:00'),
(11, 'Que vuelta tiene Messi. A los 38 años sigue siendo crack', '2025-11-10 17:20:00');