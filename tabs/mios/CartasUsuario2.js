import { View, FlatList, StyleSheet, Image } from 'react-native'
import React, { useEffect } from 'react'
import { organizerCollections } from '../../data'
import { SIZES } from '../../constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState } from 'react'

const CartasUsuarios22 = ({ idUsuario }) => {
    const [userId, setUserId] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [cartas, setCartas] = useState([])
    const [favoritas, setFavoritas] = useState([])

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
        fetchCartas()
    }, [userId])

    const fetchCartas = async () => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/cartasUsuario.php?id=${idUsuario}`
            )
            const data = await response.json()
            const filteredData = data.filter((item) => item.carta)
            setCartas(filteredData)
            const favoritoData = data.filter((item) => item.favorito === 1)
            setFavoritas(favoritoData)

            setIsLoading(false)
        } catch (error) {
            console.error('Error fetching serie data:', error)
            setIsLoading(false)
        }
    }
    return (
        <View style={styles.container}>
            <FlatList
                data={cartas}
                keyExtractor={(item) => item.id}
                numColumns={3}
                columnWrapperStyle={{ gap: 0 }}
                style={{ marginVertical: 12 }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <Image
                        source={{
                            uri: `https://momdel.es/animeWorld/DOCS/${item.carta}`,
                        }}
                        resizeMode="cover"
                        style={styles.galleryImage}
                    />
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 16,
        marginBottom: 20,
    },
    galleryImage: {
        width: (SIZES.width - 44) / 3,
        height: (SIZES.width - 44) / 3,
        borderRadius: 16,
        marginRight: 6,
        marginBottom: 20,
    },
})

export default CartasUsuarios2
