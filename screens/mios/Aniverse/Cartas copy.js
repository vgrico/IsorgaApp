import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    ActivityIndicator,
    Modal // Importa el componente Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES, icons } from '../../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';

const Cartas = ({ navigation }) => {
    const [cartas, setCartas] = useState([]);
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCarta, setSelectedCarta] = useState(null); // Estado para la carta seleccionada
    const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal

    useEffect(() => {
        const loadUserId = async () => {
            try {
                const userIdFromStorage = await AsyncStorage.getItem('userId');
                setUserId(userIdFromStorage);
            } catch (error) {
                console.error('Error loading userId from AsyncStorage:', error);
            }
        }

        loadUserId();
    }, []);

    const fetchCartas = async () => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/cartasUsuario.php?id=${userId}`
            );
            const data = await response.json();
            const filteredData = data.filter((item) => item.carta);
            setCartas(filteredData);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching serie data:', error);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchCartas();
    }, [userId]);

    const handleImagePress = (carta) => {
        setSelectedCarta(carta);
        setModalVisible(true); // Abre el modal cuando se selecciona una carta
    }

    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <Text style={[styles.headerTitle, { color: COLORS.greyscale900 }]}>
                        Cartas
                    </Text>
                </View>
                <TouchableOpacity>
                    <Image
                        source={icons.moreCircle}
                        resizeMode="contain"
                        style={[styles.moreIcon, { tintColor: COLORS.greyscale900 }]}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    const renderContent = () => {
        if (isLoading) {
            return <ActivityIndicator size="large" color={COLORS.primary} />
        } else {
            return (
                <FlatList
                    data={cartas}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={3}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    style={{ marginVertical: 12 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleImagePress(item)}>
                            <Image
                                source={{ uri: `https://momdel.es/animeWorld/DOCS/${item.carta}` }}
                                resizeMode="cover"
                                style={styles.galleryImage}
                            />
                        </TouchableOpacity>
                    )}
                />
            )
        }
    }

    const renderModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true} // Hace que el modal sea transparente
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity style={styles.modalContainer} onPress={() => setModalVisible(false)}>
                    <Image
                        source={{ uri: `https://momdel.es/animeWorld/DOCS/${selectedCarta?.carta}` }}
                        resizeMode="contain"
                        style={styles.selectedCartaImage}
                    />
                    <View style={[styles.descriptionContainer, { borderColor: getColor(selectedCarta?.rareza) }]}>
                        <Text style={styles.title}>Descripción:</Text>
                        <Text style={styles.descriptionText}>{selectedCarta?.descripcion}</Text>
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }

    // Función para obtener el color de borde según la rareza
    const getColor = (rareza) => {
        switch (rareza) {
            case '1':
                return COLORS.blue;
            case '2':
                return COLORS.purple;
            case '3':
                return COLORS.orange;
            case '4':
                return COLORS.gold;
            default:
                return COLORS.gray;
        }
    }

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                {renderHeader()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {renderContent()}
                </ScrollView>
                {renderModal()}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        width: SIZES.width - 32,
        justifyContent: 'space-between',
        marginBottom: 0,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.black,
        marginLeft: 16,
    },
    moreIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
    },
    galleryImage: {
        width: (SIZES.width - 44) / 3,
        height: (SIZES.width - 44) / 3,
        borderRadius: 16,
        marginRight: 6,
        marginBottom: 12,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    selectedCartaImage: {
        width: SIZES.width - 40,
        height: SIZES.height / 2,
        borderRadius: 20,
    },
    descriptionContainer: {
        borderWidth: 2,
        padding: 10,
        marginTop: 10,
        borderRadius: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 16,
        color: COLORS.white,
    },
})

export default Cartas;
