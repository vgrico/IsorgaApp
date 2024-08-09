import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EstadisticasUsuario = () => {
    const [userId, setUserId] = useState(null);
    const [estadisticas, setEstadisticas] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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
            fetchEstadisticas();
        }
    }, [userId]);

    const fetchEstadisticas = async () => {
        try {
            const [unoVsUnoResponse, quizResponse, mundialResponse] = await Promise.all([
                fetch(`https://momdel.es/animeWorld/api/estadisticasUsuarioJuegoUnovsUno.php?id=${userId}`),
                fetch(`https://momdel.es/animeWorld/api/estadisticasUsuarioJuegoQuiz.php?id=${userId}`),
                fetch(`https://momdel.es/animeWorld/api/estadisticasUsuarioJuegoMundial.php?id=${userId}`)
            ]);

            const [unoVsUnoData, quizData, mundialData] = await Promise.all([
                unoVsUnoResponse.json(),
                quizResponse.json(),
                mundialResponse.json()
            ]);

            setEstadisticas({
                unoVsUno: unoVsUnoData[0]?.cantidad || 0,
                quizAcertadas: quizData[0]?.acertadas || 0,
                quizFalladas: quizData[0]?.falladas || 0,
                mundialEstado2: mundialData.find(item => item.estado === 2)?.count || 0,
                mundialEstado0: mundialData.find(item => item.estado === 0)?.count || 0
            });

            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                estadisticas && (
                    <View style={styles.estadisticasContainer}>
                        <Text style={styles.estadisticaTitulo}>Estadísticas del Usuario</Text>
                        <View style={styles.estadisticaRow}>
                            <Text style={styles.estadisticaTexto}>Respuestas de Uno vs Uno</Text>
                            <Text style={styles.estadisticaValor}>{estadisticas.unoVsUno}</Text>
                        </View>
                        <View style={styles.estadisticaRow}>
                            <Text style={styles.estadisticaTexto}>Quiz Acertadas</Text>
                            <Text style={styles.estadisticaValor}>{estadisticas.quizAcertadas}</Text>
                        </View>
                        <View style={styles.estadisticaRow}>
                            <Text style={styles.estadisticaTexto}>Quiz Falladas</Text>
                            <Text style={styles.estadisticaValor}>{estadisticas.quizFalladas}</Text>
                        </View>
                        <View style={styles.estadisticaRow}>
                            <Text style={styles.estadisticaTexto}>Partidas Juego Cartas Ganadas</Text>
                            <Text style={styles.estadisticaValor}>{estadisticas.mundialEstado2}</Text>
                        </View>
                        <View style={styles.estadisticaRow}>
                            <Text style={styles.estadisticaTexto}>Partidas Juego Cartas Perdidas</Text>
                            <Text style={styles.estadisticaValor}>{estadisticas.mundialEstado0}</Text>
                        </View>
                    </View>
                )
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#f8f9fa',
    },
    estadisticasContainer: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    estadisticaTitulo: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 10,
        textAlign: 'center',
    },
    estadisticaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    estadisticaTexto: {
        fontSize: 16,
        color: '#555555',
    },
    estadisticaValor: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
});

export default EstadisticasUsuario;
