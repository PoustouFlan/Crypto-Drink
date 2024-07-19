import axios from 'axios';

export const fetchUserData = async (username: string) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/${username}`);
        return response.data;
    } catch (err) {
        throw new Error(err.message);
    }
};

export const fetchChallengeDetails = async (name: string, category: string) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/challenge`, { name, category });
        return response.data;
    } catch (err) {
        console.error(`Failed to fetch details for challenge ${name}:`, err);
        return { points: 0 }; // Default points in case of error
    }
};

export const fetchScoreboards = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/scoreboard`);
        return response.data;
    } catch (err) {
        throw new Error(err.message);
    }
};

export const fetchScoreboardDetails = async (name: string) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/scoreboard/${name}`);
        return response.data;
    } catch (err) {
        throw new Error(err.message);
    }
};