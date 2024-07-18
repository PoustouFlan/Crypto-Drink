// App.js
import React from 'react';
import {BrowserRouter as Router, Route, Routes, useParams} from 'react-router-dom';
import UserInfo from './UserInfo';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/user/:username" element={<UserRoute />} />
                {/* Add other routes here */}
            </Routes>
        </Router>
    );
};

const UserRoute = () => {
    const { username } = useParams();
    return <UserInfo username={username} />;
};

export default App;
