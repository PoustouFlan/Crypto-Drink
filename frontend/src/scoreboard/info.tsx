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
import TopPlayersGraph from './graph'; // Import the TopPlayersGraph component
import {ToastContainer} from 'react-toastify';
import RegisterPopup from './registerPopup';

interface User {
    username: string;
    score?: number;
    solvedChallengesCount?: number;
    solvedChallenges?: { date: string; points: number }[]; // Add solvedChallenges for graph
    loading: boolean;
}

const ScoreboardInfo: React.FC = () => {
    const {name} = useParams<{ name: string }>();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Function to fetch the scoreboard details and user data
    const fetchData = useCallback(async () => {
        try {
            const scoreboardInfo = await fetchScoreboardDetails(name);
            const initialUsers = scoreboardInfo.users.map((username: string) => ({
                username,
                loading: true,
            }));

            setUsers(initialUsers);
            setLoading(false);

            // Fetch user data for each user
            for (const user of initialUsers) {
                try {
                    const userData = await fetchUserData(user.username);
                    const solvedChallenges = [];

                    for (const challenge of userData.solved_challenges) {
                        const challengeDetails = await fetchChallengeDetails(challenge.name, challenge.category);
                        solvedChallenges.push({
                            date: challenge.date,
                            points: challengeDetails.points,
                        });
                    }

                    setUsers((prevUsers) => {
                        const updatedUsers = prevUsers.map((u) => {
                            if (u.username === user.username) {
                                return {
                                    username: userData.username,
                                    score: userData.score,
                                    solvedChallengesCount: userData.solved_challenges.length,
                                    solvedChallenges,
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
    }, [name]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Function to handle user registration and refresh user list
    const handleRegisterUser = async (username: string) => {
        try {
            await registerUserToScoreboard(name, username);
            await fetchData(); // Refresh the user list
        } catch (err) {
            setError(err as Error);
        }
    };

    const handleDeleteUser = async (username: string) => {
        try {
            await deleteUserFromScoreboard(name, username);
            setUsers((prevUsers) => prevUsers.filter(user => user.username !== username));
        } catch (err) {
            console.error(`Failed to delete user ${username} from scoreboard ${name}:`, err);
        }
    };

    // Function to handle refreshing all users with PUT request
    const handleRefreshUsers = async () => {
        // Set all users to loading
        setUsers(prevUsers => prevUsers.map(user => ({...user, loading: true})));

        try {
            // Use Promise.all to handle multiple promises in parallel
            await Promise.all(users.map(async (user) => {
                try {
                    const refreshedUserData = await refreshUserData(user.username);
                    const solvedChallenges = await Promise.all(refreshedUserData.solved_challenges.map(async (challenge) => {
                        const challengeDetails = await fetchChallengeDetails(challenge.name, challenge.category);
                        return {
                            date: challenge.date,
                            points: challengeDetails.points,
                        };
                    }));

                    setUsers(prevUsers => prevUsers.map(u =>
                        u.username === user.username
                            ? {
                                username: refreshedUserData.username,
                                score: refreshedUserData.score,
                                solvedChallengesCount: refreshedUserData.solved_challenges.length,
                                solvedChallenges,
                                loading: false
                            }
                            : u
                    ));
                } catch (err) {
                    console.error(`Failed to refresh data for user ${user.username}:`, err);
                    setUsers(prevUsers => prevUsers.map(u =>
                        u.username === user.username
                            ? {...u, loading: false} // Mark as not loading even if there was an error
                            : u
                    ));
                }
            }));
        } catch (err) {
            console.error('Failed to refresh users:', err);
        }
    };

    // Sort users: loaded users first, by score descending
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
            <h1>{name} Scoreboard</h1>
            <button onClick={handleRefreshUsers} className="refresh-button">
                <FontAwesomeIcon icon={faSync}/>
            </button>
            </div>

            <div className="box-center">
                <RegisterPopup onRegister={handleRegisterUser}
                    scoreboardName={name}></RegisterPopup>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                theme="dark"
            />

            <TopPlayersGraph users={sortedUsers.slice(0, 10)}/> {/* Add the TopPlayersGraph component */}

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
                        <Link to={`/scoreboard/${name}/user/${user.username}`}
                              className="user-link">{user.username}</Link>
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
