import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    ScrollView,
    TouchableOpacity,
} from 'react-native'
import { COLORS, icons } from '../../constants'

const JuegosQuePrefieres = ({ navigation }) => {
    return (
        <>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.headerTitle}>
                    Elige tema del Que Prefieres:
                </Text>
                <View style={styles.containerJuegos}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('QuePrefieresPersonajes')}
                    >
                        <View style={styles.juegosAbajo}>
                            <ImageBackground
                                source={require('../../assets/images/personajes.png')}
                                style={styles.backgroundImage}
                                resizeMode="cover"
                            >
                                <View style={styles.containerContent}>
                                    <Text style={styles.containerTitle}>
                                        PERSONAJES
                                    </Text>
                                </View>
                            </ImageBackground>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('QuePrefieresSeries')}
                    >
                        <View style={styles.juegosAbajo}>
                            <ImageBackground
                                source={require('../../assets/images/series.jpeg')}
                                style={styles.backgroundImage}
                                resizeMode="cover"
                            >
                                <View style={styles.containerContent}>
                                    <Text style={styles.containerTitle}>
                                        SERIES
                                    </Text>
                                </View>
                            </ImageBackground>
                        </View>
                    </TouchableOpacity>
                </View>
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
    container: {
        flex: 1,
        backgroundColor: 'rgba(192, 192, 192, 0.1)',
        width: 200,
    },
    personajeContainer: {
        width: 350, 
        marginBottom: 20,
        borderRadius: 15,
        overflow: 'hidden',
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
    headerContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 50,
        marginBottom: 50,
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
        marginBottom: 20,
    },
    containerJuegos: {
        flexDirection: 'row',
        justifyContent: 'center', // Center los dos juegos horizontalmente
        alignItems: 'center', // Center los dos juegos verticalmente
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    juegosAbajo: {
        width: 180, // Ancho reducido para dejar espacio en los lados
        borderRadius: 15,
        overflow: 'hidden',
        marginHorizontal: 5, 
        height: 250, // Aumento de la altura
    },
})

export default JuegosQuePrefieres
