import {useEffect, useRef, useState} from "react";
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
import FullscreenLoader from "../../components/FullscreenLoader";


const SchedulePage = ({userSessionData}) => {
    const {id} = useParams()
    const [schedule, setSchedule] = useState({})
    const [loading, setLoading] = useState(true)
    const [absenceButtonLoading, setAbsenceButtonLoading] = useState(false)
    const [chatLoading, setChatLoading] = useState(false)
    const [selectedScheduleItem, setSelectedScheduleItem] = useState(null)
    const [openChat, setOpenChat] = useState(false)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [absenceEventId, setAbsenceEventId] = useState(null)
    const messagesEndRef = useRef(null)
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
                    Authorization: `Bearer ${userSessionData['accessToken']}`
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

    const handleSubjectClick = async (scheduleItem) => {
        try {
            setChatLoading(true)
            setOpenChat(true)
            const response = await api.get(`/schedule/event/list/${scheduleItem.id}`, {
                headers: {
                    Authorization: `Bearer ${userSessionData['accessToken']}`
                }
            })
            response.data.map((event) => {
                if (event['type'] === 1 && +event['student']['id'] === +userSessionData['userId'])
                    setAbsenceEventId(event['id'])
            })
            setSelectedScheduleItem(scheduleItem)
            setMessages(response.data)
            setChatLoading(false)
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem('accessToken')
                navigate('/login')
                return
            }

            setError(err)
        }
    }

    const handleCloseChat = () => {
        setOpenChat(false)
        setSelectedScheduleItem(null)
        setAbsenceEventId(null)
        setAbsenceButtonLoading(false)
    }

    /**
     * Обработчик кнопки "Не приду"
     */
    const handleAbsence = async (scheduleItemId) => {
        try {
            setAbsenceButtonLoading(true)
            const response = await api.post('/schedule/event',
                {
                    scheduleItemId: scheduleItemId,
                    reason: 'reason',
                    type: 1
                },
                {
                    headers: {
                        Authorization: `Bearer ${userSessionData['accessToken']}`
                    }
                }
            )
            if (response.status === 201) {
                setMessages([...messages, response.data])
                setAbsenceEventId(response.data.id)
                setAbsenceButtonLoading(false)
            }


        } catch (error) {

        }
    }

    const handlePresence = async () => {
        try {
            setAbsenceButtonLoading(true)
            const response = await api.delete(`/schedule/event/${absenceEventId}`, {
                headers: {
                    Authorization: `Bearer ${userSessionData['accessToken']}`
                }
            })
            if (response.status === 204) {
                for (let i = 0; i < messages.length; i++) {
                    if (messages[i]['id'] === absenceEventId) {
                        messages.splice(i, 1)
                        break;
                    }
                }
                setMessages(messages)
                setAbsenceEventId(null)
                setAbsenceButtonLoading(false)
            }
        }
        catch (error) {

        }
    }

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return

        try {
            const response = await api.post('/schedule/event',
                {
                    scheduleItemId: selectedScheduleItem.id,
                    reason: newMessage,
                    type: 2
                },
                {
                    headers: {
                        Authorization: `Bearer ${userSessionData['accessToken']}`
                    }
                }
            )
            if (response.status === 201) {
                setMessages([...messages, response.data])
            }


        } catch (error) {

        }

        setNewMessage('')
    }

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

            setSchedule(response)
        }
        setLoading(false)
    }


    useEffect(() => {
        loadSchedule()
    }, [id, userSessionData])

    useEffect(() => {
        if (openChat) {
            const timer = setTimeout(() => { // todo нужно придумать как сделать, чтобы это работало без setTimeout
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [openChat, messages])

    if (loading) {
        return <FullscreenLoader />
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
                                    <Paper sx={{position: 'absolute', right: 0, top: 8, px: 2, borderRadius: 0, bgcolor: '#B0BEC5', color: '#fff', display: 'flex', alignItems: 'center', fontSize: 13}}>
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
                    maxWidth: '90%',
                    width: 500,
                    height: 500,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: chatLoading ? 'center' : 'inherit',
                    alignItems: chatLoading ? 'center' : 'inherit',
                }}>

                    {
                        chatLoading ? (
                            <CircularProgress />
                        ) : (
                            <>
                                <Box
                                    sx={{
                                        flexGrow: '1',
                                        overflowY: 'auto',
                                        mt: '10px',
                                        mb: '10px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        padding: '10px',
                                        wordWrap: 'break-word',
                                        overflowWrap: 'break-word'
                                    }}
                                >
                                    {messages.map(message => (
                                        message.type === 1 ? (
                                            <Typography key={message.id} sx={{ marginBottom: "5px", fontStyle: "italic", color: "#616161", textAlign: 'center' }}>
                                                Студент {message.student.id} будет отсутствовать
                                            </Typography>
                                        ) : (
                                            <Typography key={message.id} sx={{ backgroundColor: "#e0f7fa", marginLeft: +message['student']['id'] === +userSessionData['userId'] ? 'auto' : '0', width: 'fit-content', maxWidth: '80%', borderRadius: "8px", padding: "5px", marginBottom: "5px" }}>
                                                {message.reason}
                                            </Typography>
                                        )
                                    ))}
                                    <div ref={messagesEndRef} />
                                </Box>

                                {/* Поле ввода для нового сообщения */}
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    placeholder="Введите сообщение..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />

                                <Box sx={{ display: 'flex', marginTop: "10px" }}>
                                    {absenceEventId ? (
                                        <Button variant="outlined" color="success" onClick={handlePresence} sx={{ flex: 0.3 }} disabled={absenceButtonLoading}>
                                            {absenceButtonLoading ? <CircularProgress size={24} /> : 'Приду'}
                                        </Button>
                                    ) : (
                                        <Button variant="outlined" color="secondary" onClick={() => handleAbsence(selectedScheduleItem.id)} sx={{ flex: 0.3 }} disabled={absenceButtonLoading}>
                                            {absenceButtonLoading ? <CircularProgress size={24} /> : 'Не приду'}
                                        </Button>
                                    )}
                                    <Button variant="contained" color="primary" onClick={handleSendMessage} sx={{ flex: 1, marginLeft: '10px' }}>
                                        Отправить
                                    </Button>
                                </Box>
                            </>
                        )
                    }


                </Box>
            </Modal>

        </Container>
    );
}

export default SchedulePage