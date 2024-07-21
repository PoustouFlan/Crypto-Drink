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
        initialSolvedChallenges.forEach(async (challenge) => {
            try {
                const challengeDetails = await fetchChallengeDetails(challenge.name, challenge.category);
                const updatedChallenge = {...challenge, points: challengeDetails.points, loadingPoints: false};

                setSolvedChallenges(prevChallenges => {
                    return prevChallenges.map(sc => (sc.name === updatedChallenge.name && sc.category === updatedChallenge.category)
                        ? updatedChallenge
                        : sc
                    );
                });
            } catch (err) {
                console.error(`Failed to fetch details for challenge ${challenge.name}:`, err);
                const updatedChallenge = {...challenge, points: 0, loadingPoints: false};

                setSolvedChallenges(prevChallenges => {
                    return prevChallenges.map(sc => (sc.name === updatedChallenge.name && sc.category === updatedChallenge.category)
                        ? updatedChallenge
                        : sc
                    );
                });
            }
        });
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
                            <Link to={scoreboardName == null ? `/category/${encodeURIComponent(challenge.category)}`
                                : `/scoreboard/${scoreboardName}/category/${encodeURIComponent(challenge.category)}`}>{challenge.category}</Link>
                        </td>
                        <td>
                            <Link
                                to={scoreboardName == null ? `/category/${encodeURIComponent(challenge.category)}/${encodeURIComponent(challenge.name)}`
                                    : `/scoreboard/${scoreboardName}/category/${encodeURIComponent(challenge.category)}/${encodeURIComponent(challenge.name)}`}>{challenge.name}</Link>
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
