import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const FullScreenLoader = () => {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(0, 0, 0, 0.5)', // Полупрозрачный фон
                display: 'flex',
                justifyContent: 'center', // Центрирование по горизонтали
                alignItems: 'center', // Центрирование по вертикали
                zIndex: 9999 // Убедитесь, что загрузчик поверх других элементов
            }}
        >
            <CircularProgress size={60} color="primary" /> {/* Размер и цвет лоадера */}
        </Box>
    );
};

export default FullScreenLoader;