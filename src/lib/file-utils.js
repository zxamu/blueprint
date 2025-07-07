import fs from 'fs';
import path from 'path';

// Construye la ruta al directorio 'public/planos'
const planosDirectory = path.join(process.cwd(), 'public/planos');

export function getPdfFiles() {
  // Lee los nombres de los archivos en el directorio
  const fileNames = fs.readdirSync(planosDirectory);

  // Filtra para quedarte solo con los archivos .pdf y quita la extensión
  return fileNames
    .filter((fileName) => fileName.endsWith('.pdf'))
    .map((fileName) => fileName.replace(/\.pdf$/, ''));
}