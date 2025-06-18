import mysql from "mysql2/promise";
import env from "./config/env.js";

const pool = mysql.createPool({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});

// Проверяем подключение к БД
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query("SELECT 1 + 1 AS health");
        console.log(
            "✅ Успешное подключение к MySQL:",
            rows[0].health === 2 ? "OK" : "Неожиданный результат"
        );
        connection.release(); // освобождаем соединение
    } catch (error) {
        console.error("❌ Ошибка подключения к MySQL:", error.message);
    }
}

testConnection();

export default pool;
