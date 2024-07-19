import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {fetchScoreboardDetails, fetchUserData} from '../api';
import './info.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFlag, faStar} from "@fortawesome/free-solid-svg-icons";

interface User {
    username: string;
    score?: number;
    solvedChallengesCount?: number;
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

                // Fetch user data for each user
                initialUsers.forEach(async (user) => {
                    try {
                        const userData = await fetchUserData(user.username);
                        setUsers((prevUsers) => [
                            ...prevUsers.filter((u) => u.username !== user.username),
                            {
                                username: userData.username,
                                score: userData.score,
                                solvedChallengesCount: userData.solved_challenges.length,
                                loading: false,
                            },
                        ]);
                    } catch (err) {
                        console.error(`Failed to fetch data for user ${user.username}:`, err);
                    }
                });

                setLoading(false);
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
        </div>
    );
};

export default ScoreboardInfo;