import React, { useState, useEffect, useRef } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Animated,
    Alert,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { COLORS } from '../../../constants'

const sobreImage = require('../../assets/images/sobre.jpg')

const Sobres = ({ navigation }) => {
    const [selectedSobre, setSelectedSobre] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [userId, setUserId] = useState(null)
    const [cartaURL, setCartaURL] = useState(null)
    const [sobresDisponibles, setSobresDisponibles] = useState([])

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
    }, [])

    const card1Scale = useRef(new Animated.Value(1)).current
    const card2Scale = useRef(new Animated.Value(1)).current

    useEffect(() => {
        fetchSobres()
    }, [userId])

    const fetchSobres = async () => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/sobresUsuario.php?id=${userId}`
            )
            const data = await response.json()
            const sobresConCantidad = data.filter((sobre) => sobre.cantidad > 0)
            setSobresDisponibles(sobresConCantidad)
            setIsLoading(false)
        } catch (error) {
            console.error('Error fetching sobres:', error)
            setIsLoading(false)
        }
    }

    const handleSobreClick = async (tipo) => {
        const sobre = sobresDisponibles.find((sobre) => sobre.tipo === tipo)
        if (!sobre || sobre.cantidad === 0) {
            Alert.alert(
                '¡No tienes este sobre!',
                `No tienes suficientes sobres del tipo ${tipo}.`
            )
            return
        }

        setSelectedSobre(tipo)
        animateCard(tipo === 1 ? card1Scale : card2Scale)

        try {
            const response = await fetch(
                'https://momdel.es/animeWorld/api/abrirSobre.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        tipo: tipo,
                        userId: userId,
                    }),
                }
            )
            const data = await response.json()
            if (data.carta) {
                setCartaURL(data.carta)
            } else {
                // Manejar el caso donde no se recibe la URL de la carta
                console.error(
                    'No se recibió la URL de la carta en la respuesta.'
                )
            }
        } catch (error) {
            console.error('Error fetching imágenes:', error)
        }
    }

    const animateCard = (scaleRef) => {
        Animated.sequence([
            Animated.timing(scaleRef, {
                toValue: 1.3,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(scaleRef, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start()
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Sobres Disponibles</Text>
            </View>

            <View style={styles.cardsContainer}>
                <TouchableOpacity onPress={() => handleSobreClick(1)}>
                    <Animated.Image
                        source={sobreImage}
                        style={[
                            styles.sobreImage,
                            {
                                transform: [
                                    {
                                        scale:
                                            selectedSobre === 1
                                                ? card1Scale
                                                : 1,
                                    },
                                ],
                                borderColor: 'rgba(128, 128, 128, 0.5)',
                            },
                        ]}
                    />
                    <View style={styles.sobreOverlay}>
                        <Text style={styles.sobreText}>
                            {isLoading
                                ? 'Cargando...'
                                : sobresDisponibles.find(
                                      (sobre) => sobre.tipo === 1
                                  )?.cantidad || 0}
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleSobreClick(2)}>
                    <Animated.Image
                        source={sobreImage}
                        style={[
                            styles.sobreImage,
                            {
                                transform: [
                                    {
                                        scale:
                                            selectedSobre === 2
                                                ? card2Scale
                                                : 1,
                                    },
                                ],
                                borderColor: 'rgba(128, 128, 128, 0.5)',
                            },
                        ]}
                    />
                    <View style={styles.sobreOverlay}>
                        <Text style={styles.sobreText}>
                            {isLoading
                                ? 'Cargando...'
                                : sobresDisponibles.find(
                                      (sobre) => sobre.tipo === 2
                                  )?.cantidad || 0}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            {cartaURL && (
                <View style={styles.cartaContainer}>
                    <Image
                        source={{
                            uri: `https://momdel.es/animeWorld/DOCS/cartas/${cartaURL}`,
                        }}
                        style={styles.cartaImage}
                    />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(192, 192, 192, 0.1)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
    },
    cardsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 20,
        marginHorizontal: -10, // Añade un margen negativo para compensar el margen interno
    },
    sobreImage: {
        width: 170,
        height: 300,
        marginBottom: 10,
        marginHorizontal: 10, // Aplica un margen horizontal para separar las imágenes
    },
    sobreOverlay: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 5,
        marginRight: 15,
    },
    sobreText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    cartaContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    cartaImage: {
        width: 100,
        height: 150,
    },
})

export default Sobres
