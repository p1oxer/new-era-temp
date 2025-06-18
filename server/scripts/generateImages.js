import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const TARGET_FORMATS = ["webp", "avif"];
const COMPRESSION_QUALITY = 80;
const DEFAULT_SIZES = [500, 900];

export async function generateImageVersions(
    filePath,
    { sizes = DEFAULT_SIZES, quality = COMPRESSION_QUALITY, overwrite = false } = {}
) {
    const dir = path.dirname(filePath);
    const baseName = path.basename(filePath, path.extname(filePath));

    try {
        // 1. Загружаем и сразу сжимаем исходное изображение (в памяти)
        const compressedImage = sharp(filePath)
            .withMetadata() // сохраняем метаданные
            .jpeg({ quality: quality, mozjpeg: true }); // сжатие для JPEG

        const compressedBuffer = await compressedImage.toBuffer();

        // 2. Создаем версии в разных форматах и размерах
        for (const size of sizes) {
            for (const format of TARGET_FORMATS) {
                const outputPath = path.join(dir, `${baseName}-${size}.${format}`);

                if (!overwrite && (await fileExists(outputPath))) continue;

                const pipeline = sharp(compressedBuffer);

                if (size !== "original") {
                    pipeline.resize(size);
                }

                if (format === "webp") {
                    pipeline.webp({ quality });
                } else if (format === "avif") {
                    pipeline.avif({ quality });
                }

                await pipeline.toFile(outputPath);
                console.log(`Создано: ${outputPath}`);
            }
        }

        return { success: true };
    } catch (err) {
        console.error(`Ошибка при обработке ${filePath}:`, err);
        return { success: false, error: err };
    }
}

async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}
