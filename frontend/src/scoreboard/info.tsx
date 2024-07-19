// scoreboard/ScoreboardInfo.tsx
import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {fetchChallengeDetails, fetchScoreboardDetails, fetchUserData} from '../api';
import './info.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFlag, faStar} from "@fortawesome/free-solid-svg-icons";
import TopPlayersGraph from './graph'; // Import the TopPlayersGraph component

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

    useEffect(() => {
        const fetchData = async () => {
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
        };

        fetchData();
    }, [name]);

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
        <div className="scoreboard-details-container">
            <h1>{name} Scoreboard</h1>
            <table className="scoreboard-table">
                <thead>
                <tr>
                    <th>Username</th>
                    <th>Score</th>
                    <th>Solved Challenges</th>
                </tr>
                </thead>
                <tbody>
                {sortedUsers.map((user, index) => (
                    <tr key={index}>
                        <td>
                            <Link to={`/user/${user.username}`} className={"user-link"}>{user.username}</Link>
                        </td>
                        <td><span className="icon-wrapper"><FontAwesomeIcon icon={faStar} className="gold-text"/>
                            {user.loading ? 'Loading...' : user.score}
                            </span></td>
                        <td><span className="icon-wrapper"><FontAwesomeIcon icon={faFlag} className="red-text"/>
                            {user.loading ? 'Loading...' : user.solvedChallengesCount}
                            </span></td>
                    </tr>
                ))}
                </tbody>
            </table>
            <TopPlayersGraph users={sortedUsers.slice(0, 10)}/> {/* Add the TopPlayersGraph component */}
        </div>
    );
};

export default ScoreboardInfo;