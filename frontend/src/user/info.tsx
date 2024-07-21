// user/info.tsx
import React, {useEffect, useState} from 'react';
import './user.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSyncAlt} from '@fortawesome/free-solid-svg-icons';
import {fetchChallengeDetails, fetchUserData, refreshUserData, SolvedChallenge, User} from '../api';
import ScoreGraph from './graph'; // Adjusted import path
import UserCompletionRadar from './radar';
import SolvedChallenges from './solved'; // Import the SolvedChallenges component
import UserHeader from './header'; // Import UserHeader
import {useParams} from 'react-router-dom';

interface UserInfoProps extends Record<string, string | undefined> {
    username: string;
}

const UserInfo: React.FC = () => {
    const {username} = useParams<UserInfoProps>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    if (!username) {
        setError(new Error('Unknown category or challenge'));
        setLoading(false);
        return;
    }


    const fetchChallengeDetailsForUser = async (solvedChallenges: SolvedChallenge[]) => {
        return await Promise.all(solvedChallenges.map(async (challenge) => {
            try {
                if (!challenge.name || !challenge.category)
                    return {...challenge, points: 0, loadingPoints: false};
                const challengeDetails = await fetchChallengeDetails(challenge.name, challenge.category);
                return {...challenge, points: challengeDetails.points, loadingPoints: false};
            } catch (err) {
                console.error(`Failed to fetch details for challenge ${challenge.name}:`, err);
                return {...challenge, points: 0, loadingPoints: false};
            }
        }));
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
                    {user.completion && <UserCompletionRadar completion={user.completion} useScore={false}/>}
                    {user.solved_challenges && <SolvedChallenges solvedChallenges={user.solved_challenges}/>}
                </>
            )}
        </div>
    );
};

export default UserInfo;
