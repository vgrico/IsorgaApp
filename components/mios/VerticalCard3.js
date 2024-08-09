import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS, SIZES } from '../../constants';

const VerticalCard3 = ({
    name,
    image,
    location,
    startTime,
    endTime,
    date,
    isFree,
    onPress,
    id,
    completado,
    intentos
}) => {
    const [isFavourite, setIsFavourite] = useState(false);
    const [examenDisponible, setExamenDisponible] = useState(null); // Inicializar como null para manejar los tres estados
    const navigation = useNavigation();

    useEffect(() => {
        fetchExamenesDisponibles();
    }, []);

    const fetchExamenesDisponibles = async () => {
        try {
            const response = await fetch(`https://momdel.es/animeWorld/api/listadoSeriesMiasExamenSi.php?id=${id}`);
            const data = await response.json();
            setExamenDisponible(data.length > 0); // Verificar si hay datos en la respuesta
        } catch (error) {
            console.error('Error fetching examenes disponibles:', error);
            setExamenDisponible(false);
        }
    };

    const handleExamPress = () => {
        if (intentos !== 0 && examenDisponible) {
            navigation.navigate('ExPregunta1', { id: id });
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.container,
                {
                    backgroundColor: COLORS.white,
                },
            ]}
        >
            <Image
                source={{ uri: `https://momdel.es/animeWorld/DOCS/${image}` }}
                resizeMode="cover"
                style={styles.image}
            />
            <Text
                style={[
                    styles.name,
                    {
                        color: COLORS.greyscale900,
                    },
                ]}
            >
                {name}
            </Text>
            <Text
                style={[
                    styles.location,
                    {
                        color: COLORS.grayscale700,
                    },
                ]}
            >
                Intentos Restantes: {intentos}
            </Text>
            {completado === 1 ? (
                <TouchableOpacity style={[styles.examButton, { backgroundColor: COLORS.success }]}>
                    <Text style={[styles.examButtonText, { color: COLORS.white }]}>Serie verificada</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    onPress={handleExamPress}
                    style={[
                        styles.examButton,
                        { backgroundColor: examenDisponible ? COLORS.primary : COLORS.orange },
                    ]}
                    disabled={examenDisponible === null || !examenDisponible}
                >
                    <Text style={styles.examButtonText}>
                        {examenDisponible === null ? 'Verificando...' : examenDisponible ? 'Verificar serie' : 'Verificación no disponible'}
                    </Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        width: (SIZES.width - 32) / 2 - 12,
        backgroundColor: COLORS.white,
        padding: 6,
        borderRadius: 16,
        marginBottom: 12,
    },
    image: {
        width: '100%',
        height: 140,
        borderRadius: 16,
    },
    name: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        marginVertical: 4,
        alignItems: 'center',
    },
    location: {
        fontSize: 12,
        fontFamily: 'regular',
        color: COLORS.grayscale700,
        marginVertical: 4,
    },
    examButton: {
        paddingVertical: 8,
        borderRadius: 8,
        marginTop: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    examButtonText: {
        color: COLORS.white,
        fontSize: 16,
    },
});

export default VerticalCard3;
