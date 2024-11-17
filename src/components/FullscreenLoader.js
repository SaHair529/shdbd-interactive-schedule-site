import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const FullScreenLoader = ( {loading, opacity} ) => {
    if (!loading) return null
    const styles = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: '#fff', // Полупрозрачный фон
        display: 'flex',
        justifyContent: 'center', // Центрирование по горизонтали
        alignItems: 'center', // Центрирование по вертикали
        zIndex: 9999, // Убедитесь, что загрузчик поверх других элементов
        opacity: 0.5
    }

    if (opacity) {
        styles.opacity = opacity
    }

    return (
        <Box
            sx={styles}
        >
            <CircularProgress size={60} color="primary" /> {/* Размер и цвет лоадера */}
        </Box>
    );
};

export default FullScreenLoader;