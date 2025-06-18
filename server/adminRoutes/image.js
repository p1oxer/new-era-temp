import express from "express";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import mime from "mime-types";
import { fileURLToPath } from "url";
import { dirname, join, normalize } from "path";

const router = express.Router();

// Получаем __dirname в ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Путь к изображениям
const IMAGES_DIR = normalize(join(__dirname, "../../client/public/img"));

// Регулярное выражение для парсинга имени файла
const IMAGE_REGEX = /^(.+?)(?:-(\d+))?\.([a-zA-Z0-9]+)$/;

// ✅ Используем правильный wildcard маршрут
router.get("/*path", async (req, res) => {
    // Собираем путь после /api/image/
    const pathSegments = req.params.path || [];

    if (!Array.isArray(pathSegments) || pathSegments.length === 0) {
        return res.status(400).send("Image path not provided.");
    }

    const requestedPath = pathSegments.join("/");

    // Парсим имя файла
    const match = requestedPath.match(IMAGE_REGEX);

    if (!match) {
        return res.status(400).send("Invalid image name format.");
    }

    const [, baseName, size = "original", targetFormat] = match;

    // Убираем размер и расширение из имени
    const originalBaseName = requestedPath.replace(
        new RegExp(`-${size}\\.webp$|-${size}\\.avif$|\\.${targetFormat}$`),
        ""
    );

    // Пути к оригиналам
    const originalPathJPG = path.join(IMAGES_DIR, `${originalBaseName}.jpg`);
    const originalPathPNG = path.join(IMAGES_DIR, `${originalBaseName}.png`);

    let originalPath = null;

    if (fs.existsSync(originalPathJPG)) {
        originalPath = originalPathJPG;
    } else if (fs.existsSync(originalPathPNG)) {
        originalPath = originalPathPNG;
    }

    if (!originalPath) {
        return res.status(404).send("Original image not found.");
    }

    // Путь к кэшированному файлу
    const resizedFilename =
        size === "original" ? originalBaseName : `${originalBaseName}-${size}`;
    const resizedFilePath = path.join(IMAGES_DIR, `${resizedFilename}.${targetFormat}`);

    // Если файл уже существует — отдаем его
    if (fs.existsSync(resizedFilePath)) {
        const mimeType = mime.lookup(targetFormat) || "application/octet-stream";
        res.header("Content-Type", mimeType);
        return res.sendFile(resizedFilePath);
    }
    const fullPath = path.normalize(
        path.join(IMAGES_DIR, originalBaseName + path.extname(requestedPath))
    );

    if (!fullPath.startsWith(IMAGES_DIR)) {
        return res.status(403).send("Forbidden");
    }
    // Если не существует — создаём
    try {
        const pipeline = sharp(originalPath);

        if (size !== "original") {
            pipeline.resize(parseInt(size));
        }

        switch (targetFormat.toLowerCase()) {
            case "webp":
                pipeline.webp({ quality: 80 });
                break;
            case "avif":
                pipeline.avif({ quality: 80 });
                break;
            default:
                pipeline.jpeg({ quality: 80 });
        }

        await pipeline.toFile(resizedFilePath);

        const mimeType = mime.lookup(targetFormat) || "application/octet-stream";
        res.header("Content-Type", mimeType);
        res.sendFile(resizedFilePath);
    } catch (error) {
        console.error("Ошибка при обработке изображения:", error);
        res.status(500).send("Error processing image.");
    }
});

export default router;
