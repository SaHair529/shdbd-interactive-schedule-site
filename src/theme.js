import { createTheme } from "@mui/material/styles"

const getTheme = (darkMode) => {
    return createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: {
                main: '#1976d2'
            },
            secondary: {
                main: '#dc004e'
            },
            background: {
                default: darkMode ? '#2a2a2a' : '#e3f2fd'
            }
        }
    })
}

export default getTheme