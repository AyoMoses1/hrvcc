import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  secure_url: string;
  public_id: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

/**
 * Upload file to Cloudinary
 */
export async function uploadToCloudinary(
  file: File | Buffer | ArrayBuffer,
  folder: string = 'membership',
  options?: {
    resource_type?: 'image' | 'video' | 'raw' | 'auto';
    transformation?: any[];
    public_id?: string;
  }
): Promise<UploadResult> {
  return new Promise(async (resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: options?.resource_type || 'auto',
      transformation: options?.transformation,
      public_id: options?.public_id,
    };

    try {
      let buffer: Buffer;

      // Convert to buffer
      if (file instanceof File) {
        const arrayBuffer = await file.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
      } else if (file instanceof ArrayBuffer) {
        buffer = Buffer.from(file);
      } else {
        buffer = file;
      }

      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
          });
        } else {
          reject(new Error('Upload failed: No result returned'));
        }
      });

      uploadStream.end(buffer);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Delete file from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

export { cloudinary };
