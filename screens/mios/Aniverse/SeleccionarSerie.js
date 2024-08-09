import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { listarSeries } from '../../../data';
import { icons, COLORS } from '../../../constants';
import VerticalEventCardAnime from '../../../components/VerticalEventCardAnime';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SeleccionarSerie = ({ navigation }) => {
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
    }, []);

    useEffect(() => {
        searchSeries();
    }, [searchQuery]);

    const fetchData = async () => {
        const seriesData = await listarSeries();
        setSeries(seriesData);
        setFilteredSeries(seriesData);
    };

    const sendPostToAPI = async (idSerie) => {
        try {
            console.log("Data to send:", { idSerie: idSerie, idUsuario: userId });
            const response = await fetch(
                'https://momdel.es/animeWorld/api/añadirSeriePublicacion.php',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idSerie: idSerie,
                        idUsuario: userId,
                    }),
                }
            );

            const responseData = await response.text();
            console.log(responseData);

            try {
                const jsonData = JSON.parse(responseData);
                console.log(jsonData);
                navigation.navigate('Publicaciones');
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        } catch (error) {
            console.error('Error sending request:', error);
        }
    };

    const searchSeries = () => {
        const filtered = series.filter(
            serie =>
                serie.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredSeries(filtered);
    };

    const renderContent = () => {
        return (
            <View>
                <View style={styles.searchBarContainer}>
                    <TextInput
                        placeholder="Search"
                        placeholderTextColor={COLORS.gray}
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={text => setSearchQuery(text)}
                    />
                    <TouchableOpacity onPress={searchSeries}>
                        <Image
                            source={icons.search2}
                            resizeMode="contain"
                            style={styles.searchIcon}
                        />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={filteredSeries}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    columnWrapperStyle={{ gap: 16 }}
                    renderItem={({ item }) => (
                        <VerticalEventCardAnime
                            name={item.name}
                            image={item.image}
                            startTime={item.startTime}
                            endTime={item.endTime}
                            date={item.date}
                            isFree={item.isFree}
                            location={item.location}
                            onPress={() => sendPostToAPI(item.id)}
                        />
                    )}
                />
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Seleccionar serie para la publicación</Text>
                    <TouchableOpacity onPress={() => sendPostToAPI(null)} style={styles.omitButton}>
                        <Text style={styles.omitButtonText}>Omitir</Text>
                    </TouchableOpacity>
                </View>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    omitButton: {
        paddingVertical: 8,
    },
    omitButtonText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: 'bold',
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
});

export default SeleccionarSerie;
