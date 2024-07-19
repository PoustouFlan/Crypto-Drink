// scoreboard/register.tsx
import React, {useState} from 'react';
import {useParams} from 'react-router-dom';

interface RegisterUserProps {
    onRegister: (username: string) => void; // Prop to handle user registration
}

const RegisterUser: React.FC<RegisterUserProps> = ({onRegister}) => {
    const {name} = useParams<{ name: string }>();
    const [username, setUsername] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            await onRegister(username); // Call the prop function
            setSuccess(`User ${username} successfully registered!`);
            setUsername('');
            setError(null);
        } catch (err) {
            setError(`Failed to register user: ${(err as Error).message}`);
            setSuccess(null);
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
                <button type="submit">Register</button>
            </form>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
        </div>
    );
};

export default RegisterUser;
