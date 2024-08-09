import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
    Dimensions,
} from 'react-native';

const habilidadesJugador = [
    { id: 1, habilidad: "Que se pueda intercambiar el ataque por la defensa" },
    { id: 2, habilidad: "Que te doble la velocidad" },
    { id: 3, habilidad: "Que te duplique la defensa" },
    { id: 4, habilidad: "Quitar la mitad de puntos de defensa al rival" },
    { id: 5, habilidad: "Quitar la mitad de velocidad al rival" }
];

const { width } = Dimensions.get('window');

const ResumenCartas = ({ route, navigation }) => {
    const { idJuegoUsuario } = route.params || {};

    const [playerCards, setPlayerCards] = useState([]);
    const [machineCards, setMachineCards] = useState([]);
    const [machineAbility, setMachineAbility] = useState(null);
    const [selectedAbility, setSelectedAbility] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    'https://momdel.es/animeWorld/api/mostrarPartida.php',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ idJuegoUsuario }),
                    }
                );
                const result = await response.json();
                if (result.success) {
                    setPlayerCards(result.playerCards);
                    setMachineCards(result.machineCards);
                } else {
                    Alert.alert('Error', result.message);
                }
            } catch (error) {
                console.error('Error fetching cards:', error);
            }
        };

        const fetchMachineAbility = async () => {
            try {
                const response = await fetch('https://momdel.es/animeWorld/api/obtenerHabilidades.php');
                const result = await response.json();
                const randomAbility = result[Math.floor(Math.random() * result.length)];
                setMachineAbility(randomAbility);
            } catch (error) {
                console.error('Error fetching machine ability:', error);
            }
        };

        if (idJuegoUsuario) {
            fetchData();
            fetchMachineAbility();
        } else {
            Alert.alert('Error', 'ID de juego no proporcionado');
        }
    }, [idJuegoUsuario]);

    const startGame = () => {
        navigation.navigate('JuegoCartasPartida', {
            idJuegoUsuario,
            selectedAbility,
            playerCards,
            machineCards,
            machineAbility,
        });
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Cartas del Rival</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsContainer}>
                {machineCards.map((card, index) => (
                    <View key={index} style={styles.cardPreview}>
                        <Image
                            source={{ uri: `https://momdel.es/animeWorld/DOCS/cartas/${card.carta}` }}
                            style={styles.cardImage}
                        />
                        <View style={styles.statsContainer}>
                            <View style={[styles.statBox, styles.attackBox]}>
                                <Text style={styles.statText}>A: {card.ataque}</Text>
                            </View>
                            <View style={[styles.statBox, styles.defenseBox]}>
                                <Text style={styles.statText}>D: {card.defensa}</Text>
                            </View>
                            <View style={[styles.statBox, styles.speedBox]}>
                                <Text style={styles.statText}>V: {card.velocidad}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
            {/* <Text style={styles.abilityText}>Habilidad del Rival: {machineAbility?.habilidad}</Text> */}

            <Text style={styles.title}>Tus Cartas</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsContainer}>
                {playerCards.map((card, index) => (
                    <View key={index} style={styles.cardPreview}>
                        <Image
                            source={{ uri: `https://momdel.es/animeWorld/DOCS/cartas/${card.carta}` }}
                            style={styles.cardImage}
                        />
                        <View style={styles.statsContainer}>
                            <View style={[styles.statBox, styles.attackBox]}>
                                <Text style={styles.statText}>A: {card.ataque}</Text>
                            </View>
                            <View style={[styles.statBox, styles.defenseBox]}>
                                <Text style={styles.statText}>D: {card.defensa}</Text>
                            </View>
                            <View style={[styles.statBox, styles.speedBox]}>
                                <Text style={styles.statText}>V: {card.velocidad}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <Text style={styles.title}>Elige tu Habilidad</Text>
            <View style={styles.abilitiesContainer}>
                {habilidadesJugador.map((ability) => (
                    <TouchableOpacity
                        key={ability.id}
                        style={[
                            styles.abilityButton,
                            selectedAbility === ability.id && styles.selectedAbilityButton
                        ]}
                        onPress={() => setSelectedAbility(ability.id)}
                    >
                        <Text style={styles.abilityText}>{ability.habilidad}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity
                style={[styles.startButton, !selectedAbility && styles.disabledButton]}
                onPress={startGame}
                disabled={!selectedAbility}
            >
                <Text style={styles.buttonText}>Iniciar Juego</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f8ff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 40, // Añadir margen superior
        color: '#1e90ff',
        textAlign: 'center',
    },
    cardsContainer: {
        paddingHorizontal: 10,
        flexDirection: 'row',
    },
    cardPreview: {
        marginVertical: 10,
        marginHorizontal: 5,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        alignItems: 'center',
        width: width * 0.4, // Ajuste para mostrar más cartas horizontalmente
    },
    cardImage: {
        width: '100%',
        height: width * 0.55, // Ajuste para que las cartas no sean demasiado altas
        resizeMode: 'cover',
        borderRadius: 10,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 10,
    },
    statBox: {
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderRadius: 8,
        marginVertical: 2,
        width: '30%',
        alignItems: 'center',
    },
    statText: {
        fontSize: 12, // Ajuste del tamaño del texto para que las estadísticas se vean mejor
        fontWeight: 'bold',
        color: '#333',
    },
    attackBox: {
        borderColor: '#ff6347',
        backgroundColor: '#ffe6e6',
    },
    defenseBox: {
        borderColor: '#32cd32',
        backgroundColor: '#e6ffe6',
    },
    speedBox: {
        borderColor: '#4682b4',
        backgroundColor: '#e6f2ff',
    },
    abilityText: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        marginVertical: 10,
    },
    abilitiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginVertical: 20,
    },
    abilityButton: {
        backgroundColor: '#1e90ff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        width: '45%',
        margin: 5,
    },
    selectedAbilityButton: {
        backgroundColor: '#4169e1',
    },
    startButton: {
        backgroundColor: '#1e90ff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        marginHorizontal: 40,
        marginBottom: 30, // Añadir margen inferior
    },
    disabledButton: {
        backgroundColor: '#b0c4de',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ResumenCartas;
