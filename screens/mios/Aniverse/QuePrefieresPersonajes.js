import React, { useState, useEffect, useRef } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Animated,
} from 'react-native'
import { COLORS, SIZES, icons } from '../../../constants' // Asegúrate de ajustar la ruta a tus constantes
import AsyncStorage from '@react-native-async-storage/async-storage'

const QuePrefieresPersonajes = ({ navigation }) => {
    const [personajes, setPersonajes] = useState({})
    const [selectedId, setSelectedId] = useState(null)
    const [userId, setUserId] = useState(null)

    const card1Scale = useRef(new Animated.Value(1)).current
    const card2Scale = useRef(new Animated.Value(1)).current

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

    useEffect(() => {
        if (userId) {
            fetchPersonajes()
        }
    }, [userId])

    const fetchPersonajes = async () => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/quePersonajePrefieres.php?userId=${userId}`
            )
            const data = await response.json()
            setPersonajes(data)
        } catch (error) {
            console.error('Error fetching personajes:', error)
        }
    }

    const handlePersonajeClick = async (id) => {
        setSelectedId(id)
        animateCard(id === personajes.id1 ? card1Scale : card2Scale) // Aplicar animación al hacer clic
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/quePersonajePrefieres.php?id=${id}&userId=${userId}`
            )
            const response2 = await fetch(
                'https://momdel.es/animeWorld/api/calculoNivel.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: userId,
                        puntos: 1,
                    }),
                }
            )
            const data = await response.json()
            setPersonajes(data)
        } catch (error) {
            console.error('Error fetching personaje:', error)
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
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={icons.back}
                        resizeMode="contain"
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.header}>
                <Text style={styles.title}>¿Qué personaje prefieres?</Text>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('RankingQuePersonajePrefieres')}
                    >
                        <Text style={styles.buttonText}>Ranking Personajes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('ClasificacionQuePersonajePrefieres')}
                    >
                        <Text style={styles.buttonText}>Ranking Usuarios</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.cardsContainer}>
                <TouchableOpacity onPress={() => handlePersonajeClick(personajes.id1)}>
                    <Animated.View
                        style={[
                            styles.card,
                            {
                                transform: [
                                    {
                                        scale: selectedId === personajes.id1 ? card1Scale : 1,
                                    },
                                ],
                                borderColor: 'rgba(128, 128, 128, 0.5)',
                            },
                        ]}
                    >
                        <Image
                            source={{
                                uri: `https://momdel.es/animeWorld/DOCS/${personajes.imagen1}`,
                            }}
                            style={styles.characterImage}
                        />
                        <View style={styles.characterInfo}>
                            <Text style={styles.characterName}>
                                {personajes.nombre1}
                            </Text>
                        </View>
                    </Animated.View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePersonajeClick(personajes.id2)}>
                    <Animated.View
                        style={[
                            styles.card,
                            {
                                transform: [
                                    {
                                        scale: selectedId === personajes.id2 ? card2Scale : 1,
                                    },
                                ],
                                borderColor: 'rgba(128, 128, 128, 0.5)',
                            },
                        ]}
                    >
                        <Image
                            source={{
                                uri: `https://momdel.es/animeWorld/DOCS/${personajes.imagen2}`,
                            }}
                            style={styles.characterImage}
                        />
                        <View style={styles.characterInfo}>
                            <Text style={styles.characterName}>
                                {personajes.nombre2}
                            </Text>
                        </View>
                    </Animated.View>
                </TouchableOpacity>
            </View>
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
    headerContainer: {
        width: SIZES.width - 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        top: 50,
        zIndex: 999,
        left: 16,
        right: 16,
    },
    backIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
    },
    header: {
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 5,
        textAlign: 'center',
        marginBottom: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    cardsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    card: {
        width: 150,
        height: 250,
        backgroundColor: 'rgba(128, 128, 128, 0.3)',
        borderRadius: 15,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'flex-end',
        elevation: 5,
        marginBottom: 30,
        transform: [{ translateY: 20 }],
        borderWidth: 5,
    },
    characterImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    characterInfo: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    characterName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
})

export default QuePrefieresPersonajes
