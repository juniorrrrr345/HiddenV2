import { NextRequest, NextResponse } from 'next/server';
import { executeSqlOnD1 } from '@/lib/cloudflare-d1';
import bcrypt from 'bcryptjs';

// This route is for initial setup only - creates admin in D1
export async function POST(request: NextRequest) {
  try {
    const { username, password, setupKey } = await request.json();

    // Security check - require a setup key from environment
    const SETUP_KEY = process.env.ADMIN_SETUP_KEY || 'default-setup-key';
    
    if (setupKey !== SETUP_KEY) {
      return NextResponse.json(
        { error: 'Invalid setup key' },
        { status: 403 }
      );
    }

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Create admin table if not exists
    await executeSqlOnD1(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if admin already exists
    const existingAdmin = await executeSqlOnD1('SELECT * FROM admins WHERE username = ?', [username]);
    
    if (existingAdmin.result?.[0]?.results?.length > 0) {
      return NextResponse.json(
        { error: 'Admin already exists' },
        { status: 400 }
      );
    }

    // Hash password and create admin
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await executeSqlOnD1(
      'INSERT INTO admins (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    return NextResponse.json(
      { 
        success: true,
        message: 'Admin created successfully',
        username: username,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}