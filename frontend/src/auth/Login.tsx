import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateAuthToken, verifyAuthToken } from '../api';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [payload, setPayload] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = (location.state as any)?.from?.pathname || '/';

    useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            try {
                const decoded = JSON.parse(atob(jwt.split('.')[1]));
                setLoggedInUser(decoded.sub);
            } catch (e) {
                console.error('Invalid JWT:', e);
            }
        }
    }, []);

    const handleGenerateToken = async () => {
        try {
            const response = await generateAuthToken();
            setPayload(response.payload);
            setToken(response.token);
            setError('');
        } catch (err) {
            setError('Failed to generate token. Please try again.');
        }
    };

    const handleVerifyToken = async () => {
        if (!username || !payload) {
            setError('Please provide your username and ensure the token has been generated.');
            return;
        }

        try {
            await verifyAuthToken(username, payload);
            navigate(redirectTo); // Redirect to the intended page
        } catch (err) {
            setError('Invalid token or username. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        setLoggedInUser(null);
        navigate('/login');
    };

    if (loggedInUser) {
        return (
            <div style={{ padding: '20px' }}>
                <h1>Login</h1>
                <p>You are already logged in as <strong>{loggedInUser}</strong>.</p>
                <button onClick={handleLogout}>Logout</button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Login</h1>
            <p>
                To authenticate, follow these steps:
                <ol>
                    <li>Click on the "Generate Token" button to get a temporary token.</li>
                    <li>Log in to your CryptoHack account and set the given token as your website URL.</li>
                    <li>Click on the "Verify Token" button to validate your token and log in.</li>
                </ol>
            </p>

            <button onClick={handleGenerateToken}>Generate Token</button>

            {token && (
                <div>
                    <p>Your temporary token is: <code>{token}</code></p>
                    <p>Set this token as your website URL on CryptoHack, then enter your username below and click "Verify Token".</p>
                </div>
            )}

            <div>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your CryptoHack username"
                />
                <button onClick={handleVerifyToken}>Verify Token</button>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default LoginPage;