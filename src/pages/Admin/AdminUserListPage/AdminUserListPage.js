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
    InputAdornment, Drawer, FormControlLabel, FormGroup, Alert
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
import ActiveFilters from "../../../components/ActiveFilters";

const USERS_LIMIT = 14;


const AdminUserListPage = ({userSessionData}) => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(USERS_LIMIT)
    const [totalUsers, setTotalUsers] = useState(0)

    const [openUpdateUserDrawer, setOpenUpdateUserDrawer] = useState(false)

    const [updateUserErrorMessage, setUpdateUserErrorMessage] = useState(null)
    const [selectedUser, setSelectedUser] = useState({ fullName: '', email: '', roles: [], groups: [] })

    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false)
    const [selectedUsersIds, setSelectedUsersIds] = useState([])

    const [groups, setGroups] = useState([])
    const [openChangeGroupModal, setOpenChangeGroupModal] = useState(false)
    const [openRemoveGroupModal, setOpenRemoveGroupModal] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState(null)

    const [searchQuery, setSearchQuery] = useState("")

    const [openFilterModal, setOpenFilterModal] = useState(false)
    const [selectedFilterGroups, setSelectedFilterGroups] = useState([])
    const [activeFilters, setActiveFilters] = useState({})

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
    }, [userSessionData, page, rowsPerPage, searchQuery, selectedFilterGroups])

    const loadUsers = async (currentPage, currentRowsPerPage, searchQuery) => {
        try {
            const filterObj = {
                groups: selectedFilterGroups,
            }
            const filterQueryString = encodeURIComponent(JSON.stringify(filterObj))
            const response = await api.get('/user?filter='+filterQueryString, {
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

    const handleClickUserRow = async (userId) => {
        try {
            const response = await api.get('/user/'+userId, {
                headers: {
                    Authorization: `Bearer ${userSessionData['accessToken']}`
                },
            })

            setSelectedUser(response.data)
            setOpenUpdateUserDrawer(true)
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

    const handleChangeSelectedUser = (e) => {
        const { name, value } = e.target

        if (name === 'roles') {
            setSelectedUser((prevData) => {
                const roles = prevData.roles.includes(value)
                    ? prevData.roles.filter(role => role !== value)
                    : [...prevData.roles, value]
                return { ...prevData, roles }
            })
            return
        }

        if (name === 'groups') {
            setSelectedUser((prevData) => {
                const groupExists = prevData.groups.some(group => group.id === +value)

                if (groupExists) {
                    const updatedGroups = prevData.groups.filter(group => group.id !== +value)
                    return {
                        ...prevData,
                        groups: updatedGroups,
                    }
                } else {
                    const newGroup = { id: +value }
                    return {
                        ...prevData,
                        groups: [...prevData.groups, newGroup],
                    }
                }
            })
            return
        }

        setSelectedUser((prevData) => ({
            ...prevData,
            [name]: value
        }))
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

    const handleCloseSelectedUserDrawer = () => {
        setOpenUpdateUserDrawer(false)

        setSelectedUser({ fullName: '', email: '', roles: [], groups: [] })
    }

    const handleUpdateUser = async (id) => {
        try {
            const response = await api.post('/user/'+id,
                selectedUser,
                {
                    headers: {
                        Authorization: `Bearer ${userSessionData['accessToken']}`
                    }
                }
            )

            if (response.status === 200) {
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === id ? { ...user, ...selectedUser } : user
                    )
                )
                setSelectedUser({ fullName: '', email: '', roles: [], groups: [] })
                setOpenUpdateUserDrawer(false)
            }
        }
        catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem('userSessionData')
                navigate('/login')
            }
            else if (err.response.status === 400) {
                if (err.response.data['error']) {
                    setUpdateUserErrorMessage(err.response.data['error'])
                }
            }
        }
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

    const handleApplyFilters = async (event) => {
        event.preventDefault()
        setOpenFilterModal(false)
    }

    const handleChangeGroupFilter = (event) => {
        const {
            target: { value }
        } = event

        setSelectedFilterGroups((prevSelected) => {
            const newSelected = [...prevSelected]
            if (newSelected.includes(value)) {
                newSelected.splice(newSelected.indexOf(value), 1)
                setActiveFilters((prevActive) => {
                    if (!newSelected.length) {
                        delete prevActive.groups
                    }
                    return prevActive
                })
            } else {
                newSelected.push(value)
                setActiveFilters((prevActive) => {
                    prevActive.groups = {}
                    prevActive.groups.label = 'Группы'
                    return prevActive
                })
            }
            return newSelected
        })
    }

    const handleDeleteFilter = (filterKey) => {
        setActiveFilters((prevActive) => {
            delete prevActive[filterKey]
            return prevActive
        })

        switch (filterKey) {
            case 'groups':
                setSelectedFilterGroups([])
                break
        }
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
                    sx={{marginBottom: 1}}
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
                <ActiveFilters filters={activeFilters} onDelete={handleDeleteFilter}  />
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
                                <TableRow key={user.id} onClick={(e) => {
                                    if (e.target.type)
                                        return
                                    handleClickUserRow(user.id)
                                }} sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                        opacity: .7
                                    }
                                }}>
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
                        <Typography variant="h6" gutterBottom color='text.secondary'>
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
                        <Typography variant="h6" gutterBottom color='text.secondary'>
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
                        <Typography variant="h6" color='text.secondary' gutterBottom>
                            Фильтрация пользователей
                        </Typography>
                        <form onSubmit={handleApplyFilters}>
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

                <Drawer anchor='right' open={openUpdateUserDrawer} onClose={handleCloseSelectedUserDrawer}>
                    <Box sx={{width: 300, padding: 2,height: '100%', display: 'flex', flexDirection: 'column'}}>
                        <TextField
                            label="ФИО"
                            variant="outlined"
                            fullWidth
                            name="fullName"
                            value={selectedUser.fullName}
                            onChange={handleChangeSelectedUser}
                            sx={{ marginBottom: 2 }}
                        />
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            name="email"
                            value={selectedUser.email}
                            onChange={handleChangeSelectedUser}
                            sx={{ marginBottom: 2 }}
                        />
                        <Box>
                            <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
                                <Typography variant="subtitle1">Роли</Typography>
                                <FormGroup>
                                    {ROLES.map((role) => (
                                        <FormControlLabel
                                            key={role.value}
                                            control={
                                                <Checkbox
                                                    checked={selectedUser.roles.includes(role.value)}
                                                    onChange={handleChangeSelectedUser}
                                                    name="roles"
                                                    value={role.value}
                                                />
                                            }
                                            label={role.label}
                                        />
                                    ))}
                                </FormGroup>
                            </FormControl>
                        </Box>
                        <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
                            <Typography variant="subtitle1">Группы</Typography>
                            <FormGroup>
                                {groups.map((group) => (
                                    <FormControlLabel
                                        key={role.value}
                                        control={
                                            <Checkbox
                                                checked={selectedUser.groups.some(g => g.id === group.id)}
                                                onChange={handleChangeSelectedUser}
                                                name="groups"
                                                value={group.id}
                                            />
                                        }
                                        label={group.name}
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>

                        {updateUserErrorMessage && (
                            <Alert severity='error'>
                                {updateUserErrorMessage}
                            </Alert>
                        )}

                        <Box sx={{ marginTop: 'auto' }} >
                            <Button fullWidth variant="contained" color="primary" onClick={() => handleUpdateUser(selectedUser.id)}>
                                Сохранить изменения
                            </Button>
                        </Box>
                    </Box>
                </Drawer>
        </Box>
    )
}

export default AdminUserListPage