import express from "express";
import db from "../db.js";

const router = express.Router();

//  Получить все отзывы
router.get("/", async (req, res) => {
    const { _sort = "id", _order = "ASC", _start = 0, _end = 5 } = req.query;

    try {
        // Если _start и _end переданы → работаем как с react-admin
        if (req.query._start !== undefined || req.query._end !== undefined) {
            const startInt = parseInt(_start);
            const endInt = parseInt(_end);
            const limit = endInt - startInt;
            const offset = startInt;

            let sql = `SELECT * FROM reviews ORDER BY ?? ${_order.toUpperCase()} LIMIT ? OFFSET ?`;
            const replacements = [_sort, limit, offset];

            const [rows] = await db.query(sql, replacements);

            const [[{ total }]] = await db.query("SELECT COUNT(*) AS total FROM reviews");

            res.header("Content-Range", `reviews ${startInt}-${endInt}/${total}`);
            return res.json(rows);
        }

        // Если _start и _end НЕ переданы → отдай ВСЕ отзывы
        const [rows] = await db.query("SELECT * FROM reviews");
        return res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM reviews WHERE id = ?", [
            req.params.id,
        ]);
        if (rows.length === 0) return res.status(404).json({ error: "Отзыв не найден" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



export default router;
