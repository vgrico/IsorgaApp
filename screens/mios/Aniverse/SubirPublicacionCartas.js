import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    TouchableWithoutFeedback,
    Keyboard,
    FlatList,
    Image,
    Modal,
} from 'react-native';
import { COLORS, icons } from '../../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SubirPublicacionCarta = ({ navigation }) => {
    const [userId, setUserId] = useState(null);
    const [cartas, setCartas] = useState([]);
    const [selectedCarta, setSelectedCarta] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const loadUserId = async () => {
            try {
                const userIdFromStorage = await AsyncStorage.getItem('userId');
                setUserId(userIdFromStorage);
                fetchCartas(userIdFromStorage);
            } catch (error) {
                console.error('Error loading userId from AsyncStorage:', error);
            }
        };

        loadUserId();
    }, []);

    const fetchCartas = async (userId) => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/cartasFavoritasUsuario.php?id=${userId}`
            );
            const data = await response.json();
            setCartas(data);
        } catch (error) {
            console.error('Error fetching cartas data:', error);
        }
    };

    const handlePost = async () => {
        if (!selectedCarta) {
            Alert.alert('Error', 'Por favor selecciona una carta.');
            return;
        }

        const title = 'Carta Favorita';
        const text = 'Mirar una de mis cartas favoritas';

        const responseData = await sendPostToAPI(title, text, selectedCarta.id, userId);

        console.log(responseData);
        setIsModalVisible(false); // Close the modal after posting
    };

    const sendPostToAPI = async (title, text, cartaId, userId) => {
        const response = await fetch(
            'https://momdel.es/animeWorld/api/subirPublicacion2.php',
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title,
                    text: text,
                    idUsuario: userId,
                    idCarta: cartaId,
                    imagen: selectedCarta.carta, // assuming 'carta' is the property name for the image URL
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
                    puntos: 35,
                }),
            }
        );
        navigation.navigate('Publicaciones');
        return await response.json();
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const renderCarta = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                setSelectedCarta(item);
                setIsModalVisible(true);
            }}
        >
            <Image
                source={{
                    uri: `https://momdel.es/animeWorld/DOCS/cartas/${item.carta}`,
                }}
                style={styles.cartaImage}
            />
        </TouchableOpacity>
    );

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Image
                            source={icons.back}
                            resizeMode="contain"
                            style={styles.backIcon}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.title}>Selecciona una Carta</Text>
                <FlatList
                    data={cartas}
                    renderItem={renderCarta}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                />
                <Modal
                    visible={isModalVisible}
                    transparent={true}
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Image
                                source={{
                                    uri: `https://momdel.es/animeWorld/DOCS/cartas/${selectedCarta?.carta}`,
                                }}
                                style={styles.modalImage}
                            />
                            <Text style={styles.modalTitle}>
                                Carta Favorita
                            </Text>
                            <Text style={styles.modalText}>
                                Mirar una de mis cartas favoritas
                            </Text>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={() => setIsModalVisible(false)}
                                >
                                    <Text style={styles.buttonText}>
                                        Cancelar
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={handlePost}
                                >
                                    <Text style={styles.buttonText}>
                                        Publicar
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
    },
    cartaImage: {
        width: 150,
        height: 150,
        margin: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalImage: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
});

export default SubirPublicacionCarta;
