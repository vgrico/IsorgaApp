import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { listarSeriesMiasExamen } from '../../data';
import { COLORS, icons } from '../../constants';
import VerticalCard3 from '../../components/mios/VerticalCard3';

const MisSeriesExamen = ({ navigation }) => {
    const [series, setSeries] = useState([]);
    const [filteredSeries, setFilteredSeries] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true); // Estado para indicar si se están cargando los datos

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
    }, [userId]);

    const fetchData = async () => {
        try {
            const response = await fetch(`https://momdel.es/animeWorld/api/listadoSeriesMiasExamen.php?id=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const datos = await response.json();
            // Mapea los datos para darles el formato deseado
            const series = datos.map(item => ({
                id: item.id.toString(),
                name: item.nombre,
                image: item.imagen1,
                startTime: "",
                endTime: "",
                date: "",
                location: "",
                capitulo: item.capitulo,
                nCapitulos: item.n_capitulos,
                completado: item.completado,
                intentos: item.intentos,
                categoryId: "3",
                isFree: true
            }));
            setSeries(series);
            setFilteredSeries([...series]); // Crear una copia superficial de series
        } catch (error) {
            console.error('Error fetching serie data:', error);
        } finally {
            setLoading(false); // Una vez que los datos se han cargado (o ha ocurrido un error), establecer loading en falso
        }
    };

    const renderItem = ({ item }) => {
        // Si el número de intentos es 0, desactiva la tarjeta
        const disabled = item.intentos === 0;

        return (
            <VerticalCard3
                name={item.name}
                image={item.image}
                startTime={item.startTime}
                endTime={item.endTime}
                date={item.date}
                isFree={item.isFree}
                location={item.location}
                capitulo={item.capitulo}
                nCapitulos={item.nCapitulos}
                id={item.id}
                completado={item.completado}
                intentos={item.intentos}
                disabled={disabled}
                onPress={() =>
                    navigation.navigate('DetallesSeries', {
                        id: item.id,
                    })
                }
            />
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.headerWrapper}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image
                        source={icons.back}
                        resizeMode="contain"
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mis Series para Examen</Text>
            </View>
            <View style={styles.container}>
                <FlatList
                    data={filteredSeries}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={{ gap: 16 }}
                    renderItem={renderItem}
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
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 16,
        marginTop: 50,
        marginBottom: 24,
    },
    backButton: {
        position: 'absolute',
        left: 16,
    },
    backIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'medium',
        color: COLORS.greyscale900,
        textAlign: 'center',
        flex: 1,
    },
});

export default MisSeriesExamen;
