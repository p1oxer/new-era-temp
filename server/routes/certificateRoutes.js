import express from "express";
import db from "../db.js";
const router = express.Router();


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

export default router;
