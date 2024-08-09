import React, { useEffect, useState, useRef } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    FlatList,
    Dimensions,
    Animated,
    ImageBackground,
} from 'react-native'
import { COLORS, SIZES, icons } from '../../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'
import SectionHeader from '../../components/SectionHeader'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LinearGradient } from 'expo-linear-gradient'
import VerticalCardInicio from '../../components/mios/VerticalCardInicio'

const Iniciox = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [datosUsuarios, setDatosUsuarios] = useState(null)
    const [datosSeries, setDatosSeries] = useState(null)
    const [resultadosSemana, setResultadosSemana] = useState(null)
    const [curiosidades, setCuriosidades] = useState([])
    const [misiones, setMisiones] = useState([])
    const [cartaMasUtilizada, setCartaMasUtilizada] = useState(null)
    const [userId, setUserId] = useState(null)
    const [refreshIndicator, setRefreshIndicator] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loadingMisiones, setLoadingMisiones] = useState(true)

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
            fetchDatosUsuarios()
            fetchMisiones()
            fetchCuriosidades()
        }
    }, [userId])

    useEffect(() => {
        fetchSeriesMejorValoradas()
        fetchResultadosSemana()
        fetchCartaMasUtilizada()
    }, [])

    const onScreenFocus = () => {
        recargarPagina()
        recargarMisiones()
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', onScreenFocus)
        return unsubscribe
    }, [userId])

    const fetchSeriesMejorValoradas = async () => {
        try {
            const response = await fetch(`https://momdel.es/animeWorld/api/mediaSerie.php`)
            const data = await response.json()
            setDatosSeries(data)
        } catch (error) {
            console.error('Error fetching user data:', error)
        }
    }

    const fetchResultadosSemana = async () => {
        try {
            const response = await fetch(`https://momdel.es/animeWorld/api/resultadosIndividualesSemana.php`)
            const data = await response.json()
            setResultadosSemana(data)
        } catch (error) {
            console.error('Error fetching user data:', error)
        }
    }

    const fetchCartaMasUtilizada = async () => {
        try {
            const response = await fetch(`https://momdel.es/animeWorld/api/cartaMasUtilizadaGeneral.php`)
            const data = await response.json()
            setCartaMasUtilizada(data[0])
        } catch (error) {
            console.error('Error fetching carta data:', error)
        }
    }

    const getTopCharacterForResponse = (responseIndex) => {
        if (!resultadosSemana || resultadosSemana.length === 0) {
            return null
        }
        const counts = resultadosSemana.map((item) => ({
            personaje: item.personaje,
            count: parseInt(item[`respuesta${responseIndex}_count`]),
            imagen: item.imagen,
        }))
        const topCharacter = counts.reduce(
            (max, item) => (item.count > max.count ? item : max),
            counts[0]
        )
        return topCharacter
    }

    const fetchDatosUsuarios = async () => {
        try {
            const response = await fetch(`https://momdel.es/animeWorld/api/detallesUsuario.php?id=${userId}`)
            const data = await response.json()
            setDatosUsuarios(data)
        } catch (error) {
            console.error('Error fetching user data:', error)
        }
    }

    const fetchCuriosidades = async () => {
        try {
            const response = await fetch(`https://momdel.es/animeWorld/api/curiosidades.php?id=${userId}`)
            const data = await response.json()
            setCuriosidades(data)
        } catch (error) {
            console.error('Error fetching curiosidades data:', error)
        }
    }

    const fetchMisiones = async () => {
        try {
            setLoadingMisiones(true)
            const response = await fetch(`https://momdel.es/animeWorld/api/misiones.php?id=${userId}`)
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            setMisiones(data)
            setLoadingMisiones(false)
        } catch (error) {
            console.error('Error fetching misiones data:', error)
            setLoadingMisiones(false)
        }
    }

    const recargarMisiones = async () => {
        if (userId) {
            await fetchMisiones()
        }
    }

    const recargarPagina = async () => {
        if (userId) {
            await Promise.all([
                fetchDatosUsuarios(),
                fetchCuriosidades(),
                fetchMisiones(),
            ])
            setRefreshIndicator((prevIndicator) => !prevIndicator)
        } else {
            console.log('userId is null')
        }
    }

    const renderHeader = () => {
        if (!datosUsuarios) {
            return null
        }
        const progressBarWidth =
            datosUsuarios && datosUsuarios.diferencia !== null
                ? `${datosUsuarios.diferencia}%`
                : '0%'
        return (
            <View style={styles.headerContainer}>
                <View style={styles.viewLeft}>
                    <Image
                        source={{
                            uri: `https://momdel.es/animeWorld/DOCS/${datosUsuarios.imagen}`,
                        }}
                        resizeMode="contain"
                        style={styles.userIcon}
                    />
                </View>
                <View style={styles.progressBarContainer}>
                    <Text style={styles.progressText}>
                        ⭐️ {datosUsuarios.nivel}
                    </Text>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressIndicator,
                                { width: progressBarWidth },
                            ]}
                        >
                            <Text style={styles.progressNumber}>
                                {datosUsuarios.diferencia}%
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.viewRight}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Notificaciones')}
                    >
                        <Image
                            source={icons.notification}
                            resizeMode="contain"
                            style={[
                                styles.bellIcon,
                                { tintColor: COLORS.greyscale900 },
                            ]}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const renderSearchBar = () => {
        const handleInputFocus = () => {
            navigation.navigate('Search')
        }
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('Search')}
                style={[
                    styles.searchBarContainer,
                    { backgroundColor: COLORS.secondaryWhite },
                ]}
            >
                <TouchableOpacity>
                    <Image
                        source={icons.search2}
                        resizeMode="contain"
                        style={styles.searchIcon}
                    />
                </TouchableOpacity>
                <TextInput
                    placeholder="Search"
                    placeholderTextColor={COLORS.gray}
                    style={styles.searchInput}
                    onFocus={handleInputFocus}
                />
                <TouchableOpacity>
                    <Image
                        source={icons.filter}
                        resizeMode="contain"
                        style={styles.filterIcon}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }

    const renderMisiones = () => {
        return (
            <View>
                <SectionHeader title="Misiones" />
                {misiones.map((mision, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.misionContainer}
                        onPress={() => console.log('Pressed')}
                    >
                        <Text
                            style={[
                                styles.misionText,
                                mision.estado === 1
                                    ? styles.completedMission
                                    : null,
                            ]}
                        >
                            {`${index + 1}. ${mision.texto}`} |{' '}
                            {mision.experiencia}XP
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        )
    }

    const renderBannerItem = ({ item }) => (
        <View style={styles.bannerContainer}>
            <View style={styles.bannerTopContainer}>
                <View>
                    <Text style={styles.bannerDicount}>
                        {item.nombre_serie}
                    </Text>
                    <Text style={styles.bannerDiscountName}>
                        {item.curiosidad}
                    </Text>
                </View>
            </View>
        </View>
    )

    const keyExtractor = (item) => item.id.toString()

    const handleEndReached = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % curiosidades.length)
    }

    const renderDot = (index) => {
        return (
            <View
                style={[
                    styles.dot,
                    index === currentIndex ? styles.activeDot : null,
                ]}
                key={index}
            />
        )
    }

    const renderBanner = () => {
        const scrollX = useRef(new Animated.Value(0)).current
        const onScroll = Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
        )
        const currentIndex = Animated.divide(
            scrollX,
            Dimensions.get('window').width
        )
        return (
            <View style={styles.bannerItemContainer}>
                <Animated.FlatList
                    data={curiosidades}
                    renderItem={renderBannerItem}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, id) => id.toString()}
                    onScroll={onScroll}
                />
                <View style={styles.dotContainer}>
                    {curiosidades.map((_, index) => renderDot(index))}
                </View>
            </View>
        )
    }

    const renderTotalEvent = () => {
        const topCharacter = getTopCharacterForResponse(6)
        if (!topCharacter) {
            return null
        }
        return (
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('ResultadosSemana', {
                        responseIndex: 6,
                    })
                }
                style={styles.cardContainer}
            >
                <ImageBackground
                    source={{
                        uri: `https://momdel.es/animeWorld/DOCS/${topCharacter.imagen}`,
                    }}
                    style={styles.cardImageBackground}
                    imageStyle={{ borderRadius: 32 }}
                >
                    <LinearGradient
                        style={styles.cardGradient}
                        colors={['transparent', 'rgba(0,0,0,0.5)']}
                    >
                        <Text style={styles.cardTitle}>Total</Text>
                        <Text style={styles.cardSubtitle}>Resultados de la semana pasada del 1 vs 1</Text>
                    </LinearGradient>
                </ImageBackground>
            </TouchableOpacity>
        )
    }

    const renderCartaMasUtilizada = () => {
        if (!cartaMasUtilizada) {
            return null
        }
        return (
            <View style={styles.cardContainer}>
                <ImageBackground
                    source={{
                        uri: `https://momdel.es/animeWorld/DOCS/${cartaMasUtilizada.carta}`,
                    }}
                    style={styles.cardImageBackground}
                    imageStyle={{ borderRadius: 32 }}
                >
                    <LinearGradient
                        style={styles.cardGradient}
                        colors={['transparent', 'rgba(0,0,0,0.5)']}
                    >
                        <Text style={styles.cardTitle}>Carta Más Utilizada</Text>
                        <Text style={styles.cardSubtitle}>Carta más jugada en juego de copas</Text>
                    </LinearGradient>
                </ImageBackground>
            </View>
        )
    }

    const renderFeaturedEvents = () => {
        return (
            <View>
                <SectionHeader title="Eventos Destacados" />
                <FlatList
                    data={[{ key: 'totalEvent' }, { key: 'cartaMasUtilizada' }]}
                    horizontal
                    renderItem={({ item }) => {
                        if (item.key === 'totalEvent') {
                            return renderTotalEvent()
                        } else if (item.key === 'cartaMasUtilizada') {
                            return renderCartaMasUtilizada()
                        }
                        return null
                    }}
                    keyExtractor={(item) => item.key}
                />
            </View>
        )
    }

    const renderPopularEvents = () => {
        return (
            <View>
                <SectionHeader title="Series Mejor Valoradas" />
                <View style={{ backgroundColor: COLORS.secondaryWhite, marginVertical: 16 }}>
                    <FlatList
                        data={datosSeries}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        columnWrapperStyle={{ gap: 16 }}
                        renderItem={({ item }) => (
                            <VerticalCardInicio
                                name={item.nombre}
                                image={item.imagen1}
                                startTime={item.media}
                                endTime={item.media}
                                date={item.media}
                                location={item.media}
                                isFree={item.media}
                                onPress={() => navigation.navigate('DetallesSeries', { id: item.id })}
                            />
                        )}
                    />
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                {renderHeader()}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 50 }}
                >
                    {renderBanner()}
                    {renderFeaturedEvents()}
                    {renderMisiones()}
                    {renderPopularEvents()}
                </ScrollView>
            </View>
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
    headerContainer: {
        flexDirection: 'row',
        width: SIZES.width - 32,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    userIcon: {
        width: 48,
        height: 48,
        borderRadius: 32,
    },
    viewLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    greeeting: {
        fontSize: 12,
        fontFamily: 'regular',
        color: 'gray',
        marginBottom: 4,
    },
    title: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
    },
    viewNameContainer: {
        marginLeft: 12,
    },
    viewRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bellIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
        marginRight: 8,
    },
    bookmarkIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
    },
    searchBarContainer: {
        width: SIZES.width - 32,
        backgroundColor: COLORS.secondaryWhite,
        padding: 16,
        borderRadius: 12,
        height: 52,
        marginVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.gray,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'regular',
        marginHorizontal: 8,
    },
    filterIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.primary,
    },
    bannerContainer: {
        width: SIZES.width - 32,
        height: 154,
        paddingHorizontal: 28,
        paddingTop: 28,
        borderRadius: 32,
        backgroundColor: COLORS.primary,
    },
    bannerTopContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bannerDicount: {
        fontSize: 12,
        fontFamily: 'medium',
        color: COLORS.white,
        marginBottom: 4,
    },
    bannerDiscountName: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.white,
    },
    bannerBottomContainer: {
        marginTop: 8,
    },
    bannerBottomTitle: {
        fontSize: 14,
        fontFamily: 'medium',
        color: COLORS.white,
    },
    bannerBottomSubtitle: {
        fontSize: 14,
        fontFamily: 'medium',
        color: COLORS.white,
        marginTop: 4,
    },
    userAvatar: {
        width: 64,
        height: 64,
        borderRadius: 999,
    },
    firstName: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.dark2,
        marginTop: 6,
    },
    bannerItemContainer: {
        width: '100%',
        paddingBottom: 10,
        backgroundColor: COLORS.primary,
        height: 170,
        borderRadius: 32,
        marginTop: 20,
    },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ccc',
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: COLORS.white,
    },
    progressBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressText: {
        marginRight: 8,
        color: COLORS.greyscale900,
        fontFamily: 'bold',
        fontSize: 16,
    },
    progressBar: {
        height: 24,
        width: 200,
        backgroundColor: COLORS.greyscale300,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    progressIndicator: {
        height: '100%',
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    progressNumber: {
        color: COLORS.white,
        fontFamily: 'bold',
        fontSize: 14,
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: -7 }],
    },
    misionContainer: {
        backgroundColor: COLORS.secondaryWhite,
        padding: 16,
        borderRadius: 12,
        marginVertical: 8,
    },
    misionText: {
        fontSize: 16,
        fontFamily: 'regular',
        color: COLORS.gray,
    },
    completedMission: {
        textDecorationLine: 'line-through',
    },
    resultadosContainer: {
        marginVertical: 16,
    },
    cardContainer: {
        width: SIZES.width * 0.68,
        height: 310,
        borderRadius: 32,
        marginRight: 12,
    },
    cardImageBackground: {
        flex: 1,
        borderRadius: 32,
    },
    cardGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 124,
        zIndex: 999999,
        width: '100%',
        borderBottomRightRadius: 32,
        borderBottomLeftRadius: 32,
        padding: 16,
    },
    cardTitle: {
        fontSize: 24,
        fontFamily: 'bold',
        color: COLORS.white,
        marginBottom: 6,
    },
    cardSubtitle: {
        fontSize: 16,
        fontFamily: 'regular',
        color: COLORS.white,
        marginTop: 4,
    },
})

export default Iniciox
