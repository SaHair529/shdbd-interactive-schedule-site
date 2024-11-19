import {useEffect, useState} from "react";
import api from "../../../api";
import {useNavigate, Link} from "react-router-dom";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    FormControl,
    Grid2, InputLabel, MenuItem,
    Modal, Select,
    TextField,
    Typography
} from "@mui/material";
import FullscreenLoader from "../../../components/FullscreenLoader";


const AdminSchedulesListPage = ({userSessionData}) => {
    const [schedules, setSchedules] = useState([])
    const [openCreateScheduleModal, setOpenCreateScheduleModal] = useState(false)
    const [newScheduleTitle, setNewScheduleTitle] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const fetchSchedules = async () => {
        try {
            const response = await api.get('/user_schedules', {
                headers: {
                    Authorization: `Bearer ${userSessionData['accessToken']}`
                }
            })
            setSchedules(response.data)
            setLoading(false)
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem('accessToken')
                navigate('/login')
                return
            }
            setError(err)
            setLoading(false)
        }
    }

    const handleCloseCreateScheduleModal = () => {
        setOpenCreateScheduleModal(false)
    }

    const handleSubmitCreateSubject = async () => {
        try {
            const response = await api.post('/schedule/create',
                {
                    title: newScheduleTitle,
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

    useEffect(() => {
        fetchSchedules()
    }, [userSessionData])

    if (loading) return <FullscreenLoader loading={loading} />
    if (error) return <div>Error: {error.message}</div>

    return (
        <Container maxWidth='xxl' sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            pt: 3
        }}>
            <Container>
                <Typography variant="h4" gutterBottom color='text.primary'>Расписания</Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    Тут вы можете найти все доступные вам расписания, создавать новые и изменять существующие
                </Typography>
                <Grid2 container spacing={3}>
                    {schedules.map(schedule => (
                        <Grid2 item xs={12} sm={6} md={4} key={schedule.id}>
                            <Card sx={{ boxShadow: 3 }}>
                                <CardContent>
                                    <Typography variant="h6">{schedule.title}</Typography>
                                    <Typography color="textSecondary">ID: {schedule.id}</Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Link to={`/admin/schedule/${schedule.id}`}>
                                        <Button variant="contained" color="primary" size="small">Редактировать</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </Grid2>
                    ))}
                    <Grid2 item xs={12} sm={6} md={4}>
                        <Card title='Добавить новое расписание' onClick={() => setOpenCreateScheduleModal(true)} className='hover-opacity' sx={{
                            boxShadow: 3,
                            bgcolor: 'rgba(0, 0, 0, 0.1)', // Полупрозрачный фон
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            cursor: 'pointer',
                            width: '160px',
                            color: 'grey',
                            fontSize: '50px',
                            opacity: 0.3
                        }}>
                            <CardContent>
                                +
                            </CardContent>
                        </Card>
                    </Grid2>
                </Grid2>
            </Container>
            <Modal open={openCreateScheduleModal} onClose={handleCloseCreateScheduleModal}>
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

                    <form onSubmit={handleSubmitCreateSubject}>
                        <TextField
                            label="Название нового расписания"
                            value={newScheduleTitle}
                            onChange={(e) => setNewScheduleTitle(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button type="submit" variant="contained" color="primary">
                                Создать
                            </Button>
                        </Box>
                    </form>

                </Box>
            </Modal>
        </Container>
    );
}

export default AdminSchedulesListPage