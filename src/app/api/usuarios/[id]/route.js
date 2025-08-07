import { db } from '@/lib/database';
import { NextResponse } from 'next/server';
import { getUserFromCookie } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// PATCH: Actualizar un usuario
export async function PATCH(request, { params }) {
  const user = await getUserFromCookie();
  if (!user || user.rol !== 'administrador') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { id } = params;
    const { nombre, email, rol, password } = await request.json();

    if (!nombre || !email || !rol) {
        return NextResponse.json({ error: 'Nombre, email y rol son requeridos' }, { status: 400 });
    }
    
    if (password) {
        // Si se proporciona una nueva contraseña, la hasheamos y actualizamos
        const hashedPassword = await bcrypt.hash(password, 10);
        db.prepare(
            'UPDATE usuarios SET nombre = ?, email = ?, rol = ?, password = ? WHERE id = ?'
        ).run(nombre, email, rol, hashedPassword, id);
    } else {
        // Si no, actualizamos solo los otros campos
        db.prepare(
            'UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?'
        ).run(nombre, email, rol, id);
    }

    const updatedUser = { id: Number(id), nombre, email, rol };
    return NextResponse.json(updatedUser);

  } catch (error) {
     if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return NextResponse.json({ error: 'El correo electrónico ya está en uso por otro usuario' }, { status: 409 });
    }
    console.error('Error al actualizar usuario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE: Eliminar un usuario
export async function DELETE(request, { params }) {
    const user = await getUserFromCookie();
    if (!user || user.rol !== 'administrador') {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    try {
        const { id } = params;

        // Evitar que el administrador se elimine a sí mismo
        if (Number(id) === user.id) {
            return NextResponse.json({ error: 'No puedes eliminar tu propia cuenta' }, { status: 400 });
        }

        const result = db.prepare('DELETE FROM usuarios WHERE id = ?').run(id);

        if (result.changes === 0) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Usuario eliminado con éxito' });

    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
