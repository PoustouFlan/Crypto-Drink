// user/info.tsx

import React, {useEffect, useState} from 'react';
import './user.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar, faSyncAlt, faTint} from '@fortawesome/free-solid-svg-icons';
import {fetchChallengeDetails, fetchUserData, refreshUserData} from '../api';
import ScoreGraph from './graph';
import {Link, useParams} from "react-router-dom"; // Import the ScoreGraph component

interface UserInfoProps {
    username: string;
}

interface SolvedChallenge {
    date: string;
    category: string;
    name: string;
    points?: number;
    loadingPoints: boolean;
}

interface User {
    username: string;
    joined: string;
    rank: number;
    country: string;
    level: number;
    score: number;
    first_bloods: number;
    solved_challenges: SolvedChallenge[];
}

const UserInfo: React.FC<UserInfoProps> = () => {
    const {username} = useParams<{ username: string }>();
    const {name} = useParams<{ name: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchChallengeDetailsForUser = async (solvedChallenges: SolvedChallenge[]) => {
        const updatedChallenges = await Promise.all(solvedChallenges.map(async (challenge) => {
            try {
                const challengeDetails = await fetchChallengeDetails(challenge.name, challenge.category);
                return {...challenge, points: challengeDetails.points, loadingPoints: false};
            } catch (err) {
                console.error(`Failed to fetch details for challenge ${challenge.name}:`, err);
                return {...challenge, points: 0, loadingPoints: false};
            }
        }));
        return updatedChallenges;
    };

    const fetchData = async () => {
        try {
            const userData = await fetchUserData(username);

            // Initialize solved challenges with loading state
            const initialSolvedChallenges = userData.solved_challenges.map(challenge => ({
                ...challenge,
                loadingPoints: true // Mark all challenges as loading initially
            }));

            setUser({...userData, solved_challenges: initialSolvedChallenges});
            setLoading(false); // Set loading to false as soon as head data is loaded

            // Fetch details for each challenge
            const updatedSolvedChallenges = await fetchChallengeDetailsForUser(userData.solved_challenges);
            setUser(prevUser => prevUser ? {...prevUser, solved_challenges: updatedSolvedChallenges} : prevUser);

        } catch (err) {
            setError(err as Error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [username]);

    const handleRefresh = async () => {
        setLoading(true);
        try {
            const userData = await refreshUserData(username);

            // Initialize solved challenges with loading state
            const initialSolvedChallenges = userData.solved_challenges.map(challenge => ({
                ...challenge,
                loadingPoints: true // Mark all challenges as loading initially
            }));

            setUser({...userData, solved_challenges: initialSolvedChallenges});

            // Fetch details for each challenge
            const updatedSolvedChallenges = await fetchChallengeDetailsForUser(userData.solved_challenges);
            setUser(prevUser => prevUser ? {...prevUser, solved_challenges: updatedSolvedChallenges} : prevUser);

        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="container">
            <h1 className="user-title">
                {user?.username}
                <button className="refresh-button" onClick={handleRefresh}>
                    <FontAwesomeIcon icon={faSyncAlt}/>
                </button>
            </h1>
            <div className="user-details">
                <p>Joined: <b>{user?.joined}</b></p>
                <p>Rank: <b>#{user?.rank}</b></p>
                <p>Country: <b>{user?.country}</b></p>
            </div>
            <div className="user-level">
                <p>Level: <b className="red-text">{user?.level}</b></p>
                <p>
                    <span className="icon-wrapper"><FontAwesomeIcon icon={faStar} className="gold-text"/> {user?.score}</span>
                    <span className="icon-wrapper"><FontAwesomeIcon icon={faTint}
                                                                    className="red-text"/> {user?.first_bloods}</span>
                </p>
            </div>
            <div className={"user-graph"}>
                {user && <ScoreGraph solvedChallenges={user.solved_challenges.filter(sc => !sc.loadingPoints)}/>}
            </div>
            <h3>Solved Challenges</h3>
            <div className="recent-solves">
                <table>
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Challenge</th>
                        <th>Points</th>
                    </tr>
                    </thead>
                    <tbody>
                    {user?.solved_challenges?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((challenge, index) => (
                        <tr key={index}>
                            <td>{challenge.date}</td>
                            <td>
                                <Link to={name == null ? `/category/${encodeURIComponent(challenge.category)}`
                                    : `/scoreboard/${name}/category/${encodeURIComponent(challenge.category)}`}>{challenge.category}</Link>
                            </td>
                            <td>
                                <Link
                                    to={name == null ? `/category/${encodeURIComponent(challenge.category)}/${encodeURIComponent(challenge.name)}`
                                        : `/scoreboard/${name}/category/${encodeURIComponent(challenge.category)}/${encodeURIComponent(challenge.name)}`}>{challenge.name}</Link>
                            </td>
                            <td>
                                {challenge.loadingPoints ? (
                                    <span>Loading...</span>
                                ) : (
                                    <span>
                                            <FontAwesomeIcon icon={faStar} className="gold-text"/> {challenge.points}
                                        </span>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserInfo;
