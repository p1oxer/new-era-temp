import express from "express";
import db from "../db.js";

const router = express.Router();

// Получить все записи (с поддержкой пагинации)
router.get("/", async (req, res) => {
    const { _sort = "id", _order = "ASC", _start = 0, _end = 5 } = req.query;

    try {
        const startInt = parseInt(_start);
        const endInt = parseInt(_end);
        const limit = endInt - startInt;
        const offset = startInt;

        let sql = `SELECT * FROM contacts ORDER BY ?? ${_order.toUpperCase()} LIMIT ? OFFSET ?`;
        const replacements = [_sort, limit, offset];

        const [rows] = await db.query(sql, replacements);

        // Получаем общее количество записей
        const [[{ total }]] = await db.query("SELECT COUNT(*) AS total FROM contacts");

        // Устанавливаем заголовок Content-Range
        res.header("Content-Range", `contacts ${startInt}-${endInt}/${total}`);

        return res.json(rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Ошибка на сервере" });
    }
});

// Получить одну запись по ID
router.get("/:id", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM contacts WHERE id = ?", [
            req.params.id,
        ]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Контакт не найден" });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;
