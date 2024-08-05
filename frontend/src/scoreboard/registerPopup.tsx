import {useEffect, useState} from "react"

import RegisterUser from './register'; // Import the RegisterUser component
import WebhookForm from './webhookForm'; // Import the WebhookForm component

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";

import "./registerPopup.css";

interface RegisterPopupProps {
    onRegister: (username: string) => Promise<void>; // Prop to handle user registration
    scoreboardName: string;
}

const RegisterPopup: React.FC<RegisterPopupProps> = ({onRegister, scoreboardName}) => {
    const [userTab, setUserTab] = useState<boolean>(true)
    const [seen, setSeen] = useState(false);

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.which === 27) // Esc key
                setSeen(false);
        }

        window.addEventListener("keydown", onKeyDown);

        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    return (
        <>
        <button id="register-toggle"
            className="submit-button"
            onClick={() => setSeen(true)}>
            Register
        </button>

        {
            seen ? 
            <div id="register-bg"
                onClick={() => setSeen(false)}
            >
            <div id="register-popup"
                onClick={(e) => {
                    e.stopPropagation();
                }}>

                <div id="register-tabs">
                    <button id="register-user-btn" className="register-tab-btn"
                        disabled={userTab}
                        onClick={() => setUserTab(true)}>User</button>
                    <button id="register-webhook-btn" className="register-tab-btn"
                        disabled={!userTab}
                        onClick={() => setUserTab(false)}>Webhook</button>
                </div>
                <div id="register-content">

                <button id="register-close-btn"
                    className="icon-button"
                    onClick={() => setSeen(false)}>
                    <FontAwesomeIcon icon={faXmark} />
                </button>

                {userTab
                ? <RegisterUser onRegister={onRegister}/>
                : <WebhookForm scoreboardName={scoreboardName}/>
                }
                </div>
            </div>
            </div>
        : null
        }
    </>
    )
}

export default RegisterPopup;
