import React, {useEffect, useState} from 'react';
import { Grid2, Paper, Avatar, TextField, Button, Typography, Link } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import './LoginPage.css'
import api from "../../api";
import {useLocation, useNavigate} from "react-router-dom";

const LoginPage = ({ setUserSessionData }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const location = useLocation()
    const navigate = useNavigate()
    const successMessage = location.state?.successMessage

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await api.post('/login', {
                email: email,
                password: password
            })

            if (response.status === 200) {
                setUserSessionData(response.data)
                localStorage.setItem('userSessionData', JSON.stringify(response.data))
                if (response.data['roles'].includes('ROLE_ADMIN')) {
                    navigate('/admin')
                    return
                }
                navigate('/')
            }
        } catch (error) {
            if (error.response.status === 401)
                setErrorMessage(error.response.data.message)
            else
                setErrorMessage('An error occurred. Please try again.');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        if (token)
            navigate('/')
    })

    return (
        <Grid2 container className='page-container' sx={{bgcolor: 'background.default'}}>
            <Paper elevation={10} className='login-tile' >
                <Grid2 align='center'>
                    <Avatar style={{ backgroundColor: '#1bbd7e' }}><LockOutlinedIcon /></Avatar>
                    <h2>Вход</h2>
                </Grid2>
                {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                {successMessage && <Typography color="success">{successMessage}</Typography>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label='Email'
                        placeholder='Введите email'
                        variant="outlined"
                        fullWidth
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label='Password'
                        placeholder='Enter password'
                        type='password'
                        variant="outlined"
                        fullWidth
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type='submit' color='primary' variant="contained" style={{ margin: '8px 0' }} fullWidth>
                        Войти
                    </Button>
                    <Typography>
                        <Link href="#" >Забыли пароль?</Link>
                    </Typography>
                    <Typography>
                        Нет аккаунта? <Link href="/register">Зарегистрируйтесь</Link>
                    </Typography>
                </form>
            </Paper>
        </Grid2>
    );
};

export default LoginPage;