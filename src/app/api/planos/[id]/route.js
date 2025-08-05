import { db } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {

    const id = params.id;

    const plano = db.prepare(`
      SELECT
        p.id, p.alias, p.nombre_archivo, p.descripcion, p.fecha_subida,
        p.material, p.maquina, p.notas, c.nombre as cliente_nombre
      FROM planos p
      JOIN clientes c ON p.cliente_id = c.id
      WHERE p.id = ?
    `).get(id);

    if (!plano) {
      return NextResponse.json({ error: 'Plano no encontrado' }, { status: 404 });
    }

    const versionesAdicionales = db.prepare(
      'SELECT id, nombre_archivo_version, fecha_subida FROM plano_versiones WHERE plano_id = ? ORDER BY fecha_subida ASC'
    ).all(id);

    const todasLasVersiones = [
      { 
        id: `orig-${plano.id}`,
        nombre_archivo_version: plano.nombre_archivo, 
        fecha_subida: plano.fecha_subida 
      },
      ...versionesAdicionales
    ];

    return NextResponse.json({ ...plano, versiones: todasLasVersiones });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener el plano' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const id = params.id;
    const body = await request.json();
    const { material, maquina, notas } = body;

    const stmt = db.prepare(
      `UPDATE planos SET material = ?, maquina = ?, notas = ? WHERE id = ?`
    );
    const result = stmt.run(material, maquina, notas, id);

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Plano no encontrado o sin cambios que aplicar' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Plano actualizado con éxito' });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al actualizar el plano' }, { status: 500 });
  }
}