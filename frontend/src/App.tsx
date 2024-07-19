import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import UserInfo from './user/info';
import ScoreboardList from './scoreboard/list';
import ScoreboardInfo from './scoreboard/info';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/user/:username" element={<UserInfo/>}/>
                <Route path="/scoreboard" element={<ScoreboardList/>}/>
                <Route path="/scoreboard/:name" element={<ScoreboardInfo/>}/>
            </Routes>
        </Router>
    );
};

export default App;