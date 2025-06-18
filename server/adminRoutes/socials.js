import express from "express";
import db from "../db.js";

const router = express.Router();

// Получить все записи
router.get("/", async (req, res) => {
    const { _sort = "id", _order = "ASC", _start = 0, _end = 5 } = req.query;

    try {
        const startInt = parseInt(_start);
        const endInt = parseInt(_end);
        const limit = endInt - startInt;
        const offset = startInt;

        let sql = `SELECT * FROM social_links ORDER BY ?? ${_order.toUpperCase()} LIMIT ? OFFSET ?`;
        const replacements = [_sort, limit, offset];

        const [rows] = await db.query(sql, replacements);

        // Получаем общее количество записей
        const [[{ total }]] = await db.query(
            "SELECT COUNT(*) AS total FROM social_links"
        );

        res.header("Content-Range", `social_links ${startInt}-${endInt}/${total}`);
        return res.json(rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Ошибка на сервере" });
    }
});

// Получить одну запись
router.get("/:id", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM social_links WHERE id = ?", [
            req.params.id,
        ]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Соцсеть не найдена" });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Создать новую запись
router.post("/", async (req, res) => {
    try {
        const { network_type, url, sort_order = 0 } = req.body;

        if (!network_type || !url) {
            return res.status(400).json({ error: "Поля обязательны" });
        }

        const [result] = await db.query(
            "INSERT INTO social_links (network_type, url) VALUES (?, ?)",
            [network_type, url, sort_order]
        );

        res.status(201).json({
            id: result.insertId,
            network_type,
            url,
            sort_order,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Обновить запись
router.put("/:id", async (req, res) => {
    try {
        const { network_type, url, sort_order } = req.body;

        const [result] = await db.query(
            "UPDATE social_links SET network_type = ?, url = ? WHERE id = ?",
            [network_type, url, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Не найдено" });
        }

        res.json({ id: req.params.id, network_type, url, sort_order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Удалить запись
router.delete("/:id", async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM social_links WHERE id = ?", [
            req.params.id,
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Не найдено" });
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
