import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ClasificacionMundial = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState('');
    const [usuariosSeguidos, setUsuariosSeguidos] = useState([]);
    const [userId, setUserId] = useState(null);
    const [userPosition, setUserPosition] = useState(null);

    useEffect(() => {
        const loadUserId = async () => {
            try {
                const userIdFromStorage = await AsyncStorage.getItem('userId');
                setUserId(userIdFromStorage);
                fetchUsuariosSeguidos(userIdFromStorage);
            } catch (error) {
                console.error('Error loading userId from AsyncStorage:', error);
            }
        };

        loadUserId();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchData();
            calculateTimeRemaining();
        }
    }, [userId]);

    const fetchData = async () => {
        try {
            const response = await fetch('https://momdel.es/animeWorld/api/clasificacionMundial.php');
            const text = await response.text();
            try {
                const result = JSON.parse(text);
                const userIndex = result.findIndex(user => user.id === parseInt(userId));
                if (userIndex !== -1) {
                    setUserPosition(userIndex + 1);
                }
                setData(result);
            } catch (jsonError) {
                console.error('Error parsing JSON:', jsonError, 'Response text:', text);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchUsuariosSeguidos = async (userId) => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/mirarSeguidos.php?id=${userId}`
            );
            const text = await response.text();
            try {
                const data = JSON.parse(text);
                setUsuariosSeguidos(data);
            } catch (jsonError) {
                console.error('Error parsing JSON:', jsonError, 'Response text:', text);
            }
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

        const isCurrentUser = item.id === parseInt(userId);
        const isFriend = usuariosSeguidos.some(user => user.idUsuario === item.id);

        return (
            <View style={[
                styles.itemContainer,
                isCurrentUser && styles.currentUser,
                isFriend && styles.friendUser
            ]}>
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

    const renderFooter = () => {
        if (userPosition === null || userPosition > 100) {
            const user = data.find(user => user.id === parseInt(userId));
            if (user) {
                const sobres = getSobres(userPosition || data.length + 1);
                return (
                    <View style={[styles.itemContainer, styles.currentUser]}>
                        <Text style={styles.positionText}>{userPosition || data.length + 1}</Text>
                        <Text style={styles.nicknameText}>{user.nickname}</Text>
                        <View style={styles.copasContainer}>
                            <Ionicons name="trophy-outline" size={20} color="black" style={styles.copasIcon} />
                            <Text style={styles.copasText}>{user.copas}</Text>
                        </View>
                        <View style={styles.sobresContainer}>
                            <Ionicons name="gift-outline" size={24} color="black" style={styles.sobreIcon} />
                            <Text style={styles.sobresText}>x{sobres}</Text>
                        </View>
                    </View>
                );
            }
        }

        return (
            <>
                {data.map((item, index) => {
                    if (usuariosSeguidos.some(user => user.idUsuario === item.id) && index >= 100) {
                        const friendPosition = index + 1;
                        const friendSobres = getSobres(friendPosition);
                        return (
                            <View key={item.id} style={[styles.itemContainer, styles.friendUser]}>
                                <Text style={styles.positionText}>{friendPosition}</Text>
                                <Text style={styles.nicknameText}>{item.nickname}</Text>
                                <View style={styles.copasContainer}>
                                    <Ionicons name="trophy-outline" size={20} color="black" style={styles.copasIcon} />
                                    <Text style={styles.copasText}>{item.copas}</Text>
                                </View>
                                <View style={styles.sobresContainer}>
                                    <Ionicons name="gift-outline" size={24} color="black" style={styles.sobreIcon} />
                                    <Text style={styles.sobresText}>x{friendSobres}</Text>
                                </View>
                            </View>
                        );
                    }
                    return null;
                })}
            </>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Clasificación Mundial</Text>
            <Text style={styles.timeRemainingText}>Proxima Temporada: {timeRemaining}</Text>
            {loading ? (
                <Text style={styles.loadingText}>Cargando...</Text>
            ) : (
                <FlatList
                    data={data.slice(0, 100)}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={renderFooter}
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 50,
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
    currentUser: {
        backgroundColor: '#d0f0c0', // Greenish background for current user
    },
    friendUser: {
        backgroundColor: '#f0d0c0', // Orangeish background for friends
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
