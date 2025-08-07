import Database from 'better-sqlite3';
import path from 'path';

// Usamos el objeto 'global' de Node.js para almacenar la conexión y evitar
// que se recree en cada recarga del servidor en modo de desarrollo.
const globalForDb = globalThis;

const dbPath = path.join(process.cwd(), 'database.db');

// --- FUNCIÓN DE INICIALIZACIÓN ---
// Esta función crea las tablas si no existen, todo dentro de una única transacción.
const initializeDb = (dbInstance) => {
  console.log("Verificando y/o inicializando la estructura de la base de datos...");

  const setupTransaction = dbInstance.transaction(() => {
    // Tabla de Usuarios
    dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        rol TEXT NOT NULL CHECK(rol IN ('administrador', 'lectura y escritura', 'solo lectura'))
      );
    `);

    // Tabla de Clientes
    dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE
      );
    `);

    // Tabla de Planos (con auditoría)
    dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS planos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        alias TEXT NOT NULL,
        nombre_archivo TEXT NOT NULL,
        descripcion TEXT,
        cliente_id INTEGER NOT NULL,
        creado_por_usuario_id INTEGER,
        fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
        material TEXT,
        maquina TEXT,
        notas TEXT,
        FOREIGN KEY (cliente_id) REFERENCES clientes (id) ON DELETE CASCADE,
        FOREIGN KEY (creado_por_usuario_id) REFERENCES usuarios (id) ON DELETE SET NULL
      );
    `);

    // Tabla de Versiones de Planos (con auditoría)
    dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS plano_versiones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plano_id INTEGER NOT NULL,
        nombre_archivo_version TEXT NOT NULL,
        creado_por_usuario_id INTEGER,
        fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (plano_id) REFERENCES planos (id) ON DELETE CASCADE,
        FOREIGN KEY (creado_por_usuario_id) REFERENCES usuarios (id) ON DELETE SET NULL
      );
    `);
  });

  setupTransaction();
  console.log("Base de datos lista.");
};

// Si no existe una conexión en el objeto global, la creamos.
if (!globalForDb.db) {
  const newDbInstance = new Database(dbPath);
  newDbInstance.pragma('journal_mode = WAL');
  newDbInstance.pragma('foreign_keys = ON');
  
  initializeDb(newDbInstance); // Inicializamos la ESTRUCTURA solo al crear la conexión
  
  globalForDb.db = newDbInstance;
}

// Exportamos la conexión única.
export const db = globalForDb.db;
