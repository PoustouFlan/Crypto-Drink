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
