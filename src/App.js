import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import SchedulePage from "./pages/SchedulePage/SchedulePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import {useState} from "react";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import SchedulesListPage from "./pages/SchedulesListPage/SchedulesListPage";
import MenuButton from "./components/MenuButton";
import AdminProtectedRoute from "./pages/AdminProtectedRoute";
import AdminScheduleListPage from "./pages/Admin/AdminScheduleListPage/AdminScheduleListPage";
import AdminSchedulePage from "./pages/Admin/AdminSchedulePage/AdminSchedulePage";
import AdminUserListPage from "./pages/Admin/AdminUserListPage/AdminUserListPage";


function App({darkMode, setDarkMode}) {
    const [userSessionData, setUserSessionData] = useState(() => JSON.parse(localStorage.getItem('userSessionData')));

    return (
        <div className="App">
            <Router>

                <MenuButton userSessionData={userSessionData} darkMode={darkMode} setDarkMode={setDarkMode} />
                <Routes>
                    <Route path="/login" element={<LoginPage setUserSessionData={setUserSessionData} /> }/>
                    <Route path="/register" element={<RegisterPage/> }/>

                    <Route path="/" element={<ProtectedRoute userSessionData={userSessionData} element={<SchedulesListPage userSessionData={userSessionData} />} />}/>
                    <Route path="/schedule/:id" element={<ProtectedRoute userSessionData={userSessionData} element={<SchedulePage userSessionData={userSessionData} />} />}/>

                    <Route path="/admin" element={<AdminProtectedRoute userSessionData={userSessionData} element={<AdminScheduleListPage userSessionData={userSessionData} />} />}/>
                    <Route path="/admin/schedule/:id" element={<AdminProtectedRoute userSessionData={userSessionData} element={<AdminSchedulePage userSessionData={userSessionData} />} />}/>
                    <Route path="/admin/users" element={<AdminProtectedRoute userSessionData={userSessionData} element={<AdminUserListPage userSessionData={userSessionData} />} />}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
