// user/header.tsx
import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar, faTint} from '@fortawesome/free-solid-svg-icons';
import Flag from 'react-world-flags'; // Import the Flag component

interface UserHeaderProps {
    username: string;
    joined: string;
    rank: number;
    country: string; // Country code, e.g., 'fr'
    level: number;
    score: number;
    first_bloods: number;
}

const UserHeader: React.FC<UserHeaderProps> = ({username, joined, rank, country, level, score, first_bloods}) => {
    return (
        <div className="container">
            <h1 className="user-title">
                <span className="flag-container">
                    <Flag code={country} style={{width: '2rem', height: '1.5rem', marginRight: '0.5rem'}}/>
                </span>
                {username}
            </h1>
            <div className="user-details">
                <p>Joined: <b>{joined}</b></p>
                <p>Rank: <b>#{rank}</b></p>
            </div>
            <div className="user-level">
                <p>Level: <b className="red-text">{level}</b></p>
                <p>
                    <span className="icon-wrapper">
                        <FontAwesomeIcon icon={faStar} className="gold-text"/> {score}
                    </span>
                    <span className="icon-wrapper">
                        <FontAwesomeIcon icon={faTint} className="red-text"/> {first_bloods}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default UserHeader;
