import Database from 'better-sqlite3';
import path from 'path';

const globalForDb = globalThis;
const dbPath = path.join(process.cwd(), 'database.db');

const initializeDb = (dbInstance) => {
  console.log("Verificando y/o inicializando la estructura de la base de datos...");

  // Usar una transacción asegura que todas las tablas se creen en una sola operación atómica.
  const setupTransaction = dbInstance.transaction(() => {
    // Tabla de Clientes
    dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE
      );
    `);

    // Tabla de Planos
    dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS planos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        alias TEXT NOT NULL,
        nombre_archivo TEXT NOT NULL,
        descripcion TEXT,
        cliente_id INTEGER NOT NULL,
        fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
        material TEXT,
        maquina TEXT,
        notas TEXT,
        FOREIGN KEY (cliente_id) REFERENCES clientes (id) ON DELETE CASCADE
      );
    `);

    // Tabla de Versiones (¡LA QUE FALTABA!)
    dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS plano_versiones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plano_id INTEGER NOT NULL,
        nombre_archivo_version TEXT NOT NULL,
        fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (plano_id) REFERENCES planos (id) ON DELETE CASCADE
      );
    `);
  });

  setupTransaction();
  console.log("Base de datos lista.");
};

// Se crea una conexión única para toda la aplicación.
if (!globalForDb.db) {
  const newDbInstance = new Database(dbPath);
  newDbInstance.pragma('journal_mode = WAL');
  newDbInstance.pragma('foreign_keys = ON');
  
  initializeDb(newDbInstance);
  
  globalForDb.db = newDbInstance;
}

export const db = globalForDb.db;