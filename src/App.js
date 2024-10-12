import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import SchedulePage from "./pages/SchedulePage/SchedulePage";


function App() {
  return (
      <div className="App">
        <Router>
          <Routes>
            <Route path="/schedule" element={<SchedulePage scheduleId={1} />} />
          </Routes>
        </Router>
      </div>
  );
}

export default App;
