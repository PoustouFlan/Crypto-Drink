// webhookForm.tsx
import React, {useState} from 'react';
import {registerWebhookToScoreboard} from '../api';

interface WebhookFormProps {
    scoreboardName: string;
}

const WebhookForm: React.FC<WebhookFormProps> = ({scoreboardName}) => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await registerWebhookToScoreboard(scoreboardName, url);
            setSuccess(true);
            setUrl(''); // Clear the input field after successful submission
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="webhook-form">
            <h2>Register Webhook</h2>
            <div>
                <label htmlFor="webhook-url">Webhook URL:</label>
                <input
                    type="url"
                    id="webhook-url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Register Webhook'}
            </button>
            {error && <p className="error">Error: {error.message}</p>}
            {success && <p className="success">Webhook registered successfully!</p>}
        </form>
    );
};

export default WebhookForm;