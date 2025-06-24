// questRoute.js
import express from "express";
import db from "../db.js";
const router = express.Router();

// === GET ALL QUESTS ===
router.get("/", async (req, res) => {
    const { _sort = "id", _order = "ASC", _start = 0, _end = 5 } = req.query;

    try {
        // Если _start и _end переданы → работаем как с react-admin (пагинация)
        if (req.query._start !== undefined || req.query._end !== undefined) {
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
        }

        // Если _start и _end НЕ переданы → отдай ВСЕ квесты для сайта
        const [rows] = await db.query(
            `SELECT * FROM quests ORDER BY ?? ${_order.toUpperCase()}`,
            [_sort]
        );
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

export default router;
