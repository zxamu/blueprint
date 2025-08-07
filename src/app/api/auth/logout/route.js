import { serialize } from 'cookie';
const cookieName = 'auth_token';

export async function POST() {
  const cookie = serialize(cookieName, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: -1, // Expira la cookie inmediatamente
    path: '/',
  });

  return new Response(JSON.stringify({ message: 'Logout exitoso' }), {
    status: 200,
    headers: { 'Set-Cookie': cookie },
  });
}