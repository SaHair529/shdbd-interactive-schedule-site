import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {ThemeProvider} from "@mui/material";
import getTheme from "./theme";

const root = ReactDOM.createRoot(document.getElementById('root'));

const Main = () => {
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode')
        return savedMode === 'true'
    })

    const theme = getTheme(darkMode)

    useEffect(() => {
        localStorage.setItem('darkMode', darkMode)
    }, [darkMode])

    return (
        <ThemeProvider theme={theme}>
            <App darkMode={darkMode} setDarkMode={setDarkMode} />
        </ThemeProvider>
    )
}

root.render(<Main />);