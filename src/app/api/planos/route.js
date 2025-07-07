import { db } from '@/lib/database';
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Formidable } from 'formidable';

// Desactivar el bodyParser de Next.js para que formidable pueda manejar el stream
export const config = {
  api: {
    bodyParser: false,
  },
};

// --- GET: Obtener planos con filtros ---
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const clienteId = searchParams.get('clienteId');
  const busqueda = searchParams.get('busqueda');
  const fecha = searchParams.get('fecha');

  let query = `
    SELECT
      p.id,
      p.alias,
      p.nombre_archivo,
      p.descripcion,
      p.fecha_subida,
      c.nombre as cliente_nombre
    FROM planos p
    JOIN clientes c ON p.cliente_id = c.id
  `;

  const params = [];
  const conditions = [];

  if (clienteId) {
    conditions.push('p.cliente_id = ?');
    params.push(clienteId);
  }
  if (busqueda) {
    conditions.push('(p.alias LIKE ? OR p.nombre_archivo LIKE ?)');
    params.push(`%${busqueda}%`, `%${busqueda}%`);
  }
   if (fecha) {
    conditions.push('date(p.fecha_subida) = ?');
    params.push(fecha);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY p.fecha_subida DESC';

  try {
    const planos = db.prepare(query).all(...params);
    return NextResponse.json(planos);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener los planos' }, { status: 500 });
  }
}

// --- POST: Crear un nuevo plano ---
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('plano');
    const alias = formData.get('alias');
    const clienteNombre = formData.get('cliente');
    const descripcion = formData.get('descripcion');

    if (!file || !alias || !clienteNombre) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    // Guardar el archivo en public/planos
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(process.cwd(), 'public/planos', file.name);
    await fs.writeFile(filePath, buffer);
    
     // TODO: Generar una vista previa y guardarla en public/previews

    // Manejar la base de datos
    // 1. Buscar o crear el cliente
    let cliente = db.prepare('SELECT id FROM clientes WHERE nombre = ?').get(clienteNombre);
    if (!cliente) {
      const result = db.prepare('INSERT INTO clientes (nombre) VALUES (?)').run(clienteNombre);
      cliente = { id: result.lastInsertRowid };
    }

    // 2. Insertar el plano en la base de datos
    db.prepare(
      'INSERT INTO planos (alias, nombre_archivo, descripcion, cliente_id) VALUES (?, ?, ?, ?)'
    ).run(alias, file.name, descripcion, cliente.id);

    return NextResponse.json({ message: 'Plano subido con éxito' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al subir el plano' }, { status: 500 });
  }
}