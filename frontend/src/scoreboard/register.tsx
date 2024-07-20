// scoreboard/register.tsx
import React, {useState} from 'react';

import {toast, Bounce} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

interface RegisterUserProps {
    onRegister: (username: string) => Promise<void>; // Prop to handle user registration
}

const RegisterUser: React.FC<RegisterUserProps> = ({onRegister}) => {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        const notifId = toast.loading("Registering...");

        try {
            await onRegister(username); // Call the prop function

            toast.update(notifId, {
                render: `User ${username} successfully registered!`,
                type: "success",
                isLoading: false,
                transition: Bounce,
                autoClose: 5000,
                closeButton: null,
            });

            setUsername('');
        } catch (err) {
            toast.update(notifId, {
                render: `Failed to register user: ${(err as Error).message}`,
                type: "error",
                isLoading: false,
                transition: Bounce,
                autoClose: 5000,
                closeButton: null,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-user-container">
            <h2>Register a New User</h2>
            <form onSubmit={handleRegister}>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                <button type="submit" disabled={loading}>Register</button>
            </form>
        </div>
    );
};

export default RegisterUser;
