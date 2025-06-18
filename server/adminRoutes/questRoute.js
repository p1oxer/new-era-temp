// questRoute.js
import express from "express";
import db from "../db.js";
import fs from "fs/promises";
import path from "path";
import multer from "multer";
import { generateImageVersions } from "../scripts/generateImages.js";
import { translit } from "../../client/src/functions/translit.js";
import {
    updateLocaleWithQuest,
    removeLocaleQuest,
} from "../../client/src/functions/localization.js";

const router = express.Router();

// Путь к клиентской директории public
const CLIENT_PUBLIC_DIR = path.join(process.cwd(), "..", "uploads");

const IMG_QUEST_DIR = "img/quests";
const FULL_IMG_QUEST_DIR = path.join(CLIENT_PUBLIC_DIR, IMG_QUEST_DIR);

const VIDEO_QUEST_DIR = "video/quests";
const FULL_VIDEO_QUEST_DIR = path.join(CLIENT_PUBLIC_DIR, VIDEO_QUEST_DIR);

// Multer для изображений
const imageStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        await fs.mkdir(FULL_IMG_QUEST_DIR, { recursive: true });
        cb(null, FULL_IMG_QUEST_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 9)}${ext}`;
        cb(null, filename);
    },
});

const uploadImage = multer({
    storage: imageStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
});

// Multer для видео
const videoStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        await fs.mkdir(FULL_VIDEO_QUEST_DIR, { recursive: true });
        cb(null, FULL_VIDEO_QUEST_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 9)}${ext}`;
        cb(null, filename);
    },
});

const uploadVideo = multer({
    storage: videoStorage,
    limits: { fileSize: 100 * 1024 * 1024 },
}); // до 100 Мб

