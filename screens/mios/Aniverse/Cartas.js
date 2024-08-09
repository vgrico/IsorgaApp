import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    ActivityIndicator,
    Modal,
    Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES, icons } from '../../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const isIpad = width > 600;

const Cartas = ({ navigation }) => {
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cartas, setCartas] = useState([]);
    const [selectedCarta, setSelectedCarta] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

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

    useFocusEffect(
        React.useCallback(() => {
            if (userId) {
                fetchCartas();
            }
        }, [userId])
    );

    const fetchCartas = async () => {
        try {
            const response = await fetch(`https://momdel.es/animeWorld/api/cartasUsuario.php?id=${userId}`);
            const data = await response.json();
            const filteredData = data.filter((item) => item.carta);
            setCartas(filteredData);

            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching serie data:', error);
            setIsLoading(false);
        }
    };

    const addToFavorites = async (cartaId, favorito) => {
        try {
            await fetch('https://momdel.es/animeWorld/api/cartaFavorita.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cartaId: cartaId,
                    userId: userId,
                    favorito: favorito === 1 ? 0 : 1,
                }),
            });

            const updatedCartas = cartas.map((cartaItem) =>
                cartaItem.id === cartaId
                    ? {
                          ...cartaItem,
                          favorito: cartaItem.favorito === 1 ? 0 : 1,
                      }
                    : cartaItem
            );
            setCartas(updatedCartas);

            const updatedSelectedCarta = updatedCartas.find(
                (cartaItem) => cartaItem.id === cartaId
            );

            setSelectedCarta(updatedSelectedCarta);
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
    };

    const handleImagePress = (carta) => {
        setSelectedCarta(carta);
        setModalVisible(true);
    };

    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <Text style={styles.headerTitle}>Mis Cartas</Text>
                    <Text style={styles.cartasCount}>{cartas.length}</Text>
                </View>
                <View style={styles.icons}>
                    <TouchableOpacity onPress={() => navigation.navigate('CartasOrdenadas')}>
                        <Image
                            source={icons.upAndDownArrow}
                            resizeMode="contain"
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('CartasFavoritas')}
                    >
                        <Image
                            source={icons.starOutline}
                            resizeMode="contain"
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Sobres')}
                    >
                        <Image
                            source={icons.bookmark2Outline}
                            resizeMode="contain"
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            );
        } else {
            return (
                <FlatList
                    data={cartas}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={3}
                    contentContainerStyle={styles.listContentContainer}
                    style={{ marginVertical: 12 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleImagePress(item)}>
                            <View style={styles.cardContainer}>
                                <View style={styles.innerCardContainer}>
                                    <Image
                                        source={{
                                            uri: `https://momdel.es/animeWorld/DOCS/cartas/${item.carta}`,
                                        }}
                                        resizeMode="cover"
                                        style={styles.galleryImage}
                                    />
                                    <TouchableOpacity
                                        style={styles.favoriteButton}
                                        onPress={() => addToFavorites(item.id, item.favorito)}
                                    >
                                        <Image
                                            source={
                                                item.favorito === 1
                                                    ? icons.redHeart
                                                    : icons.whiteHeart
                                            }
                                            resizeMode="contain"
                                            style={[
                                                styles.favoriteIcon,
                                                item.favorito === 1
                                                    ? { tintColor: COLORS.red }
                                                    : { tintColor: COLORS.white },
                                            ]}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            );
        }
    };

    const renderModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalContainer}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalCardContainer}>
                            <Image
                                source={{
                                    uri: `https://momdel.es/animeWorld/DOCS/cartas/${selectedCarta?.carta}`,
                                }}
                                resizeMode="contain"
                                style={styles.selectedCartaImage}
                            />
                            {selectedCarta?.ataque || selectedCarta?.defensa || selectedCarta?.velocidad ? (
                                <View style={styles.statsContainer}>
                                    {selectedCarta?.ataque && (
                                        <View style={[styles.statBox, styles.attackBox]}>
                                            <Text style={styles.statText}>A: {selectedCarta?.ataque}</Text>
                                        </View>
                                    )}
                                    {selectedCarta?.defensa && (
                                        <View style={[styles.statBox, styles.defenseBox]}>
                                            <Text style={styles.statText}>D: {selectedCarta?.defensa}</Text>
                                        </View>
                                    )}
                                    {selectedCarta?.velocidad && (
                                        <View style={[styles.statBox, styles.speedBox]}>
                                            <Text style={styles.statText}>V: {selectedCarta?.velocidad}</Text>
                                        </View>
                                    )}
                                </View>
                            ) : null}
                        </View>
                        <TouchableOpacity
                            style={styles.favoriteButtonModal}
                            onPress={() => addToFavorites(selectedCarta.id, selectedCarta.favorito)}
                        >
                            <Image
                                source={
                                    selectedCarta?.favorito === 1
                                        ? icons.heart2
                                        : icons.heart2Outline
                                }
                                resizeMode="contain"
                                style={styles.heartIcon}
                            />
                        </TouchableOpacity>
                        <Text style={styles.descriptionText}>
                            {selectedCarta?.descripcion}
                        </Text>
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    };

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                {renderHeader()}
                {renderContent()}
                {renderModal()}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.lightBackground,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.lightBackground,
        padding: isIpad ? 24 : 16,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isIpad ? 16 : 8,
    },
    icons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: isIpad ? 16 : 8,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        color: COLORS.black,
        fontSize: isIpad ? SIZES.h1 : SIZES.h2,
        fontWeight: 'bold',
    },
    icon: {
        width: isIpad ? 30 : 24,
        height: isIpad ? 30 : 24,
        marginRight: 20,
    },
    listContentContainer: {
        paddingHorizontal: isIpad ? 24 : 16,
        paddingBottom: isIpad ? 120 : 100,
        alignItems: 'center',
    },
    cardContainer: {
        marginVertical: isIpad ? 15 : 10,
        paddingHorizontal: 5,
        width: (width - (isIpad ? 72 : 48)) / 3,
    },
    innerCardContainer: {
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: COLORS.white,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    galleryImage: {
        width: '100%',
        height: isIpad ? 200 : 160,
        borderRadius: 10,
    },
    favoriteButton: {
        position: 'absolute',
        top: 5,
        right: 5,
    },
    favoriteIcon: {
        width: isIpad ? 30 : 24,
        height: isIpad ? 30 : 24,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        alignItems: 'center',
        borderRadius: 15,
        padding: 20,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    modalCardContainer: {
        borderRadius: 15,
        overflow: 'hidden',
        width: isIpad ? width * 0.8 : width * 0.85,
        height: isIpad ? height * 0.7 : height * 0.75,
    },
    selectedCartaImage: {
        width: '100%',
        height: '85%',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
        backgroundColor: COLORS.lightGray,
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
    descriptionText: {
        marginTop: isIpad ? 30 : 20,
        fontSize: isIpad ? SIZES.h2 : SIZES.h3,
        color: COLORS.white,
        paddingHorizontal: isIpad ? 30 : 20,
        textAlign: 'center',
    },
    heartIcon: {
        width: isIpad ? 50 : 40,
        height: isIpad ? 50 : 40,
        tintColor: 'red',
    },
    favoriteButtonModal: {
        marginTop: 10,
        alignItems: 'center',
    },
    cartasCount: {
        color: COLORS.black,
        fontSize: isIpad ? SIZES.body2 : SIZES.body3,
        marginLeft: 5,
    },
});

export default Cartas;
