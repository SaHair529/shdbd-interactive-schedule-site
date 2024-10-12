import {useEffect, useState} from "react";
import api from "../../api";
import './SchedulePage.css'
import {
    CircularProgress,
    Container,
    Grid2,
    Paper,
    Typography
} from "@mui/material";


const SchedulePage = ({scheduleId}) => {
    const [schedule, setSchedule] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const dayNumbersNaming = ['','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресение'] // В начале пустая строка, чтобы у понедельника индекс был равен 1

    const fetchSchedule = async (id) => {
        try {
            const response = await api.get(`/schedule/${id}`)
            return response.data
        } catch (err) {
            setError(err)
            console.error(err)
            return null
        }
    }

    useEffect(() => {
        const loadSchedule = async () => {
            const response = await fetchSchedule(scheduleId)

            // Сортируем предметы по дням в респонсе
            response.sortedScheduleItems = {1: [], 2: [], 3: [], 4: [], 5: [], 6: []}
            response.scheduleItems.forEach(scheduleItem => {
                response.sortedScheduleItems[scheduleItem.dayOfWeek].push(scheduleItem)
            })
            response.scheduleItems = undefined

            setSchedule(response)
            console.log(response)
            setLoading(false)
        }

        loadSchedule()
    }, [scheduleId])

    if (loading) {
        return <CircularProgress />
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Container maxWidth='xxl' sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #a1c9f1, #ffb3aa)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }} >
            <Grid2 container spacing={2} sx={{width: '100%'}}>
                {/* Заголовки дней */}
                {Object.keys(schedule.sortedScheduleItems).map((dayNumber) => (
                    <Grid2 item xs={12} size={4} sx={{flexGrow: 1, minHeight: '40vh', background: 'rgba(245, 245, 245, 0.6)', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'}} key={dayNumber}>
                        <Paper elevation={3} className='day-paper'>
                            <Typography >{dayNumbersNaming[dayNumber]}</Typography>
                        </Paper>
                        {schedule.sortedScheduleItems[dayNumber].map(scheduleItem => (
                            <Grid2 item xs={12} sx={{flexGrow: 1}} key={scheduleItem.id}>
                                <Paper elevation={3} className='subject-paper'>
                                    <Typography >{scheduleItem.subject.name}</Typography>
                                </Paper>
                            </Grid2>
                        ))}
                    </Grid2>
                ))}

                {/* Заполнение уроками */}
            </Grid2>

        </Container>
    );
}

export default SchedulePage