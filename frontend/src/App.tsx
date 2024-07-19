import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import UserInfo from './user/info';
import ScoreboardInfo from './scoreboard/info';
import ScoreboardPage from "./scoreboard/page.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/user/:username" element={<UserInfo/>}/>
                <Route path="/scoreboard" element={<ScoreboardPage/>}/>
                <Route path="/scoreboard/:name" element={<ScoreboardInfo/>}/>
            </Routes>
        </Router>
    );
};

export default App;