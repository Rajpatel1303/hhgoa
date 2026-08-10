import heic2any from 'heic2any';

export interface ImageProcessResult {
  dataUrl: string;
  width: number;
  height: number;
}

/**
 * Reads a File object (JPG, PNG, HEIC, etc.) and converts it to a clean web-friendly data URL.
 * Automatically handles HEIC/HEIF files from iPhones using heic2any.
 */
export async function processUploadedFile(file: File): Promise<ImageProcessResult> {
  let fileToProcess: File | Blob = file;

  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  const isHeic = 
    fileName.endsWith('.heic') || 
    fileName.endsWith('.heif') || 
    fileType.includes('heic') || 
    fileType.includes('heif');

  if (isHeic) {
    try {
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.92
      });

      fileToProcess = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
    } catch (err) {
      console.warn('HEIC conversion failed or skipped, trying direct reader:', err);
    }
  }

  // Convert blob/file to DataURL
  const dataUrl = await fileToDataUrl(fileToProcess);

  // Load image to measure dimensions and optionally downsample giant camera photos (e.g., 4000x3000 -> 2000x1500)
  const img = await loadImage(dataUrl);

  const maxDimension = 2400;
  if (img.width > maxDimension || img.height > maxDimension) {
    const resizedDataUrl = resizeImageCanvas(img, maxDimension);
    const resizedImg = await loadImage(resizedDataUrl);
    return {
      dataUrl: resizedDataUrl,
      width: resizedImg.width,
      height: resizedImg.height,
    };
  }

  return {
    dataUrl,
    width: img.width,
    height: img.height,
  };
}

function fileToDataUrl(fileOrBlob: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(new Error('Failed to read image file. ' + e));
    reader.readAsDataURL(fileOrBlob);
  });
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image element.'));
    img.src = src;
  });
}

function resizeImageCanvas(img: HTMLImageElement, maxDimension: number): string {
  let { width, height } = img;
  if (width > height) {
    if (width > maxDimension) {
      height = Math.round((height * maxDimension) / width);
      width = maxDimension;
    }
  } else {
    if (height > maxDimension) {
      width = Math.round((width * maxDimension) / height);
      height = maxDimension;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, width, height);
  }
  return canvas.toDataURL('image/jpeg', 0.92);
}
