// user/solved.tsx

import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import {fetchChallengeDetails} from '../api';
import {Link, useParams} from "react-router-dom";

interface SolvedChallenge {
    date: string;
    category: string;
    name: string;
    points?: number;
    loadingPoints: boolean;
}

interface SolvedChallengesProps {
    solvedChallenges: SolvedChallenge[];
}

const SolvedChallenges: React.FC<SolvedChallengesProps> = ({solvedChallenges: initialSolvedChallenges}) => {
    const {scoreboardName} = useParams<{ scoreboardName?: string }>();
    const [solvedChallenges, setSolvedChallenges] = useState<SolvedChallenge[]>(initialSolvedChallenges);

    useEffect(() => {
        // Create a function to fetch and update challenges
        const fetchAndUpdateChallenges = async () => {
            const updatedChallenges = await Promise.all(initialSolvedChallenges.map(async (challenge) => {
                try {
                    const challengeDetails = await fetchChallengeDetails(challenge.name, challenge.category);
                    return {...challenge, points: challengeDetails.points, loadingPoints: false};
                } catch (err) {
                    console.error(`Failed to fetch details for challenge ${challenge.name}:`, err);
                    return {...challenge, points: 0, loadingPoints: false};
                }
            }));

            // Sort challenges by date in descending order
            updatedChallenges.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            setSolvedChallenges(updatedChallenges);
        };

        fetchAndUpdateChallenges();
    }, [initialSolvedChallenges]);

    return (
        <div className="recent-solves">
            <h3>Solved Challenges</h3>
            <table>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Challenge</th>
                    <th>Points</th>
                </tr>
                </thead>
                <tbody>
                {solvedChallenges.map((challenge, index) => (
                    <tr key={index}>
                        <td>{challenge.date}</td>
                        <td>
                            <Link to={scoreboardName == null
                                ? `/category/${encodeURIComponent(challenge.category)}`
                                : `/scoreboard/${scoreboardName}/category/${encodeURIComponent(challenge.category)}`}>
                                {challenge.category}
                            </Link>
                        </td>
                        <td>
                            <Link
                                to={scoreboardName == null
                                    ? `/category/${encodeURIComponent(challenge.category)}/${encodeURIComponent(challenge.name)}`
                                    : `/scoreboard/${scoreboardName}/category/${encodeURIComponent(challenge.category)}/${encodeURIComponent(challenge.name)}`}>
                                {challenge.name}
                            </Link>
                        </td>
                        <td>
                            {challenge.loadingPoints ? (
                                <span>Loading...</span>
                            ) : (
                                <span>
                                        <FontAwesomeIcon icon={faStar} className="gold-text"/> {challenge.points}
                                    </span>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default SolvedChallenges;