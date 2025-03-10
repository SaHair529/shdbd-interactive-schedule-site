import {useEffect, useRef, useState} from "react";
import api from "../../../api";
import '../../SchedulePage/SchedulePage.css'
import WorkIcon from '@mui/icons-material/Work';
import {
    Box, Button,
    CircularProgress,
    Container, FormControl,
    Grid2, InputLabel, MenuItem, Modal,
    Paper, Select, TextField,
    Typography
} from "@mui/material";
import {Equalizer, AccessAlarm, Assignment, PartyMode, BeachAccess, WbSunny, ErrorOutline} from "@mui/icons-material";
import {useNavigate, useParams} from "react-router-dom";
import FullscreenLoader from "../../../components/FullscreenLoader";


const AdminSchedulePage = ({userSessionData}) => {
    const {id} = useParams()
    const [schedule, setSchedule] = useState({})
    const [subjects, setSubjects] = useState([])
    const [teachers, setTeachers] = useState([])
    const [teacherId, setTeacherId] = useState('')
    const [selectedScheduleItemId, setSelectedScheduleItemId] = useState(null)
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [subjectId, setSubjectId] = useState('')
    const [dayOfWeek, setDayOfWeek] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const [openCreateSubjectModal, setOpenCreateSubjectModal] = useState(false)
    const [openUpdateSubjectModal, setOpenUpdateSubjectModal] = useState(false)

    const dayNumbersNaming = ['','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресение'] // В начале пустая строка, чтобы у понедельника индекс был равен 1
    const dayIcons = [null,
        <AccessAlarm sx={{marginRight: 1}} />,
        <WorkIcon sx={{marginRight: 1}} />,
        <Equalizer sx={{marginRight: 1}} />,
        <Assignment sx={{marginRight: 1}} />,
        <PartyMode sx={{marginRight: 1}} />,
        <BeachAccess sx={{marginRight: 1}} />,
        <WbSunny sx={{marginRight: 1}} />]

    const fetchSchedule = async () => {
        try {
            setLoading(true)
            const response = await api.get(`/schedule/${id}`, {
                headers: {
                    Authorization: `Bearer ${userSessionData['accessToken']}`
                }
            })
            setLoading(false)
            return response.data
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem('accessToken')
                navigate('/login')
                return
            }
            else if (err.response.status === 404) {
                setError('Расписание не найдено')
                setLoading(false)
                return err.response
            }

            setLoading(false)
            setError(err)
            console.error(err)
            return null
        }
    }

    const loadTeachers = async () => {
        try {
            setLoading(true)
            const response = await api.get('/teacher/', {
                headers: {
                    Authorization: `Bearer ${userSessionData['accessToken']}`
                }
            })
            setTeachers(response.data)
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem('accessToken')
                navigate('/login')
                return
            }
            setError(err)
        }
        setLoading(false)
    }

    const loadSubjects = async () => {
        try {
            const response = await api.get('/subject/list', {
                headers: {
                    Authorization: `Bearer ${userSessionData['accessToken']}`
                }
            })
            setSubjects(response.data)
        }
        catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem('accessToken')
                navigate('/login')
                return
            }
            else if (err.response.status === 404) {
                setError('Предметы не найдены')
                return err.response
            }

            setError(err)
            console.error(err)
            return null
        }
    }

    const loadSchedule = async () => {
        const response = await fetchSchedule()

        // Сортируем предметы по дням в респонсе
        if (response.id) { // Если расписание найдено
            response.sortedScheduleItems = {1: [], 2: [], 3: [], 4: [], 5: [], 6: []}
            response.scheduleItems.forEach(scheduleItem => {
                scheduleItem['startTime'] = new Date(scheduleItem['startTime']).toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'Europe/Moscow'
                })
                scheduleItem['endTime'] = new Date(scheduleItem['endTime']).toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'Europe/Moscow'
                })
                response.sortedScheduleItems[scheduleItem['dayOfWeek']].push(scheduleItem)
            })
            response.scheduleItems = undefined

            setSchedule(response)
            setLoading(false)
        }
    }

    const handleAddSubject = (dayOfWeek) => {
        setOpenCreateSubjectModal(true)
        setDayOfWeek(dayOfWeek)
    }

    const handleSubmitCreateSubject = async (e) => {
        try {
            const response = await api.post('/schedule',
                {
                    startTime: startTime+':00',
                    endTime: endTime+':00',
                    dayOfWeek: +dayOfWeek,
                    subjectId: +subjectId,
                    scheduleId: id,
                    teacherId: +teacherId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${userSessionData['accessToken']}`
                    }
                }
            )
            if (response.status === 201) {
            }
        }
        catch (error) {

        }
    }

    const handleCloseCreateSubjectModal = () => {
        setOpenCreateSubjectModal(false)
        setDayOfWeek('')
        setStartTime('')
        setEndTime('')
    }

    const handleClickScheduleItem = (clickedScheduleItem) => {
        setSelectedScheduleItemId(clickedScheduleItem.id)
        setDayOfWeek(clickedScheduleItem.dayOfWeek)
        setStartTime(clickedScheduleItem.startTime)
        setEndTime(clickedScheduleItem.endTime)
        setSubjectId(clickedScheduleItem.subject.id)
        setOpenUpdateSubjectModal(true)
    }

    const handleSubmitUpdateSubject = async () => {
        try {
            const response = await api.put(`/schedule/${selectedScheduleItemId}`,
                {
                    startTime: startTime+':00',
                    endTime: endTime+':00',
                    dayOfWeek: +dayOfWeek,
                    subjectId: +subjectId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${userSessionData['accessToken']}`
                    }
                }
            )
            if (response.status === 200) {
            }
        }
        catch (error) {

        }
    }

    const handleCloseUpdateSubjectModal = () => {
        setOpenUpdateSubjectModal(false)
        setDayOfWeek('')
        setStartTime('')
        setEndTime('')
        setSubjectId('')
    }

    const handleDeleteScheduleItem = async () => {
        try {
            const response = await api.delete(`/schedule_item/${selectedScheduleItemId}`, {
                headers: {
                    Authorization: `Bearer ${userSessionData['accessToken']}`
                }
            })
            if (response.status === 204) {
                window.location.reload()
            }
        }
        catch (error) {

        }
    }

    useEffect(() => {
        loadSchedule()
        loadSubjects()
        loadTeachers()
    }, [id, userSessionData])

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
        <Container maxWidth='xxl' sx={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default'}} >
            <Grid2 container spacing={1} sx={{width: '60%'}}>
                {/* Заголовки дней */}
                {schedule.sortedScheduleItems && Object.keys(schedule.sortedScheduleItems).map((dayNumber) => (
                    <Grid2 item xs={12} size={4} className='day-table' key={dayNumber}>
                        <Paper elevation={3} className='day-paper'>
                            <Box display="flex" alignItems="center">
                                {dayIcons[dayNumber]}
                                <Typography>{dayNumbersNaming[dayNumber]}</Typography>
                            </Box>
                        </Paper>
                        {schedule.sortedScheduleItems[dayNumber].map(scheduleItem => (
                            <Grid2 item xs={12} sx={{flexGrow: 1}} key={scheduleItem.id}>
                                <Paper sx={{position: 'relative'}} elevation={3} className='subject-paper' onClick={() => handleClickScheduleItem(scheduleItem)}>
                                    <Typography >{scheduleItem.subject.name}</Typography>
                                    <Paper sx={{position: 'absolute', right: 0, top: 8, px: 2, borderRadius: 0, bgcolor: '#B0BEC5', color: '#fff', display: 'flex', alignItems: 'center', fontSize: 13}}>
                                        {(scheduleItem.startTime)}
                                    </Paper>
                                </Paper>
                            </Grid2>
                        ))}
                        <Paper sx={{ opacity: .4 }} elevation={3} className='subject-paper' onClick={() => { handleAddSubject(dayNumber) }} >
                            <Typography >+ Добавить урок</Typography>
                        </Paper>
                    </Grid2>
                ))}
            </Grid2>
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

                    <Typography color='text.secondary' variant="h6" gutterBottom>
                        Создать новый предмет
                    </Typography>
                    <form onSubmit={handleSubmitCreateSubject}>
                        <TextField
                            label="Время начала"
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{shrink: true}}
                            required
                        />
                        <TextField
                            label="Время окончания"
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{shrink: true}}
                            required
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="subject-select-label">Предмет</InputLabel>
                            <Select
                                labelId="subject-select-label"
                                value={subjectId}
                                onChange={(e) => setSubjectId(e.target.value)}
                                label="Предмет"
                                required
                            >
                                {subjects.map((subj) => (
                                    <MenuItem key={subj.id} value={subj.id}>
                                        {subj.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="teacher-select-label">Учитель</InputLabel>
                            <Select
                                labelId="teacher-select-label"
                                value={teacherId}
                                onChange={(e) => setTeacherId(e.target.value)}
                                label="Учитель"
                                required
                            >
                                {teachers.map((teacher) => (
                                    <MenuItem key={teacher.id} value={teacher.id}>
                                        {teacher.fullName}
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
            <Modal open={openUpdateSubjectModal} onClose={handleCloseUpdateSubjectModal}>
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
                        Обновить предмет
                    </Typography>
                    <form onSubmit={handleSubmitUpdateSubject}>
                        <TextField
                            label="Время начала"
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{shrink: true}}
                            required
                        />
                        <TextField
                            label="Время окончания"
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{shrink: true}}
                            required
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="subject-select-label">Предмет</InputLabel>
                            <Select
                                labelId="subject-select-label"
                                value={subjectId}
                                onChange={(e) => setSubjectId(e.target.value)}
                                label="Предмет"
                                required
                            >
                                {subjects.map((subj) => (
                                    <MenuItem key={subj.id} value={subj.id}>
                                        {subj.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                    if (window.confirm("Вы уверены, что хотите удалить этот предмет?")) {
                                        handleDeleteScheduleItem()
                                    }
                                }}
                            >
                                Удалить
                            </Button>
                            <Button type="submit" variant="contained" color="primary">
                                Обновить
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </Container>
    );
}

export default AdminSchedulePage