import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Identifiants depuis les variables d'environnement Vercel
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    // Vérifier que les variables sont configurées
    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      console.error('Variables ADMIN_USERNAME et ADMIN_PASSWORD non configurées sur Vercel');
      return NextResponse.json(
        { error: 'Configuration manquante' },
        { status: 500 }
      );
    }

    // Vérifier les identifiants
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      userId: '1',
      username: ADMIN_USERNAME,
    });

    // Create response with token
    const response = NextResponse.json(
      { 
        success: true,
        token,
        user: {
          id: '1',
          username: ADMIN_USERNAME,
        }
      },
      { status: 200 }
    );

    // Set cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}