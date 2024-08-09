import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { listarSeries } from '../../../data';
import { icons, COLORS } from '../../../constants';
import VerticalEventCardAnime from '../../../components/VerticalEventCardAnime';

const Series = ({ navigation }) => {
    const [series, setSeries] = useState([]);
    const [filteredSeries, setFilteredSeries] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

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

    const searchSeries = () => {
        const filtered = series.filter(
            serie =>
                serie.name && serie.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                {filteredSeries.length > 0 ? (
                    <FlatList
                        data={filteredSeries}
                        keyExtractor={item => item.id.toString()} // Cambié el keyExtractor para asegurar que el id sea una cadena
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
                                onPress={() =>
                                    navigation.navigate('DetallesSeries', { id: item.id })
                                }
                            />
                        )}
                    />
                ) : (
                    <Text>No se encontraron resultados</Text>
                )}
            </View>
        );
    };

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
                <Text style={styles.headerTitle}>Series</Text>
            </View>
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
    headerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 16,
        marginTop: 30,
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

export default Series;
