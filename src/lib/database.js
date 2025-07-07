import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.db');
export const db = new Database(dbPath);

// Asegurarnos de que las claves foráneas estén activadas
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// --- FUNCIÓN DE INICIALIZACIÓN AUTOMÁTICA ---
// Esta función crea las tablas si no existen.
function initializeDb() {
  console.log("Verificando y/o inicializando la base de datos...");
  
  // Tabla de Clientes
  db.exec(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE
    );
  `);

  // Tabla de Planos
  db.exec(`
    CREATE TABLE IF NOT EXISTS planos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      alias TEXT NOT NULL,
      nombre_archivo TEXT NOT NULL,
      descripcion TEXT,
      cliente_id INTEGER NOT NULL,
      fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cliente_id) REFERENCES clientes (id) ON DELETE CASCADE
    );
  `);

  console.log("Base de datos lista.");
}

// Ejecutamos la inicialización aquí mismo
initializeDb();