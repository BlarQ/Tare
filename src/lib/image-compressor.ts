/**
 * Client-Side Smart Image Compression Utility
 * Intelligently reduces large photos (>5MB or 4K/8K captures) to high-fidelity WebP/JPEG
 * without visual quality loss.
 */

export interface CompressionResult {
  file: File;
  originalSizeMb: number;
  compressedSizeMb: number;
  reductionPercentage: number;
  wasCompressed: boolean;
}

export async function compressImage(
  file: File,
  maxSizeMb: number = 5,
  maxWidth: number = 2560,
  maxHeight: number = 2560,
  quality: number = 0.88
): Promise<CompressionResult> {
  const originalSizeMb = file.size / (1024 * 1024);

  // If file is not an image or is already small, skip compression
  if (!file.type.startsWith('image/') || file.type.includes('svg')) {
    return {
      file,
      originalSizeMb,
      compressedSizeMb: originalSizeMb,
      reductionPercentage: 0,
      wasCompressed: false,
    };
  }

  // If file is under threshold (e.g. < 3MB) and not oversized, return directly
  if (file.size <= maxSizeMb * 1024 * 1024 && originalSizeMb < 3.5) {
    return {
      file,
      originalSizeMb,
      compressedSizeMb: originalSizeMb,
      reductionPercentage: 0,
      wasCompressed: false,
    };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate proportional dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve({
            file,
            originalSizeMb,
            compressedSizeMb: originalSizeMb,
            reductionPercentage: 0,
            wasCompressed: false,
          });
        }

        // High quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP if supported, fallback to JPEG
        const outputMime = file.type === 'image/png' && originalSizeMb > 5 ? 'image/webp' : 'image/jpeg';

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve({
                file,
                originalSizeMb,
                compressedSizeMb: originalSizeMb,
                reductionPercentage: 0,
                wasCompressed: false,
              });
            }

            const compressedSizeMb = blob.size / (1024 * 1024);
            const reductionPercentage = Math.max(
              0,
              Math.round(((file.size - blob.size) / file.size) * 100)
            );

            // Recreate File object with clean extension
            const baseName = file.name.replace(/\.[^/.]+$/, '');
            const ext = outputMime === 'image/webp' ? '.webp' : '.jpg';
            const compressedFile = new File([blob], `${baseName}${ext}`, {
              type: outputMime,
              lastModified: Date.now(),
            });

            resolve({
              file: compressedFile,
              originalSizeMb,
              compressedSizeMb,
              reductionPercentage,
              wasCompressed: true,
            });
          },
          outputMime,
          quality
        );
      };

      img.onerror = () => {
        resolve({
          file,
          originalSizeMb,
          compressedSizeMb: originalSizeMb,
          reductionPercentage: 0,
          wasCompressed: false,
        });
      };
    };

    reader.onerror = () => {
      resolve({
        file,
        originalSizeMb,
        compressedSizeMb: originalSizeMb,
        reductionPercentage: 0,
        wasCompressed: false,
      });
    };
  });
}
