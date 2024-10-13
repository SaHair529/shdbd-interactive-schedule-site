import { createTheme } from "@mui/material/styles"

const getTheme = (darkMode) => {
    return createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            text: {
                primary: darkMode ? '#e0e0e0' : '#333',
                secondary: darkMode ? '#555555' : '#b0b0b0',
            },
            primary: {
                main: '#1976d2'
            },
            secondary: {
                main: '#dc004e'
            },
            background: {
                default: darkMode ? '#1c1c1c' : '#f5f5f5'
            }
        }
    })
}

export default getTheme