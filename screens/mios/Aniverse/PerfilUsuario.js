import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Modal,
    useWindowDimensions,
    TouchableWithoutFeedback,
    FlatList,
} from 'react-native';
import { COLORS, SIZES, icons } from '../../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import {
    OrganizerAbout,
    OrganizerCollections,
    OrganizerEvents,
} from '../../../tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartasUsuarios from '../../../tabs/mios/CartasUsuario';
import PublicacionesUsuario from '../../../tabs/mios/PublicacionesUsuario';
import SeriesUsuarios from '../../../tabs/mios/SeriesUsuario';
import { useFocusEffect } from '@react-navigation/native';
import CartasUsuarios2 from '../../../tabs/mios/CartasUsuarioOtros';
import PublicacionesUsuario2 from '../../../tabs/mios/PublicacionesUsuarioOtros';
import SeriesUsuarios2 from '../../../tabs/mios/SeriesUsuarioOtros';
import EstadisticasUsuario2 from '../../../tabs/mios/EstadisticasUsuario2';

const renderScene = (route, idUsuario) => {
    switch (route.key) {
        case 'first':
            return <EstadisticasUsuario2 idUsuario={idUsuario} />;
        case 'second':
            return <CartasUsuarios2 idUsuario={idUsuario} />;
        case 'third':
            return <SeriesUsuarios2 idUsuario={idUsuario} />;
        default:
            return null;
    }
};

