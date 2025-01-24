import api from "../../../api";
import {useEffect, useState} from "react";
import {
    Box, Button, Checkbox,
    Container, Fab,
    IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField, Typography,
} from "@mui/material";
import {BookmarkAdd, Delete, GroupAdd, MoreVert} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";


const AdminGroupListPage = ({userSessionData}) => {
    const navigate = useNavigate()

    const [groups, setGroups] = useState([])
    const [selectedGroupsIds, setSelectedGroupsIds] = useState([])

    const [anchorEl, setAnchorEl] = useState(null)
    const [openCreateGroupModal, setOpenCreateGroupModal] = useState(false)
    const [groupName, setGroupName] = useState('')

    const loadGroups = async () => {
        try {
            const response = await api.get('/group', {
                headers: {
                    Authorization: `Bearer ${userSessionData['accessToken']}`
                },
            })
            setGroups(response.data)
        }
        catch (err) {}
    }

    const handleSelectGroup = (groupId) => {
        setSelectedGroupsIds((prevSelected) =>
            prevSelected.includes(groupId)
                ? prevSelected.filter(id => id !== groupId)
                : [...prevSelected, groupId]
        )
    }

    const handleSelectAllGroups = (e) => {
        if (e.target.checked) {
            const newSelectedGroupsIds = groups.map((group) => group.id)
            setSelectedGroupsIds(newSelectedGroupsIds)
            return
        }
        setSelectedGroupsIds([])
    }

    const handleDeleteGroups = async () => {
        const confirmResult = window.confirm("Вы уверены, что хотите удалить выделенные группы?")
        if (confirmResult) {
            try {
                await api.delete('/group/', {
                    data: {
                        ids: selectedGroupsIds,
                    },
                    headers: {
                        Authorization: `Bearer ${userSessionData['accessToken']}`
                    }
                })
                loadGroups()
                setSelectedGroupsIds([])
            }
            catch (err) {
                if (err.response.status === 401) {
                    localStorage.removeItem('userSessionData')
                    navigate('/login')
                }
            }
        }
    }

    const openGroupsMenu = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const closeGroupsMenu = () => {
        setAnchorEl(null)
    }

    const handleClickCreateGroupButton = () => {
        closeGroupsMenu()
        setOpenCreateGroupModal(true)
    }

    const handleCloseCreateGroupModal = () => {
        setOpenCreateGroupModal(false)
    }

    const handleSubmitCreateGroup = async (e) => {
        e.preventDefault()

        try {
            const response = await api.post('/group/',
                {
                    name: groupName,
                },
                {
                    headers: {
                        Authorization: `Bearer ${userSessionData['accessToken']}`
                    }
                }
            )
            if (response.status === 201) {
                loadGroups()
                setOpenCreateGroupModal(false)
                setGroupName('')
            }
        }
        catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem('userSessionData')
                navigate('/login')
                return
            }
        }
    }


    useEffect(() => {
        loadGroups()
    }, userSessionData)

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh'}}>
            <Container sx={{paddingTop: 3}}>
                <TableContainer sx={{maxHeight: '85vh', overflow: 'auto'}} component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding='checkbox'>
                                    <Checkbox
                                        checked={selectedGroupsIds.length === groups.length}
                                        onChange={handleSelectAllGroups}
                                        inputProps={{ 'aria-label': 'select all groups' }}
                                    />
                                </TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Предмет</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {groups.map((group) => (
                                <TableRow key={group.id}>
                                    <TableCell padding='checkbox'>
                                        <Checkbox
                                            checked={selectedGroupsIds.includes(group.id)}
                                            onChange={() => handleSelectGroup(group.id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {group.name}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            color='secondary'
                            aria-label='delete'
                            disabled={selectedGroupsIds.length === 0}
                            onClick={handleDeleteGroups}
                        >
                            <Delete/>
                        </IconButton>
                    </Box>
                </Box>
            </Container>
            <Fab
                aria-label="add"
                size="small"
                color='primary'
                onClick={openGroupsMenu}
                sx={{ position: 'fixed', bottom: 16, right: 50, zIndex: 1000 }}
            >
                <MoreVert />
            </Fab>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={closeGroupsMenu}
                sx={{ transform: 'translateY(-50px)' }}
            >
                <MenuItem
                    onClick={handleClickCreateGroupButton} >
                    <ListItemIcon>
                        <GroupAdd/>
                    </ListItemIcon>
                    <ListItemText>Создать новую группу</ListItemText>
                </MenuItem>
            </Menu>
            <Modal open={openCreateGroupModal} onClose={handleCloseCreateGroupModal}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxWidth: '90%',
                    width: 500,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <Typography variant="h6" gutterBottom color='text.secondary'>
                        Создать новую группу
                    </Typography>
                    <form onSubmit={handleSubmitCreateGroup}>
                        <TextField
                            label="Название группы"
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button type="submit" variant="contained" color="primary">
                                Создать
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </Box>
    )
}

export default AdminGroupListPage