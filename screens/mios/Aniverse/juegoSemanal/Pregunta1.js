import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import { COLORS } from '../../../constants';
import Button from '../../../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JuegoSemanal1 = ({ navigation }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [userId, setUserId] = useState(null);
    const [pregunta, setPregunta] = useState('');
    const [personajes, setPersonajes] = useState([]);

    // Cargar el ID de AsyncStorage cuando el componente se monte
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
            const response = await fetch('https://momdel.es/animeWorld/api/juegoSemanal1.php');
            const data = await response.json();
            setPregunta(data.pregunta);
            setPersonajes([
                { id: data.idPersonaje1, imagen: data.imagenPersonaje1, nombre: data.nombrePersonaje1 },
                { id: data.idPersonaje2, imagen: data.imagenPersonaje2, nombre: data.nombrePersonaje2 }
            ]);
        } catch (error) {
            console.error('Error al obtener las preguntas:', error);
        }
    };

    const handleAnswerClick = (answer) => {
        setSelectedAnswer(answer);
    };

    const handleContinue = async () => {
        console.log('Selected answer:', selectedAnswer);
        console.log('Selected answer:', userId);

        try {
            await fetch(
                'https://momdel.es/animeWorld/api/guardarJuegoSemanal.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idUsuario: userId,
                        respuesta: selectedAnswer,
                        pregunta: '1'
                    }),
                }
            );
            navigation.navigate('JuegoSemanal2');
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                <Header title="Pregunta 1" />
                <ScrollView contentContainerStyle={styles.center}>
                    <Text style={[styles.title, { color: COLORS.greyscale900 }]}>
                        Ataque
                    </Text>
                    <View style={styles.answersContainer}>
                        {personajes.map((personaje) => (
                            <TouchableOpacity
                                key={personaje.id}
                                style={[
                                    styles.answerButton,
                                    selectedAnswer === personaje.id.toString() && styles.selectedAnswerButton,
                                ]}
                                onPress={() => handleAnswerClick(personaje.id.toString())}
                            >
                                <Image
                                    source={{ uri: `https://momdel.es/animeWorld/DOCS/${personaje.imagen}` }}
                                    style={styles.characterImage}
                                    resizeMode="cover"
                                />
                                <Text style={styles.answerText}>{personaje.nombre}</Text>
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
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 24,
    },
    answerButton: {
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        borderRadius: 8,
    },
    selectedAnswerButton: {
        borderColor: COLORS.primary,
    },
    answerText: {
        fontSize: 16,
        fontFamily: 'medium',
        color: COLORS.greyscale900,
        textAlign: 'center',
        marginTop: 8,
    },
    characterImage: {
        width: 150,
        height: 150,
        borderRadius: 8,
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

export default JuegoSemanal1;
