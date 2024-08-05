// scoreboard/list.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './list.css';
import { deleteScoreboard } from '../api'; // Import the delete function
import { Scoreboard } from "../api";
import {getCurrentUser} from "../Utils.tsx"; // Assuming User is imported from api

interface ScoreboardListProps {
    scoreboards: Scoreboard[];
    onScoreboardDeleted: (name: string) => void; // Callback to refresh the list after deletion
}

const ScoreboardList: React.FC<ScoreboardListProps> = ({ scoreboards, onScoreboardDeleted}) => {
    const handleDelete = async (name: string) => {
        try {
            await deleteScoreboard(name);
            onScoreboardDeleted(name); // Notify parent component to refresh the list
        } catch (err) {
            console.error('Failed to delete scoreboard:', err);
        }
    };

    const currentUser = getCurrentUser();
    return (
        <table className="scoreboard-table">
            <thead>
            <tr>
                <th>Name</th>
                <th>Owner</th>
                <th>Number of Users</th>
                <th>Actions</th>
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
                    <td>{scoreboard.owner}</td>
                    <td>{scoreboard.users.length}</td>
                    <td>
                        {currentUser && currentUser === scoreboard.owner && (
                            <button onClick={() => handleDelete(scoreboard.name)} className="delete-button">
                                Delete
                            </button>
                        )}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default ScoreboardList;
