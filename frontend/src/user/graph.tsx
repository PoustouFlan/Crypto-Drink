// ScoreGraph.tsx
import React from 'react';
import {Line} from 'react-chartjs-2';
import {
    CategoryScale,
    Chart as ChartJS,
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
);

interface SolvedChallenge {
    date: string;
    points: number;
}

interface ScoreGraphProps {
    solvedChallenges: SolvedChallenge[];
}

const ScoreGraph: React.FC<ScoreGraphProps> = ({solvedChallenges}) => {
    const calculateCumulativeScores = () => {
        const sortedChallenges = solvedChallenges.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        const cumulativeScores = [];
        let totalScore = 0;

        for (const challenge of sortedChallenges) {
            totalScore += challenge.points;
            cumulativeScores.push({date: challenge.date, score: totalScore});
        }

        return cumulativeScores;
    };

    const cumulativeScores = calculateCumulativeScores();

    const data = {
        labels: cumulativeScores.map(cs => cs.date),
        datasets: [
            {
                label: 'Score',
                data: cumulativeScores.map(cs => cs.score),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true
            }
        ]
    };

    const options = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day'
                }
            }
        }
    };

    return <Line data={data} options={options}/>;
};

export default ScoreGraph;
