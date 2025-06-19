// services/questService.js
import axios from "axios";

const API_HOST = process.env.API_HOST; 

export const getQuestIdBySlug = async (slug) => {
    try {
        const response = await axios.get(`${API_HOST}/quests/slug/${slug}`);
        return { id: response.data.id, error: null };
    } catch (error) {
        if (error.response?.status === 404) {
            return { id: null, error: "not-found" };
        }
        console.error("Ошибка получения квеста по slug:", error);
        return { id: null, error: "server-error" };
    }
};
