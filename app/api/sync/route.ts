import { NextRequest, NextResponse } from 'next/server';
import { cacheHelpers } from '@/lib/cache';

export async function POST(request: NextRequest) {
  try {
    const { type, action, data } = await request.json();

    // Validate request
    if (!type || !action) {
      return NextResponse.json(
        { error: 'Type et action requis' },
        { status: 400 }
      );
    }

    // Handle different sync operations
    switch (type) {
      case 'products':
        handleProductSync(action, data);
        break;
      
      case 'categories':
        handleCategorySync(action, data);
        break;
      
      case 'settings':
        handleSettingsSync(action, data);
        break;
      
      default:
        return NextResponse.json(
          { error: 'Type de synchronisation non supporté' },
          { status: 400 }
        );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Cache synchronisé avec succès',
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Erreur de synchronisation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la synchronisation' },
      { status: 500 }
    );
  }
}

function handleProductSync(action: string, data: any) {
  switch (action) {
    case 'create':
    case 'update':
      // Invalider le cache des produits et du produit spécifique
      cacheHelpers.invalidateProducts();
      if (data?.id) {
        cacheHelpers.setProduct(data.id, data);
      }
      break;
    
    case 'delete':
      // Invalider tout le cache des produits
      cacheHelpers.invalidateProducts();
      break;
    
    case 'refresh':
      // Forcer le rechargement de tous les produits
      cacheHelpers.invalidateProducts();
      break;
  }
}

function handleCategorySync(action: string, data: any) {
  switch (action) {
    case 'create':
    case 'update':
      // Invalider le cache des catégories
      cacheHelpers.invalidateCategories();
      // Aussi invalider les produits car ils dépendent des catégories
      cacheHelpers.invalidateProducts();
      if (data?.id) {
        cacheHelpers.setCategory(data.id, data);
      }
      break;
    
    case 'delete':
      // Invalider les caches des catégories et produits
      cacheHelpers.invalidateCategories();
      cacheHelpers.invalidateProducts();
      break;
    
    case 'refresh':
      // Forcer le rechargement
      cacheHelpers.invalidateCategories();
      cacheHelpers.invalidateProducts();
      break;
  }
}

function handleSettingsSync(action: string, data: any) {
  switch (action) {
    case 'update':
      cacheHelpers.invalidateSettings();
      if (data) {
        cacheHelpers.setSettings(data);
      }
      break;
    
    case 'refresh':
      cacheHelpers.invalidateSettings();
      break;
  }
}

// GET endpoint for cache stats
export async function GET() {
  try {
    // Return cache statistics
    return NextResponse.json({
      message: 'Cache API actif',
      timestamp: Date.now(),
      endpoints: {
        POST: 'Synchroniser le cache',
        GET: 'Statistiques du cache'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des stats' },
      { status: 500 }
    );
  }
}