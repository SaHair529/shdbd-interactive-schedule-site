import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import SchedulePage from "./pages/SchedulePage/SchedulePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import {useState} from "react";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import SchedulesListPage from "./pages/SchedulesListPage/SchedulesListPage";


function App() {
    const [token, setToken] = useState(() => localStorage.getItem('accessToken') || null)
    console.log(token)

    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage setToken={setToken}/> }/>
                    <Route path="/register" element={<RegisterPage/> }/>

                    <Route path="/schedule" element={<ProtectedRoute token={token} element={<SchedulePage scheduleId={1} />} />}/>
                    <Route path="/schedules_list" element={<ProtectedRoute token={token} element={<SchedulesListPage token={token} />} />}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
