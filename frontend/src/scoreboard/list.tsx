// scoreboard/ScoreboardList.tsx
import React from 'react';
import {Link} from 'react-router-dom';
import './list.css';

interface Scoreboard {
    name: string;
    users: string[];
}

interface ScoreboardListProps {
    scoreboards: Scoreboard[];
}

const ScoreboardList: React.FC<ScoreboardListProps> = ({scoreboards}) => {
    return (
        <table className="scoreboard-table">
            <thead>
            <tr>
                <th>Name</th>
                <th>Number of Users</th>
            </tr>
            </thead>
            <tbody>
            {scoreboards.map((scoreboard, index) => (
                <tr key={index}>
                    <td>
                        <Link to={`/scoreboard/${scoreboard.name}`} className="scoreboard-link">
                            {scoreboard.name}
                        </Link>
                    </td>
                    <td>{scoreboard.users.length}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default ScoreboardList;
