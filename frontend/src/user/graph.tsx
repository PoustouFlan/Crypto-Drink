// src/user/graph.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    CategoryScale,
    Chart as ChartJS,
    ChartOptions,
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
import 'chartjs-adapter-moment'; // for time scale
import "./graph.css";
import {User} from '../api';
import {colorScheme} from '../Utils';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCompress, faExpand} from "@fortawesome/free-solid-svg-icons";

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
    zoomPlugin
);

interface ScoreEntry {
    date: string;
    score: number;
}

interface ScoreGraphProps {
    users: User[];
    singleUser?: boolean;
}

const ScoreGraph: React.FC<ScoreGraphProps> = ({ users, singleUser = false }) => {
    const [cumulativeScores, setCumulativeScores] = useState<ScoreEntry[][]>([]);
    const [timeRange, setTimeRange] = useState<'week' | 'month' | '4months' | 'year' | 'all'>('all');
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
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
                    totalScore += challenge.points || 0;
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

        return { min: startDate.getTime(), max: endDate.getTime() };
    };

    useEffect(() => {
        if (chartRef.current) {
            const chart = chartRef.current;
            const { min, max } = getTimeRangeLimits(timeRange, endDate);

            chart.options.scales.x.min = min;
            chart.options.scales.x.max = max;

            chart.update('none');
        }
    }, [timeRange, endDate, cumulativeScores]);

    const data = {
        labels: cumulativeScores[0]?.map(score => score.date) || [],
        datasets: users.map((user, index) => ({
            label: user.username,
            data: cumulativeScores[index]?.map(score => score.score) || [],
            borderColor: singleUser ? 'rgba(255, 99, 132, 1)' : colorScheme[index] || 'rgba(34, 202, 236, 1)',
            backgroundColor: singleUser ? 'rgba(255, 99, 132, 0.2)' : 'rgba(34, 202, 236, 0.2)',
            fill: singleUser,
            pointRadius: singleUser || timeRange === 'week' || timeRange === "month" ? 3 : 0, // Show points for week or less
        })),
    };

    const options: ChartOptions<'line'> = {
        scales: {
            x: {
                type: 'time', // Must be exactly 'time'
                time: {
                    unit: 'day' as const, // Explicitly type as 'day'
                },
                min: getTimeRangeLimits(timeRange, endDate).min, // Ensure min is a number (timestamp)
                max: getTimeRangeLimits(timeRange, endDate).max, // Ensure max is a number (timestamp)
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
                    mode: 'x' as const, // Explicitly type as 'x'
                },
                pan: {
                    enabled: true,
                    mode: 'x' as const, // Explicitly type as 'x'
                },
            },
        },
    };

    const handleTimeRangeChange = (range: 'week' | 'month' | '4months' | 'year' | 'all') => {
        if (chartRef.current) {
            const chart = chartRef.current;

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
                } else if ((graphElement as any).mozRequestFullScreen) { // Firefox
                    (graphElement as any).mozRequestFullScreen();
                } else if ((graphElement as any).webkitRequestFullscreen) { // Chrome, Safari and Opera
                    (graphElement as any).webkitRequestFullscreen();
                } else if ((graphElement as any).msRequestFullscreen) { // IE/Edge
                    (graphElement as any).msRequestFullscreen();
                }
            }
            setIsFullScreen(!isFullScreen);
        }
    };

    return (
        <div id="top-players-graph">
            <div className="button-group">
                <div className="duration-buttons">
                <button onClick={() => handleTimeRangeChange('week')}>1 Week</button>
                <button onClick={() => handleTimeRangeChange('month')}>1 Month</button>
                <button onClick={() => handleTimeRangeChange('4months')}>4 Months</button>
                <button onClick={() => handleTimeRangeChange('year')}>1 Year</button>
                <button onClick={() => handleTimeRangeChange('all')}>All</button>
                </div>
                <button onClick={handleFullScreen}>{isFullScreen ? <FontAwesomeIcon icon={faCompress}/> : <FontAwesomeIcon icon={faExpand} />}</button>
            </div>
            <Line ref={chartRef} data={data} options={options} />
        </div>
    );
};

export default ScoreGraph;