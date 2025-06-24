import express from "express";
import db from "../db.js";

const router = express.Router();

// Получить все предложения
router.get("/", async (req, res) => {
    const { _sort = "id", _order = "ASC", _start = 0, _end = 5 } = req.query;

    try {
        // Если _start и _end переданы → работаем как с react-admin (пагинация)
        if (req.query._start !== undefined || req.query._end !== undefined) {
            const startInt = parseInt(_start);
            const endInt = parseInt(_end);
            const limit = endInt - startInt;
            const offset = startInt;

            let sql = `SELECT * FROM group_offers ORDER BY ?? ${_order.toUpperCase()} LIMIT ? OFFSET ?`;
            const replacements = [_sort, limit, offset];

            const [rows] = await db.query(sql, replacements);

            // Общее количество записей
            const [[{ total }]] = await db.query(
                "SELECT COUNT(*) AS total FROM group_offers"
            );

            res.header("Content-Range", `group_offers ${startInt}-${endInt}/${total}`);
            return res.json(rows);
        }

        // Если _start и _end НЕ переданы → отдай ВСЕ записи для сайта
        const [rows] = await db.query(
            `SELECT * FROM group_offers ORDER BY ?? ${_order.toUpperCase()}`,
            [_sort]
        );
        return res.json(rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Получить одну запись
router.get("/:id", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM group_offers WHERE id = ?", [
            req.params.id,
        ]);
        if (rows.length === 0) return res.status(404).json({ error: "Не найдено" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
