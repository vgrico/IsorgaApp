import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { COLORS, icons } from '../../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationCard from '../../../components/NotificationCard';

const Notificaciones = ({ navigation }) => {
    const [userId, setUserId] = useState(null);
    const [notificaciones, setNotificaciones] = useState(null);

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
            fetchNotificaciones();
        }
    }, [userId]);

    const fetchNotificaciones = async () => {
        try {
            const response = await fetch(`https://momdel.es/animeWorld/api/listadoNotificaciones.php?id=${userId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setNotificaciones(data);
        } catch (error) {
            console.error('Error fetching serie data:', error);
        }
    };

    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[
                        styles.headerIconContainer,
                        {
                            borderColor: COLORS.grayscale200,
                        },
                    ]}
                >
                    <Image
                        source={icons.back}
                        resizeMode="contain"
                        style={[
                            styles.arrowBackIcon,
                            {
                                tintColor: COLORS.greyscale900,
                            },
                        ]}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notificaciones</Text>
                <Text> </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                {renderHeader()}
                <View style={styles.headerNoti}>
                    <View style={styles.headerNotiLeft}>
                        <Text style={styles.notiTitle}>Recent</Text>
                        <View style={styles.headerNotiView}>
                            <Text style={styles.headerNotiTitle}>{notificaciones?.length}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={fetchNotificaciones}>
                        <Text style={styles.clearAll}>Clear All</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={notificaciones}
                    keyExtractor={(item) => item.id.toString()} // Corregido el keyExtractor
                    renderItem={({ item }) => (
                        <NotificationCard
                            title={item.breve}
                            description={item.titulo}
                            icon={item.imagen}
                            date={item.fecha}
                        />
                    )}
                />
            </View>
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
        alignItems: 'center',
    },
    headerIconContainer: {
        height: 46,
        width: 46,
        borderWidth: 1,
        borderColor: COLORS.grayscale200,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999,
    },
    arrowBackIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold', // Usar 'fontWeight' en lugar de 'fontFamily'
        color: COLORS.black,
    },
    headerNoti: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
    },
    headerNotiLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    notiTitle: {
        fontSize: 16,
        fontWeight: 'bold', // Usar 'fontWeight' en lugar de 'fontFamily'
        color: COLORS.black,
    },
    headerNotiView: {
        height: 16,
        width: 16,
        backgroundColor: COLORS.primary,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
    },
    headerNotiTitle: {
        fontSize: 10,
        fontWeight: 'bold', // Usar 'fontWeight' en lugar de 'fontFamily'
        color: COLORS.white,
    },
    clearAll: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: 'bold', // Usar 'fontWeight' en lugar de 'fontFamily'
    },
});

export default Notificaciones;
