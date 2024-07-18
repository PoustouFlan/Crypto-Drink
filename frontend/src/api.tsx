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
        // const delay = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
        // await new Promise(resolve => setTimeout(resolve, delay));
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/challenge`, { name, category });
        return response.data;
    } catch (err) {
        console.error(`Failed to fetch details for challenge ${name}:`, err);
        return { points: 0 }; // Default points in case of error
    }
};
