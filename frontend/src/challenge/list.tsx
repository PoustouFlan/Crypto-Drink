// pages/ChallengeList.tsx
import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {fetchChallengesByCategory} from '../api';
import {decodeURIComponent, encodeURIComponent} from "../Utils.tsx";

interface ChallengeListParams extends Record<string, string | undefined> {
    categoryName: string;
    scoreboardName?: string;
}

const ChallengeList: React.FC = () => {
    const {categoryName, scoreboardName} = useParams<ChallengeListParams>();
    const [challenges, setChallenges] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    if (!categoryName)
        return;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const challengesData = await fetchChallengesByCategory(decodeURIComponent(categoryName));
                setChallenges(challengesData.challenges);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [categoryName]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="challenge-list-container">
            <h1>Challenges in {decodeURIComponent(categoryName)}</h1>
            <ul>
                {challenges.map((challenge, index) => (
                    <li key={index}>
                        <Link
                            to={scoreboardName == null ? `/category/${encodeURIComponent(categoryName)}/${encodeURIComponent(challenge)}`
                                : `/scoreboard/${scoreboardName}/category/${encodeURIComponent(categoryName)}/${encodeURIComponent(challenge)}`}>{challenge}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChallengeList;
