// Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

import "./Navbar.css"

const Navbar: React.FC<{ isAuthenticated: boolean }> = ({ isAuthenticated }) => {
    return (
        <nav style={{ padding: '10px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between' }}>
            <div>
                <Link to="/scoreboard" style={{ margin: '0 10px' }}>Scoreboards</Link>
                <Link to="/category" style={{ margin: '0 10px' }}>Categories</Link>
            </div>
            <div>
                {isAuthenticated ? (
                    <>
                        <Link to="/user" style={{ margin: '0 10px' }}>Profile</Link>
                        <Link to="/logout" style={{ margin: '0 10px' }}>Log out</Link>
                    </>
                ) : (
                    <Link to="/login" style={{ margin: '0 10px' }}>Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
