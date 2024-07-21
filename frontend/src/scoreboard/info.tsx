// scoreboard/info.tsx
import React, {useCallback, useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {
    deleteUserFromScoreboard,
    fetchChallengeDetails,
    fetchScoreboardDetails,
    fetchUserData,
    refreshUserData,
    registerUserToScoreboard
} from '../api';
import './info.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFlag, faStar, faSync, faTrash} from "@fortawesome/free-solid-svg-icons";
import TopPlayersGraph from '../user/graph'; // Adjusted import path
import {ToastContainer} from 'react-toastify';
import RegisterPopup from './registerPopup';
import WorldFlags from 'react-world-flags'; // Import flag component if using a library

interface User {
    username: string;
    score?: number;
    solvedChallengesCount?: number;
    solvedChallenges?: { date: string; points: number }[];
    countryCode?: string; // Add country code
    loading: boolean;
}

const ScoreboardInfo: React.FC = () => {
    const {scoreboardName} = useParams<{ scoreboardName: string }>();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        try {
            const scoreboardInfo = await fetchScoreboardDetails(scoreboardName);
            const initialUsers = scoreboardInfo.users.map((username: string) => ({
                username,
                loading: true,
            }));

            setUsers(initialUsers);
            setLoading(false);

            for (const user of initialUsers) {
                try {
                    const userData = await fetchUserData(user.username);
                    const solvedChallenges = await Promise.all(userData.solved_challenges.map(async (challenge) => {
                        try {
                            const challengeDetails = await fetchChallengeDetails(challenge.name, challenge.category);
                            return {
                                date: challenge.date,
                                points: challengeDetails.points,
                            };
                        } catch (err) {
                            console.error(`Failed to fetch details for challenge ${challenge.name}:`, err);
                            return {
                                date: challenge.date,
                                points: 0,
                            };
                        }
                    }));

                    setUsers((prevUsers) => {
                        const updatedUsers = prevUsers.map((u) => {
                            if (u.username === user.username) {
                                return {
                                    username: userData.username,
                                    score: userData.score,
                                    solvedChallengesCount: userData.solved_challenges.length,
                                    solved_challenges: solvedChallenges,
                                    countryCode: userData.country, // Add country code
                                    loading: false,
                                };
                            }
                            return u;
                        });
                        return [...updatedUsers];
                    });
                } catch (err) {
                    console.error(`Failed to fetch data for user ${user.username}:`, err);
                }
            }
        } catch (err) {
            setError(err as Error);
            setLoading(false);
        }
    }, [scoreboardName]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRegisterUser = async (username: string) => {
        try {
            await registerUserToScoreboard(scoreboardName, username);
            await fetchData();
        } catch (err) {
            setError(err as Error);
        }
    };

    const handleDeleteUser = async (username: string) => {
        try {
            await deleteUserFromScoreboard(scoreboardName, username);
            setUsers((prevUsers) => prevUsers.filter(user => user.username !== username));
        } catch (err) {
            console.error(`Failed to delete user ${username} from scoreboard ${scoreboardName}:`, err);
        }
    };

    const handleRefreshUsers = async () => {
        setUsers(prevUsers => prevUsers.map(user => ({...user, loading: true})));

        try {
            await Promise.all(users.map(async (user) => {
                try {
                    const refreshedUserData = await refreshUserData(user.username);
                    const solvedChallenges = await Promise.all(refreshedUserData.solved_challenges.map(async (challenge) => {
                        try {
                            const challengeDetails = await fetchChallengeDetails(challenge.name, challenge.category);
                            return {
                                date: challenge.date,
                                points: challengeDetails.points,
                            };
                        } catch (err) {
                            console.error(`Failed to fetch details for challenge ${challenge.name}:`, err);
                            return {
                                date: challenge.date,
                                points: 0,
                            };
                        }
                    }));

                    setUsers(prevUsers => prevUsers.map(u =>
                        u.username === user.username
                            ? {
                                username: refreshedUserData.username,
                                score: refreshedUserData.score,
                                solvedChallengesCount: refreshedUserData.solved_challenges.length,
                                solved_challenges: solvedChallenges,
                                countryCode: refreshedUserData.country, // Add country code
                                loading: false
                            }
                            : u
                    ));
                } catch (err) {
                    console.error(`Failed to refresh data for user ${user.username}:`, err);
                    setUsers(prevUsers => prevUsers.map(u =>
                        u.username === user.username
                            ? {...u, loading: false}
                            : u
                    ));
                }
            }));
        } catch (err) {
            console.error('Failed to refresh users:', err);
        }
    };

    const sortedUsers = users.sort((a, b) => {
        if (a.loading && !b.loading) return 1;
        if (!a.loading && b.loading) return -1;
        if (a.score && b.score) return b.score - a.score;
        return 0;
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div id="scoreboard-details-container">
            <div className="box-center">
                <h1>{scoreboardName} Scoreboard</h1>
                <button onClick={handleRefreshUsers} className="refresh-button">
                    <FontAwesomeIcon icon={faSync}/>
                </button>
            </div>

            <div className="box-center">
                <RegisterPopup onRegister={handleRegisterUser} scoreboardName={scoreboardName}/>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                theme="dark"
            />

            <TopPlayersGraph users={sortedUsers.slice(0, 10)}/>

            <div id="leaderboard-title">
                <h2>Leaderboard</h2>
                <span className="icon-wrapper"><FontAwesomeIcon icon={faStar} className="gold-text"/>
                    Score
                </span>
                <span className="icon-wrapper"><FontAwesomeIcon icon={faFlag} className="red-text"/>
                    Solved Challenges
                </span>
            </div>
            <ol id="scoreboard-table">
                {sortedUsers.map((user, index) => (
                    <li key={index}>
                        <div className="player-index">{("0" + (index + 1)).slice(-2)}</div>
                        <div className="player-info">
                            <div className="user-name">
                                <Link to={`/scoreboard/${scoreboardName}/user/${user.username}`} className="user-link">
                                    {user.countryCode && <WorldFlags code={user.countryCode} style={{
                                        width: '24px',
                                        height: '16px'
                                    }}/>} {/* Display flag */}
                                    {user.username}
                                </Link>
                            </div>
                            <div className="player-info-stats">
                                <span className="icon-wrapper"><FontAwesomeIcon icon={faStar} className="gold-text"/>
                                    {user.loading ? 'Loading...' : user.score}
                                </span>
                                <span className="icon-wrapper"><FontAwesomeIcon icon={faFlag} className="red-text"/>
                                    {user.loading ? 'Loading...' : user.solvedChallengesCount}
                                </span>
                            </div>
                        </div>
                        <button onClick={() => handleDeleteUser(user.username)} className="delete-button">
                            <FontAwesomeIcon icon={faTrash}/>
                        </button>
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default ScoreboardInfo;
