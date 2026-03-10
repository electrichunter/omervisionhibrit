/**
 * Asenkron olarak resmi tarayıcı belleğine yükler
 */
export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        // CORS sorunlarını önlemek için anonim olarak başlatıyoruz
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

/**
 * Verilen görseli kırpma (crop) işlemi sonrası File / Blob formatına çevirir
 */
export default async function getCroppedImg(
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number },
    fileName: string = 'avatar-cropped.jpg'
): Promise<File | null> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return null;
    }

    // Kırpılacak alanın boyutlarını canvas'a veriyoruz
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Resmin kesilmiş halini canvas'a çiziyoruz
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    // Canvas datasını Blob (Dosya) formatına çeviriyoruz
    return new Promise((resolve, reject) => {
        canvas.toBlob((file) => {
            if (file) {
                // Return a Javascript File object so we can send it in FormData
                const newFile = new File([file], fileName, { type: 'image/jpeg' });
                resolve(newFile);
            } else {
                reject(new Error('Canvas is empty'));
            }
        }, 'image/jpeg');
    });
}
