import {useEffect, useState} from "react";
import api from "../../api";
import {useNavigate} from "react-router-dom";
import {Button, Card, CardContent, CircularProgress, Container, Divider, Grid2, Typography} from "@mui/material";


const SchedulesListPage = ({token}) => {
    const [schedules, setSchedules] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const fetchSchedules = async () => {
        try {
            const response = await api.get('/user_schedules', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setSchedules(response.data)
            setLoading(false)
        } catch (err) {
            if (err.response.status === 401)
                navigate('/login')
            setError(err)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSchedules()
    }, [token])

    if (loading) return <CircularProgress />
    if (error) return <div>Error: {error.message}</div>

    return (
        <Container maxWidth='xxl' sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            pt: 3
        }}>
            <Container>
                <Typography variant="h4" gutterBottom color='text.primary'>Ваши расписания</Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    Тут вы можете найти все доступные вам расписания.
                </Typography>
                <Grid2 container spacing={3}>
                    {schedules.map(schedule => (
                        <Grid2 item xs={12} sm={6} md={4} key={schedule.id}>
                            <Card sx={{ boxShadow: 3 }}>
                                <CardContent>
                                    <Typography variant="h6">{schedule.title}</Typography>
                                    <Typography color="textSecondary">ID: {schedule.id}</Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Button variant="contained" color="primary" size="small">Перейти к расписанию</Button>
                                </CardContent>
                            </Card>
                        </Grid2>
                    ))}
                </Grid2>
            </Container>
        </Container>
    );
}

export default SchedulesListPage