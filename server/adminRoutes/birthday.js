import express from "express";
import db from "../db.js";

const router = express.Router();

// === GET ALL ===
router.get("/", async (req, res) => {
    const { _sort = "id", _order = "ASC", _start = 0, _end = 5 } = req.query;

    try {
        const startInt = parseInt(_start);
        const endInt = parseInt(_end);
        const limit = endInt - startInt;
        const offset = startInt;

        const [rows] = await db.query(
            `SELECT * FROM birthday_offers ORDER BY ?? ${_order.toUpperCase()} LIMIT ? OFFSET ?`,
            [_sort, limit, offset]
        );

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

// === GET ONE ===
router.get("/:id", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM birthday_offers WHERE id = ?", [
            req.params.id,
        ]);
        if (rows.length === 0) return res.status(404).json({ error: "Не найдено" });

        const item = rows[0];

        // Парсим attributes
        if (typeof item.attributes === "string") {
            try {
                item.attributes = JSON.parse(item.attributes);
            } catch {
                item.attributes = [];
            }
        }

        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// === CREATE ===
router.post("/", async (req, res) => {
    const { name, price, best, attributes, link, sort_order = 0 } = req.body;

    try {
        let parsedAttributes = [];

        if (typeof attributes === "string") {
            try {
                parsedAttributes = JSON.parse(attributes);
            } catch {
                parsedAttributes = [];
            }
        } else if (Array.isArray(attributes)) {
            parsedAttributes = attributes;
        }

        const [result] = await db.query(
            "INSERT INTO birthday_offers (name, price, best, attributes, link, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
            [name, price, best, JSON.stringify(parsedAttributes), link, sort_order]
        );

        res.status(201).json({
            id: result.insertId,
            name,
            price,
            best,
            attributes: parsedAttributes,
            link,
            sort_order,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// === UPDATE ===
router.put("/:id", async (req, res) => {
    const { name, price, best, attributes, link, sort_order } = req.body;

    try {
        const [[currentData]] = await db.query(
            "SELECT * FROM birthday_offers WHERE id = ?",
            [req.params.id]
        );

        if (!currentData) {
            return res.status(404).json({ error: "Не найдено" });
        }

        let updatedAttributes = currentData.attributes;

        // Парсим текущие атрибуты
        try {
            updatedAttributes = JSON.parse(updatedAttributes);
        } catch {}

        // Если пришли новые — обновляем
        if (attributes !== undefined) {
            if (Array.isArray(attributes)) {
                updatedAttributes = attributes;
            } else if (typeof attributes === "string") {
                try {
                    const parsed = JSON.parse(attributes);
                    updatedAttributes = Array.isArray(parsed) ? parsed : [];
                } catch {}
            }
        }

        await db.query(
            `UPDATE birthday_offers SET 
                name = ?, 
                price = ?, 
                best = ?, 
                attributes = ?, 
                link = ?, 
                sort_order = ?
             WHERE id = ?`,
            [
                name || currentData.name,
                price || currentData.price,
                best || currentData.best,
                JSON.stringify(updatedAttributes),
                link || currentData.link,
                sort_order || currentData.sort_order,
                req.params.id,
            ]
        );

        res.json({
            id: req.params.id,
            name: name || currentData.name,
            price: price || currentData.price,
            best: best || currentData.best,
            attributes: updatedAttributes,
            link: link || currentData.link,
            sort_order: sort_order || currentData.sort_order,
        });
    } catch (err) {
        console.error("Ошибка обновления:", err);
        res.status(500).json({ error: err.message });
    }
});

// === DELETE ===
router.delete("/:id", async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM birthday_offers WHERE id = ?", [
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
