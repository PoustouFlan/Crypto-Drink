import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import UserInfo from './user/info';
import ScoreboardInfo from './scoreboard/info';
import ScoreboardPage from "./scoreboard/page.tsx";
import CategoryList from "./category/list.tsx";
import ChallengeList from "./challenge/list.tsx";
import ChallengeFlaggers from "./challenge/flaggers.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/user/:username" element={<UserInfo/>}/>
                <Route path="/scoreboard/:scoreboardName/user/:username" element={<UserInfo/>}/>
                <Route path="/scoreboard" element={<ScoreboardPage/>}/>
                <Route path="/scoreboard/:scoreboardName" element={<ScoreboardInfo/>}/>
                <Route path="/category" element={<CategoryList/>}/>
                <Route path="/scoreboard/:scoreboardName/category" element={<CategoryList/>}/>
                <Route path="/category/:categoryName" element={<ChallengeList/>}/>
                <Route path="/scoreboard/:scoreboardName/category/:categoryName" element={<ChallengeList/>}/>
                <Route path="/category/:categoryName/:challengeName" element={<ChallengeFlaggers/>}/>
                <Route path="/scoreboard/:scoreboardName/category/:categoryName/:challengeName"
                       element={<ChallengeFlaggers/>}/>
            </Routes>
        </Router>
    );
};

export default App;