import {Link, useLocation} from "react-router-dom";
import {IconButton, Menu, MenuItem} from "@mui/material";
import {CalendarToday, Event, ExitToApp, GridView, Help, Person, Settings} from "@mui/icons-material";
import {useState} from "react";


const MenuButton = () => {
    const location = useLocation()
    const ignoredRoutes = ['/register', '/login']
    const hideMenu = ignoredRoutes.includes(location.pathname)
    const [anchorEl, setAnchorEl] = useState(null)

    const openMenu = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const closeMenu = () => {
        setAnchorEl(null)
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
                <MenuItem onClick={closeMenu} sx={{color: 'red'}}><ExitToApp sx={{mr: 1}} />Выход</MenuItem>
            </Menu>
        </>
    )
}

export default MenuButton