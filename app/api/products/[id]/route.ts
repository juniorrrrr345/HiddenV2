import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { products as staticProducts } from '@/lib/products';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    // Essayer de récupérer depuis MongoDB
    try {
      await dbConnect();
      const product = await Product.findById(id);
      if (product) {
        return NextResponse.json(product);
      }
    } catch (mongoError) {
      console.log('MongoDB error, trying static products');
    }
    
    // Si pas trouvé dans MongoDB, chercher dans les produits statiques
    const staticProduct = staticProducts.find(p => p.id === id);
    if (staticProduct) {
      return NextResponse.json({
        ...staticProduct,
        _id: staticProduct.id,
        quantity: 50,
        available: true
      });
    }
    
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
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
    
    // Essayer de mettre à jour dans MongoDB
    try {
      await dbConnect();
      
      // Vérifier si le produit existe dans MongoDB
      let product = await Product.findById(id);
      
      if (!product) {
        // Si c'est un produit statique, le créer dans MongoDB
        const staticProduct = staticProducts.find(p => p.id === id);
        if (staticProduct) {
          console.log('Creating product from static data');
          // Créer le produit dans MongoDB avec les nouvelles données
          product = await Product.create({
            ...staticProduct,
            ...body,
            _id: undefined // Laisser MongoDB générer un nouvel ID
          });
          return NextResponse.json(product);
        }
      } else {
        // Mettre à jour le produit existant
        product = await Product.findByIdAndUpdate(
          id,
          body,
          { new: true, runValidators: true }
        );
      }
      
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      
      return NextResponse.json(product);
    } catch (mongoError: any) {
      console.error('MongoDB error:', mongoError);
      
      // Si MongoDB n'est pas disponible, sauvegarder localement
      // Pour l'instant, on retourne juste une erreur
      return NextResponse.json(
        { error: 'Database error: ' + mongoError.message },
        { status: 500 }
      );
    }
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
    await dbConnect();
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}