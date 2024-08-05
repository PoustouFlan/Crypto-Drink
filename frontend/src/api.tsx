// api.tsx
import axios from 'axios';

// Cache objects
const userCache = new Map();
const challengeCache = new Map();
const scoreboardCache = new Map();
const scoreboardDetailsCache = new Map();
const categoryCache = new Map();
const totalUsersCache = new Map();

export interface Scoreboard {
    name: string;
    users: string[];
    owner: string;
    is_public: string;
}

export interface SolvedChallenge {
    date: string;
    category?: string;
    name?: string;
    points?: number;
    loadingPoints?: boolean;
}

export interface User {
    loading?: boolean;
    username: string;
    joined?: string;
    rank?: number;
    country?: string;
    level?: number;
    score: number;
    first_bloods?: number;
    solved_challenges: SolvedChallenge[];
    completion?: {
        name: string;
        solved: number;
        total: number;
        score: number;
        total_score: number;
    }[];
    last_refreshed?: string;
}

// Utility function to get the JWT token from local storage
const getJWTToken = () => localStorage.getItem('jwt');

// Axios instance with interceptor to add JWT token to the headers
const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(config => {
    const token = getJWTToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export const fetchUserData = async (username: string): Promise<User> => {
    if (userCache.has(username)) {
        return userCache.get(username);
    }

    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_BACKEND_URL}/user/${username}`);
        const data = response.data;
        userCache.set(username, data);
        return data;
    } catch (err) {
        throw new Error((err as Error).message);
    }
};

export const fetchChallengeDetails = async (name: string, category: string) => {
    const cacheKey = `${name}-${category}`;
    if (challengeCache.has(cacheKey)) {
        return challengeCache.get(cacheKey);
    }

    try {
        const response = await axiosInstance.post(`${import.meta.env.VITE_BACKEND_URL}/challenge`, { name, category });
        const data = response.data;
        challengeCache.set(cacheKey, data);
        return data;
    } catch (err) {
        console.error(`Failed to fetch details for challenge ${name}:`, err);
        return { points: 0 }; // Default points in case of error
    }
};

export const fetchScoreboards = async (): Promise<Scoreboard[]> => {
    if (scoreboardCache.size > 0) {
        return Array.from(scoreboardCache.values())[0]; // Return the first value since there should only be one
    }

    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_BACKEND_URL}/scoreboard`);
        const data = response.data;
        scoreboardCache.set('scoreboard', data); // Store the response with a fixed key
        return data;
    } catch (err) {
        throw new Error((err as Error).message);
    }
};

