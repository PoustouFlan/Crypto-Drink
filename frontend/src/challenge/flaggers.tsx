// challenge/flaggers.tsx
import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {fetchChallengeFlaggers} from '../api';

interface ChallengeFlaggersParams {
    categoryName: string;
    challengeName: string;
}

const ChallengeFlaggers: React.FC = () => {
    const {categoryName, challengeName} = useParams<ChallengeFlaggersParams>();
    const [flaggers, setFlaggers] = useState<{ date: string; username: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const flaggersData = await fetchChallengeFlaggers(decodeURIComponent(challengeName), decodeURIComponent(categoryName));
                setFlaggers(flaggersData.known_flaggers);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [categoryName, challengeName]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="challenge-flaggers-container">
            <h1>Flaggers for {decodeURIComponent(challengeName)} in {decodeURIComponent(categoryName)}</h1>
            <ul>
                {flaggers.map((flagger, index) => (
                    <li key={index}>
                        {flagger.date} - <Link to={`/user/${flagger.username}`}>{flagger.username}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChallengeFlaggers;
