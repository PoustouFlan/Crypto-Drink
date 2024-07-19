// scoreboard/TopPlayersGraph.tsx
import React, {useEffect, useState} from 'react';
import {Line} from 'react-chartjs-2';
import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    TimeScale,
    Title,
    Tooltip,
} from 'chart.js';
import 'chartjs-adapter-moment';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
    Filler // Register the Filler plugin
);

interface SolvedChallenge {
    date: string;
    points: number;
}

interface User {
    username: string;
    solvedChallenges?: SolvedChallenge[];
    score?: number;
}

interface TopPlayersGraphProps {
    users: User[];
}

const TopPlayersGraph: React.FC<TopPlayersGraphProps> = ({users}) => {
    const [cumulativeScores, setCumulativeScores] = useState<any[]>([]);

    useEffect(() => {
        const calculateCumulativeScores = () => {
            const allDates = new Set<string>();

            // Collect all unique dates from all users' challenges
            users.forEach(user => {
                user.solvedChallenges?.forEach(challenge => {
                    allDates.add(challenge.date);
                });
            });

            // Sort dates
            const sortedDates = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

            const scores = users.map(user => {
                let totalScore = 0;
                const dateScoreMap = new Map<string, number>();

                // Create a map of dates to cumulative scores
                const sortedChallenges = user.solvedChallenges?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                sortedChallenges?.forEach(challenge => {
                    totalScore += challenge.points;
                    dateScoreMap.set(challenge.date, totalScore);
                });

                // Generate cumulative score array for each date, using the last known score for missing dates
                totalScore = 0;
                return sortedDates.map(date => {
                    totalScore = dateScoreMap.get(date) ?? totalScore;
                    return {
                        date,
                        score: totalScore
                    };
                });
            });

            setCumulativeScores(scores);
        };

        calculateCumulativeScores();
    }, [users]);

    const data = {
        labels: cumulativeScores[0]?.map((cs: any) => cs.date) || [],
        datasets: users.map((user, index) => ({
            label: user.username,
            data: cumulativeScores[index]?.map((cs: any) => cs.score) || [],
            borderColor: `hsl(${index * 36}, 70%, 50%)`,
            backgroundColor: `hsla(${index * 36}, 70%, 50%, 0.2)`,
            fill: false,
        })),
    };

    const options = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                },
            },
        },
    };

    return (
        <div className="top-players-graph">
            <h2>Cumulative Scores of Top 10 Players</h2>
            <Line data={data} options={options}/>
        </div>
    );
};

export default TopPlayersGraph;
