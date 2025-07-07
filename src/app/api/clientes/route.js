import { db } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const clientes = db.prepare('SELECT id, nombre FROM clientes ORDER BY nombre ASC').all();
    return NextResponse.json(clientes);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener los clientes' }, { status: 500 });
  }
}