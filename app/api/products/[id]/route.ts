import { NextRequest, NextResponse } from 'next/server';
import { executeSqlOnD1 } from '@/lib/cloudflare-d1';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const result = await executeSqlOnD1('SELECT * FROM products WHERE id = ?', [parseInt(id)]);
    const product = result.result?.[0]?.results?.[0];
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    console.log('Updating product:', id, body);
    
    // Construire la requête UPDATE dynamiquement
    const fields = [];
    const values = [];
    
    if (body.name !== undefined) { fields.push('name = ?'); values.push(body.name); }
    if (body.origin !== undefined) { fields.push('origin = ?'); values.push(body.origin); }
    if (body.image !== undefined) { fields.push('image = ?'); values.push(body.image); }
    if (body.video !== undefined) { fields.push('video = ?'); values.push(body.video); }
    if (body.price !== undefined) { fields.push('price = ?'); values.push(Number(body.price)); }
    if (body.pricing !== undefined) { fields.push('pricing = ?'); values.push(typeof body.pricing === 'string' ? body.pricing : JSON.stringify(body.pricing)); }
    if (body.quantity !== undefined) { fields.push('quantity = ?'); values.push(Number(body.quantity)); }
    if (body.category !== undefined) { fields.push('category = ?'); values.push(body.category); }
    if (body.tag !== undefined) { fields.push('tag = ?'); values.push(body.tag); }
    if (body.tagColor !== undefined) { fields.push('tagColor = ?'); values.push(body.tagColor); }
    if (body.country !== undefined) { fields.push('country = ?'); values.push(body.country); }
    if (body.countryFlag !== undefined) { fields.push('countryFlag = ?'); values.push(body.countryFlag); }
    if (body.description !== undefined) { fields.push('description = ?'); values.push(body.description); }
    if (body.available !== undefined) { fields.push('available = ?'); values.push(body.available ? 1 : 0); }
    
    if (fields.length > 0) {
      values.push(parseInt(id));
      
      const result = await executeSqlOnD1(
        `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
      
      if (!result.success) {
        throw new Error('Failed to update product in D1');
      }
    }
    
    // Récupérer le produit mis à jour
    const updatedResult = await executeSqlOnD1('SELECT * FROM products WHERE id = ?', [parseInt(id)]);
    const product = updatedResult.result?.[0]?.results?.[0];
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    const result = await executeSqlOnD1('DELETE FROM products WHERE id = ?', [parseInt(id)]);
    
    if (!result.success || result.result?.[0]?.meta?.changes === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}