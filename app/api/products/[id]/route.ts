import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const product = await getProductById(parseInt(id));
    
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
    
    const success = await updateProduct(parseInt(id), {
      name: body.name,
      origin: body.origin,
      image: body.image,
      video: body.video,
      price: body.price,
      pricing: typeof body.pricing === 'string' ? body.pricing : JSON.stringify(body.pricing || []),
      quantity: body.quantity,
      category: body.category,
      tag: body.tag,
      tagColor: body.tagColor,
      country: body.country,
      countryFlag: body.countryFlag,
      description: body.description,
      available: body.available
    });
    
    if (!success) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Récupérer le produit mis à jour
    const updatedProduct = await getProductById(parseInt(id));
    return NextResponse.json(updatedProduct);
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
    const success = await deleteProduct(parseInt(id));
    
    if (!success) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}