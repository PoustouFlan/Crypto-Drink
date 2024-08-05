// webhookForm.tsx
import React, {useState} from 'react';
import {registerWebhookToScoreboard} from '../api';

import {toast, Bounce} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

interface WebhookFormProps {
    scoreboardName: string;
}

const WebhookForm: React.FC<WebhookFormProps> = ({scoreboardName}) => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const notifId = toast.loading("Registering...");

        try {
            await registerWebhookToScoreboard(scoreboardName, url);
            toast.update(notifId, {
                render: `Webhook registered successfully!`,
                isLoading: false,
            });
            setUrl(''); // Clear the input field after successful submission
        } catch (err) {
            let error = err as Error;
            toast.update(notifId, {
                render: `Error: ${error.message}`,
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
        <>
        <h2 className="register-title">Register Webhook</h2>
        <form onSubmit={handleSubmit} className="webhook-form">
            <div className="register-form-content">
                <input
                    type="url"
                    id="webhook-url"
                    value={url}
                    placeholder='Webhook URL'
                    onChange={(e) => setUrl(e.target.value)}
                    required
                />
            </div>
            <button type="submit" disabled={loading}>Register Webhook</button>
        </form>
        </>
    );
};

export default WebhookForm;
