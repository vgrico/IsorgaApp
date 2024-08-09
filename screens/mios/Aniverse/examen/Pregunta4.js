// ExPregunta1.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import Button from '../../../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { COLORS } from '../../../constants';

const ExPregunta4 = ({ route, navigation }) => {
    const { id } = route.params;
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [userId, setUserId] = useState(null);
    const [pregunta, setPregunta] = useState('');
    const [opcionesRespuesta, setOpcionesRespuesta] = useState([]);

    useEffect(() => {
        const loadUserId = async () => {
            try {
                const userIdFromStorage = await AsyncStorage.getItem('userId');
                setUserId(userIdFromStorage);
            } catch (error) {
                console.error('Error loading userId from AsyncStorage:', error);
            }
        };

        loadUserId();
    }, []);

    useEffect(() => {
        fetchPreguntas();
    }, []);

    const fetchPreguntas = async () => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/ExPregunta4.php?id=${id}`
            );
            const data = await response.json();
            setPregunta(data.pregunta);
            setOpcionesRespuesta([
                { respuesta: data['primera'], esCorrecta: data['correcta'] === '1' },
                { respuesta: data['segunda'], esCorrecta: data['correcta'] === '2' },
                { respuesta: data['tercera'], esCorrecta: data['correcta'] === '3' },
                { respuesta: data['cuarta'], esCorrecta: data['correcta'] === '4' },
            ]);
        } catch (error) {
            console.error('Error al obtener las preguntas:', error);
        }
    };

    const handleAnswerClick = (index) => {
        setSelectedAnswer(index);
    };

    const handleContinue = async () => {
        if (selectedAnswer === null) {
            Alert.alert('Seleccione una respuesta', 'Por favor seleccione una respuesta antes de continuar');
            return;
        }

        const selectedOption = opcionesRespuesta[selectedAnswer];
        if (selectedOption.esCorrecta) {
            navigation.navigate('ExPregunta5', { id: id });
        } else {
            const response = await fetch('https://momdel.es/animeWorld/api/preguntaExamenFallada.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idUsuario: userId,
                    serie: id,
                }),
            });
            Alert.alert('Examen fallado', 'La respuesta seleccionada es incorrecta.');
            navigation.navigate('MisSeries');
        }
    };

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                <Header title="Pregunta 4" />
                <ScrollView contentContainerStyle={styles.center}>
                    <Text style={[styles.title, { color: COLORS.greyscale900 }]}>{pregunta}</Text>
                    <View style={styles.answersContainer}>
                        {opcionesRespuesta.map((opcion, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.answerButton,
                                    selectedAnswer === index && styles.selectedAnswerButton,
                                ]}
                                onPress={() => handleAnswerClick(index)}
                            >
                                <Text style={styles.answerText}>{opcion.respuesta}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Button title="Continue" filled style={styles.button} onPress={handleContinue} />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.white,
    },
    title: {
        fontSize: 18,
        fontFamily: 'medium',
        color: COLORS.greyscale900,
        textAlign: 'center',
        marginBottom: 24,
    },
    answersContainer: {
        alignItems: 'center',
    },
    answerButton: {
        backgroundColor: COLORS.secondaryWhite,
        borderColor: COLORS.primary,
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    selectedAnswerButton: {
        backgroundColor: COLORS.primary,
    },
    answerText: {
        fontSize: 16,
        fontFamily: 'medium',
        color: COLORS.greyscale900,
        textAlign: 'center',
    },
    button: {
        borderRadius: 32,
        marginTop: 24,
    },
    center: {
        flexGrow: 1,
        justifyContent: 'center',
    },
});

export default ExPregunta4;
