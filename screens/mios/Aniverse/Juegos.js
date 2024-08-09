import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native'
import { COLORS } from '../../constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'

const { width } = Dimensions.get('window')

const Juegos = ({ navigation }) => {
    const [isFocused, setIsFocused] = useState(false)

    const [personajes, setJuegos] = useState([])
    const [juegoSemanal, setJuegosSemanal] = useState([])
    const [userId, setUserId] = useState(null)
    const [isJuegoDiarioDisabled, setIsJuegoDiarioDisabled] = useState(false)
    const [isJuegoSemanalDisabled, setIsJuegoSemanalDisabled] = useState(false)

    useFocusEffect(
        React.useCallback(() => {
            const loadUserId = async () => {
                try {
                    const userIdFromStorage =
                        await AsyncStorage.getItem('userId')
                    setUserId(userIdFromStorage)
                } catch (error) {
                    console.error(
                        'Error loading userId from AsyncStorage:',
                        error
                    )
                }
            }
            loadUserId()
            return () => {
                setUserId(null)
            }
        }, [])
    )

    useEffect(() => {
        if (userId) {
            fetchJuego()
            fetchJuegoSemanal()
        }
    }, [userId])

    const fetchJuego = async () => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/juegoPixel.php?id=${userId}`
            )
            const data = await response.json()
            setJuegos(data)
            const hasNullAcertado = data.every((item) => item.acertado != null)
            setIsJuegoDiarioDisabled(hasNullAcertado)
        } catch (error) {
            console.error('Error fetching serie data:', error)
        }
    }

    const fetchJuegoSemanal = async () => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/juegoSemanal.php?id=${userId}`
            )
            const data = await response.json()
            setJuegosSemanal(data)
            const allDataNotNull = data.every((item) =>
                Object.values(item).every((value) => value !== null)
            )
            setIsJuegoSemanalDisabled(allDataNotNull)
        } catch (error) {
            console.error('Error fetching serie data:', error)
        }
    }

    return (
        <>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.headerTitle}>JUEGOS DE ANIVERSE</Text>

                <View style={styles.containerJuegos}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('JuegoSemanal1')}
                        disabled={isJuegoSemanalDisabled}
                    >
                        <View
                            style={[
                                styles.juegosAbajo,
                                isJuegoSemanalDisabled && { opacity: 0.5 },
                            ]}
                        >
                            <ImageBackground
                                source={require('../../assets/images/juegoSemanal.jpg')}
                                style={styles.backgroundImage}
                                resizeMode="cover"
                            >
                                <View style={styles.containerContent}>
                                    <Text style={styles.containerTitle}>
                                        1 VS 1 SEMANAL
                                    </Text>
                                </View>
                            </ImageBackground>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('JuegoPixels1')}
                        disabled={isJuegoDiarioDisabled}
                    >
                        <View
                            style={[
                                styles.juegosAbajo,
                                isJuegoDiarioDisabled && { opacity: 0.5 },
                            ]}
                        >
                            <ImageBackground
                                source={require('../../assets/images/animeQuiz.png')}
                                style={styles.backgroundImage}
                                resizeMode="cover"
                            >
                                <View style={styles.containerContent}>
                                    <Text style={styles.containerTitle}>
                                        JUEGO DIARIO
                                    </Text>
                                </View>
                            </ImageBackground>
                        </View>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.containerJuegos}>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('QuePrefieresPersonajes')
                        }
                    >
                        <View style={styles.juegosAbajo}>
                            <ImageBackground
                                source={require('../../assets/images/animeVersus.png')}
                                style={styles.backgroundImage}
                                resizeMode="cover"
                            >
                                <View style={styles.containerContent}>
                                    <Text style={styles.containerTitle}>
                                        ¿Qué Personaje Prefieres?
                                    </Text>
                                </View>
                            </ImageBackground>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('JuegoPreguntas')}
                    >
                        <View style={styles.juegosAbajo}>
                            <ImageBackground
                                source={require('../../assets/images/imagenQuiz.jpeg')}
                                style={styles.backgroundImage}
                                resizeMode="cover"
                            >
                                <View style={styles.containerContent}>
                                    <Text style={styles.containerTitle}>
                                        QUIZ
                                    </Text>
                                </View>
                            </ImageBackground>
                        </View>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={() => navigation.navigate('JuegoMundialDeCartas')}
                >
                    <View style={styles.personajeContainer}>
                        <ImageBackground
                            source={require('../../assets/images/anime1vs1.png')}
                            style={styles.backgroundImage}
                            resizeMode="cover"
                        >
                            <View style={styles.containerContent}>
                                <Text style={styles.containerTitle}>
                                    JUEGO CARTAS MUNDIAL
                                </Text>
                            </View>
                        </ImageBackground>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(192, 192, 192, 0.1)',
        paddingBottom: 50,
    },
    personajeContainer: {
        width: width * 0.9,
        marginBottom: 20,
        borderRadius: 15,
        overflow: 'hidden',
        height: 150,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerContent: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 20,
        textAlign: 'center',
    },
    containerJuegos: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width * 0.9,
        marginBottom: 20,
    },
    juegosAbajo: {
        width: (width * 0.9 - 20) / 2,
        borderRadius: 15,
        overflow: 'hidden',
        height: 150,
    },
})

export default Juegos
