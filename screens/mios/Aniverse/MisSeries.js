import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, icons } from '../../constants';
import VerticalEventCardAnime from '../../components/VerticalEventCardAnime';
import VerticalCard2 from '../../components/mios/VerticalCard2';
import VerticalCard3 from '../../components/mios/VerticalCard3';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 360;

const MisSeries = ({ navigation }) => {
    const [series, setSeries] = useState([]);
    const [filteredSeries, setFilteredSeries] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [userId, setUserId] = useState(null);
    const [selectedButton, setSelectedButton] = useState(null);

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
        useCallback(() => {
            fetchData();
        }, [userId])
    );

    const fetchData = async () => {
        try {
            const response = await fetch(`https://momdel.es/animeWorld/api/listadoSeriesMias.php?id=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const datos = await response.json();
            const characters = datos.map(item => ({
                id: item.id.toString(),
                name: item.nombre,
                image: item.imagen1,
                estado: item.estado,
                capitulo: item.capitulo,
                nCapitulos: item.n_capitulos,
                completado: item.completado,
                intentos: item.intentos,
                date: '',
                startTime: '',
                endTime: '',
                location: '',
                categoryId: '3',
                isFree: true
            }));
            setSeries(characters);
            const filtered = characters.filter((serie) => serie.estado === 1);
            setFilteredSeries(filtered);
            setSelectedButton(null);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const searchSeries = () => {
        const filtered = series.filter((serie) =>
            serie.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setFilteredSeries(filtered)
    }

    const filterSeriesByStatus = (estado) => {
        const filtered = series.filter((serie) => serie.estado === estado)
        setFilteredSeries(filtered)
        setSelectedButton(estado);
    }

    const renderContent = () => {
        let CardComponent;
        switch (filteredSeries[0]?.estado) {
            case 1:
                CardComponent = VerticalEventCardAnime;
                break;
            case 2:
                CardComponent = VerticalCard2;
                break;
            case 3:
                CardComponent = VerticalCard3;
                break;
            default:
                CardComponent = VerticalEventCardAnime;
        }
        return (
            <View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, selectedButton === 1 && styles.selectedButton]}
                        onPress={() => filterSeriesByStatus(1)}
                    >
                        <Image
                            source={icons.playOutline}
                            style={styles.buttonIcon}
                        />
                        <Text style={[styles.buttonText, selectedButton === 1 && styles.selectedButtonText]}></Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, selectedButton === 2 && styles.selectedButton]}
                        onPress={() => filterSeriesByStatus(2)}
                    >
                        <Image
                            source={icons.timeCircle}
                            style={styles.buttonIcon}
                        />
                        <Text style={[styles.buttonText, selectedButton === 2 && styles.selectedButtonText]}></Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('MisSeriesExamen')}
                    >
                        <Image
                            source={icons.shieldOutline}
                            style={styles.buttonIcon}
                        />
                        <Text style={styles.buttonText}></Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Series')}
                    >
                        <Image
                            source={icons.arrowRight}
                            style={styles.buttonIcon}
                        />
                        <Text style={styles.buttonText}></Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={filteredSeries}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={{ gap: 16 }}
                    renderItem={({ item }) => (
                        <CardComponent
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
                            onPress={() =>
                                navigation.navigate('DetallesSeries', {
                                    id: item.id,
                                })
                            }
                        />
                    )}
                />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>{renderContent()}</View>
        </SafeAreaView>
    )
}

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
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.secondaryWhite,
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'regular',
        marginHorizontal: 8,
    },
    searchIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.gray,
    },
    buttonContainer: {
        flexDirection: isSmallScreen ? 'column' : 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 16,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: COLORS.primary,
        borderWidth: 1,
        borderRadius: 50,
        padding: 12,
        marginHorizontal: 5,
        width: isSmallScreen ? '80%' : 'auto',
        backgroundColor: COLORS.secondaryWhite,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    selectedButton: {
        backgroundColor: COLORS.primary,
    },
    buttonIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.primary,
        marginRight: 8,
    },
    buttonText: {
        color: COLORS.primary,
        fontSize: 16,
        textAlign: 'center',
    },
    selectedButtonText: {
        color: COLORS.white,
    },
});

export default MisSeries;
