import sharp from "sharp";


/**
 * Processes an image buffer to ensure it is below a specified maximum size.
 *
 * @param {Buffer} buffer - The image buffer to be processed.
 * @returns {Promise<Buffer>} - A Promise that resolves to the processed image buffer.
 */
export const processImageBuffer = async (buffer) => {
    const MAX_SIZE = 100 * 1024; // 100 KB
    let quality = 80;
    let attempts = 0;
    const maxAttempts = 3;
    let outputBuffer;

    while (attempts < maxAttempts) {
        outputBuffer = await sharp(buffer)
            .resize({ width: 600 })
            .png({ quality, compressionLevel: 9 })
            .toBuffer();

        if (outputBuffer.length <= MAX_SIZE) {
            return outputBuffer.toString("base64");
        }
        quality -= 15; // reduce quality for next attempt
        attempts++;
    }

    throw new Error("Image is too large even after compression");
};

