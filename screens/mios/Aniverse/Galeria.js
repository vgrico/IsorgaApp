import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
} from 'react-native'
import { COLORS, SIZES, icons } from '../../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'

const Galeria = ({ navigation, route }) => {
    const [personajes, setPersonajes] = useState([])

    const { id } = route.params

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

    useEffect(() => {
        fetchPersonajesSerie()
    }, [])

    const handleImagePress = (personajeId) => {
        // Navigate to the next screen and pass the personajeId as a parameter
        navigation.navigate('NextScreen', { personajeId })
    }

    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image
                            source={icons.back}
                            resizeMode="contain"
                            style={[
                                styles.backIcon,
                                { tintColor: COLORS.greyscale900 },
                            ]}
                        />
                    </TouchableOpacity>
                    <Text
                        style={[
                            styles.headerTitle,
                            { color: COLORS.greyscale900 },
                        ]}
                    >
                        Personajes
                    </Text>
                </View>
                {/* <TouchableOpacity>
                    <Image
                        source={icons.moreCircle}
                        resizeMode="contain"
                        style={[
                            styles.moreIcon,
                            { tintColor: COLORS.greyscale900 },
                        ]}
                    />
                </TouchableOpacity> */}
            </View>
        )
    }

    const renderContent = () => {
        return (
            <View>
                <FlatList
                    data={personajes}
                    keyExtractor={(item, index) => index.toString()} // Use the index as the key
                    numColumns={3}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    style={{ marginVertical: 12 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('DetallesPersonaje', {
                                    id: item.id,
                                })
                            }
                        >
                            <Image
                                source={{
                                    uri: `https://momdel.es/animeWorld/DOCS/${item.imagen}`,
                                }}
                                resizeMode="cover"
                                style={styles.galleryImage}
                            />
                        </TouchableOpacity>
                    )}
                />
            </View>
        )
    }

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                {renderHeader()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {renderContent()}
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
        marginBottom: 0,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.black,
        marginLeft: 16,
    },
    moreIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
    },
    title: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.black,
        marginVertical: 16,
    },
    galleryImage: {
        width: (SIZES.width - 44) / 3,
        height: (SIZES.width - 44) / 3,
        borderRadius: 16,
        marginRight: 6,
        marginBottom: 12,
    },
})

export default Galeria
