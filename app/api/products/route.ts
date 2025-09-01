import { NextRequest, NextResponse } from 'next/server';
import { executeSqlOnD1 } from '@/lib/cloudflare-d1';

export async function GET() {
  try {
    const result = await executeSqlOnD1('SELECT * FROM products WHERE available = 1 ORDER BY createdAt DESC');
    const products = result.result?.[0]?.results || [];
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
    
    const result = await executeSqlOnD1(
      'INSERT INTO products (name, origin, image, video, price, pricing, quantity, category, tag, tagColor, country, countryFlag, description, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        body.name || 'Nouveau produit',
        body.origin || '',
        body.image || '',
        body.video || '',
        Number(body.price || 0),
        JSON.stringify(body.pricing || []),
        Number(body.quantity || 0),
        body.category || 'weed',
        body.tag || '',
        body.tagColor || 'green',
        body.country || 'FR',
        body.countryFlag || '🇫🇷',
        body.description || '',
        body.available !== false ? 1 : 0
      ]
    );
    
    if (result.success) {
      const newId = result.result?.[0]?.meta?.last_row_id;
      return NextResponse.json({ id: newId, ...body }, { status: 201 });
    }
    
    throw new Error('Failed to create product in D1');
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}