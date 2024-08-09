// authUtils.ts
import { jwtDecode } from 'jwt-decode';

export function decodeURIComponent(component: string): string {
    return component.replace(/\+/g, ' ');
}

export function encodeURIComponent(component: string): string {
    return component.replace(/ /g, '+');
}

interface DecodedToken {
    sub: string; // The subject of the token (usually the username or user ID)
    // Add other fields based on your token structure
}

export const getCurrentUser = (): string | null => {
    const token = localStorage.getItem('jwt'); // Or however you store the token
    if (!token) return null;

    try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        return decodedToken.sub; // Assuming 'sub' contains the username
    } catch (e) {
        console.error('Failed to decode JWT:', e);
        return null;
    }
};

export const colorScheme = [
    'hsl(0, 70%, 50%)',     // Red
    'hsl(36, 70%, 50%)',    // Orange
    'hsl(72, 70%, 50%)',    // Yellow
    'hsl(108, 70%, 50%)',   // Green
    'hsl(144, 70%, 50%)',   // Light Green
    'hsl(180, 70%, 50%)',   // Cyan
    'hsl(216, 70%, 50%)',   // Blue
    'hsl(252, 70%, 50%)',   // Purple
    'hsl(288, 70%, 50%)',   // Magenta
    'hsl(324, 70%, 50%)'    // Pink
];