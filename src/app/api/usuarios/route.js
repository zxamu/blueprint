import { db } from '@/lib/database';
import { NextResponse } from 'next/server';
import { getUserFromCookie } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// GET: Obtener todos los usuarios
export async function GET(request) {
  const user = await getUserFromCookie();
  if (!user || user.rol !== 'administrador') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    // Excluimos la contraseña del resultado por seguridad
    const usuarios = db.prepare('SELECT id, nombre, email, rol FROM usuarios').all();
    return NextResponse.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST: Crear un nuevo usuario
export async function POST(request) {
  const user = await getUserFromCookie();
  if (!user || user.rol !== 'administrador') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { nombre, email, password, rol } = await request.json();

    if (!nombre || !email || !password || !rol) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = db.prepare(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)'
    ).run(nombre, email, hashedPassword, rol);

    const newUser = {
        id: result.lastInsertRowid,
        nombre,
        email,
        rol
    };

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return NextResponse.json({ error: 'El correo electrónico ya está en uso' }, { status: 409 });
    }
    console.error('Error al crear usuario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
