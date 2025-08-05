import { db } from '@/lib/database';
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request, { params }) {
  try {
    const { id: planoId } = params;
    const formData = await request.formData();
    const file = formData.get('plano_version');

    if (!file) {
      return NextResponse.json({ error: 'No se recibió ningún archivo.' }, { status: 400 });
    }

    // Guardar el nuevo archivo en public/planos
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(process.cwd(), 'public/planos', file.name);
    await fs.writeFile(filePath, buffer);
    
    // Registrar la nueva versión en la base de datos
    db.prepare(
      'INSERT INTO plano_versiones (plano_id, nombre_archivo_version) VALUES (?, ?)'
    ).run(planoId, file.name);

    return NextResponse.json({ message: 'Nueva versión subida con éxito' }, { status: 201 });

  } catch (error) {
    console.error('Error al subir nueva versión:', error);
    return NextResponse.json({ error: 'Error interno al subir la nueva versión.' }, { status: 500 });
  }
}