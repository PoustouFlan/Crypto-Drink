// user/header.tsx
import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar, faTint} from '@fortawesome/free-solid-svg-icons';
import Flag from 'react-world-flags'; // Import the Flag component
import {fetchTotalUsers} from '../api'; // Import the method to fetch total users
import {formatDistanceToNow, parseISO} from 'date-fns'; // Import date-fns methods

interface UserHeaderProps {
    username?: string;
    joined?: string;
    rank?: number;
    country?: string; // Country code, e.g., 'fr'
    level?: number;
    score?: number;
    first_bloods?: number;
    last_refreshed?: string; // Add last_refreshed to props
}

const UserHeader: React.FC<UserHeaderProps> = ({
                                                   username,
                                                   joined,
                                                   rank,
                                                   country,
                                                   level,
                                                   score,
                                                   first_bloods,
                                                   last_refreshed
                                               }) => {
    const [totalUsers, setTotalUsers] = useState<number | null>(null);

    useEffect(() => {
        // Fetch total users and update state
        const getTotalUsers = async () => {
            try {
                const total = await fetchTotalUsers();
                setTotalUsers(total);
            } catch (err) {
                console.error('Failed to fetch total users:', err);
            }
        };

        getTotalUsers();
    }, []);

    const lastRefreshedText = last_refreshed ? `Last refreshed: ${formatDistanceToNow(parseISO(last_refreshed))} ago` : '';

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
                <p>Rank: <b>#{rank}
                    {totalUsers !== null && ` / ${totalUsers}`}
                </b></p>
                {last_refreshed && (
                    <p>{lastRefreshedText}</p>
                )}
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
