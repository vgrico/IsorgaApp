import React, { useRef, useState, useEffect } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    ImageBackground,
    FlatList,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage' // Importa AsyncStorage desde el paquete correcto
import { StatusBar } from 'expo-status-bar'
import { ScrollView } from 'react-native-virtualized-view'
import { COLORS, SIZES, icons, images } from '../../../constants'
import Button from '../../../components/Button'
import RBSheet from 'react-native-raw-bottom-sheet'
import { LinearGradient } from 'expo-linear-gradient'
import ComentariosCard from '../../../components/mios/ComentariosCard'
import CarruselImagenes from '../../../components/mios/CarruselImagenes'
import { FontAwesome } from '@expo/vector-icons'

const DetallesSeries = ({ navigation, route }) => {
    const { id } = route.params
    const refRBSheet = useRef()
    const [serieData, setSerieData] = useState(null)
    const [comentarioData, setComentarioData] = useState(null)
    const [mediaEstrellas, setMediaEstrellas] = useState(null)
    const [mediaNotas, setMediaNotas] = useState(null)
    const [serieFavorita, setSerieFavorita] = useState(null)

    const [resultsCount, setResultsCount] = useState(0)
    const [personajes, setPersonajes] = useState([])
    const [userId, setUserId] = useState(null) // Estado para almacenar el ID recuperado de AsyncStorage
    const [selectedCategory, setSelectedCategory] = useState('Quiero verla') // Categoría seleccionada
    const [selectedFacilities, setSelectedFacilities] = useState([])
    const [selectedChapter, setSelectedChapter] = useState(1) // Capítulo seleccionado
    const [nCapitulos, setNCapitulos] = useState(0) // Número total de capítulos
    const [selectedNota, setSelectedNota] = useState(1) // Nota seleccionada (1 por defecto)

    // Cargar el ID de AsyncStorage cuando el componente se monte
    useEffect(() => {
        const loadUserId = async () => {
            try {
                const userIdFromStorage = await AsyncStorage.getItem('userId')
                setUserId(userIdFromStorage)
            } catch (error) {
                console.error('Error loading userId from AsyncStorage:', error)
            }
        }

        loadUserId()
        fetchSerieData()
    }, [])

    const fetchSerieData = async () => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/detallesSerie.php?id=${id}`
            )
            const data = await response.json()
            setSerieData(data)
            setNCapitulos(data && data.length > 0 ? data[0].n_capitulos : 0)
        } catch (error) {
            console.error('Error fetching serie data:', error)
        }
    }

    const fetchUltimoComentario = async () => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/detallesComentario.php?id=${id}`
            )
            const data = await response.json()
            setComentarioData(data)
            setResultsCount(data.length)
        } catch (error) {
            console.error('Error fetching serie data:', error)
        }
    }

    const fetchMediaEstrellas = async () => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/mediaEstrellasComentarios.php?id=${id}`
            )
            const data = await response.json()
            setMediaEstrellas(data)
        } catch (error) {
            console.error('Error fetching serie data:', error)
        }
    }

    const fetchMediaNota = async () => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/mediaSerieUnica.php?id=${id}`
            )
            const data = await response.json()
            setMediaNotas(data)
        } catch (error) {
            console.error('Error fetching serie data:', error)
        }
    }

    const fetchSerieFavorita = async () => {
        try {
            const response = await fetch(
                'https://momdel.es/animeWorld/api/seriesFavoritas.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idUsuario: userId,
                        serie:
                            serieData &&
                            serieData.length > 0 &&
                            serieData[0].id,
                    }),
                }
            )
            const data = await response.json()
            console.log(data) // Agrega este console.log para verificar los datos recibidos
            // Si la respuesta contiene datos, la serie está marcada como favorita
            setSerieFavorita(data.success && data.isFavorite)
        } catch (error) {
            console.error('Error fetching favorite status:', error)
        }
    }

    const toggleFavorite = async () => {
        try {
            const response = await fetch(
                'https://momdel.es/animeWorld/api/cambiarSeriesFavoritas.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idUsuario: userId,
                        serie:
                            serieData &&
                            serieData.length > 0 &&
                            serieData[0].id,
                    }),
                }
            )
            const data = await response.json()
            // Si la serie ya estaba marcada como favorita, ahora se ha eliminado
            setSerieFavorita(!serieFavorita)
        } catch (error) {
            console.error('Error toggling favorite:', error)
        }
    }

    const fetchPersonajesSerie = async () => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/personajesSerie.php?id=${id}`
            )
            const data = await response.json()
            // Filtrar las imágenes nulas
            const filteredData = data.filter((item) => item.imagen)
            setPersonajes(filteredData)
        } catch (error) {
            console.error('Error fetching serie data:', error)
        }
    }

    // Llama a fetchSerieData cuando el componente se monta
    useEffect(() => {
        fetchSerieFavorita()
        fetchPersonajesSerie()
        fetchUltimoComentario()
        fetchMediaEstrellas()
        fetchMediaNota()
    }, [serieData])

    const handleAddToList = () => {
        refRBSheet.current.open()
    }

    // Slider images
    const sliderImages = [
        serieData && serieData.length > 0 && serieData[0].imagen1,
    ]

    //MODAL
    // Toggle category selection
    const toggleCategory = (category) => {
        setSelectedCategory(category)
        // Establecer el capítulo seleccionado según la categoría
        switch (category) {
            case 'Quiero verla':
                setSelectedChapter(0) // Capítulo 0 para "Quiero verla"
                break
            case 'Viéndola':
                setSelectedChapter(1) // Capítulo 1 para "Viéndola"
                break
            case 'Acabada':
                setSelectedChapter(nCapitulos) // Último capítulo para "Acabada"
                break
            default:
                break
        }
    }

    const renderChapterItem = ({ item }) => (
        <TouchableOpacity
            style={{
                backgroundColor:
                    selectedCategory === 'Quiero verla' ||
                    selectedCategory === 'Acabada'
                        ? COLORS.lightGray
                        : selectedChapter === item
                          ? COLORS.primary
                          : 'transparent',
                padding: 10,
                marginVertical: 5,
                borderColor: COLORS.primary,
                borderWidth: 1.3,
                borderRadius: 24,
                marginRight: 12,
            }}
            onPress={() => setSelectedChapter(item)}
            disabled={
                selectedCategory === 'Quiero verla' ||
                selectedCategory === 'Acabada'
            }
        >
            <Text
                style={{
                    color:
                        selectedCategory === 'Quiero verla' ||
                        selectedCategory === 'Acabada'
                            ? COLORS.primary
                            : selectedChapter === item
                              ? COLORS.white
                              : COLORS.primary,
                }}
            >
                {item}
            </Text>
        </TouchableOpacity>
    )

    // Function to toggle selected nota
    const toggleNota = (nota) => {
        setSelectedNota(nota)
    }

    const toggleChapter = (chapter) => {
        setSelectedChapter(chapter)
    }

    // Function to handle filter button press
    const handleFilterPress = async () => {
        try {
            const selectedCategoryValue = categoriasValues[selectedCategory]

            if (!userId || !serieData || serieData.length === 0) {
                throw new Error('Missing user ID or series data')
            }

            const response = await fetch(
                'https://momdel.es/animeWorld/api/guardarProgresoSerie.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idUsuario: userId,
                        serie: serieData[0].id,
                        capitulo: selectedChapter,
                        nota: selectedNota,
                        categoria: selectedCategoryValue,
                    }),
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit review.')
            }

            let experiencia = 0

            switch (selectedCategoryValue) {
                case 1:
                    experiencia = 25
                    break
                case 2:
                    experiencia = 35
                    break
                case 3:
                    experiencia = 50
                    break
                default:
                    experiencia = 0
                    break
            }

            const response2 = await fetch(
                'https://momdel.es/animeWorld/api/calculoNivel.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: userId,
                        puntos: experiencia,
                    }),
                }
            )
            refRBSheet.current.close()

            // Aquí puedes manejar la respuesta del segundo fetch si es necesario
        } catch (error) {
            console.error('Error submitting review:', error)
            setErrorMessage(
                'Failed to submit your review. Please try again later.'
            )
        }
    }

    const renderNotaItem = (nota) => (
        <TouchableOpacity
            style={{
                backgroundColor:
                    selectedNota === nota ? COLORS.primary : 'transparent',
                padding: 10,
                marginVertical: 5,
                borderColor: COLORS.primary,
                borderWidth: 1.3,
                borderRadius: 24,
                marginRight: 12,
                flexDirection: 'row', // Agrega dirección de fila para alinear el icono y el texto
                alignItems: 'center', // Alinea verticalmente el icono y el texto
            }}
            onPress={() => {
                toggleNota(nota)
                console.log('Nota seleccionada:', nota) // Imprimir la nota seleccionada
            }}
        >
            {/* Icono de estrella */}
            <FontAwesome
                name="star"
                size={20}
                color={selectedNota === nota ? COLORS.white : COLORS.primary}
                style={{ marginRight: 5 }} // Espacio entre el icono y el texto
            />
            <Text
                style={{
                    color:
                        selectedNota === nota ? COLORS.white : COLORS.primary,
                }}
            >
                {nota}
            </Text>
        </TouchableOpacity>
    )

    const renderFacilitiesItem = () => (
        <FlatList
            data={Array.from({ length: 10 }, (_, i) => i + 1)} // Crear una lista de números del 1 al 10
            keyExtractor={(item) => item.toString()}
            showsHorizontalScrollIndicator={false}
            horizontal
            renderItem={({ item }) => renderNotaItem(item)}
        />
    )

    // Category item
    const renderCategoryItem = ({ item }) => (
        <TouchableOpacity
            style={{
                backgroundColor:
                    selectedCategory === item ? COLORS.primary : 'transparent',
                padding: 10,
                marginVertical: 5,
                borderColor: COLORS.primary,
                borderWidth: 1.3,
                borderRadius: 24,
                marginRight: 12,
            }}
            onPress={() => toggleCategory(item)}
        >
            <Text
                style={{
                    color:
                        selectedCategory === item
                            ? COLORS.white
                            : COLORS.primary,
                }}
            >
                {item}
            </Text>
        </TouchableOpacity>
    )

    const categoriasValues = {
        'Quiero verla': 1,
        Viéndola: 2,
        Acabada: 3,
    }

    // render header
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
            </View>
        )
    }

    /**
     * render content
     */
    const renderContent = () => {
        const [isFollowed, setIsFollowed] = useState(false)
        const [expanded, setExpanded] = useState(false)

        const toggleExpanded = () => {
            setExpanded(!expanded)
        }

        return (
            <View style={styles.contentContainer}>
                <Text
                    style={[
                        styles.eventName,
                        {
                            color: COLORS.greyscale900,
                        },
                    ]}
                >
                    {serieData && serieData.length > 0 && serieData[0].nombre}
                </Text>
                <View style={styles.eventDescContainer}>
                    <View style={styles.eventCategoryContainer}>
                        <Text style={styles.eventCategory}>
                            {serieData &&
                                serieData.length > 0 &&
                                serieData[0].tipo}
                        </Text>
                    </View>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{
                                uri: `https://momdel.es/animeWorld/DOCS/${serieData && serieData.length > 0 && serieData[0].imagen2}`,
                            }}
                            resizeMode="contain"
                            style={styles.avatar}
                        />
                        <Image
                            source={{
                                uri: `https://momdel.es/animeWorld/DOCS/${serieData && serieData.length > 0 && serieData[0].imagen3}`,
                            }}
                            resizeMode="contain"
                            style={styles.avatar}
                        />
                    </View>
                    {/* <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('EventDetailsPeopleGoing')
                        }
                        style={styles.attenderContainer}
                    >
                        <Text
                            style={[
                                styles.numAttenders,
                                {
                                    color: COLORS.greyscale900,
                                },
                            ]}
                        >
                            {serieData &&
                                serieData.length > 0 &&
                                serieData[0].arcos}{' '}
                            arcos
                        </Text>
                        <Image
                            source={icons.rightArrow}
                            resizeMode="contain"
                            style={[
                                styles.arrowRightIcon,
                                {
                                    tintColor: COLORS.greyscale900,
                                },
                            ]}
                        />
                    </TouchableOpacity> */}
                </View>
                <View
                    style={[
                        styles.separateLine,
                        {
                            marginVertical: 12,
                            height: 1,
                            backgroundColor: COLORS.grayscale100,
                        },
                    ]}
                />
                <View style={styles.eventFeatureContainer}>
                    <View style={styles.eventFeatureIconContainer}>
                        <Image
                            source={icons.star}
                            resizeMode="contain"
                            style={styles.eventFeatureIcon}
                        />
                    </View>
                    <View style={styles.eventFeatureTextContainer}>
                        <Text
                            style={[
                                styles.eventDate,
                                {
                                    color: COLORS.greyscale900,
                                },
                            ]}
                        >
                            {mediaNotas &&
                                mediaNotas.length > 0 &&
                                mediaNotas[0].media}{' '}
                            (NOTA MEDIA)
                        </Text>
                    </View>
                </View>
                <View
                    style={[
                        styles.eventFeatureContainer,
                        { marginVertical: 12 },
                    ]}
                >
                    <View style={styles.eventFeatureIconContainer}>
                        <Image
                            source={icons.calendar3}
                            resizeMode="contain"
                            style={styles.eventFeatureIcon}
                        />
                    </View>
                    <View style={styles.eventFeatureTextContainer}>
                        <Text
                            style={[
                                styles.eventDate,
                                {
                                    color: COLORS.greyscale900,
                                },
                            ]}
                        >
                                {serieData &&
                                serieData.length > 0 &&
                                serieData[0].añopublic}
                        </Text>
                    </View>
                </View>

                <View
                    style={[
                        styles.separateLine,
                        {
                            marginVertical: 6,
                            height: 1,
                            backgroundColor: COLORS.grayscale100,
                        },
                    ]}
                />

                <View style={styles.userInfoContainer}>
                    <View style={styles.userInfoLeftContainer}>
                        <TouchableOpacity
                            
                        >
                            <Image
                                source={{
                                    uri: `https://momdel.es/animeWorld/DOCS/${serieData && serieData.length > 0 && serieData[0].imagenCreador}`,
                                }}
                                resizeMode="cover"
                                style={styles.userImage}
                            />
                        </TouchableOpacity>
                        <View style={{ marginLeft: 12 }}>
                            <Text
                                style={[
                                    styles.userName,
                                    {
                                        color: COLORS.black,
                                    },
                                ]}
                            >
                                {serieData &&
                                    serieData.length > 0 &&
                                    serieData[0].nombreCreador}
                            </Text>
                            <Text
                                style={[
                                    styles.userPosition,
                                    {
                                        color: COLORS.grayscale700,
                                    },
                                ]}
                            >
                                Creador
                            </Text>
                        </View>
                    </View>
                    {/* <View style={styles.userInfoRightContainer}>
                        <TouchableOpacity
                            onPress={() => setIsFollowed(!isFollowed)}
                            style={[
                                styles.followBtn,
                                {
                                    backgroundColor: isFollowed
                                        ? COLORS.white
                                        : COLORS.primary,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.followBtnText,
                                    {
                                        color: isFollowed
                                            ? COLORS.primary
                                            : COLORS.white,
                                    },
                                ]}
                            >
                                Ver
                            </Text>
                        </TouchableOpacity>
                    </View> */}
                </View>

                <Text
                    style={[
                        styles.viewSubtitle,
                        {
                            color: COLORS.greyscale900,
                        },
                    ]}
                >
                    Descripcion de la serie
                </Text>
                <Text
                    style={[
                        styles.description,
                        {
                            color: COLORS.grayscale700,
                        },
                    ]}
                    numberOfLines={expanded ? undefined : 2}
                >
                    {serieData &&
                        serieData.length > 0 &&
                        serieData[0].descripcion}
                </Text>
                <TouchableOpacity onPress={toggleExpanded}>
                    <Text style={styles.viewBtn}>
                        {expanded ? 'View Less' : 'View More'}
                    </Text>
                </TouchableOpacity>

                {personajes && personajes.length > 0 && (
                    <>
                        <View style={styles.subItemContainer}>
                            <Text
                                style={[
                                    styles.viewSubtitle,
                                    {
                                        color: COLORS.greyscale900,
                                    },
                                ]}
                            >
                                Personajes
                            </Text>
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate('Galeria', { id: id })
                                }
                            >
                                <Text style={styles.seeAll}>Ver Todos</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.coverImageContainer}>
                            <Image
                                source={{
                                    uri: `https://momdel.es/animeWorld/DOCS/${personajes[0].imagen}`,
                                }}
                                resizeMode="cover"
                                style={styles.coverImage}
                            />
                            {personajes.length > 1 && (
                                <Image
                                    source={{
                                        uri: `https://momdel.es/animeWorld/DOCS/${personajes[1].imagen}`,
                                    }}
                                    resizeMode="cover"
                                    style={styles.coverImage}
                                />
                            )}
                            {personajes.length > 2 && (
                                <ImageBackground
                                    imageStyle={{ borderRadius: 16 }}
                                    style={styles.coverImage}
                                    source={{
                                        uri: `https://momdel.es/animeWorld/DOCS/${personajes[2].imagen}`,
                                    }}
                                >
                                    <LinearGradient
                                        colors={[
                                            'rgba(0,0,0,0.8)',
                                            'transparent',
                                        ]}
                                        style={styles.gradientImage}
                                    >
                                    </LinearGradient>
                                </ImageBackground>
                            )}
                        </View>
                    </>
                )}


            </View>
        )
    }

    return (
        <View
            style={[
                styles.area,
                { backgroundColor: COLORS.white, flexGrow: 5 },
            ]}
        >
            <StatusBar hidden />
            <CarruselImagenes images={sliderImages} />
            {renderHeader()}
            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {renderContent()}
            </ScrollView>
            <View
                style={[
                    styles.bookBottomContainer,
                    {
                        backgroundColor: COLORS.white,
                        borderTopColor: COLORS.white,
                    },
                ]}
            >
                <Button
                    title="Añadir a la lista"
                    filled
                    style={styles.bookingBtn}
                    onPress={handleAddToList}
                />
            </View>
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={false}
                height={500}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    },
                    draggableIcon: {
                        backgroundColor: '#000',
                    },
                    container: {
                        borderTopRightRadius: 32,
                        borderTopLeftRadius: 32,
                        height: 500,
                        backgroundColor: COLORS.white,
                        alignItems: 'center',
                    },
                }}
            >
                <Text
                    style={[
                        styles.bottomTitle,
                        {
                            color: COLORS.greyscale900,
                        },
                    ]}
                >
                    Añadir a tu lista
                </Text>
                <View style={styles.separateLine} />
                <View style={{ width: SIZES.width - 32 }}>
                    <Text
                        style={[
                            styles.sheetTitle,
                            {
                                color: COLORS.greyscale900,
                            },
                        ]}
                    >
                        Estado
                    </Text>
                    <FlatList
                        data={['Quiero verla', 'Viéndola', 'Acabada']} // Opciones de categoría
                        keyExtractor={(item) => item}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        renderItem={renderCategoryItem}
                    />

                    <Text
                        style={[
                            styles.sheetTitle,
                            {
                                color: COLORS.greyscale900,
                            },
                        ]}
                    >
                        Capitulo
                    </Text>
                    <FlatList
                        data={Array.from(
                            { length: nCapitulos },
                            (_, i) => i + 1
                        )} // Genera los números de capítulo desde 1 hasta nCapitulos
                        keyExtractor={(item) => item.toString()} // KeyExtractor espera una cadena
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        renderItem={renderChapterItem}
                    />

                    <Text
                        style={[
                            styles.sheetTitle,
                            {
                                color: COLORS.greyscale900,
                            },
                        ]}
                    >
                        Nota
                    </Text>
                    {renderFacilitiesItem()}
                </View>

                <View style={styles.separateLine} />

                <View style={styles.bottomContainer}>
                    <Button
                        title="Cancelar"
                        style={{
                            width: (SIZES.width - 32) / 2 - 8,
                            backgroundColor: COLORS.tansparentPrimary,
                            borderRadius: 32,
                            borderColor: COLORS.tansparentPrimary,
                        }}
                        textColor={COLORS.primary}
                        onPress={() => refRBSheet.current.close()}
                    />
                    <Button
                        title="Guardar"
                        filled
                        style={styles.logoutButton}
                        onPress={handleFilterPress} // Llama a la función handleFilterPress cuando se presiona el botón "Filter"
                    />
                </View>
            </RBSheet>
        </View>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    headerContainer: {
        width: SIZES.width - 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        top: 32,
        zIndex: 999,
        left: 16,
        right: 16,
    },
    backIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.white,
    },
    bookmarkIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.white,
    },
    sendIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.white,
    },
    sendIconContainer: {
        marginLeft: 8,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contentContainer: {
        marginHorizontal: 16,
    },
    estateName: {
        fontSize: 24,
        fontFamily: 'bold',
        color: COLORS.black,
        marginVertical: 6,
    },
    categoryContainer: {
        backgroundColor: COLORS.tansparentPrimary,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 6,
        borderRadius: 6,
        width: 80,
    },
    categoryName: {
        fontSize: 12,
        fontFamily: 'medium',
        color: COLORS.primary,
    },
    rating: {
        fontSize: 12,
        fontFamily: 'medium',
        color: COLORS.black,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    numReviewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 12,
    },
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12,
    },
    viewItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    viewItemIcon: {
        width: 44,
        height: 44,
        backgroundColor: COLORS.tansparentPrimary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999,
    },
    viewIcon: {
        height: 20,
        width: 20,
        tintColor: COLORS.primary,
    },
    viewTitle: {
        fontSize: 14,
        fontFamily: 'medium',
        color: COLORS.black,
        marginLeft: 12,
    },
    separateLine: {
        width: SIZES.width - 32,
        height: 1,
        backgroundColor: COLORS.grayscale100,
    },
    userInfoContainer: {
        width: SIZES.width - 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 6,
    },
    userImage: {
        width: 52,
        height: 52,
        borderRadius: 999,
    },
    userName: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.black,
    },
    userPosition: {
        fontSize: 14,
        fontFamily: 'medium',
        color: COLORS.grayscale700,
        marginTop: 3,
    },
    userInfoRightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userInfoLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chatIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.primary,
    },
    phoneIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.primary,
    },
    viewSubtitle: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        marginVertical: 12,
    },
    description: {
        fontSize: 14,
        color: COLORS.grayscale700,
        fontFamily: 'regular',
    },
    viewBtn: {
        color: COLORS.primary,
        marginTop: 5,
        fontSize: 14,
        fontFamily: 'semiBold',
    },
    subItemContainer: {
        width: SIZES.width - 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    seeAll: {
        color: COLORS.primary,
        fontSize: 14,
        fontFamily: 'semiBold',
    },
    coverImageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    coverImage: {
        width: (SIZES.width - 32) / 3 - 9,
        height: (SIZES.width - 32) / 3 - 9,
        borderRadius: 16,
        zIndex: 999,
    },
    gradientImage: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: (SIZES.width - 32) / 3 - 9,
        height: (SIZES.width - 32) / 3 - 9,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    numImage: {
        fontSize: 22,
        color: COLORS.white,
        fontFamily: 'bold',
    },
    eventItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationIcon: {
        width: 20,
        height: 20,
        tintColor: COLORS.primary,
        marginRight: 8,
    },
    locationText: {
        fontSize: 14,
        fontFamily: 'medium',
        color: COLORS.grayscale700,
    },

    locationMapContainer: {
        height: 226,
        width: '100%',
        borderRadius: 12,
        marginVertical: 16,
    },
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        borderRadius: 12,
        backgroundColor: COLORS.dark2,
    },
    viewMapContainer: {
        height: 50,
        backgroundColor: COLORS.gray,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    bubble: {
        flexDirection: 'column',
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 6,
        borderColor: '#ccc',
        borderWidth: 0.5,
        padding: 15,
        width: 'auto',
    },
    // Arrow below the bubble
    arrow: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#fff',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -32,
    },
    arrowBorder: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#007a87',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -0.5,
    },
    reviewContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: SIZES.width - 32,
        marginVertical: 16,
    },
    reviewLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starMiddleIcon: {
        height: 18,
        width: 18,
        tintColor: 'orange',
        marginRight: 8,
    },
    reviewTitle: {
        fontFamily: 'bold',
        color: COLORS.black,
        fontSize: 18,
    },
    seeAll: {
        color: COLORS.primary,
        fontFamily: 'semiBold',
        fontSize: 16,
    },
    noReviewsContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 16,
    },
    noReviewsText: {
        fontFamily: 'regular',
        color: COLORS.grayscale700,
        fontSize: 16,
        marginBottom: 8,
    },
    writeReviewButton: {
        width: 200,
        backgroundColor: COLORS.primary,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    bookBottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: SIZES.width,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 104,
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopRightRadius: 32,
        borderTopLeftRadius: 32,
        borderTopColor: COLORS.white,
        borderTopWidth: 1,
    },
    priceContainer: {
        flexDirection: 'column',
    },
    priceText: {
        fontFamily: 'regular',
        color: COLORS.grayscale700,
        fontSize: 14,
        marginBottom: 4,
    },
    priceDurationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    price: {
        fontFamily: 'bold',
        color: COLORS.primary,
        fontSize: 26,
    },
    priceDuration: {
        fontFamily: 'regular',
        color: COLORS.grayscale700,
        fontSize: 16,
    },
    bookingBtn: {
        width: SIZES.width - 32,
    },
    separateLine: {
        width: SIZES.width - 32,
        height: 1,
        backgroundColor: COLORS.grayscale200,
    },
    bottomTitle: {
        fontSize: 24,
        fontFamily: 'semiBold',
        color: COLORS.black,
        textAlign: 'center',
        marginTop: 12,
    },
    socialContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
        width: SIZES.width - 32,
    },
    eventName: {
        fontSize: 28,
        fontFamily: 'bold',
        color: COLORS.black,
        marginVertical: 12,
    },
    eventDescContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eventCategoryContainer: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderColor: COLORS.primary,
        borderWidth: 1,
        borderRadius: 6,
    },
    eventCategory: {
        fontSize: 12,
        fontFamily: 'medium',
        color: COLORS.primary,
    },
    avatarContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginLeft:100
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 999,
    },
    attenderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    numAttenders: {
        fontSize: 14,
        fontFamily: 'medium',
        color: COLORS.greyscale900,
    },
    arrowRightIcon: {
        width: 16,
        height: 16,
        tintColor: COLORS.greyscale900,
        marginHorizontal: 8,
    },
    eventFeatureContainer: {
        flexDirection: 'row',
    },
    eventFeatureIconContainer: {
        width: 58,
        height: 58,
        borderRadius: 999,
        backgroundColor: COLORS.tansparentPrimary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    eventFeatureIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.primary,
    },
    eventFeatureTextContainer: {
        marginLeft: 12,
    },
    eventDate: {
        fontSize: 18,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        marginVertical: 18,
    },
    eventTime: {
        fontSize: 12,
        fontFamily: 'regular',
        color: COLORS.greyscale700,
    },
    miniActionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        width: 180,
        height: 30,
        borderRadius: 16,
        marginTop: 12,
    },
    miniIconContainer: {
        marginRight: 8,
        marginLeft: 12,
    },
    eventFeatureMiniIcon: {
        width: 12,
        height: 12,
        tintColor: COLORS.white,
    },
    miniIconText: {
        fontSize: 14,
        color: COLORS.white,
        fontFamily: 'semiBold',
    },
    followBtn: {
        width: 96,
        height: 36,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    followBtnText: {
        fontSize: 14,
        color: COLORS.white,
        fontFamily: 'semiBold',
    },

    // Estilos para el modal
    bottomTitle: {
        fontSize: 24,
        fontFamily: 'semiBold',
        color: COLORS.black,
        textAlign: 'center',
        marginTop: 12,
    },
    separateLine: {
        height: 0.4,
        width: SIZES.width - 32,
        backgroundColor: COLORS.greyscale300,
        marginVertical: 12,
    },
    sheetTitle: {
        fontSize: 18,
        fontFamily: 'semiBold',
        color: COLORS.black,
        marginVertical: 12,
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
        paddingHorizontal: 16,
        width: SIZES.width,
    },
    cancelButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.tansparentPrimary,
        borderRadius: 32,
    },
    logoutButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.primary,
        borderRadius: 32,
    },
})

export default DetallesSeries
