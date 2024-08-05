// Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

import "./Navbar.css"

const Navbar: React.FC<{ isAuthenticated: boolean }> = ({ isAuthenticated }) => {
    return (
        <nav>
            <div>
                <Link to="/scoreboard">Scoreboards</Link>
                <Link to="/category">Categories</Link>
            </div>
            <div>
                {isAuthenticated ? (
                    <>
                        <Link to="/user">Profile</Link>
                        <Link to="/logout">Log out</Link>
                    </>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
