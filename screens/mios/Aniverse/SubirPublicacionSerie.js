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
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, icons } from '../../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SubirPublicacionSerie = ({ navigation }) => {
    const [userId, setUserId] = useState(null);
    const [series, setSeries] = useState([]);
    const [selectedSerie, setSelectedSerie] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const loadUserId = async () => {
            try {
                const userIdFromStorage = await AsyncStorage.getItem('userId');
                setUserId(userIdFromStorage);
                fetchSeries(userIdFromStorage);
            } catch (error) {
                console.error('Error loading userId from AsyncStorage:', error);
            }
        };

        loadUserId();
    }, []);

    const fetchSeries = async (userId) => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/listadoSeriesMias.php?id=${userId}`
            );
            const data = await response.json();
            setSeries(data);
        } catch (error) {
            console.error('Error fetching series data:', error);
        }
    };

    const handlePost = async () => {
        if (!selectedSerie) {
            Alert.alert('Error', 'Por favor selecciona una serie.');
            return;
        }

        const title = 'Mis series';
        let text = '';
        if (selectedSerie.estado === 1) {
            text = 'Quiero empezar a ver esta serie';
        } else if (selectedSerie.estado === 2) {
            text = `Me estoy viendo esta serie y voy por el capítulo ${selectedSerie.capitulo}`;
        } else if (selectedSerie.estado === 3) {
            text = 'Ya tengo esta serie acabada';
        }

        const responseData = await sendPostToAPI(title, text, selectedSerie.id, userId);

        console.log(responseData);
        setIsModalVisible(false); // Close the modal after posting
    };

    const sendPostToAPI = async (title, text, serieId, userId) => {
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
                    idSerie: serieId,
                    imagen: selectedSerie.imagen1, // assuming 'imagen' is the property name for the image URL
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

    const renderSerie = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                setSelectedSerie(item);
                setIsModalVisible(true);
            }}
            style={styles.serieContainer}
        >
            <Image
                source={{
                    uri: `https://momdel.es/animeWorld/DOCS/${item.imagen1}`,
                }}
                style={styles.serieImage}
            />
            <Text style={styles.serieName}>{item.nombre}</Text>
        </TouchableOpacity>
    );

    const renderContent = () => (
        <View>
            {series.length > 0 ? (
                <FlatList
                    data={series}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    renderItem={renderSerie}
                />
            ) : (
                <Text>No se encontraron resultados</Text>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image
                        source={icons.back}
                        resizeMode="contain"
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
            </View>
            <Text style={styles.pageTitle}>Seleccionar serie</Text>
            <View style={styles.container}>
                {renderContent()}
                <Modal
                    visible={isModalVisible}
                    transparent={true}
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Image
                                source={{
                                    uri: `https://momdel.es/animeWorld/DOCS/${selectedSerie?.imagen1}`,
                                }}
                                style={styles.modalImage}
                            />
                            <Text style={styles.modalTitle}>
                                Mis series
                            </Text>
                            <Text style={styles.modalText}>
                                {selectedSerie?.estado === 1 && 'Quiero empezar a ver esta serie'}
                                {selectedSerie?.estado === 2 && `Me estoy viendo esta serie y voy por el capítulo ${selectedSerie.capitulo}`}
                                {selectedSerie?.estado === 3 && 'Ya tengo esta serie acabada'}
                            </Text>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        paddingHorizontal: 16,
        marginTop: 50,
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
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 16,
        textAlign: 'center',
    },
    row: {
        justifyContent: 'space-between',
    },
    serieContainer: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: COLORS.lightGray,
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    serieImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    serieName: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: COLORS.darkGray,
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
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalImage: {
        width: 200,
        height: 300,
        borderRadius: 20,
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 10,
        textAlign: 'center',
        marginTop: 40,
    },
    modalText: {
        fontSize: 18,
        color: COLORS.darkGray,
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
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: COLORS.primary,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SubirPublicacionSerie;
