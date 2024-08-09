import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { COLORS, SIZES, icons } from '../../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import HorizontalEventCardPublicaciones from '../../../components/mios/HorizontalEventCardPublicaciones';

const Publicaciones = ({ navigation }) => {
    const [publicaciones, setPublicaciones] = useState([]);
    const [publicacionesAmigos, setPublicacionesAmigos] = useState([]);
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showingAmigos, setShowingAmigos] = useState(false);

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
            const fetchData = async () => {
                setIsLoading(true);
                if (userId) {
                    if (showingAmigos) {
                        const publicacionesAmigosData = await fetchPublicacionesAmigos(userId);
                        setPublicacionesAmigos(publicacionesAmigosData);
                    } else {
                        const publicacionesData = await fetchPublicaciones();
                        setPublicaciones(publicacionesData);
                    }
                }
                setIsLoading(false);
            };
            fetchData();
        }, [userId, showingAmigos])
    );

    const fetchPublicaciones = async () => {
        try {
            const response = await fetch('https://momdel.es/animeWorld/api/listadoPublicaciones.php');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching publicaciones:', error);
            return [];
        }
    };

    const fetchPublicacionesAmigos = async (userId) => {
        try {
            const response = await fetch(`https://momdel.es/animeWorld/api/listadoPublicacionesAmigos.php?id=${userId}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching publicaciones de amigos:', error);
            return [];
        }
    };

    const handleTabChange = (isAmigos) => {
        setShowingAmigos(isAmigos);
    };

    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <Text style={[styles.headerTitle, { color: COLORS.greyscale900 }]}>
                        Publicaciones
                    </Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('SeleccionarTipoPublicacion')}>
                    <Image source={icons.plus} resizeMode="contain" style={[styles.moreIcon, { tintColor: COLORS.greyscale900 }]} />
                </TouchableOpacity>
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
        }

        const dataToShow = showingAmigos ? publicacionesAmigos : publicaciones;

        return (
            <View style={styles.contentContainer}>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={showingAmigos ? styles.tabBtn : styles.selectedTab}
                        onPress={() => handleTabChange(false)}
                    >
                        <Text style={showingAmigos ? styles.tabBtnText : styles.selectedTabText}>General</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={showingAmigos ? styles.selectedTab : styles.tabBtn}
                        onPress={() => handleTabChange(true)}
                    >
                        <Text style={showingAmigos ? styles.selectedTabText : styles.tabBtnText}>Amigos</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={dataToShow}
                    keyExtractor={(item, index) => `${item.idUsuario}-${index}`} // Ensure unique key
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('PerfilUsuario', { idUsuario: item.idUsuario })}
                        >
                            <HorizontalEventCardPublicaciones
                                titulo={item.titulo}
                                imagen={item.imagen}
                                texto={item.texto}
                                usuario={item.nickname}
                                idUsuario={item.idUsuario}
                            />
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text>No results found</Text>}
                />
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            {renderContent()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        width: SIZES.width - 32,
        justifyContent: 'space-between',
        marginBottom: 16,
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    tabBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 8,
        borderColor: COLORS.primary,
        borderWidth: 1,
        marginHorizontal: 4,
    },
    selectedTab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: COLORS.primary,
        marginHorizontal: 4,
    },
    tabBtnText: {
        color: COLORS.primary,
    },
    selectedTabText: {
        color: COLORS.white,
    },
});

export default Publicaciones;
