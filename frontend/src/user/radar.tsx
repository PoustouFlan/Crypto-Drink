// user/radar.tsx
import React, {useState} from 'react';
import {Radar} from 'react-chartjs-2';
import {Chart, Filler, Legend, LineElement, PointElement, RadialLinearScale, Tooltip} from 'chart.js';

Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface UserCompletionRadarProps {
    completion: {
        name: string;
        solved: number;
        total: number;
        score: number;
        total_score: number;
    }[];
    useScore?: boolean;
}

const UserCompletionRadar: React.FC<UserCompletionRadarProps> = ({completion, useScore = false}) => {
    const [showScore, setShowScore] = useState(useScore);

    const data = {
        labels: completion.map(c => c.name),
        datasets: [
            {
                label: showScore ? 'Score' : 'Challenges Solved',
                data: showScore
                    ? completion.map(c => (c.score / c.total_score) * 100)
                    : completion.map(c => (c.solved / c.total) * 100),
                backgroundColor: completion.map(c => (c.solved === c.total ? 'rgba(34, 202, 236, 0.5)' : 'rgba(34, 202, 236, 0.2)')),
                borderColor: 'rgba(34, 202, 236, 1)',
                pointBackgroundColor: completion.map(c => (c.solved === c.total ? 'rgba(34, 202, 236, 1)' : 'rgba(0, 0, 0, 0.1)')),
                borderWidth: 2,
            },
        ],
    };

    const options = {
        scales: {
            r: {
                angleLines: {
                    display: false,
                },
                suggestedMin: 0,
                suggestedMax: 100,
                ticks: {
                    callback: (value: number) => `${value}%`,
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const index = context.dataIndex;
                        const category = completion[index];
                        if (showScore) {
                            return `${category.name}: ${category.score} / ${category.total_score} (${Math.round(context.raw)}%)`;
                        } else {
                            return `${category.name}: ${category.solved} / ${category.total} (${Math.round(context.raw)}%)`;
                        }
                    },
                },
            },
        },
    };

    return (
        <div>
            <button onClick={() => setShowScore(!showScore)}>
                {showScore ? 'Show Challenges Solved' : 'Show Score'}
            </button>
            <Radar data={data} options={options}/>
        </div>
    );
};

export default UserCompletionRadar;