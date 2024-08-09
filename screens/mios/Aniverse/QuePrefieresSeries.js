import React, { useState, useEffect, useRef } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Animated,
} from 'react-native'
import SectionHeader from '../../../components/SectionHeader'
import { COLORS } from '../../../constants'
import AsyncStorage from '@react-native-async-storage/async-storage'

const QuePrefieresSeries = ({navigation}) => {
    const [personajes, setPersonajes] = useState({})
    const [selectedId, setSelectedId] = useState(null)

    const card1Scale = useRef(new Animated.Value(1)).current
    const card2Scale = useRef(new Animated.Value(1)).current
    const [userId, setUserId] = useState(null)


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
        fetchPersonajes()
    }, [])

    const fetchPersonajes = async () => {
        try {
            const response = await fetch(
                'https://momdel.es/animeWorld/api/queSeriePrefieres.php'
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
                `https://momdel.es/animeWorld/api/queSeriePrefieres.php?id=${id}`
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

    const navigateToRankings = () => {
        // Aquí deberías escribir el código para navegar a la página de Rankings
        console.log('Navigating to Rankings...')
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>¿Qué serie          prefieres?</Text>
                {/* <TouchableOpacity style={styles.rankingsButton} onPress={navigateToRankings}> */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('RankingQueSeriePrefieres')}
                >
                    <Text style={styles.rankingsButtonText}>Rankings</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.cardsContainer}>
                <TouchableOpacity
                    onPress={() => handlePersonajeClick(personajes.id1)}
                >
                    <Animated.View
                        style={[
                            styles.card,
                            {
                                transform: [
                                    {
                                        scale:
                                            selectedId === personajes.id1
                                                ? card1Scale
                                                : 1,
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
                <TouchableOpacity
                    onPress={() => handlePersonajeClick(personajes.id2)}
                >
                    <Animated.View
                        style={[
                            styles.card,
                            {
                                transform: [
                                    {
                                        scale:
                                            selectedId === personajes.id2
                                                ? card2Scale
                                                : 1,
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    rankingsButton: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    rankingsButtonText: {
        fontSize: 18,
        fontFamily: 'bold',
        color: COLORS.primary,
    },
})

export default QuePrefieresSeries
