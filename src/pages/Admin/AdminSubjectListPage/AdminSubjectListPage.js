import {
    Box, Button, Checkbox,
    Container, Dialog, DialogActions, DialogContent, DialogTitle, Fab, FormControl, FormHelperText,
    IconButton, InputLabel, ListItemIcon, ListItemText, Menu, MenuItem, Modal,
    Paper, Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField, Typography,
} from "@mui/material";
import {BookmarkAdd, Delete, MoreVert, PersonAdd} from "@mui/icons-material";
import api from "../../../api";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const AdminSubjectListPage = ({userSessionData}) => {
    const navigate = useNavigate()

    const [subjects, setSubjects] = useState([])
    const [selectedSubjectsIds, setSelectedSubjectsIds] = useState([])
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false)

    const [anchorEl, setAnchorEl] = useState(null)
    const [openCreateSubjectModal, setOpenCreateSubjectModal] = useState(false)
    const [subjectName, setSubjectName] = useState('')

    useEffect(() => {
        loadSubjects()
    }, userSessionData)

    const loadSubjects = async () => {
        try {
            const response = await api.get('/subject/list', {
                headers: {
                    Authorization: `Bearer ${userSessionData['accessToken']}`
                },
            })

            setSubjects(response.data)
        }
        catch (err) {

        }
    }

    const handleSelectSubject = (subjectId) => {
        setSelectedSubjectsIds((prevSelected) =>
            prevSelected.includes(subjectId)
                ? prevSelected.filter(id => id !== subjectId)
                : [...prevSelected, subjectId]
        )
    }

    const handleSelectAllSubjects = (e) => {
        if (e.target.checked) {
            const newSelectedSubjectsIds = subjects.map((subject) => subject.id)
            setSelectedSubjectsIds(newSelectedSubjectsIds)
            return
        }
        setSelectedSubjectsIds([])
    }

    const handleConfirmDeleteSubjects = async () => {
        try {
            await api.delete('/subject/', {
                data: {
                    ids: selectedSubjectsIds,
                },
                headers: {
                    Authorization: `Bearer ${userSessionData['accessToken']}`
                }
            })
            loadSubjects()
            setOpenDeleteConfirm(false)
            setSelectedSubjectsIds([])
        }
        catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem('userSessionData')
                navigate('/login')
            }
        }
    }

    const openSubjectsMenu = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const closeSubjectsMenu = () => {
        setAnchorEl(null)
    }

    const handleClickCreateSubjectButton = () => {
        closeSubjectsMenu()
        setOpenCreateSubjectModal(true)
    }

    const handleCloseCreateSubjectModal = () => {
        setOpenCreateSubjectModal(false)
    }

    const handleSubmitCreateSubject = async (e) => {
        e.preventDefault()

        try {
            const response = await api.post('/subject',
                {
                    name: subjectName,
                },
                {
                    headers: {
                        Authorization: `Bearer ${userSessionData['accessToken']}`
                    }
                }
            )
            if (response.status === 201) {
                loadSubjects()
                setOpenCreateSubjectModal(false)
                setSubjectName('')
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

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh'}}>
            <Container sx={{paddingTop: 3}}>
                <TableContainer sx={{maxHeight: '85vh', overflow: 'auto'}} component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding='checkbox'>
                                    <Checkbox
                                        checked={selectedSubjectsIds.length === subjects.length}
                                        onChange={handleSelectAllSubjects}
                                        inputProps={{ 'aria-label': 'select all users' }}
                                    />
                                </TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Предмет</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {subjects.map((subject) => (
                                <TableRow key={subject.id}>
                                    <TableCell padding='checkbox'>
                                        <Checkbox
                                            checked={selectedSubjectsIds.includes(subject.id)}
                                            onChange={() => handleSelectSubject(subject.id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {subject.name}
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
                            disabled={selectedSubjectsIds.length === 0}
                            onClick={() => setOpenDeleteConfirm(true)}
                        >
                            <Delete/>
                        </IconButton>
                    </Box>
                </Box>
            </Container>
            <Dialog open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)}>
                <DialogTitle>Подтверждение удаления</DialogTitle>
                <DialogContent>
                    <Typography>Вы уверены, что хотите удалить выделенные предметы?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteConfirm(false)} color='primary'>Отмена</Button>
                    <Button onClick={handleConfirmDeleteSubjects} color='secondary'>Удалить</Button>
                </DialogActions>
            </Dialog>
            <Fab
                aria-label="add"
                size="small"
                color='primary'
                onClick={openSubjectsMenu}
                sx={{ position: 'fixed', bottom: 16, right: 50, zIndex: 1000 }}
            >
                <MoreVert />
            </Fab>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={closeSubjectsMenu}
                sx={{ transform: 'translateY(-50px)' }}
            >
                <MenuItem
                    onClick={handleClickCreateSubjectButton} >
                    <ListItemIcon>
                        <BookmarkAdd/>
                    </ListItemIcon>
                    <ListItemText>Создать новый предмет</ListItemText>
                </MenuItem>
            </Menu>
            <Modal open={openCreateSubjectModal} onClose={handleCloseCreateSubjectModal}>
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
                        Создать новый предмет
                    </Typography>
                    <form onSubmit={handleSubmitCreateSubject}>
                        <TextField
                            label="Название предмета"
                            type="text"
                            value={subjectName}
                            onChange={(e) => setSubjectName(e.target.value)}
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

export default AdminSubjectListPage