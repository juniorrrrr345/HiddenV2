import { NextRequest, NextResponse } from 'next/server';
import { executeSqlOnD1 } from '@/lib/cloudflare-d1';

export async function GET() {
  try {
    const result = await executeSqlOnD1('SELECT * FROM categories ORDER BY name');
    const categories = result.result?.[0]?.results || [];
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await executeSqlOnD1(
      'INSERT INTO categories (name, icon, color) VALUES (?, ?, ?)',
      [body.name || 'Nouvelle catégorie', body.icon || '📦', body.color || '#22C55E']
    );
    
    if (result.success) {
      const newId = result.result?.[0]?.meta?.last_row_id;
      const newCategory = {
        id: newId,
        name: body.name,
        icon: body.icon || '📦',
        color: body.color || '#22C55E'
      };
      return NextResponse.json(newCategory, { status: 201 });
    }
    
    throw new Error('Failed to create category');
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}