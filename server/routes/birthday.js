import express from "express";
import db from "../db.js";

const router = express.Router();

// Получить все предложения
router.get("/", async (req, res) => {
    const { _sort = "id", _order = "ASC", _start = 0, _end = 5 } = req.query;

    try {
        const startInt = parseInt(_start);
        const endInt = parseInt(_end);
        const limit = endInt - startInt;
        const offset = startInt;

        let sql = `SELECT * FROM birthday_offers ORDER BY ?? ${_order.toUpperCase()} LIMIT ? OFFSET ?`;
        const replacements = [_sort, limit, offset];

        const [rows] = await db.query(sql, replacements);

        // Общее количество записей
        const [[{ total }]] = await db.query(
            "SELECT COUNT(*) AS total FROM birthday_offers"
        );

        res.header("Content-Range", `birthday_offers ${startInt}-${endInt}/${total}`);
        return res.json(rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Получить одну запись
router.get("/:id", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM birthday_offers WHERE id = ?", [
            req.params.id,
        ]);
        if (rows.length === 0) return res.status(404).json({ error: "Не найдено" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
