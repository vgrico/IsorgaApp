import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Animated,
    Alert,
    Modal,
    TouchableWithoutFeedback,
    Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, icons } from '../../../constants';

const sobreImage = require('../../assets/images/sobre.jpg');
const sobreImage2 = require('../../assets/images/sobre2.jpg');

const { width } = Dimensions.get('window');
const isIpad = width > 600;

const Sobres = ({ navigation }) => {
    const [selectedSobre, setSelectedSobre] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [cartaURL, setCartaURL] = useState(null);
    const [sobresDisponibles, setSobresDisponibles] = useState([]);
    const [showSobreModal, setShowSobreModal] = useState(false);
    const [showCartaModal, setShowCartaModal] = useState(false);

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

    const card1Scale = useRef(new Animated.Value(1)).current;
    const card2Scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        fetchSobres();
    }, [userId]);

    const fetchSobres = async () => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/sobresUsuario.php?id=${userId}`
            );
            const data = await response.json();
            const sobresConCantidad = data.filter((sobre) => sobre.cantidad > 0);
            setSobresDisponibles(sobresConCantidad);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching sobres:', error);
            setIsLoading(false);
        }
    };

    const handleSobreClick = async (tipo) => {
        const sobre = sobresDisponibles.find((sobre) => sobre.tipo === tipo);
        if (!sobre || sobre.cantidad === 0) {
            Alert.alert(
                '¡No tienes este sobre!',
                `No tienes suficientes sobres del tipo ${tipo}.`
            );
            return;
        }

        setSelectedSobre(tipo);
        setShowSobreModal(true);
    };

    const animateCard = (scaleRef) => {
        Animated.sequence([
            Animated.timing(scaleRef, {
                toValue: 1.3,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(scaleRef, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const closeModal = () => {
        setShowSobreModal(false);
        setShowCartaModal(false);
    };

    const openCartaModal = async () => {
        setShowSobreModal(false);
        try {
            const response = await fetch(
                'https://momdel.es/animeWorld/api/abrirSobre.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        tipo: selectedSobre,
                        userId: userId,
                    }),
                }
            );
            const response2 = await fetch(
                'https://momdel.es/animeWorld/api/calculoNivel.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: userId,
                        puntos: 200,
                    }),
                }
            );
            const data = await response.json();
            if (data.carta) {
                setCartaURL(data.carta);
                fetchSobres();
                setShowCartaModal(true);
            } else {
                console.error(
                    'No se recibió la URL de la carta en la respuesta.'
                );
            }
        } catch (error) {
            console.error('Error fetching imágenes:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image
                        source={icons.back}
                        resizeMode="contain"
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Sobres Disponibles</Text>
            </View>

            <View style={styles.cardsContainer}>
                <TouchableOpacity onPress={() => handleSobreClick(1)}>
                    <Animated.Image
                        source={sobreImage}
                        style={[
                            styles.sobreImage,
                            {
                                transform: [
                                    {
                                        scale:
                                            selectedSobre === 1
                                                ? card1Scale
                                                : 1,
                                    },
                                ],
                                borderColor: 'rgba(128, 128, 128, 0.5)',
                            },
                        ]}
                    />
                    <View style={styles.sobreOverlay}>
                        <Text style={styles.sobreText}>
                            {isLoading
                                ? 'Cargando...'
                                : sobresDisponibles.find(
                                      (sobre) => sobre.tipo === 1
                                  )?.cantidad || 0}
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleSobreClick(2)}>
                    <Animated.Image
                        source={sobreImage2}
                        style={[
                            styles.sobreImage,
                            {
                                transform: [
                                    {
                                        scale:
                                            selectedSobre === 2
                                                ? card2Scale
                                                : 1,
                                    },
                                ],
                                borderColor: 'rgba(128, 128, 128, 0.5)',
                            },
                        ]}
                    />
                    <View style={styles.sobreOverlay}>
                        <Text style={styles.sobreText}>
                            {isLoading
                                ? 'Cargando...'
                                : sobresDisponibles.find(
                                      (sobre) => sobre.tipo === 2
                                  )?.cantidad || 0}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showSobreModal}
                onRequestClose={closeModal}
            >
                <TouchableWithoutFeedback onPress={openCartaModal}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Image
                                source={
                                    selectedSobre === 1 ? sobreImage : sobreImage2
                                }
                                style={styles.sobreModalImage}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showCartaModal}
                onRequestClose={closeModal}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableWithoutFeedback onPress={closeModal}>
                            <Image
                                source={{
                                    uri: `https://momdel.es/animeWorld/DOCS/cartas/${cartaURL}`,
                                }}
                                style={styles.sobreModalImage}
                            />
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(192, 192, 192, 0.1)',
        paddingHorizontal: isIpad ? 60 : 20, // Ajuste del padding para pantallas grandes
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 16,
        marginTop: 50,
        marginBottom: 20,
    },
    backButton: {
        position: 'absolute',
        left: 16,
    },
    backIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
    },
    headerTitle: {
        fontSize: isIpad ? 34 : 24, // Ajuste del tamaño de fuente para pantallas grandes
        fontWeight: 'bold',
        color: 'black',
    },
    cardsContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sobreImage: {
        width: isIpad ? 220 : 170, // Ajuste del tamaño para pantallas grandes
        height: isIpad ? 380 : 300, // Ajuste del tamaño para pantallas grandes
        marginBottom: 10,
        marginHorizontal: 10, // Aplica un margen horizontal para separar las imágenes
    },
    sobreOverlay: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 5,
        marginRight: 15,
    },
    sobreText: {
        fontSize: isIpad ? 20 : 16, // Ajuste del tamaño de fuente para pantallas grandes
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    cartaContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    cartaImage: {
        width: 100,
        height: 150,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'transparent', // Hacer el modal transparente
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    sobreModalImage: {
        width: isIpad ? 350 : 300, // Ajuste del tamaño para pantallas grandes
        height: isIpad ? 450 : 400, // Ajuste del tamaño para pantallas grandes
        resizeMode: 'contain',
    },
});

export default Sobres;
