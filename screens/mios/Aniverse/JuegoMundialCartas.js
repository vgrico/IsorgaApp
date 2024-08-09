import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Alert,
    TouchableWithoutFeedback,
    Keyboard,
    Image,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, icons } from '../../constants';

const JuegoMundialDeCartas = ({ navigation }) => {
    const [selectedCards, setSelectedCards] = useState([null, null, null]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const loadUserId = async () => {
            try {
                const userIdFromStorage = await AsyncStorage.getItem('userId');
                setUserId(userIdFromStorage);
                fetchCardData(userIdFromStorage);
            } catch (error) {
                console.error('Error loading userId from AsyncStorage:', error);
            }
        };

        loadUserId();
    }, []);

    const fetchCardData = async (userId) => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/seleccionarCartasJuego.php?id=${userId}`
            );
            const data = await response.json();
            setModalData(data);
        } catch (error) {
            console.error('Error fetching character data:', error);
        }
    };

    const handleCardPress = (index) => {
        setCurrentCardIndex(index);
        setModalVisible(true);
    };

    const handleCardSelect = (selectedCard) => {
        if (selectedCards.some((card) => card?.id === selectedCard.id)) {
            Alert.alert('Error', 'Esta carta ya está seleccionada.');
            return;
        }
        const updatedCards = [...selectedCards];
        updatedCards[currentCardIndex] = selectedCard;
        setSelectedCards(updatedCards);
        setModalVisible(false);
    };

    const canStartGame = selectedCards.every((card) => card !== null);

    const startGame = async () => {
        try {
            const response = await fetch(
                'https://momdel.es/animeWorld/api/empezarPartida.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                        cardIds: selectedCards.map((card) => card.id),
                    }),
                }
            );
            const result = await response.json();
            navigation.navigate('ResumenCartas', {
                idJuegoUsuario: result.idJuegoUsuario,
            });
        } catch (error) {
            console.error('Error starting game:', error);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Juego Mundial de Cartas</Text>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.cardsContainer}>
                            {selectedCards.map((card, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.card}
                                    onPress={() => handleCardPress(index)}
                                >
                                    {card ? (
                                        <Image
                                            source={{
                                                uri: `https://momdel.es/animeWorld/DOCS/cartas/${card.carta}`,
                                            }}
                                            style={styles.selectedCardImage}
                                        />
                                    ) : (
                                        <Text style={styles.cardText}>Seleccionar</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                !canStartGame && styles.buttonDisabled,
                            ]}
                            onPress={() => canStartGame && startGame()}
                            disabled={!canStartGame}
                        >
                            <Text style={styles.buttonText}>Iniciar Partida</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.iconBar}>
                        <Ionicons
                            name="trophy-outline"
                            size={40}
                            color="black"
                            onPress={() => navigation.navigate('ClasificacionMundial')}
                            style={styles.icon}
                        />
                        <Ionicons
                            name="stats-chart-outline"
                            size={40}
                            color="black"
                            onPress={() => navigation.navigate('EstadisticasMundial')}
                            style={styles.icon}
                        />
                    </View>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitle}>Seleccionar Personaje</Text>
                            {modalData.length > 0 ? (
                                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                                    <View style={styles.grid}>
                                        {modalData.map((card) => (
                                            <TouchableOpacity
                                                key={card.id}
                                                style={styles.cardItem}
                                                onPress={() => handleCardSelect(card)}
                                            >
                                                <Image
                                                    source={{
                                                        uri: `https://momdel.es/animeWorld/DOCS/cartas/${card.carta}`,
                                                    }}
                                                    style={styles.cardImage}
                                                />
                                                <View style={styles.statsContainer}>
                                                    <View style={[styles.statBox, styles.attackBox]}>
                                                        <Text style={styles.statText}>A: {card.ataque}</Text>
                                                    </View>
                                                    <View style={[styles.statBox, styles.defenseBox]}>
                                                        <Text style={styles.statText}>D: {card.defensa}</Text>
                                                    </View>
                                                    <View style={[styles.statBox, styles.speedBox]}>
                                                        <Text style={styles.statText}>V: {card.velocidad}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>
                            ) : (
                                <Text>Cargando...</Text>
                            )}
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeButton}>Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: '#f0f0f0',
    },
    container: {
        flex: 1,
        width: '100%',
        padding: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        paddingHorizontal: 16,
        marginTop: 20,
        marginBottom: 70,
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
    titleContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
    },
    cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    selectedCardImage: {
        width: 100,
        height: 150,
        resizeMode: 'cover',
        borderRadius: 10,
    },
    cardText: {
        fontSize: 18,
        color: '#555',
        textAlign: 'center',
    },
    footer: {
        justifyContent: 'flex-end',
        width: '100%',
    },
    button: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonDisabled: {
        backgroundColor: 'gray',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
    iconBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    icon: {
        marginHorizontal: 20,
    },
    modalView: {
        flex: 1,
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    scrollViewContent: {
        alignItems: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    cardItem: {
        alignItems: 'center',
        margin: 10,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    cardImage: {
        width: 100,
        height: 150,
        resizeMode: 'cover',
        borderRadius: 10,
        marginBottom: 10,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
    },
    statBox: {
        padding: 5,
        borderWidth: 2,
        borderRadius: 8,
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    attackBox: {
        borderColor: 'red',
        backgroundColor: '#ffe6e6',
    },
    defenseBox: {
        borderColor: 'green',
        backgroundColor: '#e6ffe6',
    },
    speedBox: {
        borderColor: 'blue',
        backgroundColor: '#e6e6ff',
    },
    closeButton: {
        marginTop: 20,
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    },
});

export default JuegoMundialDeCartas;
