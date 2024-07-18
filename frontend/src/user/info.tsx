import React, {useEffect, useState} from 'react';
import './user.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar, faTint} from '@fortawesome/free-solid-svg-icons';
import {fetchChallengeDetails, fetchUserData} from '../api';
import ScoreGraph from './graph'; // Import the ScoreGraph component

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

const UserInfo: React.FC<UserInfoProps> = ({username}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
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

                // Fetch details for each challenge incrementally
                userData.solved_challenges.forEach(async (challenge) => {
                    try {
                        const challengeDetails = await fetchChallengeDetails(challenge.name, challenge.category);
                        const updatedChallenge = {...challenge, points: challengeDetails.points, loadingPoints: false};

                        // Update user state for the current challenge
                        setUser(prevUser => {
                            if (!prevUser) return prevUser; // Just to satisfy TypeScript, though it should never be null here

                            const updatedSolvedChallenges = prevUser.solved_challenges.map(sc => {
                                if (sc.name === updatedChallenge.name && sc.category === updatedChallenge.category) {
                                    return updatedChallenge;
                                }
                                return sc;
                            });

                            return {...prevUser, solved_challenges: updatedSolvedChallenges};
                        });
                    } catch (err) {
                        console.error(`Failed to fetch details for challenge ${challenge.name}:`, err);
                        const updatedChallenge = {...challenge, points: 0, loadingPoints: false}; // Default points in case of error

                        // Update user state for the current challenge
                        setUser(prevUser => {
                            if (!prevUser) return prevUser; // Just to satisfy TypeScript, though it should never be null here

                            const updatedSolvedChallenges = prevUser.solved_challenges.map(sc => {
                                if (sc.name === updatedChallenge.name && sc.category === updatedChallenge.category) {
                                    return updatedChallenge;
                                }
                                return sc;
                            });

                            return {...prevUser, solved_challenges: updatedSolvedChallenges};
                        });
                    }
                });
            } catch (err) {
                setError(err as Error);
                setLoading(false);
            }
        };

        fetchData();
    }, [username]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="container">
            <h1 className="user-title">{user?.username}</h1>
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
                    {user?.solved_challenges.map((challenge, index) => (
                        <tr key={index}>
                            <td>{challenge.date}</td>
                            <td>{challenge.category}</td>
                            <td>{challenge.name}</td>
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
