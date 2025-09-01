import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/mongodb';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Creating product:', body);
    
    const productId = await createProduct({
      name: body.name,
      origin: body.origin || '',
      image: body.image || '',
      video: body.video || '',
      price: body.price || 0,
      pricing: JSON.stringify(body.pricing || []),
      quantity: body.quantity || 0,
      category: body.category || 'weed',
      tag: body.tag || '',
      tagColor: body.tagColor || 'green',
      country: body.country || 'FR',
      countryFlag: body.countryFlag || '🇫🇷',
      description: body.description || '',
      available: body.available !== false
    });
    
    return NextResponse.json({ id: productId, ...body }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}