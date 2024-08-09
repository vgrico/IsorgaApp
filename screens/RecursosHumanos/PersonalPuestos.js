import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TextInput,
    TouchableOpacity,
    Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, icons, SIZES } from '../../constants';

const PersonalPuestos = ({ route, navigation }) => {
    const { id } = route.params
    const { nombre } = route.params

    const [userId, setUserId] = useState(null);
    const [centroId, setCentroId] = useState(null);
    const [Nombre, setNombre] = useState(null);
    const [Personal, setPersonal] = useState([]);
    const [filteredPersonal, setFilteredPersonal] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [nombrePersonal, setNombrePersonal] = useState('');

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userIdFromStorage = await AsyncStorage.getItem('isorgaId');
                setUserId(userIdFromStorage);

                const centroIdFromStorage = await AsyncStorage.getItem('centroId');
                setCentroId(centroIdFromStorage);
            } catch (error) {
                console.error('Error loading data from AsyncStorage:', error);
            }
        };

        loadUserData();
    }, []);

    useEffect(() => {
        if (userId && centroId) {
            fetchPesonalCentro();
        }
    }, [userId, centroId]);


    const fetchPesonalCentro = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                'https://isorga.com/api/FichaPersonalCentro.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        personalId: id,
                    }),
                }
            );
            const data = await response.json();
            setPersonal(data);
            setFilteredPersonal(data);
            if (data.length > 0) {
                setNombrePersonal(data[0].nombre);
            }
        } catch (error) {
            console.error('Error fetching modulos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (text) => {
        setSearch(text);
        const filtered = Personal.filter(item => 
            item.puesto.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredPersonal(filtered);
    };

    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={icons.arrowBack}
                        resizeMode="contain"
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Puestos Trabajo</Text>
            </View>
        );
    };

    const renderModulo = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('DocumentosPuesto', { id: item.id, nombre:nombre })}
            >
                <View style={styles.row}>
                    <Text style={[styles.cell, styles.codigoCell]}>{item.seccion}</Text>
                    <Text style={[styles.cell, styles.tituloCell]}>{item.puesto}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.area}>
            {renderHeader()}
            <View style={styles.horizontalLine} />
            <View style={styles.header}>
                <Text style={styles.tituloSegundo}>{nombre}</Text>
            </View>
            <View style={styles.horizontalLine} />
            <View style={styles.table}>
                <View style={styles.headerRow}>
                    <Text style={[styles.headerCell, styles.codigoCell]}>Sección</Text>
                    <Text style={[styles.headerCell, styles.tituloCell]}>Puesto</Text>
                </View>
                <FlatList
                    data={filteredPersonal}
                    renderItem={renderModulo}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.flatListContent}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    header: {
        padding: 1,
    },
    headerTitle: {
        color: COLORS.black,
        fontSize: SIZES.h3,
        fontWeight: 'bold',
        marginLeft: 22,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    backIcon: {
        height: 18,
        width: 18,
        tintColor: COLORS.black,
    },
    tituloSegundo: {
        fontSize: 15,
        paddingHorizontal: 60,
        fontWeight: 'bold',
        color: COLORS.blackTie,
    },
    searchBar: {
        margin: 16,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        backgroundColor: COLORS.secondaryWhite,
    },
    flatListContent: {
        paddingHorizontal: 16,
    },
    table: {
        flex: 1,
        paddingHorizontal: 5,
    },
    headerRow: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: COLORS.black,
        paddingBottom: 8,
        marginBottom: 10,
    },
    headerCell: {
        fontWeight: 'bold',
        fontSize: 12,
        color: COLORS.black,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
        paddingVertical: 10,
    },
    cell: {
        fontSize: 12,
        color: COLORS.black,
    },
    codigoCell: {
        flex: 4, // 20%
    },
    tituloCell: {
        flex: 6, // 70%
    },
    horizontalLine: {
        borderBottomColor: COLORS.black,
        borderBottomWidth: 1,
        marginVertical: 10,
    },
});

export default PersonalPuestos;