const PerfilUsuario = ({ route, navigation }) => {
    const { idUsuario } = route.params;
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'first', title: 'Estadisticas' },
        { key: 'second', title: 'Cartas' },
        { key: 'third', title: 'Series' },
    ]);

    const [userId, setUserId] = useState(null);
    const [datosUsuarios, setDatosUsuarios] = useState(null);
    const [usuariosSeguidos, setUsuariosSeguidos] = useState([]);
    const [usuariosSeguidores, setUsuariosSeguidores] = useState([]);
    const [usuarioSeguido, setUsuarioSeguido] = useState(null);
    const [hasFollowed, setHasFollowed] = useState(false);
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [listModalVisible, setListModalVisible] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [modalType, setModalType] = useState('');

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
            fetchDatosUsuarios();
            fetchSiSeguido();
            fetchUsuariosSeguidos();
            fetchUsuariosSeguidores();
        }
    }, [userId]);

    const fetchDatosUsuarios = async () => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/perfilUsuario.php?id=${idUsuario}`
            );
            const data = await response.json();
            setDatosUsuarios(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchUsuariosSeguidos = async () => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/mirarSeguidos.php?id=${idUsuario}`
            );
            const data = await response.json();
            setUsuariosSeguidos(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchUsuariosSeguidores = async () => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/mirarSeguidores.php?id=${idUsuario}`
            );
            const data = await response.json();
            setUsuariosSeguidores(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchSiSeguido = async () => {
        try {
            const response = await fetch(
                'https://momdel.es/animeWorld/api/usuarioSiSeguido.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idUsuario: userId,
                        usuario: idUsuario,
                    }),
                }
            );
            const data = await response.json();
            setUsuarioSeguido(data.success && data.seguido);
            setHasFollowed(data.success && data.seguido);
        } catch (error) {
            console.error('Error fetching follow status:', error);
        }
    };

    const fetchSeguir = async () => {
        try {
            const response = await fetch(
                'https://momdel.es/animeWorld/api/seguirUsuarios.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idUsuario: userId,
                        usuario: idUsuario,
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
                        puntos: 2,
                    }),
                }
            );
            const data = await response.json();
            setUsuarioSeguido(!usuarioSeguido);
            setHasFollowed(!hasFollowed);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const progressBarWidth =
        datosUsuarios && datosUsuarios.diferencia !== null
            ? `${datosUsuarios.diferencia}%`
            : '0%';

    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={icons.arrowLeft}
                        resizeMode="contain"
                        style={[
                            styles.arrowBackIcon,
                            {
                                tintColor: COLORS.greyscale900,
                            },
                        ]}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle={{
                backgroundColor: COLORS.primary,
            }}
            style={{
                backgroundColor: COLORS.white,
            }}
            renderLabel={({ route, focused }) => (
                <Text
                    style={[
                        {
                            color: focused ? COLORS.primary : 'gray',
                            fontSize: 16,
                            fontFamily: 'semiBold',
                        },
                    ]}
                >
                    {route.title}
                </Text>
            )}
        />
    );

    const renderContent = () => {
        if (!datosUsuarios) {
            return null;
        }

        return (
            <View>
                <View style={styles.profileImageContainer}>
                    <TouchableOpacity onPress={() => setProfileModalVisible(true)}>
                        <Image
                            source={{
                                uri: `https://momdel.es/animeWorld/DOCS/${datosUsuarios.imagen}`,
                            }}
                            resizeMode="contain"
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>
                    <Text
                        style={[
                            styles.fullName,
                            {
                                color: COLORS.greyscale900,
                            },
                        ]}
                    >
                        {datosUsuarios.nickname}
                    </Text>
                    <View style={styles.progressBarContainer}>
                        <Text style={styles.progressText}>
                            ⭐️ {datosUsuarios.nivel}
                        </Text>
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressIndicator,
                                    { width: progressBarWidth },
                                ]}
                            >
                                <Text style={styles.progressNumber}>
                                    {datosUsuarios.diferencia}%
                                </Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.price} numberOfLines={2} adjustsFontSizeToFit>
                        {datosUsuarios.titulo}
                    </Text>

                    <View style={styles.viewContainer}>
                        <View style={styles.view}>
                            <Text
                                style={[
                                    styles.viewNum,
                                    {
                                        color: COLORS.greyscale900,
                                    },
                                ]}
                            >
                                {datosUsuarios.publicaciones}
                            </Text>
                            <Text
                                style={[
                                    styles.viewText,
                                    {
                                        color: COLORS.greyscale900,
                                    },
                                ]}
                            >
                                Publicaciones
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.view}
                            onPress={() => {
                                setModalData(usuariosSeguidores);
                                setModalType('Seguidores');
                                setListModalVisible(true);
                            }}
                        >
                            <Text
                                style={[
                                    styles.viewNum,
                                    {
                                        color: COLORS.greyscale900,
                                    },
                                ]}
                            >
                                {datosUsuarios.seguidores}
                            </Text>
                            <Text
                                style={[
                                    styles.viewText,
                                    {
                                        color: COLORS.greyscale900,
                                    },
                                ]}
                            >
                                Seguidores
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.viewLeft}
                            onPress={() => {
                                setModalData(usuariosSeguidos);
                                setModalType('Seguidos');
                                setListModalVisible(true);
                            }}
                        >
                            <Text
                                style={[
                                    styles.viewNum,
                                    {
                                        color: COLORS.greyscale900,
                                    },
                                ]}
                            >
                                {datosUsuarios.seguidos}
                            </Text>
                            <Text
                                style={[
                                    styles.viewText,
                                    {
                                        color: COLORS.greyscale900,
                                    },
                                ]}
                            >
                                Seguidos
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.buttonActionContainer}>
                        <TouchableOpacity
                            onPress={fetchSeguir}
                            style={[
                                styles.buttonAction,
                                {
                                    backgroundColor: hasFollowed
                                        ? COLORS.white
                                        : COLORS.primary,
                                },
                            ]}
                        >
                            <Image
                                source={icons.addUser}
                                resizeMode="contain"
                                style={[
                                    styles.buttonActionIcon,
                                    {
                                        tintColor: hasFollowed
                                            ? COLORS.primary
                                            : COLORS.white,
                                    },
                                ]}
                            />
                            <Text
                                style={[
                                    styles.buttonActionText,
                                    {
                                        color: hasFollowed
                                            ? COLORS.primary
                                            : COLORS.white,
                                    },
                                ]}
                            >
                                {hasFollowed ? 'Following' : 'Follow'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.separateLine} />
                </View>
            </View>
        );
    };

    const renderListModalContent = () => {
        return (
            <FlatList
                data={modalData}
                keyExtractor={(item) => item.idUsuario.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.modalItem}
                        onPress={() => {
                            setListModalVisible(false);
                            navigation.push('PerfilUsuario', {
                                idUsuario: item.idUsuario,
                            });
                        }}
                    >
                        <Image
                            source={{
                                uri: `https://momdel.es/animeWorld/DOCS/${item.imagen}`,
                            }}
                            style={styles.modalItemImage}
                        />
                        <Text style={styles.modalItemText}>
                            {item.nickname}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        );
    };

    useFocusEffect(
        React.useCallback(() => {
            if (userId) {
                fetchDatosUsuarios();
                fetchSiSeguido();
                fetchUsuariosSeguidos();
                fetchUsuariosSeguidores();
            }
        }, [userId])
    );

    if (!userId) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                {renderHeader()}
                <View style={{ flex: 1 }}>
                    {renderContent()}
                    <View style={{ flex: 1 }}>
                        <TabView
                            navigationState={{ index, routes }}
                            renderScene={({ route }) =>
                                renderScene(route, idUsuario)
                            }
                            onIndexChange={setIndex}
                            initialLayout={{ width: layout.width }}
                            renderTabBar={renderTabBar}
                        />
                    </View>
                </View>
            </View>
            <Modal
                visible={profileModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setProfileModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setProfileModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <Image
                            source={{
                                uri: `https://momdel.es/animeWorld/DOCS/${datosUsuarios?.imagen}`,
                            }}
                            resizeMode="contain"
                            style={styles.modalImage}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            <Modal
                visible={listModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setListModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setListModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{modalType}</Text>
                            {renderListModalContent()}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
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
        backgroundColor: COLORS.white,
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    arrowBackIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
    },
    bellIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
    },
    profileImageContainer: {
        alignItems: 'center',
    },
    profileImage: {
        height: 120,
        width: 120,
        borderRadius: 9999,
        borderColor: COLORS.gray,
        borderWidth: 2,
    },
    fullName: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.black,
        marginVertical: 8,
    },
    yearExperience: {
        fontSize: 14,
        color: COLORS.greyscale900,
    },
    reviewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    ratingNum: {
        color: 'gray',
        fontSize: 14,
    },
    price: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.primary,
        marginVertical: 8,
        textAlign: 'center', // Centrar el texto
        paddingHorizontal: 10, // Añadir padding para que se vea mejor en el centro
        numberOfLines: 2,
        adjustsFontSizeToFit: true,
    },
    summaryContainer: {
        width: SIZES.width - 64,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 22,
    },
    viewContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 12,
    },
    view: {
        width: (SIZES.width - 32) / 3,
        alignItems: 'center',
        borderRightColor: COLORS.black,
        borderRightWidth: 0.3,
    },
    viewNum: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.black,
    },
    viewText: {
        fontSize: 14,
        fontFamily: 'regular',
        color: COLORS.black,
        marginVertical: 4,
    },
    viewLeft: {
        width: (SIZES.width - 32) / 3,
        alignItems: 'center',
    },
    buttonActionContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 6,
        width: SIZES.width - 32,
    },
    buttonAction: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.primary,
        borderRadius: 32,
        borderWidth: 1.4,
        borderColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 42,
    },
    buttonActionIcon: {
        width: 16,
        height: 16,
        tintColor: COLORS.white,
        marginRight: 8,
    },
    buttonActionText: {
        fontSize: 18,
        fontFamily: 'semiBold',
        color: COLORS.white,
    },
    buttonActionRight: {
        width: (SIZES.width - 32) / 2 - 8,
        borderRadius: 32,
        borderWidth: 1.4,
        borderColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 42,
    },
    buttonActionIconRight: {
        width: 16,
        height: 16,
        tintColor: COLORS.primary,
        marginRight: 8,
    },
    buttonActionTextRight: {
        fontSize: 18,
        fontFamily: 'semiBold',
        color: COLORS.primary,
    },
    separateLine: {
        width: SIZES.width - 32,
        height: 0.1,
        backgroundColor: COLORS.gray,
    },
    progressBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressText: {
        marginRight: 8,
        color: COLORS.greyscale900,
        fontFamily: 'bold',
        fontSize: 16,
    },
    progressBar: {
        height: 24,
        width: 200,
        backgroundColor: COLORS.greyscale300,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    progressIndicator: {
        height: '100%',
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    progressNumber: {
        color: COLORS.white,
        fontFamily: 'bold',
        fontSize: 14,
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: -7 }],
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalContent: {
        width: '80%',
        height: '80%',
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 16,
    },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    modalItemImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 16,
    },
    modalItemText: {
        fontSize: 16,
        color: COLORS.black,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.primary,
        marginBottom: 16,
        textAlign: 'center',
    },
    modalImage: {
        width: '80%',
        height: '80%',
        borderRadius: 20,
    },
});

export default PerfilUsuario;
