import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;
const cookieName = 'auth_token';

export function verifyToken(token) {
  try {
    // Esta función no cambia, sigue siendo síncrona.
    return jwt.verify(token, secret);
  } catch (e) {
    return null;
  }
}

export async function getUserFromCookie() {
  // La función cookies() de next/headers es la forma correcta de acceder
  // a las cookies en el servidor.
  const cookieStore = cookies();
  const tokenCookie = cookieStore.get(cookieName);

  if (!tokenCookie) {
    return null;
  }

  try {
    const decoded = verifyToken(tokenCookie.value);
    return decoded;
  } catch (error) {
    return null;
  }
}
