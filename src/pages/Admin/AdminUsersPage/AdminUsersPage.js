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
    FormControl, Select, Button, FormHelperText
} from "@mui/material";
import api from "../../../api";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import FullscreenLoader from "../../../components/FullscreenLoader";
import {ErrorOutline, MoreVert, PersonAdd} from "@mui/icons-material";


const AdminUsersPage = ({userSessionData}) => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15)
    const [totalUsers, setTotalUsers] = useState(0)

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
        loadUsers()
    }, userSessionData, page, rowsPerPage)

    const loadUsers = async () => {
        try {
            const response = await api.get('/user', {
                headers: {
                    Authorization: `Bearer ${userSessionData['accessToken']}`
                },
                params: {
                    page: page+1,
                    limit: rowsPerPage,
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const openUsersMenu = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const closeUsersMenu = () => {
        setAnchorEl(null)
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
            <Container sx={{paddingTop: 6}}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{fontWeight: 'bold'}}>#</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>ФИО</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Email</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Роль</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.fullName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.roles.includes('ROLE_ADMIN') ? 'Админ' : 'Пользователь'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[15, 50, 150]}
                    component='div'
                    count={totalUsers}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

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


            </Container>
        </Box>
    )
}

export default AdminUsersPage