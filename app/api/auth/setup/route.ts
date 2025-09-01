import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';

// This route is for initial setup only
// It should be disabled in production after creating the first admin
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

    await dbConnect();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin already exists' },
        { status: 400 }
      );
    }

    // Create new admin
    const admin = new Admin({
      username,
      password,
    });

    await admin.save();

    return NextResponse.json(
      { 
        success: true,
        message: 'Admin created successfully',
        username: admin.username,
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