// client/src/functions/localization.js

import fs from "fs/promises";
import path from "path";

const LOCALES_DIR = "/var/www/files";
const RU_LOCALE_PATH = path.join(LOCALES_DIR, "url-mapping.json");

// === Существующая функция ===
export async function updateLocaleWithQuest(slug, title) {
    try {
        const data = await fs.readFile(RU_LOCALE_PATH, "utf8");
        const locale = JSON.parse(data);

        // Добавляем или обновляем запись
        locale[slug] = title;

        await fs.writeFile(RU_LOCALE_PATH, JSON.stringify(locale, null, 2), "utf8");
        console.log(`Обновлен перевод: "${slug}": "${title}"`);
    } catch (err) {
        console.error("Ошибка обновления файла локализации:", err);
    }
}

// === Новая функция: удаление slug из файла ===
export async function removeLocaleQuest(slug) {
    try {
        const data = await fs.readFile(RU_LOCALE_PATH, "utf8");
        const locale = JSON.parse(data);

        if (locale[slug]) {
            delete locale[slug]; // Удаляем ключ
            await fs.writeFile(RU_LOCALE_PATH, JSON.stringify(locale, null, 2), "utf8");
            console.log(`Удалён перевод: "${slug}"`);
        }
    } catch (err) {
        console.error("Ошибка удаления перевода:", err);
    }
}
