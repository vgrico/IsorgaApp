import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { COLORS, icons } from '../../constants';
import Button from '../../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const JuegoPreguntas = ({ navigation }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [preguntaActual, setPreguntaActual] = useState({});
    const [preguntas, setPreguntas] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [respuestaCorrecta, setRespuestaCorrecta] = useState(null);
    const [porcentaje, setPorcentaje] = useState(0);

    useEffect(() => {
        cargarUserId();
        fetchPreguntas();
    }, []);

    useEffect(() => {
        if (preguntas.length > 0) {
            setPreguntaActual(preguntas[0]);
            setLoading(false);
        }
    }, [preguntas]);

    const cargarUserId = async () => {
        try {
            const userIdFromStorage = await AsyncStorage.getItem('userId');
            setUserId(userIdFromStorage);
        } catch (error) {
            console.error('Error al cargar userId desde AsyncStorage:', error);
        }
    };

    const fetchPreguntas = async () => {
        try {
            const response = await fetch(
                'https://momdel.es/animeWorld/api/juegoPreguntas.php'
            );
            const data = await response.json();
            setPreguntas(data);
        } catch (error) {
            console.error('Error al obtener las preguntas:', error);
        }
    };

    const fetchPorcentaje = async () => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/juegoPreguntasProgreso.php?id=${userId}`
            );
            const data = await response.json();
            console.log(data.porcentaje);
            setPorcentaje(data.porcentaje);
            setLoading(false); // Marcamos que hemos terminado de cargar
        } catch (error) {
            console.error('Error al obtener el porcentaje:', error);
        }
    };

    const enviarRespuesta = async (esCorrecta) => {
        try {
            await fetch(
                'https://momdel.es/animeWorld/api/guardarJuegoPreguntas.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userId,
                        esCorrecta: esCorrecta,
                    }),
                }
            );
        } catch (error) {
            console.error('Error al enviar la respuesta:', error);
        }
    };

    const handleAnswerClick = (answer) => {
        if (!selectedAnswer) {  // Solo permite seleccionar una vez
            setSelectedAnswer(answer);
            if (answer === preguntaActual.correcta.toString()) {
                setRespuestaCorrecta(true);
                enviarRespuesta(true);
            } else {
                setRespuestaCorrecta(false);
                enviarRespuesta(false);
            }
        }
    };

    const handleContinue = async () => {
        setSelectedAnswer(null);
        setRespuestaCorrecta(null);
        fetchPreguntas();
    };

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.headerWrapper}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image
                        source={icons.back}
                        resizeMode="contain"
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Juego de Quiz</Text>
                <TouchableOpacity
                    style={styles.iconWrapper}
                    onPress={() => navigation.navigate('ClasificacionQuiz')}
                >
                    <Ionicons
                        name="trophy-outline"
                        style={styles.iconCopa}
                        size={28}
                        color={COLORS.black}
                    />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.center}>
                <Text
                    style={[styles.title, { color: COLORS.greyscale900 }]}
                >
                    {preguntaActual.pregunta}
                </Text>
                <View style={styles.answersContainer}>
                    {['1', '2', '3', '4'].map((respuesta) => (
                        <TouchableOpacity
                            key={respuesta}
                            style={[
                                styles.answerButton,
                                selectedAnswer === respuesta &&
                                respuestaCorrecta !== null &&
                                (respuestaCorrecta
                                    ? styles.correctAnswerButton
                                    : styles.incorrectAnswerButton),
                            ]}
                            onPress={() => handleAnswerClick(respuesta)}
                            disabled={!!selectedAnswer}  // Deshabilitar si hay una respuesta seleccionada
                        >
                            <Text style={styles.answerText}>
                                {preguntaActual[respuesta]}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                {respuestaCorrecta !== null && (
                    <View style={styles.resultContainer}>
                        {respuestaCorrecta ? (
                            <Text style={styles.correctText}>
                                ¡Respuesta correcta!
                            </Text>
                        ) : (
                            <Text style={styles.incorrectText}>
                                Respuesta incorrecta
                            </Text>
                        )}
                        <Button
                            title="Continuar"
                            filled
                            style={styles.button}
                            onPress={handleContinue}
                        />
                    </View>
                )}
            </ScrollView>
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
    headerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 16,
        marginTop: 50,
        marginBottom: 24,
    },
    backButton: {
        padding: 10,
    },
    backIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'medium',
        color: COLORS.greyscale900,
        textAlign: 'center',
        flex: 1, // This makes the title take up available space
    },
    iconWrapper: {
        padding: 10,
    },
    iconCopa: {
        marginLeft: 10,
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
        width: '80%',
    },
    correctAnswerButton: {
        backgroundColor: COLORS.greeen,
    },
    incorrectAnswerButton: {
        backgroundColor: COLORS.red,
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
        width: '80%',
    },
    center: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    correctText: {
        color: COLORS.greeen,
        fontSize: 18,
        fontFamily: 'medium',
        marginBottom: 10,
    },
    incorrectText: {
        color: COLORS.red,
        fontSize: 18,
        fontFamily: 'medium',
        marginBottom: 10,
    },
});

export default JuegoPreguntas;
