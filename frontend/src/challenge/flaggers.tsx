// challenge/flaggers.tsx
import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {fetchChallengeFlaggers, fetchScoreboardChallengeFlaggers} from '../api';

interface FlaggersParams extends Record<string, string | undefined> {
    scoreboardName?: string;
    categoryName: string;
    challengeName: string;
}

const Flaggers: React.FC = () => {
    const {scoreboardName, categoryName, challengeName} = useParams<FlaggersParams>();
    const [flaggers, setFlaggers] = useState<{ date: string; username: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [points, setPoints] = useState<number | null>(null);
    const [totalSolves, setTotalSolves] = useState<number | null>(null);

    if (!categoryName || !challengeName) {
        setError(new Error('Unknown category or challenge'));
        setLoading(false);
        return;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                let flaggersData;
                if (scoreboardName) {
                    flaggersData = await fetchScoreboardChallengeFlaggers(scoreboardName, decodeURIComponent(challengeName), decodeURIComponent(categoryName));
                } else {
                    flaggersData = await fetchChallengeFlaggers(decodeURIComponent(challengeName), decodeURIComponent(categoryName));
                }
                setFlaggers(flaggersData.known_flaggers);
                setPoints(flaggersData.points);
                setTotalSolves(flaggersData.solves);
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
        <div className="flaggers-container">
            <h1>
                Flaggers for {decodeURIComponent(challengeName)} in {decodeURIComponent(categoryName)}
                {scoreboardName && <> on {decodeURIComponent(scoreboardName)} Scoreboard</>}
            </h1>
            <div>
                <p>Challenge Points: <b>{points}</b></p>
                <p>Total Solves on CryptoHack: <b>{totalSolves}</b></p>
                {scoreboardName && <p>Solves on this Scoreboard: <b>{flaggers.length}</b></p>}
            </div>
            <ul>
                {flaggers.map((flagger, index) => (
                    <li key={index}>
                        {flagger.date} - <Link
                        to={scoreboardName ? `/scoreboard/${scoreboardName}/user/${flagger.username}` : `/user/${flagger.username}`}>{flagger.username}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Flaggers;
