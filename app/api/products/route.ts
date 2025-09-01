import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { products as staticProducts } from '@/lib/products';

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    // Si pas de produits dans MongoDB, utiliser les produits statiques
    if (products.length === 0) {
      console.log('No products in MongoDB, using static products');
      return NextResponse.json(staticProducts.map(p => ({
        ...p,
        _id: p.id,
        quantity: 50,
        available: true
      })));
    }
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    // En cas d'erreur MongoDB, retourner les produits statiques
    return NextResponse.json(staticProducts.map(p => ({
      ...p,
      _id: p.id,
      quantity: 50,
      available: true
    })));
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    console.log('Creating product:', body);
    
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}