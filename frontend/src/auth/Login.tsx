import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateAuthToken, verifyAuthToken } from '../api';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [payload, setPayload] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
    const [step, setStep] = useState<number>(1); // Track the current step
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

    const handleUsernameSubmit = async () => {
        if (!username) {
            setError('Please enter your CryptoHack username.');
            return;
        }

        try {
            const response = await generateAuthToken();
            setPayload(response.payload);
            setToken(response.token);
            setError('');
            setStep(2); // Move to the next step
        } catch (err) {
            setError('Failed to generate token. Please try again.');
        }
    };

    const handleVerifyToken = async () => {
        if (!username || !payload) {
            setError('Please enter your username and ensure the token has been generated.');
            return;
        }

        try {
            await verifyAuthToken(username, payload);
            navigate(redirectTo);
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
            {step === 1 && (
                <>
                    <p>
                        To authenticate, please enter your CryptoHack username below.
                        Once entered, a token will be automatically generated for you.
                    </p>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your CryptoHack username"
                    />
                    <button onClick={handleUsernameSubmit}>Submit Username</button>
                </>
            )}

            {step === 2 && (
                <>
                    <p>
                        A temporary token has been generated. Please set this token as your website URL in your CryptoHack profile settings.
                        You can set it at: <a href={`https://cryptohack.org/user/${username}/`} target="_blank" rel="noopener noreferrer">CryptoHack Profile</a>.
                        Click on "Profile settings" on this page.
                    </p>
                    <p>Your token is: <code>{token}</code></p>
                    <button onClick={handleVerifyToken}>Verify Token</button>
                </>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default LoginPage;
