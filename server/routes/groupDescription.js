import express from "express";
import db from "../db.js";

const router = express.Router();

// Получить описание
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM group_description LIMIT 1");
        const data = rows[0] || { id: null, description: "" };
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});
// Получить одну запись
router.get("/:id", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM group_description WHERE id = ?", [
            req.params.id,
        ]);
        if (rows.length === 0) return res.status(404).json({ error: "Не найдено" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;