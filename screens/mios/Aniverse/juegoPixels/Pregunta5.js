import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import { COLORS, SIZES, illustrations } from '../../../constants';
import Button from '../../../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JuegoPixels3 = ({ navigation }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [userId, setUserId] = useState(null); 
    const [personajeImagen, setPersonajeImagen] = useState(null);
    const [personajeNombre, setPersonajeNombre] = useState(null);
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

    const handleAnswerClick = (answer) => {
        setSelectedAnswer(answer);
    };

    useEffect(() => {
        fetchPreguntas();
    }, []);

    const fetchPreguntas = async () => {
        try {
            const response = await fetch(
                'https://momdel.es/animeWorld/api/pregunta5.php'
            );
            const data = await response.json();
            setPregunta(data.pregunta);
            setOpcionesRespuesta([
                data['primera'],
                data['segunda'],
                data['tercera'],
            ]);
        } catch (error) {
            console.error('Error al obtener las preguntas:', error);
        }
    };

    const handleContinue = async () => {
        console.log('Selected answer:', selectedAnswer);

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
                        pregunta: '5',
                        acabado: '1',
                    }),
                }
            );
            informacionPersonaje();
            setModalVisible(true);
        } catch (error) {
            console.error('Error submitting review:', error);
            setErrorMessage(
                'Failed to submit your review. Please try again later.'
            );
        }
    };

    const informacionPersonaje = async () => {
        try {
            const response = await fetch(
                'https://momdel.es/animeWorld/api/resumenCuestionario.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idUsuario: userId,
                    }),
                }
            );
            const data = await response.json();
            setPersonajeImagen(data.imagen);
            setPersonajeNombre(data.nombre);
            setModalVisible(true);
        } catch (error) {
            console.error('Error submitting review:', error);
            setErrorMessage(
                'Failed to submit your review. Please try again later.'
            );
        }
    };

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                <Header title="Pregunta 5" />
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
                                    selectedAnswer === (index + 1).toString() &&
                                        styles.selectedAnswerButton,
                                ]}
                                onPress={() =>
                                    handleAnswerClick((index + 1).toString())
                                }
                            >
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
                {/* Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                >
                    <TouchableWithoutFeedback
                        onPress={() => setModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalSubContainer}>
                                <Image
                                    source={
                                        personajeImagen
                                            ? {
                                                  uri: `https://momdel.es/animeWorld/DOCS/${personajeImagen}`,
                                              }
                                            : null
                                    }
                                    resizeMode="contain"
                                    style={styles.modalIllustration}
                                />
                                <Text style={styles.modalTitle}>
                                    {personajeNombre
                                        ? `Felicidades tu personaje más similar es, ${personajeNombre}!`
                                        : 'Congratulations!'}
                                </Text>
                                <Text
                                    style={[
                                        styles.modalSubtitle,
                                        { color: COLORS.greyscale900 },
                                    ]}
                                >
                                    Tu cuenta ya esta lista
                                </Text>
                                <Button
                                    title="Continue"
                                    filled
                                    onPress={() => {
                                        setModalVisible(false);
                                        navigation.navigate('Main');
                                    }}
                                    style={styles.modalButton}
                                />
                                <Button
                                    title="Cambiar Personaje"
                                    filled
                                    onPress={() => {
                                        setModalVisible(false);
                                        navigation.navigate('CanviarPersonaje');
                                    }}
                                    style={styles.modalButton}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
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
    modalTitle: {
        fontSize: 24,
        fontFamily: 'bold',
        color: COLORS.primary,
        textAlign: 'center',
        marginVertical: 12,
    },
    modalSubtitle: {
        fontSize: 16,
        fontFamily: 'regular',
        color: COLORS.black2,
        textAlign: 'center',
        marginVertical: 12,
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalSubContainer: {
        height: 494,
        width: SIZES.width * 0.9,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    modalIllustration: {
        height: 180,
        width: 180,
        marginVertical: 22,
    },
    modalButton: {
        width: '100%',
        marginTop: 5,
    },
});

export default JuegoPixels3;
