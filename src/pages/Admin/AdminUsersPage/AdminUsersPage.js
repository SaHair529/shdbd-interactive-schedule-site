import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Container,
    Box,
    Typography,
    TablePagination,
    Fab,
    Menu,
    MenuItem,
    ListItemText,
    ListItemIcon,
    Modal,
    TextField,
    InputLabel,
    FormControl,
    Select,
    Button,
    FormHelperText,
    Checkbox,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment
} from "@mui/material";
import api from "../../../api";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import FullscreenLoader from "../../../components/FullscreenLoader";
import {
    Close,
    Delete,
    ErrorOutline,
    FilterAlt,
    Group,
    MoreVert,
    PersonAdd
} from "@mui/icons-material";

const USERS_LIMIT = 14;


const AdminUsersPage = ({userSessionData}) => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(USERS_LIMIT)
    const [totalUsers, setTotalUsers] = useState(0)

    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false)
    const [selectedUsersIds, setSelectedUsersIds] = useState([])

    const [groups, setGroups] = useState([])
    const [openChangeGroupModal, setOpenChangeGroupModal] = useState(false)
    const [openRemoveGroupModal, setOpenRemoveGroupModal] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState(null)

    const [searchQuery, setSearchQuery] = useState("")

    const [openFilterModal, setOpenFilterModal] = useState(false)
    const [selectedFilterRoles, setSelectedFilterRoles] = useState([])
    const [selectedFilterGroups, setSelectedFilterGroups] = useState([])

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [role, setRole] = useState("")

    const [emailError, setEmailError] = useState(null)

    const [openCreateUserModal, setOpenCreateUserModal] = useState(false)

    const [anchorEl, setAnchorEl] = useState(null)


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate()

    const ROLES = [
        {id: 0, label: 'Ученик', value: 'ROLE_USER'},
        {id: 1, label: 'Админ', value: 'ROLE_ADMIN'},
    ]

    useEffect(() => {
        loadUsers(page, rowsPerPage, searchQuery)
        loadGroups()
    }, [userSessionData, page, rowsPerPage, searchQuery])

    const loadUsers = async (currentPage, currentRowsPerPage, searchQuery) => {
        try {
            const response = await api.get('/user', {
                headers: {
                    Authorization: `Bearer ${userSessionData['accessToken']}`
                },
                params: {
                    page: currentPage+1,
                    limit: currentRowsPerPage,
                    searchQuery: searchQuery,
                }
            })
            setUsers(response.data['users'])
            setTotalUsers(response.data['meta']['total_users'])
            setLoading(false)
        }
        catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem('userSessionData')
                navigate('/login')
                return
            }

            setError(err)
        }
    }

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

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
        loadUsers(newPage, rowsPerPage, searchQuery)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)

        loadUsers(0, parseInt(event.target.value, 10), searchQuery)
    }

    const openUsersMenu = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const closeUsersMenu = () => {
        setAnchorEl(null)
    }

    const handleSelectUser = (userId) => {
        setSelectedUsersIds((prevSelected) =>
            prevSelected.includes(userId)
                ? prevSelected.filter(id => id !== userId)
                : [...prevSelected, userId]
        );
    }

    const handleSelectAllUsers = (e) => {
        if (e.target.checked) {
            const newSelectedUsersIds = users.map((user) => user.id)
            setSelectedUsersIds(newSelectedUsersIds)
            return
        }
        setSelectedUsersIds([])
    }

    const handleClickCreateUserButton = () => {
        closeUsersMenu()
        setOpenCreateUserModal(true)
    }

    const handleCloseCreateUserModal = () => {
        setOpenCreateUserModal(false)
        setEmail('')
        setPassword('')
        setFullName('')
        setRole('')
    }

    const handleCloseChangeGroupModal = () => {
        setOpenChangeGroupModal(false)
        setSelectedGroup(null)
    }

    const handleCloseRemoveGroupModal = () => {
        setOpenRemoveGroupModal(false)
        setSelectedGroup(null)
    }

    const handleSubmitCreateUser = async (e) => {
        e.preventDefault()

        try {
            const response = await api.post('/user/',
                {
                    email: email,
                    password: password,
                    fullName: fullName,
                    role: role
                },
                {
                    headers: {
                        Authorization: `Bearer ${userSessionData['accessToken']}`
                    }
                }
            )
            if (response.status === 201) {
                window.location.reload()
            }
        }
        catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem('userSessionData')
                navigate('/login')
                return
            }
            else if (err.response.status === 409) {
                setEmailError('Пользователь с таким email уже существует')
                return
            }

            setError(err)
        }
    }

    const handleSubmitChangeGroup = async (e) => {
        e.preventDefault()
        try {
            const response = await api.post('/user/add_group',
                {
                    usersIds: selectedUsersIds,
                    groupId: selectedGroup
                },
                {
                    headers: {
                        Authorization: `Bearer ${userSessionData['accessToken']}`
                    }
                }
            )
            console.log('response',response)
            if (response.status === 200) {
                window.location.reload()
            }
        }
        catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem('userSessionData')
                navigate('/login')
            }
        }
    }

    const handleSubmitRemoveGroup = async (e) => {
        e.preventDefault()
        try {
            const response = await api.post('/user/remove_group',
                {
                    usersIds: selectedUsersIds,
                    groupId: selectedGroup
                },
                {
                    headers: {
                        Authorization: `Bearer ${userSessionData['accessToken']}`
                    }
                }
            )
            console.log('response',response)
            if (response.status === 200) {
                window.location.reload()
            }
        }
        catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem('userSessionData')
                navigate('/login')
            }
        }
    }

    const handleConfirmDeleteUsers = async () => {
        try {
            await api.delete('/user/', {
                data: {
                    ids: selectedUsersIds
                },
                headers: {
                    Authorization: `Bearer ${userSessionData['accessToken']}`
                }
            })
            loadUsers(page, rowsPerPage, searchQuery)
            setOpenDeleteConfirm(false)
            setSelectedUsersIds([])
        }
        catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem('userSessionData')
                navigate('/login')
            }
        }
    }

    const handleApplyFilters = async () => {

    }

    const handleChangeRoleFilter = (event) => {
        const {
            target: { value }
        } = event

        setSelectedFilterRoles((prevSelected) => {
            const newSelected = [...prevSelected]
            if (newSelected.includes(value)) {
                newSelected.splice(newSelected.indexOf(value), 1)
            } else {
                newSelected.push(value)
            }
            return newSelected
        })
    }

    const handleChangeGroupFilter = (event) => {
        const {
            target: { value }
        } = event

        setSelectedFilterGroups((prevSelected) => {
            const newSelected = [...prevSelected]
            if (newSelected.includes(value)) {
                newSelected.splice(newSelected.indexOf(value), 1)
            } else {
                newSelected.push(value)
            }
            return newSelected
        })
    }

    if (loading) {
        return <FullscreenLoader loading={loading} />
    }

    if (error) {
        return (
            <Container maxWidth='xxl' sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default'
            }}>
                <Paper elevation={3} sx={{
                    padding: 3,
                    textAlign: 'center',
                    bgcolor: '#FFEBEE', // Светлый красный фон для ошибки
                    color: '#D32F2F' // Красный цвет текста
                }}>
                    <ErrorOutline sx={{ fontSize: 40}} />
                    <Typography variant="h6">{error}</Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
            <Container sx={{paddingTop: 3}}>
                <TextField
                    label='Поиск'
                    variant='outlined'
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{marginBottom: 2}}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setOpenFilterModal(true)}>
                                    <FilterAlt />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                <TableContainer sx={{maxHeight: '85vh', overflow: 'auto'}} component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding='checkbox'>
                                    <Checkbox
                                        checked={selectedUsersIds.length === users.length}
                                        onChange={handleSelectAllUsers}
                                        inputProps={{ 'aria-label': 'select all users' }}
                                    />
                                </TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>#</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>ФИО</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Email</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Роль</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell padding='checkbox'>
                                        <Checkbox
                                            checked={selectedUsersIds.includes(user.id)}
                                            onChange={() => handleSelectUser(user.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.fullName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.roles.includes('ROLE_ADMIN') ? 'Админ' : 'Пользователь'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            color='primary'
                            aria-label='add schedule'
                            disabled={selectedUsersIds.length === 0}
                            onClick={() => setOpenChangeGroupModal(true)}
                        >
                            <Group />
                        </IconButton>

                        <IconButton
                            color='secondary'
                            aria-label='remove schedule'
                            disabled={selectedUsersIds.length === 0}
                            sx={{position: 'relative'}}
                            onClick={() => setOpenRemoveGroupModal(true)}
                        >
                            <Group />
                            <Close fontSize="small" sx={{position: 'absolute', bottom: 5, right: -3}} /> {/* Иконка крестика */}
                        </IconButton>

                        <IconButton
                            color='secondary'
                            aria-label='delete'
                            disabled={selectedUsersIds.length === 0}
                            onClick={() => setOpenDeleteConfirm(true)}
                        >
                            <Delete/>
                        </IconButton>
                    </Box>
                    <TablePagination
                        sx={{marginLeft: 'auto'}}
                        rowsPerPageOptions={[USERS_LIMIT, 40, 140]}
                        component='div'
                        count={totalUsers}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Box>

                <Fab
                    aria-label="add"
                    size="small"
                    color='primary'
                    onClick={openUsersMenu}
                    sx={{ position: 'fixed', bottom: 16, right: 50, zIndex: 1000 }}
                >
                    <MoreVert />
                </Fab>
                
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={closeUsersMenu}
                    sx={{ transform: 'translateY(-50px)' }}
                    >
                    <MenuItem onClick={handleClickCreateUserButton} >
                        <ListItemIcon>
                            <PersonAdd/>
                        </ListItemIcon>
                        <ListItemText>Создать нового пользователя</ListItemText>
                    </MenuItem>
                </Menu>

                <Modal open={openCreateUserModal} onClose={handleCloseCreateUserModal}>
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
                        <Typography variant="h6" gutterBottom>
                            Создать нового пользователя
                        </Typography>
                        <form onSubmit={handleSubmitCreateUser}>
                            <TextField
                                label="Email"
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                                margin="normal"
                                required
                            />
                            {emailError && (<FormHelperText sx={{color: '#E57373'}}>{emailError}</FormHelperText>)}
                            <TextField
                                label="Пароль"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                fullWidth
                                margin="normal"
                                required
                            />
                            <TextField
                                label="ФИО"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                fullWidth
                                margin="normal"
                                required
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="role-select-label">Роль</InputLabel>
                                <Select
                                    labelId="role-select-label"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    label="Предмет"
                                    required
                                >
                                    {ROLES.map((role) => (
                                        <MenuItem key={role.id} value={role.value}>
                                            {role.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <Button type="submit" variant="contained" color="primary">
                                    Создать
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Modal>

                <Modal open={openChangeGroupModal} onClose={handleCloseChangeGroupModal}>
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
                        <Typography variant="h6" gutterBottom>
                            Сменить группу для выделенных пользователей
                        </Typography>
                        <form onSubmit={handleSubmitChangeGroup}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="group-select-label">Выберите группу</InputLabel>
                                <Select
                                    labelId="group-select-label"
                                    value={selectedGroup}
                                    onChange={(e) => setSelectedGroup(e.target.value)}
                                    required
                                >
                                    {groups.map((group) => (
                                        <MenuItem key={group.id} value={group.id}>
                                            {group.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Выберите группу для выделенных пользователей</FormHelperText>
                            </FormControl>
                            <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 2}}>
                                <Button type="submit" variant="contained" color="primary">
                                    Сменить группу
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Modal>
                <Modal open={openRemoveGroupModal} onClose={handleCloseRemoveGroupModal}>
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
                        <Typography variant="h6" gutterBottom>
                            Исключить из группы выделенных пользователей
                        </Typography>
                        <form onSubmit={handleSubmitRemoveGroup}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="group-select-label">Выберите группу</InputLabel>
                                <Select
                                    labelId="group-select-label"
                                    value={selectedGroup}
                                    onChange={(e) => setSelectedGroup(e.target.value)}
                                    required
                                >
                                    {groups.map((group) => (
                                        <MenuItem key={group.id} value={group.id}>
                                            {group.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Выберите группу из которой исключить выделенных пользователей</FormHelperText>
                            </FormControl>
                            <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 2}}>
                                <Button type="submit" variant="contained" color="secondary">
                                    Исключить из группы
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Modal>
                <Modal open={openFilterModal} onClose={() => setOpenFilterModal(false)}>
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
                        <Typography variant="h6" gutterBottom>
                            Фильтрация пользователей
                        </Typography>
                        <form onSubmit={handleApplyFilters}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="role-filter-label">Роль</InputLabel>
                                <Select
                                    labelId="role-filter-label"
                                    value={selectedFilterRoles}
                                    onChange={handleChangeRoleFilter}
                                    renderValue={(selected) => {
                                        let value = ''
                                        const ROLES_MAP = {
                                            ROLE_USER: 'Ученик',
                                            ROLE_ADMIN: 'Админ'
                                        }
                                        for (let i = 0; i < selected.length; i++) {
                                            value += ROLES_MAP[selected[i]]+', '
                                        }
                                        return value.slice(0, -2)
                                    }}
                                >
                                    {ROLES.map((role) => (
                                        <MenuItem key={role.id} value={role.value}>
                                            <Checkbox checked={selectedFilterRoles.indexOf(role.value) > -1} />
                                            <ListItemText primary={role.label} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth margin="normal">
                                <InputLabel id="group-filter-label">Группа</InputLabel>
                                <Select
                                    labelId="group-filter-label"
                                    value={selectedFilterGroups}
                                    onChange={handleChangeGroupFilter}
                                    renderValue={(selected) => {
                                        let value = ''
                                        for (let i = 0; i < selected.length; i++) {
                                            for (let j = 0; j < groups.length; j++) {
                                                if (groups[j]['id'] === selected[i]) {
                                                    value += groups[j]['name']+', '
                                                }
                                            }
                                        }
                                        return value.slice(0, -2)
                                    }}
                                >
                                    {groups.map((group) => (
                                        <MenuItem key={group.id} value={group.id}>
                                            <Checkbox checked={selectedFilterGroups.indexOf(group.id) > -1} />
                                            <ListItemText primary={group.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 2}}>
                                <Button type="submit" variant="contained" color="primary">
                                    Подтвердить
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Modal>

                <Dialog open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)}>
                    <DialogTitle>Подтверждение удаления</DialogTitle>
                    <DialogContent>
                        <Typography>Вы уверены, что хотите удалить выделенных пользователей?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDeleteConfirm(false)} color='primary'>Отмена</Button>
                        <Button onClick={handleConfirmDeleteUsers} color='secondary'>Удалить</Button>
                    </DialogActions>
                </Dialog>

            </Container>
        </Box>
    )
}

export default AdminUsersPage