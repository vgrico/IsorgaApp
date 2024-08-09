import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import { COLORS } from '../../../constants';
import Button from '../../../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JuegoPixels5 = ({ navigation }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [userId, setUserId] = useState(null);
    const [data, setData] = useState(null);
    const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
    const [correcta, setCorrecta] = useState(null);
    const [cantidad, setCantidad] = useState(0);
    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [summaryModalVisible, setSummaryModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

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
        if (userId) {
            fetchPreguntas();
        }
    }, [userId]);

    const fetchPreguntas = async () => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/juegoPixels5.php?id=${userId}`
            );
            const data = await response.json();
            setData(data);
        } catch (error) {
            console.error('Error al obtener las preguntas:', error);
        }
    };

    const handleAnswerClick = (answer) => {
        setSelectedAnswer(answer);
        setShowCorrectAnswer(true);
        const isCorrect = answer === data.respuesta.toString();
        setCorrecta(isCorrect ? 1 : 0);
        setModalMessage(isCorrect ? '¡Felicidades, has acertado!' : 'Lo siento, has fallado.');
        setResultModalVisible(true);
    };

    const handleContinue = async () => {
        try {
            const response = await fetch(
                'https://momdel.es/animeWorld/api/guardarJuegoPixel5.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idUsuario: userId,
                        respuesta: selectedAnswer,
                        correcta: correcta,
                        idJuego: data.id
                    }),
                }
            );
            const result = await response.json();
            setCantidad(result.cantidad);
            setResultModalVisible(false);
            setSummaryModalVisible(true);
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const handleNavigateToJuegos = () => {
        setSummaryModalVisible(false);
        navigation.navigate('Juegos');
    };

    if (!data) {
        return <Text>Loading...</Text>;
    }

    const opcionesRespuesta = [
        data.opcion1,
        data.opcion2,
        data.opcion3,
        data.opcion4,
    ];

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                <Header title="Pregunta 5" />
                <ScrollView contentContainerStyle={styles.center}>
                    <Text style={[styles.title, { color: COLORS.greyscale900 }]}>
                        ¿Qué personaje es este?
                    </Text>
                    <Image
                        source={{ uri: `https://momdel.es/animeWorld/DOCS/juegoPixel/${data.imagenPixel}` }}
                        style={styles.image}
                    />
                    <View style={styles.answersContainer}>
                        {opcionesRespuesta.map((opcion, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.answerButton,
                                    showCorrectAnswer && selectedAnswer === (index + 1).toString() &&
                                    (selectedAnswer === data.respuesta.toString() ? styles.correctAnswer : styles.incorrectAnswer),
                                ]}
                                onPress={() => handleAnswerClick((index + 1).toString())}
                                disabled={showCorrectAnswer}
                            >
                                <Text style={styles.answerText}>{opcion}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>
            <Modal
                visible={resultModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setResultModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{modalMessage}</Text>
                        <Image
                            source={{ uri: `https://momdel.es/animeWorld/DOCS/juegoPixel/${data.imagenBuena}` }}
                            style={styles.image}
                        />
                        <Button
                            title="Continuar"
                            filled
                            style={styles.modalButton}
                            onPress={handleContinue}
                        />
                    </View>
                </View>
            </Modal>
            <Modal
                visible={summaryModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setSummaryModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{`Has contestado ${cantidad}/5 correctamente`}</Text>
                        <Button
                            title="Ir a Juegos"
                            filled
                            style={styles.modalButton}
                            onPress={handleNavigateToJuegos}
                        />
                    </View>
                </View>
            </Modal>
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
    image: {
        width: 200,
        height: 300,
        alignSelf: 'center',
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
    correctAnswer: {
        backgroundColor: 'green',
    },
    incorrectAnswer: {
        backgroundColor: 'red',
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalButton: {
        borderRadius: 10,
    },
});

export default JuegoPixels5;
