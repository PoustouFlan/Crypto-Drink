// user/graph.tsx
import React, {useEffect, useRef, useState} from 'react';
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
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-moment';
import "./graph.css";

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
    solved_challenges?: SolvedChallenge[];
    score?: number;
}

interface ScoreGraphProps {
    users: User[];
    singleUser?: boolean;
}

const ScoreGraph: React.FC<ScoreGraphProps> = ({users, singleUser = false}) => {
    const [cumulativeScores, setCumulativeScores] = useState<any[]>([]);
    const [timeRange, setTimeRange] = useState<'week' | 'month' | '4months' | 'year' | 'all'>('all');
    const [endDate, setEndDate] = useState<Date | null>(null); // Store the end date
    const [isFullScreen, setIsFullScreen] = useState(false); // Track fullscreen mode
    const chartRef = useRef<any>(null);

    useEffect(() => {
        const calculateCumulativeScores = () => {
            const allDates = new Set<string>();

            users.forEach(user => {
                user.solved_challenges?.forEach(challenge => {
                    allDates.add(challenge.date);
                });
            });

            const sortedDates = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

            const scores = users.map(user => {
                let totalScore = 0;
                const dateScoreMap = new Map<string, number>();

                const sortedChallenges = user.solved_challenges?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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

            // Set the end date to the last date of the dataset
            if (sortedDates.length > 0) {
                setEndDate(new Date(sortedDates[sortedDates.length - 1]));
            }
        };

        calculateCumulativeScores();
    }, [users]);

    const getTimeRangeLimits = (range: 'week' | 'month' | '4months' | 'year' | 'all', endDate: Date | null) => {
        const now = new Date();
        if (!endDate) endDate = now;

        let startDate = new Date(endDate);
        switch (range) {
            case 'week':
                startDate.setDate(endDate.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(endDate.getMonth() - 1);
                break;
            case '4months':
                startDate.setMonth(endDate.getMonth() - 4);
                break;
            case 'year':
                startDate.setFullYear(endDate.getFullYear() - 1);
                break;
            default:
                startDate = new Date(Math.min(...cumulativeScores.flatMap(userScores => userScores.map(score => new Date(score.date).getTime()))));
                break;
        }

        return {min: startDate, max: endDate};
    };

    useEffect(() => {
        if (chartRef.current) {
            const chart = chartRef.current;
            const {min, max} = getTimeRangeLimits(timeRange, endDate);

            // Update x-axis with new range
            chart.options.scales.x.min = min;
            chart.options.scales.x.max = max;

            // Force the chart to re-render
            chart.update('none'); // Avoid animation when updating
        }
    }, [timeRange, cumulativeScores, endDate]);

    const data = {
        labels: cumulativeScores[0]?.map((cs: any) => cs.date) || [],
        datasets: users.map((user, index) => ({
            label: singleUser ? 'Score' : user.username,
            data: cumulativeScores[index]?.map((cs: any) => cs.score) || [],
            borderColor: singleUser ? 'rgba(255, 99, 132, 1)' : `hsl(${index * 36}, 70%, 50%)`,
            backgroundColor: singleUser ? 'rgba(255, 99, 132, 0.2)' : `hsla(${index * 36}, 70%, 50%, 0.2)`,
            fill: singleUser,
            pointRadius: singleUser || timeRange === 'week' || timeRange === "month" ? 3 : 0, // Show points for week or less
        })),
    };

    const options = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                },
                min: getTimeRangeLimits(timeRange, endDate).min,
                max: getTimeRangeLimits(timeRange, endDate).max,
            },
            y: {
                min: 0, // Y-axis starts from 0
                max: Math.round(Math.max(...cumulativeScores.flatMap(userScores => userScores.map(score => score.score))) * 1.1), // Set max to 110% of the max score for padding
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

    const handleTimeRangeChange = (range: 'week' | 'month' | '4months' | 'year' | 'all') => {
        if (chartRef.current) {
            const chart = chartRef.current;
            const {min} = getTimeRangeLimits(range, endDate);

            // Update endDate based on current chart view
            setEndDate(new Date(chart.options.scales.x.max));

            setTimeRange(range);
        }
    };

    const handleFullScreen = () => {
        const graphElement = document.getElementById('top-players-graph');
        if (graphElement) {
            if (isFullScreen) {
                document.exitFullscreen();
            } else {
                if (graphElement.requestFullscreen) {
                    graphElement.requestFullscreen();
                } else if (graphElement.mozRequestFullScreen) { // Firefox
                    graphElement.mozRequestFullScreen();
                } else if (graphElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
                    graphElement.webkitRequestFullscreen();
                } else if (graphElement.msRequestFullscreen) { // IE/Edge
                    graphElement.msRequestFullScreen();
                }
            }
            setIsFullScreen(!isFullScreen);
        }
    };

    return (
        <div id="top-players-graph">
            <h2>{singleUser ? 'Score' : 'Scores of Top 10 Players'}</h2>
            <div className="button-group">
                <button onClick={() => handleTimeRangeChange('week')}>1 Week</button>
                <button onClick={() => handleTimeRangeChange('month')}>1 Month</button>
                <button onClick={() => handleTimeRangeChange('4months')}>4 Months</button>
                <button onClick={() => handleTimeRangeChange('year')}>1 Year</button>
                <button onClick={() => handleTimeRangeChange('all')}>All</button>
                <button onClick={handleFullScreen}>{isFullScreen ? 'Exit Full Screen' : 'Full Screen'}</button>
            </div>
            <Line ref={chartRef} data={data} options={options}/>
        </div>
    );
};

export default ScoreGraph;