export const fetchScoreboardDetails = async (name: string) => {
    if (scoreboardDetailsCache.has(name)) {
        return scoreboardDetailsCache.get(name);
    }

    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_BACKEND_URL}/scoreboard/${name}`);
        const data = response.data;
        scoreboardDetailsCache.set(name, data);
        return data;
    } catch (err) {
        throw new Error((err as Error).message);
    }
};

export const createScoreboard = async (name: string) => {
    try {
        const response = await axiosInstance.post(`${import.meta.env.VITE_BACKEND_URL}/scoreboard`, {name});
        // Clear the cache for scoreboards after creation
        scoreboardCache.clear();
        return response.data;
    } catch (err) {
        throw new Error((err as Error).message);
    }
};

export const deleteScoreboard = async (name: string) => {
    try {
        await axiosInstance.delete(`${import.meta.env.VITE_BACKEND_URL}/scoreboard/${name}`);
        // Clear the cache for scoreboards after deletion
        scoreboardCache.clear();
    } catch (err) {
        throw new Error((err as Error).message);
    }
};

export const registerUserToScoreboard = async (scoreboardName: string, username: string) => {
    try {
        await axiosInstance.post(`${import.meta.env.VITE_BACKEND_URL}/scoreboard/${scoreboardName}/register`, {username});
        // Clear the cache for scoreboards and scoreboard details after registration
        scoreboardDetailsCache.delete(scoreboardName);
    } catch (err) {
        throw new Error((err as Error).message);
    }
};

export const deleteUserFromScoreboard = async (scoreboardName: string, username: string) => {
    try {
        await axiosInstance.delete(`${import.meta.env.VITE_BACKEND_URL}/scoreboard/${scoreboardName}/user/${username}`);
        // Clear the cache for scoreboard details after user deletion
        scoreboardDetailsCache.delete(scoreboardName);
    } catch (err) {
        throw new Error((err as Error).message);
    }
};

export const refreshUserData = async (username: string): Promise<User> => {
    try {
        const response = await axiosInstance.put(`${import.meta.env.VITE_BACKEND_URL}/user/${username}`);
        const data = response.data;
        // Update the user cache with the new data
        userCache.set(username, data);
        return data;
    } catch (err) {
        throw new Error((err as Error).message);
    }
};

export const registerWebhookToScoreboard = async (scoreboardName: string, url: string) => {
    try {
        const response = await axiosInstance.put(`${import.meta.env.VITE_BACKEND_URL}/scoreboard/${scoreboardName}/webhook`, {url});
        return response.data;
    } catch (err) {
        throw new Error((err as Error).message);
    }
};

export const fetchCategories = async () => {
    if (categoryCache.has('categories')) {
        return categoryCache.get('categories');
    }

    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_BACKEND_URL}/category`);
        const data = response.data;
        categoryCache.set('categories', data);
        return data;
    } catch (err) {
        throw new Error((err as Error).message);
    }
};

export const fetchChallengesByCategory = async (name: string) => {
    if (categoryCache.has(name)) {
        return categoryCache.get(name);
    }

    try {
        const response = await axiosInstance.post(`${import.meta.env.VITE_BACKEND_URL}/category`, {name});
        const data = response.data;
        categoryCache.set(name, data);
        return data;
    } catch (err) {
        throw new Error((err as Error).message);
    }
};

export const fetchChallengeFlaggers = async (name: string, category: string) => {
    const cacheKey = `${name}-${category}-flaggers`;
    if (challengeCache.has(cacheKey)) {
        return challengeCache.get(cacheKey);
    }

    try {
        const response = await axiosInstance.post(`${import.meta.env.VITE_BACKEND_URL}/challenge`, {name, category});
        const data = response.data;
        challengeCache.set(cacheKey, data);
        return data;
    } catch (err) {
        throw new Error((err as Error).message);
    }
};

export const fetchScoreboardChallengeFlaggers = async (scoreboardName: string, name: string, category: string) => {
    const cacheKey = `${scoreboardName}-${name}-${category}-flaggers`;
    if (challengeCache.has(cacheKey)) {
        return challengeCache.get(cacheKey);
    }

    try {
        const response = await axiosInstance.post(`${import.meta.env.VITE_BACKEND_URL}/scoreboard/${scoreboardName}/challenge`, {
            name,
            category
        });
        const data = response.data;
        challengeCache.set(cacheKey, data);
        return data;
    } catch (err) {
        throw new Error((err as Error).message);
    }
};

export const fetchTotalUsers = async () => {
    if (totalUsersCache.has('totalUsers')) {
        return totalUsersCache.get('totalUsers');
    }

    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_BACKEND_URL}/total-users`);
        const totalUsers = response.data;
        totalUsersCache.set('totalUsers', totalUsers);
        return totalUsers;
    } catch (err) {
        throw new Error((err as Error).message);
    }
};

// New Authentication Methods
export const generateAuthToken = async () => {
    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_BACKEND_URL}/auth/generate-token`);
        return response.data;
    } catch (err) {
        throw new Error((err as Error).message);
    }
};

export const verifyAuthToken = async (username: string, payload: string) => {
    try {
        const response = await axiosInstance.post(`${import.meta.env.VITE_BACKEND_URL}/auth/verify-token`, {
            username,
            payload
        });

        const { jwt } = response.data;
        localStorage.setItem('jwt', jwt);
        return jwt;
    } catch (err) {
        throw new Error((err as Error).message);
    }
};