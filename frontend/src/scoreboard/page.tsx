// scoreboard/ScoreboardPage.tsx
import React, {useEffect, useState} from 'react';
import {fetchScoreboards} from '../api';
import ScoreboardList from './list';
import CreateScoreboard from './create';
import './list.css';

const ScoreboardPage: React.FC = () => {
    const [scoreboards, setScoreboards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Function to fetch scoreboards and update state
    const loadScoreboards = async () => {
        try {
            const data = await fetchScoreboards();
            setScoreboards(data);
            setLoading(false);
        } catch (err) {
            setError(err as Error);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadScoreboards();
    }, []);

    // Function to be passed to CreateScoreboard for refreshing the list
    const refreshScoreboards = async () => {
        await loadScoreboards();
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="scoreboard-container">
            <h1>Scoreboards</h1>
            <CreateScoreboard onScoreboardCreated={refreshScoreboards}/>
            <ScoreboardList scoreboards={scoreboards}/>
        </div>
    );
};

export default ScoreboardPage;