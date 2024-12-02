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
    Typography, TablePagination
} from "@mui/material";
import api from "../../../api";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import FullscreenLoader from "../../../components/FullscreenLoader";
import {ErrorOutline} from "@mui/icons-material";


const AdminUsersPage = ({userSessionData}) => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25)
    const [totalUsers, setTotalUsers] = useState(0)

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate()

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
                    rowsPerPageOptions={[25, 50, 150]}
                    component='div'
                    count={totalUsers}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Container>
        </Box>
    )
}

export default AdminUsersPage