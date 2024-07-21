import React, {useEffect, useRef, useState} from 'react';
import {Line} from 'react-chartjs-2';
import "./graph.css";
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
import zoomPlugin from 'chartjs-plugin-zoom';
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
    Filler,
    zoomPlugin // Register the zoom plugin
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
    const [timeRange, setTimeRange] = useState<'all' | 'day' | 'week' | 'month' | 'year'>('all');
    const chartRef = useRef<any>(null);

    useEffect(() => {
        const calculateCumulativeScores = () => {
            const allDates = new Set<string>();

            users.forEach(user => {
                user.solvedChallenges?.forEach(challenge => {
                    allDates.add(challenge.date);
                });
            });

            const sortedDates = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

            const scores = users.map(user => {
                let totalScore = 0;
                const dateScoreMap = new Map<string, number>();

                const sortedChallenges = user.solvedChallenges?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                sortedChallenges?.forEach(challenge => {
                    totalScore += challenge.points;
                    dateScoreMap.set(challenge.date, totalScore);
                });

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

    const getTimeRangeLimits = (range: 'all' | 'day' | 'week' | 'month' | 'year') => {
        const now = new Date();
        let minDate = new Date(0); // Epoch time
        switch (range) {
            case 'day':
                minDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                break;
            case 'week':
                minDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                minDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case 'year':
                minDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                minDate = new Date(Math.min(...cumulativeScores.flatMap(userScores => userScores.map(score => new Date(score.date).getTime()))));
        }

        return {min: minDate, max: now};
    };

    useEffect(() => {
        if (chartRef.current) {
            const chart = chartRef.current;
            const {min, max} = getTimeRangeLimits(timeRange);
            chart.options.scales.x.min = min;
            chart.options.scales.x.max = max;
            chart.update();
        }
    }, [timeRange, cumulativeScores]);

    const data = {
        labels: cumulativeScores[0]?.map((cs: any) => cs.date) || [],
        datasets: users.map((user, index) => ({
            label: user.username,
            data: cumulativeScores[index]?.map((cs: any) => cs.score) || [],
            borderColor: `hsl(${index * 36}, 70%, 50%)`,
            backgroundColor: `hsla(${index * 36}, 70%, 50%, 0.2)`,
            fill: false,
            pointRadius: 0, // Remove circles
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
        plugins: {
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true,
                    },
                    mode: 'x',
                },
                pan: {
                    enabled: true,
                    mode: 'x',
                },
            },
        },
    };

    const handleTimeRangeChange = (range: 'all' | 'day' | 'week' | 'month' | 'year') => {
        setTimeRange(range);
    };

    const handleResetZoom = () => {
        chartRef.current.resetZoom();
    };

    const handleFullScreen = () => {
        const graphElement = document.getElementById('top-players-graph');
        if (graphElement.requestFullscreen) {
            graphElement.requestFullscreen();
        } else if (graphElement.mozRequestFullScreen) { // Firefox
            graphElement.mozRequestFullScreen();
        } else if (graphElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
            graphElement.webkitRequestFullscreen();
        } else if (graphElement.msRequestFullscreen) { // IE/Edge
            graphElement.msRequestFullscreen();
        }
    };

    return (
        <div id="top-players-graph">
            <h2>Cumulative Scores of Top 10 Players</h2>
            <div className="button-group">
                <button onClick={() => handleTimeRangeChange('all')}>All</button>
                <button onClick={() => handleTimeRangeChange('day')}>Last Day</button>
                <button onClick={() => handleTimeRangeChange('week')}>Last Week</button>
                <button onClick={() => handleTimeRangeChange('month')}>Last Month</button>
                <button onClick={() => handleTimeRangeChange('year')}>Last Year</button>
                <button onClick={handleResetZoom}>Reset Zoom</button>
                <button onClick={handleFullScreen}>Full Screen</button>
            </div>
            <Line ref={chartRef} data={data} options={options}/>
        </div>
    );
};

export default TopPlayersGraph;
