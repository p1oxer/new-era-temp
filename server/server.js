import express from "express";
import cors from "cors";
const app = express();

import reviewsRouter from "./routes/reviews.js";
import faqRouter from "./routes/faq.js";
import aboutRouter from "./routes/about.js";
import contactsRouter from "./routes/contacts.js";
import socialsRouter from "./routes/socials.js";
import birthdayRouter from "./routes/birthday.js";
import birthdayDescriptionRouter from "./routes/birthdayDescription.js";
import groupRouter from "./routes/group.js";
import groupDescriptionRouter from "./routes/groupDescription.js";
import certificateRouter from "./routes/certificateRoutes.js";
import questRouter from "./routes/questRoute.js";

import reviewsAdminRouter from "./adminRoutes/reviews.js";
import faqAdminRouter from "./adminRoutes/faq.js";
import aboutAdminRouter from "./adminRoutes/about.js";
import contactsAdminRouter from "./adminRoutes/contacts.js";
import socialsAdminRouter from "./adminRoutes/socials.js";
import birthdayAdminRouter from "./adminRoutes/birthday.js";
import birthdayDescriptionAdminRouter from "./adminRoutes/birthdayDescription.js";
import groupAdminRouter from "./adminRoutes/group.js";
import groupDescriptionAdminRouter from "./adminRoutes/groupDescription.js";
import certificateAdminRouter from "./adminRoutes/certificateRoutes.js";
import questAdminRouter from "./adminRoutes/questRoute.js";
import imageAdminRouter from "./adminRoutes/image.js";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import { dirname, join } from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use("/uploads", express.static(join(__dirname, "../uploads")));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET, {
            algorithms: ["HS256"],
        });

        // Проверка issuer и audience
        const issuer = process.env.SUPABASE_URL;
        if (decoded.iss !== `${issuer}/auth/v1` || decoded.aud !== "authenticated") {
            throw new Error("Invalid token issuer or audience");
        }

        req.user = decoded;
        next();
    } catch (err) {
        console.error("JWT verification failed:", err.message);
        res.status(401).json({ error: "Invalid token" });
    }
}

// Middleware для проверки админских прав
function isAdmin(req, res, next) {
    if (req.user.email !== process.env.ADMIN_EMAIL) {
        return res.status(403).json({ error: "Access denied" });
    }
    next();
}
// Подключаем маршруты
app.use("/api/reviews", reviewsRouter);
app.use("/api/faq", faqRouter);
app.use("/api/about", aboutRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/socials", socialsRouter);
app.use("/api/birthday_offers", birthdayRouter);
app.use("/api/birthday-description", birthdayDescriptionRouter);
app.use("/api/group_offers", groupRouter);
app.use("/api/group-description", groupDescriptionRouter);
app.use("/api/certificates", certificateRouter);
app.use("/api/quests", questRouter);


// админские маршруты

app.use("/api/admin/reviews", authenticate, isAdmin, reviewsAdminRouter);
app.use("/api/admin/faq", authenticate, isAdmin, faqAdminRouter);
app.use("/api/admin/about", authenticate, isAdmin, aboutAdminRouter);
app.use("/api/admin/contacts", authenticate, isAdmin, contactsAdminRouter);
app.use("/api/admin/socials", authenticate, isAdmin, socialsAdminRouter);
app.use("/api/admin/birthday_offers", authenticate, isAdmin, birthdayAdminRouter);
app.use(
    "/api/admin/birthday-description",
    authenticate,
    isAdmin,
    birthdayDescriptionAdminRouter
);
app.use("/api/admin/group_offers", authenticate, isAdmin, groupAdminRouter);
app.use(
    "/api/admin/group-description",
    authenticate,
    isAdmin,
    groupDescriptionAdminRouter
);
app.use("/api/admin/image", authenticate, isAdmin, imageAdminRouter);
app.use("/api/admin/certificates", authenticate, isAdmin, certificateAdminRouter);
app.use("/api/admin/quests", authenticate, isAdmin, questAdminRouter);

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
