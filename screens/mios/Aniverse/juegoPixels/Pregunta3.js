import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../../../components/Header'
import { ScrollView } from 'react-native-virtualized-view'
import { COLORS } from '../../../constants'
import Button from '../../../components/Button'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Pregunta3 = ({ navigation }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [userId, setUserId] = useState(null) // Estado para almacenar el ID recuperado de AsyncStorage
    const [pregunta, setPregunta] = useState('');
    const [opcionesRespuesta, setOpcionesRespuesta] = useState([]);

    // Cargar el ID de AsyncStorage cuando el componente se monte
    useEffect(() => {
        const loadUserId = async () => {
            try {
                const userIdFromStorage = await AsyncStorage.getItem('userId')
                setUserId(userIdFromStorage)
            } catch (error) {
                console.error('Error loading userId from AsyncStorage:', error)
            }
        }

        loadUserId()
    }, [])

    const handleAnswerClick = (answer) => {
        setSelectedAnswer(answer)
    }

    useEffect(() => {
        fetchPreguntas();
    }, []);
    const fetchPreguntas = async () => {
        try {
            const response = await fetch(
                'https://momdel.es/animeWorld/api/pregunta3.php'
            );
            const data = await response.json();
            setPregunta(data.pregunta);
            setOpcionesRespuesta([data['primera'], data['segunda'], data['tercera']]);
        } catch (error) {
            console.error('Error al obtener las preguntas:', error);
        }
    };

    const handleContinue = async () => {
        console.log('Selected answer:', selectedAnswer)

        try {
            const response = await fetch(
                'https://momdel.es/animeWorld/api/guardarCuestionario.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idUsuario: userId,
                        respuesta: selectedAnswer,
                        pregunta: '3',
                    }),
                }
            )
            // Cerrar el modal
            navigation.navigate('Pregunta4')
        } catch (error) {
            console.error('Error submitting review:', error)
            setErrorMessage(
                'Failed to submit your review. Please try again later.'
            )
        }
    }

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                <Header title="Pregunta 3" />
                <ScrollView contentContainerStyle={styles.center}>
                    <Text
                        style={[styles.title, { color: COLORS.greyscale900 }]}
                    >
                        {pregunta}
                    </Text>
                    <View style={styles.answersContainer}>
                        {opcionesRespuesta.map((opcion, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.answerButton,
                                    selectedAnswer === (index + 1).toString() && styles.selectedAnswerButton,
                                ]}
                                onPress={() => handleAnswerClick((index + 1).toString())}>
                                <Text style={styles.answerText}>{opcion}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Button
                        title="Continue"
                        filled
                        style={styles.button}
                        onPress={handleContinue}
                    />
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

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
})

export default Pregunta3
