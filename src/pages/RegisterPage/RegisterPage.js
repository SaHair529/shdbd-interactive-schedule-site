import React, {useState} from "react";
import {Avatar, Button, Grid2, Link, Paper, TextField, Typography} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import api from "../../api";
import './RegisterPage.css'
import {useNavigate} from "react-router-dom";


const RegisterPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const response = await api.post('/register', {
                email: email,
                password: password
            })

            if (response.status === 201) {
                navigate('/login')
            }

        } catch (error) {
            if (error.response.status === 409)
                setErrorMessage('Email уже зарегистрирован')
            else
                setErrorMessage('An error occurred. Please try again.');
        }
    }

    return (
        <Grid2 container className='page-container' sx={{bgcolor: 'background.default'}}>
            <Paper elevation={10} className='register-tile'>
                <Grid2 align='center'>
                    <Avatar style={{backgroundColor: '#1bbd7e'}}><LockOutlinedIcon/></Avatar>
                    <h2>Регистрация</h2>
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
                    <Button type='submit' color='primary' variant="contained" style={{margin: '8px 0'}} fullWidth>
                        Зарегистрироваться
                    </Button>
                    <Typography>
                        Уже зарегистрированы? <Link href="/login">Войдите</Link>
                    </Typography>
                </form>
            </Paper>
        </Grid2>
    )
}

export default RegisterPage