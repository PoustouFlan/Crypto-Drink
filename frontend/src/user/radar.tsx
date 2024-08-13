// src/user/radar.tsx
import React, { useState } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart, Filler, Legend, LineElement, PointElement, RadialLinearScale, Tooltip } from 'chart.js';
import { Completion, User } from '../api';
import { colorScheme } from '../Utils';

Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface UserCompletionRadarProps {
    completions: User[];
    useScore?: boolean;
    colorScheme?: string[];
}

const UserCompletionRadar: React.FC<UserCompletionRadarProps> = ({ completions, useScore = false }) => {
    const [showScore, setShowScore] = useState(useScore);

    function filteredCompletion(user: User): Completion[] {
        if (user.completion == null) return [];
        return showScore
            ? user.completion.filter(c => c.total_score !== 0)
            : user.completion.filter(c => c.total !== 0);
    }

    const data = {
        labels: filteredCompletion(completions[0]).map(c => c.name),
        datasets: completions.map((user, index) => ({
            label: user.username,
            data: showScore
                ? filteredCompletion(user).map(c => (c.score / c.total_score) * 100)
                : filteredCompletion(user).map(c => (c.solved / c.total) * 100),
            borderColor: colorScheme[index] || 'rgba(34, 202, 236, 1)',
            pointBackgroundColor: filteredCompletion(user).map(c => (c.solved === c.total ? colorScheme[index] || 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.1)')),
            borderWidth: 2,
        }))
    };

    const options = {
        scales: {
            r: {
                type: 'radialLinear' as const,
                angleLines: {
                    display: false,
                },
                suggestedMin: 0,
                suggestedMax: 100,
                ticks: {
                    backdropColor: 'rgba(0, 0, 0, 0)',
                    callback: function (value: number | string) {
                        return typeof value === 'number' ? `${value}%` : `${value}`;
                    },
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const datasetIndex = context.datasetIndex;
                        const index = context.dataIndex;
                        const category = filteredCompletion(completions[datasetIndex])[index];
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
        <div id="user-completion-radar">
            <button onClick={() => setShowScore(!showScore)}>
                {showScore ? 'Show Challenges Solved' : 'Show Score'}
            </button>
            <Radar data={data} options={options} />
        </div>
    );
};

export default UserCompletionRadar;
