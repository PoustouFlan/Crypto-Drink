import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserInfo from './user/info';
import ScoreboardInfo from './scoreboard/info';
import ScoreboardPage from "./scoreboard/page.tsx";
import CategoryList from "./category/list.tsx";
import ChallengeList from "./challenge/list.tsx";
import ChallengeFlaggers from "./challenge/flaggers.tsx";
import LoginPage from "./auth/Login.tsx";
import LogoutPage from "./auth/Logout.tsx";
import ProtectedRoute from './auth/ProtectedRoute';
import Navbar from "./Navbar.tsx";

const App: React.FC = () => {
    const jwt = localStorage.getItem('jwt');
    const isAuthenticated = Boolean(jwt);

    return (
        <Router>
            <Navbar isAuthenticated={isAuthenticated} />
            <Routes>
                <Route path="/user" element={<ProtectedRoute element={<UserInfo />} isAuthenticated={isAuthenticated} />} />
                <Route path="/user/:username" element={<UserInfo />} />
                <Route path="/scoreboard/:scoreboardName/user/" element={<ProtectedRoute element={<UserInfo />} isAuthenticated={isAuthenticated} />} />
                <Route path="/scoreboard/:scoreboardName/user/:username" element={<UserInfo />} />
                <Route path="/scoreboard" element={<ScoreboardPage />} />
                <Route path="/scoreboard/:scoreboardName" element={<ScoreboardInfo />} />
                <Route path="/category" element={<CategoryList />} />
                <Route path="/scoreboard/:scoreboardName/category" element={<CategoryList />} />
                <Route path="/category/:categoryName" element={<ChallengeList />} />
                <Route path="/scoreboard/:scoreboardName/category/:categoryName" element={<ChallengeList />} />
                <Route path="/category/:categoryName/:challengeName" element={<ChallengeFlaggers />} />
                <Route path="/scoreboard/:scoreboardName/category/:categoryName/:challengeName" element={<ChallengeFlaggers />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/logout" element={<LogoutPage />} />
                <Route path="/205-s-01" element={<EasterEgg />} />
            </Routes>
        </Router>
    );
};

const EasterEgg: React.FC = () => {
    const flag = "ASM{Reference_Easter_Egg!}";
    return <h1>{flag}</h1>
}
export default App;
