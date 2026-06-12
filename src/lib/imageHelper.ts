/**
 * Helper to compress a base64 image data URL using a Canvas element.
 * Restricts max width or height to 1200px and reduces JPEG quality to 0.75.
 */
export function compressImage(
  base64Str: string,
  maxWidth = 800,
  maxHeight = 800
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Check if resizing is needed
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(base64Str); // Fallback to original
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      
      // Get compressed JPEG format base64
      const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.70);
      resolve(compressedDataUrl);
    };
    img.onerror = (err) => {
      reject(err);
    };
  });
}

/**
 * Handle general file pick and output the metadata & base64 encoding.
 */
export function processFile(file: File): Promise<{ base64: string; name: string; size: number; isImage: boolean }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const isImage = file.type.startsWith("image/");
      
      if (isImage) {
        try {
          const compressed = await compressImage(base64);
          resolve({
            base64: compressed,
            name: file.name,
            size: file.size,
            isImage: true
          });
        } catch {
          resolve({
            base64,
            name: file.name,
            size: file.size,
            isImage: true
          });
        }
      } else {
        resolve({
          base64,
          name: file.name,
          size: file.size,
          isImage: false
        });
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
