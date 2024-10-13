import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {ThemeProvider} from "@mui/material";
import getTheme from "./theme";

const root = ReactDOM.createRoot(document.getElementById('root'));

const Main = () => {
    const [darkMode, setDarkMode] = useState(false)

    const theme = getTheme(darkMode)

    return (
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    )
}

root.render(<Main />);