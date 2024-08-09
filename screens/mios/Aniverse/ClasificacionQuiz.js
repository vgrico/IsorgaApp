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
import { COLORS, SIZES, icons } from '../../../constants';

const ClasificacionQuiz = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
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
        if (userId) {
            fetchData();
        }
    }, [userId]);

    const fetchData = async () => {
        try {
            const response = await fetch(`https://momdel.es/animeWorld/api/porcentajeQuiz.php?id=${userId}`);
            const result = await response.json();
            const sortedResult = result.sort((a, b) => b.porcentaje_acertadas - a.porcentaje_acertadas);
            setData(sortedResult);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    const renderItem = ({ item, index }) => {
        const position = index + 1;

        return (
            <View style={styles.itemContainer}>
                <Text style={styles.positionText}>{position}</Text>
                <Text style={styles.nicknameText}>{item.nickname}</Text>
                <Text style={styles.acertadasText}>{item.acertadas}</Text>
                <Text style={styles.falladasText}>{item.falladas}</Text>
                <Text style={styles.porcentajeText}>{item.porcentaje_acertadas}%</Text>
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
                <Text style={styles.headerTitle}>Clasificación Quiz</Text>
            </View>
            <Text style={styles.title}>Clasificación Quiz de tus Amigos</Text>
            {loading ? (
                <Text style={styles.loadingText}>Cargando...</Text>
            ) : data.length === 0 ? (
                <Text style={styles.noDataText}>No tienes amigos disponibles</Text>
            ) : (
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
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
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#333',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    positionText: {
        fontSize: 18,
        fontWeight: 'bold',
        width: 40,
        color: '#333',
    },
    nicknameText: {
        fontSize: 18,
        flex: 1,
        color: '#666',
    },
    acertadasText: {
        fontSize: 18,
        color: 'green',
        marginHorizontal: 10,
    },
    falladasText: {
        fontSize: 18,
        color: 'red',
        marginHorizontal: 10,
    },
    porcentajeText: {
        fontSize: 18,
        color: '#666',
        marginLeft: 10,
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        color: '#999',
    },
    noDataText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        color: '#999',
    },
    listContent: {
        paddingBottom: 20,
    },
});

export default ClasificacionQuiz;
