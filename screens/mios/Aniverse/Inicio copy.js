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
} from 'react-native'
import { COLORS, SIZES, icons, images } from '../../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'
import {
    banners,
    categories,
    featuredEvents,
    recommendedEvents,
} from '../../data'
import SectionHeader from '../../components/SectionHeader'
import FeaturedEventCard from '../../components/FeaturedEventCard'
import VerticalEventCard from '../../components/VerticalEventCard'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MaterialIcons } from '@expo/vector-icons' // Asegúrate de tener instalada la biblioteca @expo/vector-icons

const Inicio = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [datosUsuarios, setDatosUsuarios] = useState(null)
    const [curiosidades, setCuriosidades] = useState([])
    const [misiones, setMisiones] = useState([])
    const [userId, setUserId] = useState(null)

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
        const loadData = async () => {
            if (userId) {
                try {
                    await Promise.all([
                        fetchDatosUsuarios(),
                        fetchCuriosidades(),
                        fetchMisiones()
                    ]);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                console.log('userId is null');
            }
        };
    
        loadData();
    }, [userId]);
    

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Recargar la página al enfocar la pantalla "Inicio"
            recargarPagina()
        })

        return unsubscribe
    }, [navigation])

    const fetchDatosUsuarios = async () => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/detallesUsuario.php?id=${userId}`
            )
            const data = await response.json()
            setDatosUsuarios(data)
        } catch (error) {
            console.error('Error fetching user data:', error)
        }
    }

    const fetchCuriosidades = async () => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/curiosidades.php?id=${userId}`
            )
            const data = await response.json()
            setCuriosidades(data)
        } catch (error) {
            console.error('Error fetching curiosidades data:', error)
        }
    }

    const fetchMisiones = async () => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/misiones.php?id=${userId}`
            )
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            setMisiones(data)
        } catch (error) {
            console.error('Error fetching misiones data:', error)
        }
    }

    const recargarPagina = () => {
        if (userId) {
            fetchDatosUsuarios()
            fetchCuriosidades()
            fetchMisiones()
        } else {
            console.log('userId is null')
        }
    }

    /**
     * render header
     */
    const renderHeader = () => {
        if (!datosUsuarios) {
            return null
        }

        const progressBarWidth =
            datosUsuarios && datosUsuarios.diferencia !== null
                ? `${datosUsuarios.diferencia.toFixed(0)}%`
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
                    {/* <View style={styles.viewNameContainer}>
                        <Text style={styles.greeeting}>Buenos Dias👋</Text>
                        <Text
                            style={[
                                styles.title,
                                {
                                    color: COLORS.greyscale900,
                                },
                            ]}
                        >
                            {datosUsuarios.nombre}
                        </Text>
                    </View> */}
                </View>
                <View style={styles.progressBarContainer}>
                    <Text style={styles.progressText}>
                        ⭐️ {datosUsuarios.nivel.toFixed(0)}
                    </Text>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressIndicator,
                                { width: progressBarWidth },
                            ]}
                        >
                            <Text style={styles.progressNumber}>
                                {datosUsuarios.diferencia.toFixed(0)}%
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.viewRight}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Notifications')}
                    >
                        <Image
                            source={icons.notificationBell2}
                            resizeMode="contain"
                            style={[
                                styles.bellIcon,
                                { tintColor: COLORS.greyscale900 },
                            ]}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Favourite')}
                    >
                        <Image
                            source={icons.bookmarkOutline}
                            resizeMode="contain"
                            style={[
                                styles.bookmarkIcon,
                                { tintColor: COLORS.greyscale900 },
                            ]}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    /**
     * Render search bar
     */
    const renderSearchBar = () => {
        const handleInputFocus = () => {
            // Redirect to another screen
            navigation.navigate('Search')
        }

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('Search')}
                style={[
                    styles.searchBarContainer,
                    {
                        backgroundColor: COLORS.secondaryWhite,
                    },
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
                {misiones.map((mision, index) => {
                    return (
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
                    )
                })}
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

    /**
     * Render banner
     */
    const renderBanner = () => {
        const scrollX = useRef(new Animated.Value(0)).current

        const onScroll = Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
        )

        // Calcular el índice actual basado en el desplazamiento horizontal
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

    const renderFeaturedEvents = () => {
        return (
            <View>
                <SectionHeader
                    title="Featured"
                    subtitle="See All"
                    onPress={() => navigation.navigate('Personajes')}
                />
                <FlatList
                    data={featuredEvents}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <FeaturedEventCard
                            image={item.image}
                            name={item.name}
                            startTime={item.startTime}
                            endTime={item.endTime}
                            date={item.date}
                            location={item.location}
                            onPress={() => navigation.navigate('EventDetails')}
                        />
                    )}
                />
            </View>
        )
    }

    /**
     * render popular events
     */
    const renderPopularEvents = () => {
        const [selectedCategories, setSelectedCategories] = useState(['1'])

        const filteredEvents = recommendedEvents.filter(
            (event) =>
                selectedCategories.includes('1') ||
                selectedCategories.includes(event.categoryId)
        )

        // Category item
        const renderCategoryItem = ({ item }) => (
            <TouchableOpacity
                style={{
                    backgroundColor: selectedCategories.includes(item.id)
                        ? COLORS.primary
                        : 'transparent',
                    padding: 10,
                    marginVertical: 5,
                    borderColor: COLORS.primary,
                    borderWidth: 1.3,
                    borderRadius: 24,
                    marginRight: 12,
                }}
                onPress={() => toggleCategory(item.id)}
            >
                <Text
                    style={{
                        color: selectedCategories.includes(item.id)
                            ? COLORS.white
                            : COLORS.primary,
                    }}
                >
                    {item.name}
                </Text>
            </TouchableOpacity>
        )

        // Toggle category selection
        const toggleCategory = (categoryId) => {
            const updatedCategories = [...selectedCategories]
            const index = updatedCategories.indexOf(categoryId)

            if (index === -1) {
                updatedCategories.push(categoryId)
            } else {
                updatedCategories.splice(index, 1)
            }

            setSelectedCategories(updatedCategories)
        }

        return (
            <View>
                <SectionHeader
                    title="Popular Event"
                    subtitle="See All"
                    onPress={() => navigation.navigate('PopularEvents')}
                />
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    renderItem={renderCategoryItem}
                />
                <View
                    style={{
                        backgroundColor: COLORS.secondaryWhite,
                        marginVertical: 16,
                    }}
                >
                    <FlatList
                        data={filteredEvents}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        columnWrapperStyle={{ gap: 16 }}
                        renderItem={({ item }) => {
                            return (
                                <VerticalEventCard
                                    name={item.name}
                                    image={item.image}
                                    startTime={item.startTime}
                                    endTime={item.endTime}
                                    date={item.date}
                                    location={item.location}
                                    isFree={item.isFree}
                                    onPress={() =>
                                        navigation.navigate('EventDetails')
                                    }
                                />
                            )
                        }}
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
                    {/* {renderSearchBar()} */}
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
    bannerDiscountNum: {
        fontSize: 46,
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
        fontSize: 16, // Aumenta el tamaño del texto del nivel
    },
    progressBar: {
        height: 24, // Aumenta la altura de la barra de progreso
        width: 200, // Mantén el mismo ancho de la barra de progreso
        backgroundColor: COLORS.greyscale300,
        borderRadius: 12, // Ajusta el radio de borde para que coincida con la altura
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
        textDecorationLine: 'line-through', // Tachado
        // Otros estilos adicionales para misiones completadas
    },
})

export default Inicio
