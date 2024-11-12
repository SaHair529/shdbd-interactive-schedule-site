import {Link, useLocation, useNavigate} from "react-router-dom";
import {IconButton, Menu, MenuItem} from "@mui/material";
import {
    Event,
    ExitToApp,
    GridView,
    NightsStay,
    WbSunny
} from "@mui/icons-material";
import {useState} from "react";


const MenuButton = ({darkMode, setDarkMode}) => {
    const location = useLocation()
    const navigate = useNavigate()
    const ignoredRoutes = ['/register', '/login']
    const hideMenu = ignoredRoutes.includes(location.pathname)
    const [anchorEl, setAnchorEl] = useState(null)

    const openMenu = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const closeMenu = () => {
        setAnchorEl(null)
    }

    const logout = () => {
        closeMenu()
        localStorage.removeItem('userSessionData')
        navigate('/login')
    }

    const toggleTheme = () => {
        setDarkMode(!darkMode)
        closeMenu()
    }

    if (hideMenu)
        return

    return (
        <>
            <IconButton onClick={openMenu} color='primary'
                sx ={{
                    position: 'fixed',
                    top: 16,
                    right: 50,
                    zIndex: 1000
                }}
            >
                <GridView />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
                <MenuItem onClick={closeMenu} component={Link} to='/' ><Event sx={{mr: 1}} />Мои расписания</MenuItem>
                <MenuItem onClick={toggleTheme}>
                    {darkMode ? <WbSunny sx={{ mr: 1 }} /> : <NightsStay sx={{ mr: 1 }} />}
                    {darkMode ? 'Светлая тема' : 'Темная тема'}
                </MenuItem>
                <MenuItem onClick={logout} sx={{color: 'red'}}><ExitToApp sx={{mr: 1}} />Выход</MenuItem>
            </Menu>
        </>
    )
}

export default MenuButton