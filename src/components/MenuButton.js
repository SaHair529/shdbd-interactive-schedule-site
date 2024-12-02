import {Link, useLocation, useNavigate} from "react-router-dom";
import {IconButton, Menu, MenuItem, Typography} from "@mui/material";
import {
    Event,
    ExitToApp,
    GridView,
    NightsStay,
    WbSunny,
    Person
} from "@mui/icons-material";
import {useState} from "react";


const MenuButton = ({darkMode, setDarkMode, userSessionData}) => {
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

    const userMenu = (
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
                <MenuItem disabled>
                    <Typography variant="body2" sx={{ flexGrow: 1, textAlign: 'center' }}>{ userSessionData.fullName.split(' ').slice(0,2).join(' ') }</Typography>
                </MenuItem>
                <MenuItem onClick={closeMenu} component={Link} to='/' ><Event sx={{mr: 1}} />Мои расписания</MenuItem>
                <MenuItem onClick={toggleTheme}>
                    {darkMode ? <WbSunny sx={{ mr: 1 }} /> : <NightsStay sx={{ mr: 1 }} />}
                    {darkMode ? 'Светлая тема' : 'Темная тема'}
                </MenuItem>
                <MenuItem onClick={logout} sx={{color: 'red'}}><ExitToApp sx={{mr: 1}} />Выход</MenuItem>
            </Menu>
        </>
    )

    const adminMenu = (
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
                <MenuItem disabled>
                    <Typography variant="body2" sx={{ flexGrow: 1, textAlign: 'center' }}>{ userSessionData.fullName.split(' ').slice(0,2).join(' ') }</Typography>
                </MenuItem>
                <MenuItem onClick={closeMenu} component={Link} to='/admin' ><Event sx={{mr: 1}} />Расписания</MenuItem>
                <MenuItem onClick={closeMenu} component={Link} to='/admin/users' ><Person sx={{mr: 1}} />Пользователи</MenuItem>
                <MenuItem onClick={toggleTheme}>
                    {darkMode ? <WbSunny sx={{ mr: 1 }} /> : <NightsStay sx={{ mr: 1 }} />}
                    {darkMode ? 'Светлая тема' : 'Темная тема'}
                </MenuItem>
                <MenuItem onClick={logout} sx={{color: 'red'}}><ExitToApp sx={{mr: 1}} />Выход</MenuItem>
            </Menu>
        </>
    )

    if (hideMenu)
        return

    if (userSessionData['roles'].includes('ROLE_ADMIN'))
        return adminMenu

    return userMenu
}

export default MenuButton