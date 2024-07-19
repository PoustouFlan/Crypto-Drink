// pages/ScoreboardChallengeFlaggers.tsx
import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {fetchScoreboardChallengeFlaggers} from '../api';

interface ScoreboardChallengeFlaggersParams {
    scoreboardName: string;
    categoryName: string;
    challengeName: string;
}

const ScoreboardChallengeFlaggers: React.FC = () => {
    const {scoreboardName, categoryName, challengeName} = useParams<ScoreboardChallengeFlaggersParams>();
    const [flaggers, setFlaggers] = useState<{ date: string; username: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const flaggersData = await fetchScoreboardChallengeFlaggers((scoreboardName), decodeURIComponent(challengeName), decodeURIComponent(categoryName));
                setFlaggers(flaggersData.known_flaggers);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [scoreboardName, categoryName, challengeName]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="scoreboard-challenge-flaggers-container">
            <h1>Flaggers
                for {decodeURIComponent(challengeName)} in {decodeURIComponent(categoryName)} on {decodeURIComponent(scoreboardName)} Scoreboard</h1>
            <ul>
                {flaggers.map((flagger, index) => (
                    <li key={index}>
                        {flagger.date} - <Link
                        to={`/scoreboard/${scoreboardName}/user/${flagger.username}`}>{flagger.username}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ScoreboardChallengeFlaggers;
