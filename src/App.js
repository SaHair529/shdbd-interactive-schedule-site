import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import SchedulePage from "./pages/SchedulePage/SchedulePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import {useState} from "react";


function App() {
    const [token, setToken] = useState(null)

    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/schedule" element={<SchedulePage scheduleId={1}/>}/>
                    <Route path="/login" element={<LoginPage setToken={setToken}/> }/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
