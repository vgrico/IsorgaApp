import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, icons, SIZES } from '../../../constants';

const ClasificacionMundial = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState('');
    const [usuariosSeguidos, setUsuariosSeguidos] = useState('');
    const [userId, setUserId] = useState(null);

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
        fetchData();
        calculateTimeRemaining();
    }, [userId]);

    const fetchData = async () => {
        try {
            const response = await fetch('https://momdel.es/animeWorld/api/clasificacionMundial.php');
            const result = await response.json();
            setData(result.slice(0, 100));
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUsuariosSeguidos = async () => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/mirarSeguidos.php?id=${userId}`
            );
            const data = await response.json();
            setUsuariosSeguidos(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const calculateTimeRemaining = () => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

        const firstDayOfNextMonth = new Date(nextYear, nextMonth, 1);
        const diff = firstDayOfNextMonth - now;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeRemaining(`${days}d ${hours}h`);
    };

    useEffect(() => {
        const timer = setInterval(calculateTimeRemaining, 1000);
        return () => clearInterval(timer);
    }, []);

    const getSobres = (position) => {
        if (position >= 20 && position <= 100) return 2;
        if (position >= 15 && position < 20) return 4;
        if (position >= 10 && position < 15) return 8;
        if (position >= 5 && position < 10) return 10;
        return 11 + (10 - position); // Para las posiciones 1-4
    };

    const renderItem = ({ item, index }) => {
        const position = index + 1;
        const sobres = getSobres(position);

        return (
            <View style={styles.itemContainer}>
                <Text style={styles.positionText}>{position}</Text>
                <Text style={styles.nicknameText}>{item.nickname}</Text>
                <View style={styles.copasContainer}>
                    <Ionicons name="trophy-outline" size={20} color="black" style={styles.copasIcon} />
                    <Text style={styles.copasText}>{item.copas}</Text>
                </View>
                <View style={styles.sobresContainer}>
                    <Ionicons name="gift-outline" size={24} color="black" style={styles.sobreIcon} />
                    <Text style={styles.sobresText}>x{sobres}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={icons.back}
                        resizeMode="contain"
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Clasificación Mundial</Text>
            </View>
            <Text style={styles.timeRemainingText}>Proxima Temporada: {timeRemaining}</Text>
            {loading ? (
                <Text style={styles.loadingText}>Cargando...</Text>
            ) : (
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    headerContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 50,
        marginBottom: 20,
    },
    backIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.black,
        marginLeft: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    timeRemainingText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    positionText: {
        fontSize: 16,
        fontWeight: 'bold',
        width: 30,
    },
    nicknameText: {
        fontSize: 16,
        flex: 1,
    },
    copasContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 50,
        marginRight: 20,
    },
    copasIcon: {
        marginRight: 5,
    },
    copasText: {
        fontSize: 16,
    },
    sobresContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 5,
    },
    sobreIcon: {
        marginRight: 5,
    },
    sobresText: {
        fontSize: 16,
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default ClasificacionMundial;