// === GET ALL QUESTS WITH PAGINATION ===
router.get("/", async (req, res) => {
    const { _sort = "id", _order = "ASC", _start = 0, _end = 5 } = req.query;

    try {
        const startInt = parseInt(_start);
        const endInt = parseInt(_end);
        const limit = endInt - startInt;
        const offset = startInt;

        const [rows] = await db.query(
            `SELECT * FROM quests ORDER BY ?? ${_order.toUpperCase()} LIMIT ? OFFSET ?`,
            [_sort, limit, offset]
        );

        const [[{ total }]] = await db.query("SELECT COUNT(*) AS total FROM quests");

        res.header("Content-Range", `quests ${startInt}-${endInt}/${total}`);
        return res.json(rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

// === GET ONE QUEST BY ID ===
router.get("/:id", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM quests WHERE id = ?", [
            req.params.id,
        ]);
        if (rows.length === 0) return res.status(404).json({ error: "Квест не найден" });

        const quest = rows[0];

        // Парсим img как массив
        if (typeof quest.img === "string") {
            try {
                const parsed = JSON.parse(quest.img);
                quest.img = Array.isArray(parsed) ? parsed : [];
            } catch {
                quest.img = [];
            }
        }

        res.json(quest);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// === UPDATE QUEST ===
router.put("/:id", async (req, res) => {
    const {
        title,
        description,
        people,
        age,
        difficulty,
        time,
        address,
        small_description,
        category,
        img,
    } = req.body;

    try {
        const [[currentData]] = await db.query("SELECT * FROM quests WHERE id = ?", [
            req.params.id,
        ]);
        if (!currentData) return res.status(404).json({ error: "Квест не найден" });

        let newSlug = currentData.slug;
        let oldSlug = currentData.slug;

        // Если заголовок изменился — генерируем новый slug
        if (title && title !== currentData.title) {
            newSlug = translit(title);

            // Удаляем старый slug из файла локализации
            await removeLocaleQuest(oldSlug);

            // Добавляем новый slug в файл локализации
            await updateLocaleWithQuest(newSlug, title);
        }

        const images = img ? img : JSON.parse(currentData.img || "[]");

        await db.query(
            `UPDATE quests SET 
                slug = ?, 
                title = ?, 
                description = ?, 
                people = ?, 
                age = ?, 
                difficulty = ?, 
                time = ?, 
                address = ?, 
                small_description = ?, 
                category = ?,
                img = ?
             WHERE id = ?`,
            [
                newSlug,
                title || currentData.title,
                description || currentData.description,
                people || currentData.people,
                age || currentData.age,
                difficulty || currentData.difficulty,
                time || currentData.time,
                address || currentData.address,
                small_description || currentData.small_description,
                category || currentData.category,
                JSON.stringify(images),
                req.params.id,
            ]
        );

        res.json({
            id: req.params.id,
            slug: newSlug,
            title: title || currentData.title,
            description: description || currentData.description,
            people: people || currentData.people,
            age: age || currentData.age,
            difficulty: difficulty || currentData.difficulty,
            time: time || currentData.time,
            address: address || currentData.address,
            small_description: small_description || currentData.small_description,
            category: category || currentData.category,
            img: images,
        });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({
            error: "Не удалось обновить квест",
            details: err.message,
        });
    }
});

// === UPLOAD IMAGE ===
router.post("/upload-image", uploadImage.single("image"), async (req, res) => {
    const { questId, currentPaths } = req.body;

    if (!questId) return res.status(400).json({ error: "Missing questId" });

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    try {
        await generateImageVersions(req.file.path, {
            sizes: [540],
            quality: 90,
        });

        const relativePath = `/${IMG_QUEST_DIR}/${req.file.filename}`;

        let pathsArray = currentPaths ? JSON.parse(currentPaths) : [];

        if (!Array.isArray(pathsArray)) pathsArray = [];

        pathsArray.push(relativePath);

        await db.query("UPDATE quests SET img = ? WHERE id = ?", [
            JSON.stringify(pathsArray),
            questId,
        ]);

        res.json({ success: true, image: { path: relativePath } });
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ error: "Failed to process image" });
    }
});

// === DELETE IMAGE ===
router.post("/delete-image/:id", async (req, res) => {
    const { path: imagePath } = req.body;
    const cleanImagePath = imagePath?.trim();

    try {
        const [[quest]] = await db.query("SELECT img FROM quests WHERE id = ?", [
            req.params.id,
        ]);

        if (!quest) return res.status(404).json({ error: "Квест не найден" });

        let pathsArray = [];
        try {
            pathsArray = Array.isArray(quest.img)
                ? quest.img
                : JSON.parse(quest.img || "[]");
        } catch {
            pathsArray = [];
        }

        const updatedPaths = pathsArray.filter((p) => p !== cleanImagePath);

        await db.query("UPDATE quests SET img = ? WHERE id = ?", [
            JSON.stringify(updatedPaths),
            req.params.id,
        ]);

        if (cleanImagePath) {
            const fullPath = path.join(CLIENT_PUBLIC_DIR, cleanImagePath);
            await fs.unlink(fullPath).catch(() => {});
        }

        res.json({ success: true, remainingImages: updatedPaths });
    } catch (err) {
        console.error("Ошибка при удалении изображения:", err);
        res.status(500).json({ error: "Ошибка сервера", details: err.message });
    }
});

// === UPLOAD VIDEO ===
router.post("/upload-video", uploadVideo.single("video"), async (req, res) => {
    const { questId } = req.body;

    if (!questId) return res.status(400).json({ error: "Missing questId" });

    if (!req.file) return res.status(400).json({ error: "No video uploaded" });

    try {
        const relativePath = `/${VIDEO_QUEST_DIR}/${req.file.filename}`;

        await db.query("UPDATE quests SET video = ? WHERE id = ?", [
            relativePath,
            questId,
        ]);

        res.json({ success: true, video: relativePath });
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ error: "Failed to process video" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const [[quest]] = await db.query("SELECT slug FROM quests WHERE id = ?", [
            req.params.id,
        ]);
        if (!quest) return res.status(404).json({ error: "Квест не найден" });

        const { slug } = quest;

        const [result] = await db.query("DELETE FROM quests WHERE id = ?", [
            req.params.id,
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Квест не найден" });
        }

        // Удаляем запись из файла локализации
        await removeLocaleQuest(slug);

        res.json({ success: true, message: "Квест успешно удален" });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ error: "Ошибка сервера при удалении квеста" });
    }
});
// === DELETE VIDEO ===
router.post("/delete-video/:id", async (req, res) => {
    const { path: videoPath } = req.body;
    const cleanVideoPath = videoPath?.trim();

    try {
        // Получаем текущий квест
        const [[quest]] = await db.query("SELECT video FROM quests WHERE id = ?", [
            req.params.id,
        ]);

        if (!quest) {
            return res.status(404).json({ error: "Квест не найден" });
        }

        // Если путь совпадает — удаляем
        if (cleanVideoPath && quest.video === cleanVideoPath) {
            const fullPath = path.join(CLIENT_PUBLIC_DIR, cleanVideoPath);

            // Удаляем файл с диска
            await fs.unlink(fullPath).catch(() => {});

            // Обновляем запись в БД
            await db.query("UPDATE quests SET video = NULL WHERE id = ?", [
                req.params.id,
            ]);
        }

        res.json({ success: true, message: "Видео удалено" });
    } catch (err) {
        console.error("Ошибка при удалении видео:", err);
        res.status(500).json({ error: "Ошибка сервера", details: err.message });
    }
});
router.get("/slug/:slug", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id FROM quests WHERE slug = ?", [
            req.params.slug,
        ]);
        if (rows.length === 0) return res.status(404).json({ error: "Квест не найден" });
        res.json({ id: rows[0].id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

router.post("/", async (req, res) => {
    const {
        title,
        description,
        people,
        age,
        difficulty,
        time,
        address,
        small_description,
        category,
        img = [],
    } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title и description обязательны" });
    }

    try {
        const slug = translit(title);
        // Проверяем уникальность slug
        const [existing] = await db.query("SELECT * FROM quests WHERE slug = ?", [slug]);
        if (existing.length > 0) {
            return res
                .status(400)
                .json({ error: "Квест с таким названием уже существует" });
        }

        // Вставляем новый квест
        const [result] = await db.query(
            `INSERT INTO quests (
                slug, title, description, people, age, difficulty, time, address, 
                small_description, category, img
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                slug,
                title,
                description,
                people,
                age,
                difficulty,
                time,
                address,
                small_description,
                category,
                JSON.stringify(img), // сохраняем как JSON-строку
            ]
        );
        // Обновляем файл локализации
        await updateLocaleWithQuest(slug, title);
        const newQuestId = result.insertId;

        // Возвращаем клиенту новый объект
        res.status(201).json({
            id: newQuestId,
            title,
            description,
            people,
            age,
            difficulty,
            time,
            address,
            small_description,
            category,
            img,
        });
    } catch (err) {
        console.error("Ошибка при создании квеста:", err);
        res.status(500).json({ error: "Не удалось создать квест", details: err.message });
    }
});
export default router;
