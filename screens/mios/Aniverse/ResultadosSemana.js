import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { COLORS, SIZES, icons } from '../../../constants'; // Asegúrate de ajustar la ruta a tus constantes

const ResultadosSemana = ({ navigation }) => {
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(true);

    const titles = ["Ataque", "Defensa", "IQ", "IQ en Combate", "Velocidad", "Total"];

    useEffect(() => {
        fetchResultadosIndividuales();
    }, []);

    const fetchResultadosIndividuales = async () => {
        try {
            const response = await fetch(`https://momdel.es/animeWorld/api/resultadosIndividualesSemana.php`);
            const data = await response.json();
            setResultados(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching resultados:', error);
            setLoading(false);
        }
    };

    const calculatePercentages = (resultados) => {
        const responseIndices = [1, 2, 3, 4, 5, 6];
        const counts = responseIndices.map(() => ({}));
        const totalCounts = responseIndices.map(() => 0);

        resultados.forEach((item) => {
            responseIndices.forEach((index) => {
                const personaje = item.personaje;
                const count = parseInt(item[`respuesta${index}_count`]);
                if (count) {
                    if (!counts[index - 1][personaje]) {
                        counts[index - 1][personaje] = { count: 0, imagen: item.imagen };
                    }
                    counts[index - 1][personaje].count += count;
                    totalCounts[index - 1] += count;
                }
            });
        });

        return responseIndices.map((index) => {
            const result = Object.keys(counts[index - 1]).map((personaje) => ({
                personaje,
                count: counts[index - 1][personaje].count,
                percentage: ((counts[index - 1][personaje].count / totalCounts[index - 1]) * 100).toFixed(2),
                imagen: counts[index - 1][personaje].imagen,
            }));
            const maxCount = Math.max(...result.map(item => item.count));
            const winners = result.filter(item => item.count === maxCount);
            return {
                question: titles[index - 1],
                result,
                isTie: winners.length > 1,
                winner: winners[0],
            };
        });
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Cargando...</Text>
            </View>
        );
    }

    const data = calculatePercentages(resultados);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={icons.back}
                        resizeMode="contain"
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
            </View>
            {data.map((questionData, index) => (
                <View key={index} style={styles.questionContainer}>
                    <Text style={styles.questionTitle}>{questionData.question}</Text>
                    <View style={styles.resultContainer}>
                        {questionData.result.map((item, idx) => (
                            <View
                                key={idx}
                                style={[
                                    styles.resultItem,
                                    item.count === questionData.winner.count && !questionData.isTie
                                        ? styles.winnerHighlight
                                        : null,
                                ]}
                            >
                                <Image
                                    source={{ uri: `https://momdel.es/animeWorld/DOCS/${item.imagen}` }}
                                    style={styles.image}
                                />
                                {/* <Text style={styles.personajeText}>{item.personaje}</Text> */}
                                <Text style={styles.percentageText}>{item.percentage}%</Text>
                            </View>
                        ))}
                    </View>
                    {questionData.isTie && <Text style={styles.tieText}>Empate</Text>}
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: COLORS.white,
    },
    title: {
        fontSize: 24,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        textAlign: 'center',
        marginBottom: 16,
    },
    questionContainer: {
        width: Dimensions.get('window').width * 0.9,
        backgroundColor: COLORS.lightGray,
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    questionTitle: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        marginBottom: 16,
    },
    resultContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    resultItem: {
        alignItems: 'center',
        flex: 1,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 8,
    },
    personajeText: {
        fontSize: 16,
        color: COLORS.greyscale900,
        fontWeight: 'bold',
    },
    percentageText: {
        fontSize: 16,
        color: COLORS.primary,
    },
    winnerHighlight: {
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderRadius: 8,
        padding: 8,
    },
    tieText: {
        fontSize: 18,
        color: COLORS.primary,
        fontWeight: 'bold',
        marginTop: 8,
    },
    headerContainer: {
        width: SIZES.width - 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        top: 32,
        zIndex: 999,
        left: 16,
        right: 16,
    },
    backIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.white,
    },
});

export default ResultadosSemana;
