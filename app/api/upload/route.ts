import { NextRequest, NextResponse } from 'next/server';
import r2Client from '@/lib/cloudflare-r2';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const resourceType = formData.get('resource_type') as string || 'image';

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Vérifier la taille selon le type
    const maxSize = resourceType === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024; // 50MB pour vidéo, 10MB pour image
    if (file.size > maxSize) {
      const maxSizeMB = resourceType === 'video' ? '50MB' : '10MB';
      return NextResponse.json({ error: `Fichier trop volumineux (max ${maxSizeMB})` }, { status: 400 });
    }

    // Vérifier le type de fichier
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const allowedVideoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'];
    const allowedTypes = resourceType === 'video' ? allowedVideoTypes : allowedImageTypes;
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Type de fichier non supporté' }, { status: 400 });
    }

    // Upload vers R2 selon le type
    let uploadedUrl: string;
    
    if (resourceType === 'video') {
      uploadedUrl = await r2Client.uploadVideo(file);
    } else {
      uploadedUrl = await r2Client.uploadImage(file);
    }

    return NextResponse.json({ 
      url: uploadedUrl,
      public_id: uploadedUrl.split('/').pop()?.split('.')[0] || 'unknown'
    });

  } catch (error) {
    console.error('Erreur upload R2:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload vers R2' },
      { status: 500 }
    );
  }
}