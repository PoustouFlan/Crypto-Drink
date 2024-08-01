import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('jwt');
        navigate('/');
    }, [navigate]);

    return (
        <div>
            <h1>Logging out...</h1>
        </div>
    );
};

export default LogoutPage;
