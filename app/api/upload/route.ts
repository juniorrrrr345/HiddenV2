import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload vers Cloudinary
    const uploadOptions: any = {
      folder: resourceType === 'video' ? 'hidden-spingfield-videos' : 'hidden-spingfield-products',
      resource_type: resourceType === 'video' ? 'video' : 'image',
    };

    // Transformations spécifiques selon le type
    if (resourceType === 'video') {
      uploadOptions.transformation = [
        { quality: 'auto:good' },
        { format: 'mp4' }
      ];
    } else {
      uploadOptions.transformation = [
        { width: 1000, height: 1000, crop: 'fill', gravity: 'center' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ];
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({ 
      url: (result as any).secure_url,
      public_id: (result as any).public_id 
    });

  } catch (error) {
    console.error('Erreur upload Cloudinary:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload' },
      { status: 500 }
    );
  }
}