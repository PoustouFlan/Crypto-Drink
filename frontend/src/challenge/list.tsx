// pages/ChallengeList.tsx
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {fetchChallengesByCategory} from '../api';

interface ChallengeListParams {
    category: string;
    name: string;
}

const ChallengeList: React.FC = () => {
    const {category} = useParams<ChallengeListParams>();
    const {name} = useParams<ChallengeListParams>();
    const [challenges, setChallenges] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const challengesData = await fetchChallengesByCategory(category);
                setChallenges(challengesData.challenges);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [category]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="challenge-list-container">
            <h1>Challenges in {decodeURIComponent(category)}</h1>
            <ul>
                {challenges.map((challenge, index) => (
                    <li key={index}>{challenge}</li>
                ))}
            </ul>
        </div>
    );
};

export default ChallengeList;
