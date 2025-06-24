import express from "express";
import db from "../db.js";

const router = express.Router();

// get all
router.get("/", async (req, res) => {
    const { _sort = "id", _order = "ASC", _start = 0, _end = 5 } = req.query;

    try {
        // Если _start и _end переданы → работаем как с react-admin (пагинация)
        if (req.query._start !== undefined || req.query._end !== undefined) {
            const startInt = parseInt(_start);
            const endInt = parseInt(_end);
            const limit = endInt - startInt;
            const offset = startInt;

            let sql = `SELECT * FROM faq ORDER BY ?? ${_order.toUpperCase()} LIMIT ? OFFSET ?`;
            const replacements = [_sort, limit, offset];

            const [rows] = await db.query(sql, replacements);

            // Получаем общее количество записей
            const [[{ total }]] = await db.query("SELECT COUNT(*) AS total FROM faq");

            // Устанавливаем заголовок Content-Range
            res.header("Content-Range", `items ${startInt}-${endInt}/${total}`);

            // Отправляем только один ответ
            return res.json(rows);
        }

        // Если _start и _end НЕ переданы → отдай ВСЕ записи для сайта
        const [rows] = await db.query(
            `SELECT * FROM faq ORDER BY ?? ${_order.toUpperCase()}`,
            [_sort]
        );
        return res.json(rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});
// create one

router.post("/", async (req, res) => {
    try {
        const { title, text } = req.body;

        const [result] = await db.query("INSERT INTO faq (title, text) VALUES (?, ?)", [
            title,
            text,
        ]);
        res.status(201).json({
            data: {
                id: result.insertId,
                title: title,
                text: text,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Получить одну запись
router.get("/:id", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM faq WHERE id = ?", [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Запись не найдена" });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Редактировать запись
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, text } = req.body;
        const [result] = await db.query(
            "UPDATE faq SET title = ?, text = ? WHERE id = ?",
            [title, text, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Не найдено" });
        }

        res.json({ id, title, text });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query("DELETE FROM faq WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Не найдено" });
        }

        res.json({ message: "Успешно удалёно" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
