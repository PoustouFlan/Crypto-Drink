// user/info.tsx
import React, {useEffect, useState} from 'react';
import './user.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSyncAlt} from '@fortawesome/free-solid-svg-icons';
import {fetchChallengeDetails, fetchUserData, refreshUserData} from '../api';
import ScoreGraph from './graph'; // Adjusted import path
import UserCompletionRadar from './radar';
import SolvedChallenges from './solved'; // Import the SolvedChallenges component
import UserHeader from './header'; // Import UserHeader
import {useParams} from 'react-router-dom';

interface UserInfoProps {
    username: string;
}

interface SolvedChallenge {
    date: string;
    category: string;
    name: string;
    points?: number;
    loadingPoints: boolean;
}

interface User {
    username: string;
    joined: string;
    rank: number;
    country: string;
    level: number;
    score: number;
    first_bloods: number;
    solved_challenges: SolvedChallenge[];
    completion: {
        name: string;
        solved: number;
        total: number;
        score: number;
        total_score: number;
    }[];
}

const UserInfo: React.FC<UserInfoProps> = () => {
    const {username} = useParams<{ username: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchChallengeDetailsForUser = async (solvedChallenges: SolvedChallenge[]) => {
        const updatedChallenges = await Promise.all(solvedChallenges.map(async (challenge) => {
            try {
                const challengeDetails = await fetchChallengeDetails(challenge.name, challenge.category);
                return {...challenge, points: challengeDetails.points, loadingPoints: false};
            } catch (err) {
                console.error(`Failed to fetch details for challenge ${challenge.name}:`, err);
                return {...challenge, points: 0, loadingPoints: false};
            }
        }));
        return updatedChallenges;
    };

    const fetchData = async () => {
        try {
            const userData = await fetchUserData(username);

            const initialSolvedChallenges = userData.solved_challenges.map(challenge => ({
                ...challenge,
                loadingPoints: true
            }));

            setUser({...userData, solved_challenges: initialSolvedChallenges});
            setLoading(false);

            const updatedSolvedChallenges = await fetchChallengeDetailsForUser(userData.solved_challenges);
            setUser(prevUser => prevUser ? {...prevUser, solved_challenges: updatedSolvedChallenges} : prevUser);

        } catch (err) {
            setError(err as Error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [username]);

    const handleRefresh = async () => {
        setLoading(true);
        try {
            const userData = await refreshUserData(username);

            const initialSolvedChallenges = userData.solved_challenges.map(challenge => ({
                ...challenge,
                loadingPoints: true
            }));

            setUser({...userData, solved_challenges: initialSolvedChallenges});

            const updatedSolvedChallenges = await fetchChallengeDetailsForUser(userData.solved_challenges);
            setUser(prevUser => prevUser ? {...prevUser, solved_challenges: updatedSolvedChallenges} : prevUser);

        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="container">
            {user && (
                <>
                    <UserHeader
                        username={user.username}
                        joined={user.joined}
                        rank={user.rank}
                        country={user.country}
                        level={user.level}
                        score={user.score}
                        first_bloods={user.first_bloods}
                    />
                    <button className="refresh-button" onClick={handleRefresh}>
                        <FontAwesomeIcon icon={faSyncAlt}/>
                    </button>
                    <div className="user-graph">
                        <ScoreGraph users={[user]} singleUser={true}/>
                    </div>
                    <UserCompletionRadar completion={user.completion} useScore={false}/>
                    <SolvedChallenges solvedChallenges={user.solved_challenges}/>
                </>
            )}
        </div>
    );
};

export default UserInfo;
