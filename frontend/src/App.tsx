import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import UserInfo from './user/info';
import ScoreboardInfo from './scoreboard/info';
import ScoreboardPage from "./scoreboard/page.tsx";
import CategoryList from "./category/list.tsx";
import ChallengeList from "./challenge/list.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/user/:username" element={<UserInfo/>}/>
                <Route path="/scoreboard/:name/user/:username" element={<UserInfo/>}/>
                <Route path="/scoreboard" element={<ScoreboardPage/>}/>
                <Route path="/scoreboard/:name" element={<ScoreboardInfo/>}/>
                <Route path="/category" element={<CategoryList/>}/>
                <Route path="/category/:category" element={<ChallengeList/>}/>
                <Route path="/scoreboard/:name/category" element={<CategoryList/>}/>
                <Route path="/scoreboard/:name/category/:category" element={<ChallengeList/>}/>
            </Routes>
        </Router>
    );
};

export default App;