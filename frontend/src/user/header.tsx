// user/header.tsx

import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar, faTint} from '@fortawesome/free-solid-svg-icons';

interface UserHeaderProps {
    username: string;
    joined: string;
    rank: number;
    country: string;
    level: number;
    score: number;
    first_bloods: number;
}

const UserHeader: React.FC<UserHeaderProps> = ({username, joined, rank, country, level, score, first_bloods}) => {
    return (
        <div className="container">
            <h1 className="user-title">{username}</h1>
            <div className="user-details">
                <p>Joined: <b>{joined}</b></p>
                <p>Rank: <b>#{rank}</b></p>
                <p>Country: <b>{country}</b></p>
            </div>
            <div className="user-level">
                <p>Level: <b className="red-text">{level}</b></p>
                <p>
                    <span className="icon-wrapper"><FontAwesomeIcon icon={faStar} className="gold-text"/> {score}</span>
                    <span className="icon-wrapper"><FontAwesomeIcon icon={faTint} className="red-text"/> {first_bloods}</span>
                </p>
            </div>
        </div>
    );
};

export default UserHeader;
