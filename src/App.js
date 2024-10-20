import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import SchedulePage from "./pages/SchedulePage/SchedulePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import {useState} from "react";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import SchedulesListPage from "./pages/SchedulesListPage/SchedulesListPage";
import MenuButton from "./components/MenuButton";


function App() {
    const [token, setToken] = useState(() => localStorage.getItem('accessToken') || null)

    return (
        <div className="App">
            <Router>
                <MenuButton/>
                <Routes>
                    <Route path="/login" element={<LoginPage setToken={setToken}/> }/>
                    <Route path="/register" element={<RegisterPage/> }/>

                    <Route path="/" element={<ProtectedRoute token={token} element={<SchedulesListPage token={token} />} />}/>
                    <Route path="/schedule/:id" element={<ProtectedRoute token={token} element={<SchedulePage token={token} />} />}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
