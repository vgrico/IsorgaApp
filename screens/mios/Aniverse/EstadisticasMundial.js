import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

const EstadisticasMundial = () => {
    const [cartaMasUtilizada, setCartaMasUtilizada] = useState(null);
    const [alineacionMasUtilizada, setAlineacionMasUtilizada] = useState(null);
    const [cartaMasUtilizadaGanando, setCartaMasUtilizadaGanando] = useState(null);
    const [cartaMasPerdidas, setCartaMasPerdidas] = useState(null);
    const [rachaVictorias, setRachaVictorias] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const loadUserId = async () => {
            try {
                const userIdFromStorage = await AsyncStorage.getItem('userId');
                setUserId(userIdFromStorage);
            } catch (error) {
                console.error('Error loading userId from AsyncStorage:', error);
            }
        };

        loadUserId();
    }, []);

    useEffect(() => {
        if (userId) {
            const fetchEstadisticas = async () => {
                try {
                    const fetchData = async (endpoint) => {
                        const response = await fetch(`https://momdel.es/animeWorld/api/${endpoint}.php?id=${userId}`);
                        const data = await response.json();
                        return data[0];
                    };

                    const [
                        dataCartaMasUtilizada,
                        dataAlineacionMasUtilizada,
                        dataCartaMasUtilizadaGanando,
                        dataCartaMasPerdidas,
                        dataRachaVictorias,
                    ] = await Promise.all([
                        fetchData('cartaMasUtilizada'),
                        fetchData('alineacionMasUtilizada'),
                        fetchData('cartaMasUtilizadaGanando'),
                        fetchData('cartaMasPerdidas'),
                        fetchData('estadisticasJuegoMundialVictoriasSeguidas'), // Nueva llamada a la API
                    ]);

                    setCartaMasUtilizada(dataCartaMasUtilizada);
                    setAlineacionMasUtilizada(dataAlineacionMasUtilizada);
                    setCartaMasUtilizadaGanando(dataCartaMasUtilizadaGanando);
                    setCartaMasPerdidas(dataCartaMasPerdidas);
                    setRachaVictorias(dataRachaVictorias); // Establecer el estado de la racha de victorias

                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setLoading(false);
                }
            };

            fetchEstadisticas();
        }
    }, [userId]);

    const renderCard = (carta) => (
        <Image
            source={{ uri: `https://momdel.es/animeWorld/DOCS/cartas/${carta}` }}
            style={styles.cardImage}
        />
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Estadísticas de Juego</Text>
                <View style={styles.cardContainer}>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Carta Más Utilizada</Text>
                        {cartaMasUtilizada && (
                            <>
                                {renderCard(cartaMasUtilizada.carta)}
                                <Text style={styles.cardText}>Veces Jugadas: {cartaMasUtilizada.veces_jugada}</Text>
                            </>
                        )}
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Carta Más Utilizada Ganando</Text>
                        {cartaMasUtilizadaGanando && (
                            <>
                                {renderCard(cartaMasUtilizadaGanando.carta)}
                                <Text style={styles.cardText}>Veces Jugada Ganando: {cartaMasUtilizadaGanando.veces_jugada}</Text>
                            </>
                        )}
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Alineación Más Utilizada</Text>
                        {alineacionMasUtilizada && (
                            <>
                                <View style={styles.alineacionContainer}>
                                    {renderCard(alineacionMasUtilizada.carta1)}
                                    {renderCard(alineacionMasUtilizada.carta2)}
                                    {renderCard(alineacionMasUtilizada.carta3)}
                                </View>
                                <Text style={styles.cardText}>Veces Jugada: {alineacionMasUtilizada.veces_jugadas}</Text>
                            </>
                        )}
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Carta Contra la Que Más Has Perdido</Text>
                        {cartaMasPerdidas && (
                            <>
                                {renderCard(cartaMasPerdidas.carta)}
                                <Text style={styles.cardText}>Veces Perdida: {cartaMasPerdidas.veces_perdida}</Text>
                            </>
                        )}
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Racha Más Larga de Victorias Consecutivas</Text>
                        {rachaVictorias && (
                            <>
                                <Text style={styles.cardText}>Victorias Consecutivas: {rachaVictorias.consecutive_count}</Text>
                            </>
                        )}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5',
        paddingVertical: 20,
    },
    container: {
        flex: 1,
        width: '100%',
        padding: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#000000',
        marginTop: 20,
    },
    cardContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 20,
        width: screenWidth - 40,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
        alignItems: 'center',
        borderLeftWidth: 5,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333333',
        textAlign: 'center',
    },
    cardText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#333333',
        marginTop: 10,
    },
    alineacionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 15,
    },
    cardImage: {
        width: screenWidth / 3 - 40,
        height: 150,
        resizeMode: 'cover',
        borderRadius: 15,
        marginVertical: 10,
        borderColor: '#3b5998',
        borderWidth: 2,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default EstadisticasMundial;
