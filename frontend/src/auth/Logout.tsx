import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('jwt'); // Remove JWT from local storage
        navigate('/'); // Redirect to the main page
    }, [navigate]);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Logging out...</h1>
            <p>You are being logged out. Redirecting to the main page...</p>
        </div>
    );
};

export default LogoutPage;