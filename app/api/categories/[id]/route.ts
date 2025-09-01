import { NextRequest, NextResponse } from 'next/server';
import { executeSqlOnD1 } from '@/lib/cloudflare-d1';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const result = await executeSqlOnD1('SELECT * FROM categories WHERE id = ?', [parseInt(id)]);
    const category = result.result?.[0]?.results?.[0];
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    const result = await executeSqlOnD1(
      'UPDATE categories SET name = ?, icon = ?, color = ? WHERE id = ?',
      [body.name, body.icon, body.color, parseInt(id)]
    );
    
    if (!result.success) {
      return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
    
    // Récupérer la catégorie mise à jour
    const updatedResult = await executeSqlOnD1('SELECT * FROM categories WHERE id = ?', [parseInt(id)]);
    const category = updatedResult.result?.[0]?.results?.[0];
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    const result = await executeSqlOnD1('DELETE FROM categories WHERE id = ?', [parseInt(id)]);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
    
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}