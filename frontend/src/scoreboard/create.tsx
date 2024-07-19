// scoreboard/CreateScoreboard.tsx
import React, {useState} from 'react';
import {createScoreboard} from '../api';
import './create.css';

interface CreateScoreboardProps {
    onScoreboardCreated: () => void;
}

const CreateScoreboard: React.FC<CreateScoreboardProps> = ({onScoreboardCreated}) => {
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (name.trim() === '') {
            setError('Scoreboard name is required');
            return;
        }

        try {
            await createScoreboard(name);
            setSuccess('Scoreboard created successfully');
            setError(null);
            setName('');
            // Call the refresh function passed from parent
            onScoreboardCreated();
        } catch (err) {
            setError(`Failed to create scoreboard: ${err.message}`);
            setSuccess(null);
        }
    };

    return (
        <div className="create-scoreboard-container">
            <h2>Create New Scoreboard</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="scoreboardName">Scoreboard Name:</label>
                    <input
                        type="text"
                        id="scoreboardName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <button type="submit">Create Scoreboard</button>
            </form>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
        </div>
    );
};

export default CreateScoreboard;
