import {Link, useLocation, useNavigate} from "react-router-dom";
import {Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography} from "@mui/material";
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

    if (hideMenu)
        return

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
                <Divider/>
                <MenuItem onClick={closeMenu} component={Link} to='/' >
                    <ListItemIcon>
                        <Event fontSize='small' />
                    </ListItemIcon>
                    <ListItemText>Мои расписания</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={toggleTheme}>
                    <ListItemIcon>
                        {darkMode ? <WbSunny fontSize='small' /> : <NightsStay fontSize='small' />}
                    </ListItemIcon>
                    <ListItemText>
                        {darkMode ? 'Светлая тема' : 'Темная тема'}
                    </ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={logout} sx={{color: 'red'}}>
                    <ListItemIcon>
                        <ExitToApp sx={{color: 'red'}} fontSize='small' />
                    </ListItemIcon>
                    <ListItemText>Выход</ListItemText>
                </MenuItem>
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
                <Divider />
                <MenuItem onClick={closeMenu} component={Link} to='/admin' >
                    <ListItemIcon>
                        <Event fontSize='small' />
                    </ListItemIcon>
                    <ListItemText>Расписания</ListItemText>
                </MenuItem>
                <MenuItem onClick={closeMenu} component={Link} to='/admin/users' >
                    <ListItemIcon>
                        <Person fontsize='small' />
                    </ListItemIcon>
                    <ListItemText>Пользователи</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={toggleTheme}>
                    <ListItemIcon>
                        {darkMode ? <WbSunny fontSize='small' /> : <NightsStay fontSize='small' />}
                    </ListItemIcon>
                    <ListItemText>
                        {darkMode ? 'Светлая тема' : 'Темная тема'}
                    </ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={logout} sx={{color: 'red'}}>
                    <ListItemIcon>
                        <ExitToApp sx={{color: 'red'}} fontSize='small' />
                    </ListItemIcon>
                    <ListItemText>Выход</ListItemText>
                </MenuItem>
            </Menu>
        </>
    )

    if (userSessionData['roles'].includes('ROLE_ADMIN'))
        return adminMenu

    return userMenu
}

export default MenuButton