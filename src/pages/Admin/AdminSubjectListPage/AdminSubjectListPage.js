import {
    Box, Button, Checkbox,
    Container, Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Typography,
} from "@mui/material";
import {Delete} from "@mui/icons-material";
import api from "../../../api";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const AdminSubjectListPage = ({userSessionData}) => {
    const navigate = useNavigate()

    const [subjects, setSubjects] = useState([])
    const [selectedSubjectsIds, setSelectedSubjectsIds] = useState([])
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false)

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
        </Box>
    )
}

export default AdminSubjectListPage