// R2 Cloudflare Storage pour HIDDEN SPINGFIELD
import r2Client from './cloudflare-r2';

export const uploadImage = async (file: File | string) => {
  try {
    if (typeof file === 'string') {
      throw new Error('String upload not supported with R2, use File object');
    }
    
    const result = await r2Client.uploadImage(file, 'images');
    return result;
  } catch (error) {
    console.error('Error uploading to R2:', error);
    throw error;
  }
};

export const uploadVideo = async (file: File) => {
  try {
    const result = await r2Client.uploadVideo(file, 'videos');
    return result;
  } catch (error) {
    console.error('Error uploading video to R2:', error);
    throw error;
  }
};

// Compatibility export
export default {
  uploadImage,
  uploadVideo
};