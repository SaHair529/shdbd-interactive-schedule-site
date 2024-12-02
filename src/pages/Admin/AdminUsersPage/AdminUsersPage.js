import {TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Container, Box} from "@mui/material";


const AdminUsersPage = () => {
    const users = [ // todo брать юзеров из бд
        { id: 1, fullName: 'Хайрулаев Шамиль', email: 'sa.hairulaev@gmail.com', roles: ['ROLE_USER', 'ROLE_ADMIN'] },
        { id: 2, fullName: 'Алибеков Магомед', email: 'mn.alibekov@gmail.com', roles: ['ROLE_USER'] },
        { id: 3, fullName: 'Алибеков Магомед', email: 'mn.alibekov@gmail.com', roles: ['ROLE_USER'] },
        { id: 4, fullName: 'Алибеков Магомед', email: 'mn.alibekov@gmail.com', roles: ['ROLE_USER'] },
        { id: 5, fullName: 'Алибеков Магомед', email: 'mn.alibekov@gmail.com', roles: ['ROLE_USER'] },
    ]

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
            </Container>
        </Box>
    )
}

export default AdminUsersPage