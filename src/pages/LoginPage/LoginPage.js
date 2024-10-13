import React, { useState } from 'react';
import { Grid2, Paper, Avatar, TextField, Button, Typography, Link } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import './LoginPage.css'

const LoginPage = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://your-api-url/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                setToken(data.token); // Сохраните токен
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.error || 'Login failed');
            }
        } catch (error) {
            setErrorMessage('An error occurred. Please try again.');
        }
    };


    return (
        <Grid2 container className='page-container'>
            <Paper elevation={10} className='login-tile' >
                <Grid2 align='center'>
                    <Avatar style={{ backgroundColor: '#1bbd7e' }}><LockOutlinedIcon /></Avatar>
                    <h2>Вход</h2>
                </Grid2>
                {errorMessage && <Typography color="error">{errorMessage}</Typography>}
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
                        Нет аккаунта? <Link href="#">Зарегистрируйтесь</Link>
                    </Typography>
                </form>
            </Paper>
        </Grid2>
    );
};

export default LoginPage;