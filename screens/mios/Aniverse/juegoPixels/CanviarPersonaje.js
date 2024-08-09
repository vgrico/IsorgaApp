import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    Image,
    FlatList,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import { COLORS, SIZES } from '../../../constants';
import Button from '../../../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CanviarPersonaje = ({ navigation }) => {
    const [userId, setUserId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);

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
        fetchCharacters();
    }, [userId]);

    const fetchCharacters = async () => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/listadoCambioPersonaje.php?id=${userId}`
            );
            const data = await response.json();
            setCharacters(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching characters:', error);
            setLoading(false);
        }
    };

    const handleCharacterClick = async (characterId) => {
        setSelectedCharacter(characterId);
        setModalVisible(true);
    };

    const confirmChangeCharacter = async () => {
        try {
            const response = await fetch(
                'https://momdel.es/animeWorld/api/guardarCambioPersonaje.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idUsuario: userId,
                        respuesta: selectedCharacter,
                    }),
                }
            );
            setModalVisible(false);
            navigation.navigate('Main')

        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const cancelChangeCharacter = () => {
        setModalVisible(false);
        setSelectedCharacter(null);
        navigation.navigate('Main')
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.characterContainer}
            onPress={() => handleCharacterClick(item.id)}
        >
            <Image
                source={{ uri: `https://momdel.es/animeWorld/DOCS/${item.imagen}` }}
                style={styles.characterImage}
            />
            <Text style={styles.characterName}>{item.nombre}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                <Header title="Cambio Personal" />
                {loading ? (
                    <ActivityIndicator size="large" color={COLORS.primary} />
                ) : (
                    <FlatList
                        data={characters}
                        numColumns={2}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.charactersList}
                    />
                )}

            </View>
            {characters.length > 0 && ( // Renderiza el modal solo si hay personajes cargados
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalSubContainer}>
                                <Text style={styles.modalTitle}>Confirmar Cambios</Text>
                                <Text style={styles.modalSubtitle}>
                                    Estas seguro que quieres cambiar el personaje?
                                    No podrás volver a cambiaR D EPERSONAJE
                                </Text>
                                <View style={styles.modalButtonsContainer}>
                                    <Button
                                        title="Change"
                                        filled
                                        onPress={confirmChangeCharacter}
                                        style={styles.modalButton}
                                    />
                                    <Button
                                        title="Cancel"
                                        onPress={cancelChangeCharacter}
                                        style={styles.modalButton}
                                    />
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            )}
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
    charactersList: {
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
    },
    characterContainer: {
        alignItems: 'center',
        margin: 8,
    },
    characterImage: {
        width: Dimensions.get('window').width * 0.4,
        height: Dimensions.get('window').width * 0.4,
        borderRadius: 10,
    },
    characterName: {
        marginTop: 8,
        fontSize: 16,
        fontFamily: 'medium',
        color: COLORS.greyscale900,
    },
    button: {
        borderRadius: 32,
        marginTop: 24,
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalSubContainer: {
        height: 200,
        width: SIZES.width * 0.9,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
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
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    modalButton: {
        width: '40%',
    },
});

export default CanviarPersonaje;
