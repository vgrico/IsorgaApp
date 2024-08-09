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


const NoConformidades = ({ route, navigation }) => {
    const [userId, setUserId] = useState(null);
    const [centroId, setCentroId] = useState(null);

    const [modulosUsuario, setModulosUsuario] = useState([]);
    const [filteredModulos, setFilteredModulos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');


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
            fetchModulosUsuario();
        }
    }, [userId, centroId]);

    const fetchModulosUsuario = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                'https://isorga.com/api/QuimicosCentro.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        centroId: centroId,
                    }),
                }
            );
            const data = await response.json();
            setModulosUsuario(data);
            setFilteredModulos(data);
            if (data.length > 0) {
                setCentroNombre(data[0].centroNombre);
            }
        } catch (error) {
            console.error('Error fetching modulos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (text) => {
        setSearch(text);
        const filtered = modulosUsuario.filter(item => 
            item.nombre.toLowerCase().includes(nombre.toLowerCase() )
        );
        setFilteredModulos(filtered);
    };

    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={icons.back}
                        resizeMode="contain"
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>NO CONFORMIDADES</Text>
            </View>
        );
    };

    const renderModulo = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('Fds', { id: item.id })}
            >
                <View style={styles.row}>
                    <Text style={[styles.cell, styles.nombreCell]}>{item.nombre}</Text>
                    <Text style={[styles.cell, styles.fechaCell]}>{item.fecha}</Text>
                    <Text style={[styles.cell, styles.adrCell]}>{item.adr}</Text>
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
            <TextInput
                              placeholder="Buscar..."
                              style={styles.searchBar}
                              placeholderTextColor={COLORS.gray}
                value={search}
                onChangeText={handleSearch}
            />
            <View style={styles.table}>
                <View style={styles.headerRow}>
                    <Text style={[styles.headerCell, styles.nombreCell]}>Nombre</Text>
                    <Text style={[styles.headerCell, styles.fechaCell]}>Fecha</Text>
                    <Text style={[styles.headerCell, styles.adrCell]}>ADR</Text>
                </View>
                <FlatList
                    data={filteredModulos}
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
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    headerTitle: {
        color: COLORS.black,
        fontSize: SIZES.h3,
        fontWeight: 'bold',
        marginLeft: 20,
    },
    backIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
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
        paddingHorizontal: 16,
    },
    headerRow: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: COLORS.black,
        paddingBottom: 8,
        marginBottom: 16,
    },
    headerCell: {
        fontWeight: 'bold',
        fontSize: 15,
        color: COLORS.black,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
        paddingVertical: 8,
    },
    cell: {
        fontSize: 13,
        color: COLORS.black,
        paddingHorizontal: 4,
    },
    nombreCell: {
        flex: 5, // 20%
    },
    fechaCell: {
        flex: 3, // 70%
    },
    adrCell: {
        flex: 2, // 10%
        textAlign: 'center',
    },
    horizontalLine: {
        borderBottomColor: COLORS.black,
        borderBottomWidth: 1,
        marginVertical: 10,
    },
});

export default NoConformidades;
