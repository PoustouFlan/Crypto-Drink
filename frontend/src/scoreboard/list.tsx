import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {fetchScoreboards} from '../api';
import './list.css';

interface Scoreboard {
    name: string;
    users: string[];
}

const ScoreboardList: React.FC = () => {
    const [scoreboards, setScoreboards] = useState<Scoreboard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchScoreboards();
                setScoreboards(data);
                setLoading(false);
            } catch (err) {
                setError(err as Error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="scoreboard-container">
            <h1>Scoreboards</h1>
            <table className="scoreboard-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Number of Users</th>
                </tr>
                </thead>
                <tbody>
                {scoreboards.map((scoreboard, index) => (
                    <tr key={index}>
                        <td>
                            <Link to={`/scoreboard/${scoreboard.name}`} className="scoreboard-link">
                                {scoreboard.name}
                            </Link>
                        </td>
                        <td>{scoreboard.users.length}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ScoreboardList;