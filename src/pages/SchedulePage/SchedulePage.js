import {useEffect, useState} from "react";
import api from "../../api";
import './SchedulePage.css'
import WorkIcon from '@mui/icons-material/Work';
import {
    Box, Button,
    CircularProgress,
    Container,
    Grid2, Modal,
    Paper, TextField,
    Typography
} from "@mui/material";
import {Equalizer, AccessAlarm, Assignment, PartyMode, BeachAccess, WbSunny, ErrorOutline} from "@mui/icons-material";
import {useNavigate, useParams} from "react-router-dom";


const SchedulePage = ({token}) => {
    const {id} = useParams()
    const [schedule, setSchedule] = useState({})
    const [loading, setLoading] = useState(true)
    const [selectedScheduleItem, setSelectedScheduleItem] = useState(null)
    const [openChat, setOpenChat] = useState(false)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()

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
            const response = await api.get(`/schedule/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response.data
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem('accessToken')
                navigate('/login')
                return
            }
            else if (err.response.status === 404) {
                setError('Расписание не найдено')
                return err.response
            }

            setError(err)
            console.error(err)
            return null
        }
    }

    const handleSubjectClick = (scheduleItem) => {
        setSelectedScheduleItem(scheduleItem)
        setOpenChat(true)
    }

    const handleCloseChat = () => {
        setOpenChat(false)
        setSelectedScheduleItem(null)
    }

    const handleAbsence = () => {

    }

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return

        setMessages([...messages, {id: messages.length1, text: newMessage, sender: 'student'}])
        setNewMessage('')
    }

    useEffect(() => {
        const loadSchedule = async () => {
            const response = await fetchSchedule()

            // Сортируем предметы по дням в респонсе
            if (response.id) { // Если расписание найдено
                response.sortedScheduleItems = {1: [], 2: [], 3: [], 4: [], 5: [], 6: []}
                response.scheduleItems.forEach(scheduleItem => {
                    scheduleItem['startTime'] = new Date(scheduleItem['startTime']).toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                    response.sortedScheduleItems[scheduleItem['dayOfWeek']].push(scheduleItem)
                })
                response.scheduleItems = undefined

                console.log(response)
                setSchedule(response)
            }
            setLoading(false)
        }

        loadSchedule()
    }, [id, token])

    if (loading) {
        return <CircularProgress />
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
        <Container maxWidth='xxl' sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default'
        }} >
            <Grid2 container spacing={1} sx={{width: '60%'}}>
                {/* Заголовки дней */}
                {Object.keys(schedule.sortedScheduleItems).map((dayNumber) => (
                    <Grid2 item xs={12} size={4} className='day-table' key={dayNumber}>
                        <Paper elevation={3} className='day-paper'>
                            <Box display="flex" alignItems="center">
                                {dayIcons[dayNumber]}
                                <Typography>{dayNumbersNaming[dayNumber]}</Typography>
                            </Box>
                        </Paper>
                        {schedule.sortedScheduleItems[dayNumber].map(scheduleItem => (
                            <Grid2 item xs={12} sx={{flexGrow: 1}} key={scheduleItem.id}>
                                <Paper sx={{position: 'relative'}} elevation={3} className='subject-paper' onClick={() => handleSubjectClick(scheduleItem)}>
                                    <Typography >{scheduleItem.subject.name}</Typography>
                                    <Paper sx={{
                                        position: 'absolute',
                                        right: 0,
                                        top: 8,
                                        px: 2,
                                        borderRadius: 0,
                                        bgcolor: '#B0BEC5',
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: 13
                                    }}>
                                        {(scheduleItem.startTime)}
                                    </Paper>
                                </Paper>
                            </Grid2>
                        ))}
                    </Grid2>
                ))}
            </Grid2>

            {/* Модальное окно чата */}
            <Modal open={openChat} onClose={handleCloseChat}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    height: 500,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    display:'flex',
                    flexDirection:'column'
                }}>
                    <Typography variant="h6" component="h2" color='text.primary'>
                        Чат по предмету "{selectedScheduleItem?.subject.name}"
                    </Typography>

                    {/* Список сообщений */}
                    <Box sx={{
                        flexGrow:'1',
                        overflowY:'auto',
                        mt:'10px',
                        mb:'10px',
                        border:'1px solid #ccc',
                        borderRadius:'4px',
                        padding:'10px',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                    }}>
                        {messages.map(message => (
                            <Typography key={message.id}
                                        align={message.sender === "student" ? "right" : "left"}
                                        sx={{
                                            backgroundColor : message.sender === "student" ? "#e0f7fa" : "#fce4ec",
                                            borderRadius : "8px",
                                            padding : "5px",
                                            marginBottom : "5px"
                                        }}
                            >
                                {message.text}
                            </Typography>
                        ))}
                    </Box>

                    {/* Поле ввода для нового сообщения */}
                    <TextField
                        variant="outlined"
                        fullWidth
                        placeholder="Введите сообщение..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} // Отправка по нажатию Enter
                    />

                    <Box sx={{ display: 'flex', marginTop: "10px" }}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => handleAbsence(selectedScheduleItem.id)}
                            sx={{ flex: 0.3 }}
                        >
                            Не приду
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSendMessage}
                            sx={{ flex: 1, marginLeft: '10px' }}
                        >
                            Отправить
                        </Button>
                    </Box>
                </Box>
            </Modal>

        </Container>
    );
}

export default SchedulePage