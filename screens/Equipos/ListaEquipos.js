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

const ListaEquipos = ({ route, navigation }) => {

    const { numero } = route.params
    const { titulo } = route.params
    const { icono } = route.params

    const [userId, setUserId] = useState(null);
    const [centroId, setCentroId] = useState(null);
    const [modulosUsuario, setModulosUsuario] = useState([]);
    const [filteredModulos, setFilteredModulos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [centroNombre, setCentroNombre] = useState('');

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
                'https://isorga.com/api/listadoEquipos.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        tipo: numero,
                        centroId : centroId,
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
            item.nombre.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredModulos(filtered);
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
                <Text style={styles.headerTitle}> {titulo}</Text>
                <View style={{ flex: 1 }} />
                <Image source={require('../../assets/images/logoIsorga.png')} style={styles.logo} />
            </View>
        );
    };

    const renderModulo = ({ item }) => {
        return (
            <TouchableOpacity
            onPress={() => navigation.navigate('DatosEquipo', { id: item.id })}
        >
            <View style={styles.row}>
                <Text style={[styles.cell, styles.codigoCell]}>
                    <Text style={styles.nombreText}>{item.nombre}</Text>  
                </Text>
                <Text style={[styles.cell, styles.revisionCell]}>
                    {item.activo ? 'Sí' : 'No'}
                </Text>
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
                    <Text style={[styles.headerCell, styles.codigoCell]}>Nombre</Text>
                    <Text style={[styles.headerCell, styles.revisionCell]}>Estado</Text>
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
    backIcon: {
        height: 18,
        width: 18,
        tintColor: COLORS.black,
    },
    headerTitle: {
        color: COLORS.black,
        fontSize: SIZES.h3,
        fontWeight: 'bold',
        marginLeft: 20,
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
        fontSize: 14,
        color: COLORS.black,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
        paddingVertical: 8,
    },
    cell: {
        fontSize: 14,
        color: COLORS.black,
        paddingHorizontal: 4,
    },
    codigoCell: {
        flex: 2, // 20%
    },
    tituloCell: {
        flex: 7, // 70%
    },
    revisionCell: {
        flex: 1, // 10%
        textAlign: 'center',
    },
    nombreText: {
        fontWeight: 'semibold', // Ejemplo de estilo para "nombre"
        fontSize: 13,       // Puedes ajustar estos valores
        color: '#000',      // Color del texto para "nombre"
    },
    tiponombreText: {
        fontStyle: 'italic', // Ejemplo de estilo para "tiponombre"
        fontSize: 10,        // Ajusta según prefieras
        color: '#555',       // Color del texto para "tiponombre"
    },
    horizontalLine: {
        borderBottomColor: COLORS.black,
        borderBottomWidth: 1,
        marginVertical: 10,
    },
    logo: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
      },
});

export default ListaEquipos;
