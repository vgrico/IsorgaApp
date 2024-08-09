import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ImageBackground,
    ScrollView,
} from 'react-native';
import { COLORS, icons } from '../../../constants';

const RankingQuePersonajePrefieres = ({ navigation }) => {
    const [personajes, setPersonajes] = useState([]);

    useEffect(() => {
        fetchPersonajes();
    }, []);

    const fetchPersonajes = async () => {
        try {
            const response = await fetch(
                'https://momdel.es/animeWorld/api/personajesMasVotadosQuePrefieres.php'
            );
            const data = await response.json();
            setPersonajes(data);
        } catch (error) {
            console.error('Error fetching personajes:', error);
        }
    };

    return (
        <>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={icons.back}
                        resizeMode="contain"
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Personajes más Votados</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {personajes.map((personaje, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => {
                            /* Aquí puedes manejar la navegación al detalle del personaje */
                        }}
                        style={styles.rankingItem}
                    >
                        <Text style={styles.rankNumber}>{index + 1}</Text>
                        <View style={styles.personajeContainer}>
                            <ImageBackground
                                source={{
                                    uri: `https://momdel.es/animeWorld/DOCS/${personaje.imagen}`,
                                }}
                                style={styles.backgroundImage}
                                resizeMode="cover"
                            >
                                <View style={styles.overlay} />
                                <View style={styles.containerContent}>
                                    <Text style={styles.containerTitle}>
                                        {personaje.nombre}
                                    </Text>
                                    <Text style={styles.containerText}>
                                        Cantidad de Votos: {personaje.cantidad}
                                    </Text>
                                </View>
                            </ImageBackground>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
        paddingBottom: 50,
        paddingHorizontal: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 50,
        marginBottom: 20,
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
    rankingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        backgroundColor: COLORS.white,
    },
    rankNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginHorizontal: 10,
    },
    personajeContainer: {
        flex: 1,
        borderRadius: 15,
        overflow: 'hidden',
    },
    backgroundImage: {
        width: '100%',
        height: 500,
        justifyContent: 'flex-end',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    containerContent: {
        padding: 10,
    },
    containerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
    },
    containerText: {
        fontSize: 16,
        color: 'white',
    },
});

export default RankingQuePersonajePrefieres;
