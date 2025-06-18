import express from "express";
import db from "../db.js";
import fs from "fs/promises";
import path from "path";
import multer from "multer";
import { generateImageVersions } from "../scripts/generateImages.js";
const router = express.Router();

const CLIENT_PUBLIC_DIR = path.join(process.cwd(), "..", "uploads");
const IMG_DIR = "img/cert";
const FULL_IMG_DIR = path.join(CLIENT_PUBLIC_DIR, IMG_DIR);

// Настройка Multer для сохранения в клиентскую папку
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        await fs.mkdir(FULL_IMG_DIR, { recursive: true });
        cb(null, FULL_IMG_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 9)}${ext}`;
        cb(null, filename);
    },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.get("/", async (req, res) => {
    const { _sort = "id", _order = "ASC", _start = 0, _end = 5 } = req.query;

    try {
        const startInt = parseInt(_start);
        const endInt = parseInt(_end);
        const limit = endInt - startInt;
        const offset = startInt;

        // Получаем данные
        const [rows] = await db.query(
            `SELECT * FROM certificates ORDER BY ?? ${_order.toUpperCase()} LIMIT ? OFFSET ?`,
            [_sort, limit, offset]
        );

        // Общее количество записей
        const [[{ total }]] = await db.query(
            "SELECT COUNT(*) AS total FROM certificates"
        );

        // Устанавливаем Content-Range
        res.header("Content-Range", `certificates ${startInt}-${endInt}/${total}`);

        // Отправляем данные
        return res.json(rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

router.post("/upload-image", upload.single("image"), async (req, res) => {
    const { certificateId, currentPaths } = req.body; // Получаем текущие пути

    if (!certificateId) {
        return res.status(400).json({ error: "Missing certificateId" });
    }

    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        await generateImageVersions(req.file.path, {
            sizes: [560],
            quality: 90,
        });
        const relativePath = `/img/cert/${req.file.filename}`;

        let pathsArray = currentPaths ? JSON.parse(currentPaths) : [];

        if (!Array.isArray(pathsArray)) {
            pathsArray = [];
        }

        pathsArray.push(relativePath);

        // Обновляем запись в БД
        await db.query("UPDATE certificates SET image_paths = ? WHERE id = ?", [
            JSON.stringify(pathsArray),
            certificateId,
        ]);

        res.json({
            success: true,
            image: { path: relativePath },
        });
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ error: "Failed to process image" });
    }
});

router.put("/:id", async (req, res) => {
    const { text, image_paths } = req.body;

    try {
        // Получаем текущие данные
        const [[currentData]] = await db.query(
            "SELECT * FROM certificates WHERE id = ?",
            [req.params.id]
        );

        if (!currentData) {
            return res.status(404).json({ error: "Сертификат не найден" });
        }

        const images = image_paths ? image_paths : JSON.parse(currentData.image_paths || "[]");

        // Обновляем запись в БД
        await db.query(
            `UPDATE certificates SET 
                text = ?, 
                image_paths = ?
             WHERE id = ?`,
            [text || currentData.text, JSON.stringify(images), req.params.id]
        );

        // Отправляем клиенту обновлённые данные
        res.json({
            id: req.params.id,
            text: text || currentData.text,
            image_paths: images,
        });
    } catch (err) {
        console.error("Ошибка обновления сертификата:", err);
        res.status(500).json({
            error: "Не удалось обновить сертификат",
            details: err.message,
        });
    }
});
// Получить одну запись
// GET /:id
router.get("/:id", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM certificates WHERE id = ?", [
            req.params.id,
        ]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Запись не найдена" });
        }
        const certificate = rows[0];

        // Парсим image_paths, если это строка
        if (typeof certificate.image_paths === "string") {
            try {
                const parsed = JSON.parse(certificate.image_paths);
                // Если это массив строк, преобразуем в массив объектов
                if (Array.isArray(parsed)) {
                    certificate.image_paths = parsed.map((path) => ({ path }));
                } else {
                    certificate.image_paths = [];
                }
            } catch {
                certificate.image_paths = [];
            }
        }

        res.json(certificate);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

router.post("/delete-image/:id", async (req, res) => {
    const { path: imagePath } = req.body;
    const cleanImagePath = imagePath?.trim();

    try {
        // 1. Получаем текущие пути из БД
        const [[certificate]] = await db.query(
            "SELECT image_paths FROM certificates WHERE id = ?",
            [req.params.id]
        );

        if (!certificate) {
            return res.status(404).json({ error: "Сертификат не найден" });
        }

        // 2. Парсим JSON из БД
        let pathsArray = [];
        try {
            // Проверяем, если это уже массив (для обратной совместимости)
            pathsArray = Array.isArray(certificate.image_paths)
                ? certificate.image_paths
                : JSON.parse(certificate.image_paths || "[]");
        } catch (e) {
            console.error("Ошибка парсинга image_paths:", e);
            pathsArray = [];
        }

        console.log("Текущие пути:", pathsArray);
        console.log("Удаляемый путь:", cleanImagePath);

        // 3. Фильтруем массив (удаляем точное совпадение)
        const updatedPaths = pathsArray.filter((p) => p !== cleanImagePath);

        console.log("Обновленные пути:", updatedPaths);

        // 4. Сохраняем в БД
        await db.query("UPDATE certificates SET image_paths = ? WHERE id = ?", [
            JSON.stringify(updatedPaths),
            req.params.id,
        ]);

        // 5. Удаляем файлы с диска
        if (cleanImagePath) {
            const filename = cleanImagePath.split("/").pop();
            const fullPath = path.join(FULL_IMG_DIR, filename);

            // Генерируем все возможные варианты файлов
            const filesToDelete = [
                fullPath,
                fullPath.replace(/\.(\w+)$/, "-560.avif"),
                fullPath.replace(/\.(\w+)$/, "-560.webp"),
            ];

            for (const file of filesToDelete) {
                try {
                    await fs.unlink(file).catch(() => {});
                    console.log("Удален файл:", file);
                } catch (err) {
                    console.warn("Не удалось удалить файл:", file, err.message);
                }
            }
        }

        res.json({
            success: true,
            remainingImages: updatedPaths,
        });
    } catch (err) {
        console.error("Ошибка при удалении изображения:", err);
        res.status(500).json({
            error: "Ошибка сервера",
            details: err.message,
        });
    }
});
export default router;
