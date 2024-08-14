import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
    ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { icons, COLORS, SIZES } from '../../constants'

import VerticalCentros from '../../components/isorga/VerticalCentros'

const Centros = ({ route, navigation }) => {

    const { pantalla } = route.params
    const [series, setSeries] = useState([])
    const [filteredSeries, setFilteredSeries] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [userId, setUserId] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadUserId = async () => {
            try {
                const userIdFromStorage = await AsyncStorage.getItem('isorgaId')
                setUserId(userIdFromStorage)
            } catch (error) {
                console.error('Error loading userId from AsyncStorage:', error)
            }
        }
        loadUserId()
    }, [])

    useEffect(() => {
        if (userId) {
            fetchData()
        }
    }, [userId])

    useEffect(() => {
        searchSeries()
    }, [searchQuery])

    const fetchData = async () => {
        try {
            const response = await fetch(
                `https://isorga.com/api/centrosUsuario.php?id=${userId}`
            )
            if (!response.ok) {
                throw new Error('Failed to fetch data')
            }
            const datos = await response.json()
            console.log(userId)
            console.log(pantalla)
            const series = datos.map((item) => ({
                id: item.centroId.toString(),
                centroNombre: item.centroNombre.toUpperCase(),
                // interno: item.interno,
                // datosCodigo_postal: item.datosCodigo_postal,
                datosPoblacion: item.datosPoblacion,
            }))
            setSeries(series)
            setFilteredSeries(series)
        } catch (error) {
            console.error('Error fetching serie data:', error)
        } finally {
            setLoading(false)
        }
    }

    const searchSeries = () => {
        const filtered = series.filter(
            (serie) =>
                serie.centroNombre &&
                serie.centroNombre
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
        )
        setFilteredSeries(filtered)
    }

    const handlePress = async (id) => {
        try {
            await AsyncStorage.setItem('centroId', id.toString())
            if (pantalla === 1) {
                navigation.navigate('Inicio', { id: id})
            } else if (pantalla === 0) {
                navigation.navigate('Main', { id: id })
            }
        } catch (error) {
            console.error('Error saving centroId to AsyncStorage:', error)
        }
    }

    const renderContent = () => {
        if (loading) {
            return <ActivityIndicator size="large" color={COLORS.primary} />
        }

        return (
            <View>
                {filteredSeries.length > 0 ? (
                    <FlatList
                        data={filteredSeries}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        columnWrapperStyle={styles.columnWrapper}
                        renderItem={({ item }) => (
                            <VerticalCentros
                                name={item.centroNombre}
                                startTime={item.interno}
                                endTime={item.datosCodigo_postal}
                                date={item.datosPoblacion}
                                onPress={() => handlePress(item.id)}
                            />
                        )}
                    />
                ) : (
                    <Text>No se encontraron resultados</Text>
                )}
            </View>
        )
    }

    const renderLogo = () => {
        return (
            <View style={styles.container}>
                <Image
                    source={require('../../assets/images/logoIsorga.png')}
                    style={styles.logo}
                />
            </View>
        )
    }

    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                   <Image
                    source={require('../../assets/images/logoIsorga.png')}
                    style={styles.logo}
                />
                <Text style={styles.headerTitle}>MIS CENTROS</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.area}>
            {renderHeader()}
            <TextInput
                    placeholder="Buscar..."
                    style={styles.searchBar}
                    placeholderTextColor={COLORS.gray}
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                />
            <View style={styles.containerCentro}>{renderContent()}</View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,        
        backgroundColor: COLORS.white,

    },
    containerCentro: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 15,
    },
    backButton: {
        position: 'absolute',
        left: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    headerTitle: {
        fontSize: SIZES.h2,
        fontWeight: 'bold',
        marginLeft: 16,
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
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.secondaryWhite,
        padding: 16,
        borderRadius: 12,
        borderColor: COLORS.greyScale800,
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
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
    },
    moduloLogo: {
        width: 50,
        height: 50,
        marginBottom: 15,
        resizeMode: 'contain',
    },
})

export default Centros
