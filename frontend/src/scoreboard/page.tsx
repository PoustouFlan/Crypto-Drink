// scoreboard/ScoreboardPage.tsx
import React, {useEffect, useState} from 'react';
import {fetchScoreboards} from '../api';
import ScoreboardList from './list';
import CreateScoreboard from "./create.tsx";

const ScoreboardPage: React.FC = () => {
    const [scoreboards, setScoreboards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

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

    const refreshScoreboards = async () => {
        await loadScoreboards();
    };

    const handleScoreboardDeleted = (name: string) => {
        setScoreboards(prevScoreboards => prevScoreboards.filter(scoreboard => scoreboard.name !== name));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="scoreboard-container">
            <h1>Scoreboards</h1>
            <CreateScoreboard onScoreboardCreated={refreshScoreboards}/>
            <ScoreboardList scoreboards={scoreboards} onScoreboardDeleted={handleScoreboardDeleted}/>
        </div>
    );
};

export default ScoreboardPage;
