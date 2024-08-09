import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { listarSeriesMias } from '../../data';
import { COLORS, icons } from '../../constants';
import VerticalEventCardAnime from '../../components/VerticalEventCardAnime';
import VerticalCard2 from '../../components/mios/VerticalCard2';
import VerticalCard3 from '../../components/mios/VerticalCard3';

const MisSeries = ({ navigation }) => {
    const [series, setSeries] = useState([]);
    const [filteredSeries, setFilteredSeries] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
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
    }, [userId]);

    const fetchData = async () => {
        const seriesData = await listarSeriesMias(userId);
        setSeries(seriesData);
        // Filtrar las series por estado 1 al cargar el componente
        const filtered = seriesData.filter(serie => serie.estado === 1);
        setFilteredSeries(filtered);
    };

    const searchSeries = () => {
        const filtered = series.filter(serie =>
            serie.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredSeries(filtered);
    };

    const filterSeriesByStatus = (estado) => {
        const filtered = series.filter(serie => serie.estado === estado);
        setFilteredSeries(filtered);
    };

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
                    <TouchableOpacity style={styles.button} onPress={() => filterSeriesByStatus(1)}>
                        <Image source={icons.playOutline} style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Por Ver</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => filterSeriesByStatus(2)}>
                        <Image source={icons.timeCircle} style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Viéndolas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => filterSeriesByStatus(3)}>
                        <Image source={icons.shieldOutline} style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Acabadas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Series')}>
                        <Image source={icons.arrowRight} style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Ver todas</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={filteredSeries}
                    keyExtractor={item => item.id}
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
                            onPress={() => navigation.navigate('DetallesSeries', { id: item.id })}
                        />
                    )}
                />
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                {renderContent()}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    button: {
        borderColor: COLORS.primary,
        borderWidth: 1,
        borderRadius: 50,
        padding: 8,
        alignItems: 'center',
    },
    buttonIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.primary,
    },
    buttonText: {
        color: COLORS.primary,
        fontSize: 16,
        marginTop: 4,
    },
});

export default MisSeries;
