import axios from 'axios';

// Cache objects
const userCache = new Map();
const challengeCache = new Map();
const scoreboardCache = new Map();
const scoreboardDetailsCache = new Map();

export const fetchUserData = async (username: string) => {
    if (userCache.has(username)) {
        return userCache.get(username);
    }

    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/${username}`);
        const data = response.data;
        userCache.set(username, data);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};

export const fetchChallengeDetails = async (name: string, category: string) => {
    const cacheKey = `${name}-${category}`;
    if (challengeCache.has(cacheKey)) {
        return challengeCache.get(cacheKey);
    }

    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/challenge`, { name, category });
        const data = response.data;
        challengeCache.set(cacheKey, data);
        return data;
    } catch (err) {
        console.error(`Failed to fetch details for challenge ${name}:`, err);
        return { points: 0 }; // Default points in case of error
    }
};

export const fetchScoreboards = async () => {
    if (scoreboardCache.size > 0) {
        return Array.from(scoreboardCache.values())[0]; // Return the first value since there should only be one
    }

    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/scoreboard`);
        const data = response.data;
        scoreboardCache.set('scoreboard', data); // Store the response with a fixed key
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};

export const fetchScoreboardDetails = async (name: string) => {
    if (scoreboardDetailsCache.has(name)) {
        return scoreboardDetailsCache.get(name);
    }

    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/scoreboard/${name}`);
        const data = response.data;
        scoreboardDetailsCache.set(name, data);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};

// New method to create a scoreboard
export const createScoreboard = async (name: string) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/scoreboard`, {name});
        // Clear the cache for scoreboards after creation
        scoreboardCache.clear();
        return response.data;
    } catch (err) {
        throw new Error(err.message);
    }
};