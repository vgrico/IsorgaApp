import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ImageBackground,
    ScrollView, // Importa ScrollView desde react-native
} from 'react-native';
import { COLORS, icons } from '../../../constants';

const RankingQueSeriePrefieres = ({ navigation }) => {
    const [personajes, setPersonajes] = useState([]);

    useEffect(() => {
        fetchPersonajes();
    }, []);

    const fetchPersonajes = async () => {
        try {
            const response = await fetch(
                'https://momdel.es/animeWorld/api/seriesMasVotadasQuePrefieres.php'
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
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image
                            source={icons.back}
                            resizeMode="contain"
                            style={[styles.backIcon, { tintColor: COLORS.greyscale900 }]}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: COLORS.greyscale900 }]}>
                        Series más Votadas
                    </Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {personajes.map((personaje, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => {
                            /* Aquí puedes manejar la navegación al detalle del personaje */
                        }}
                    >
                        <View style={styles.personajeContainer}>
                            <ImageBackground
                                source={{
                                    uri: `https://momdel.es/animeWorld/DOCS/${personaje.imagen}`,
                                }}
                                style={styles.backgroundImage}
                                resizeMode="cover"
                            >
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
        width: 350, // Ajusta según tus necesidades
        marginBottom: 20,
        borderRadius: 15,
        overflow: 'hidden',
    },
    backgroundImage: {
        width: '100%',
        height: 150,
        justifyContent: 'flex-end',
    },
    containerContent: {
        padding: 10,
    },
    containerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    containerText: {
        fontSize: 14,
        color: 'white',
    },
    headerContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 50,
        marginBottom: 50
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
});

export default RankingQueSeriePrefieres;
