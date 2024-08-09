import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    Animated,
    Modal,
    ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JuegoCartasPartida = ({ route, navigation }) => {
    const {
        idJuegoUsuario,
        selectedAbility,
        playerCards: initialPlayerCards,
        machineCards: initialMachineCards,
        machineAbility,
    } = route.params;

    const [playerCards, setPlayerCards] = useState(initialPlayerCards);
    const [machineCards, setMachineCards] = useState(initialMachineCards.map(card => ({
        ...card,
        ataque: card.ataque + 10,
        defensa: card.defensa + 10,
        velocidad: card.velocidad + 10
    })));
    const [playerIndex, setPlayerIndex] = useState(0);
    const [machineIndex, setMachineIndex] = useState(0);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [abilityModalVisible, setAbilityModalVisible] = useState(false);
    const [abilityMessage, setAbilityMessage] = useState('');
    const [actionSelected, setActionSelected] = useState(false);
    const [rounds, setRounds] = useState(1);
    const [playerAbilityUsed, setPlayerAbilityUsed] = useState(false);
    const [machineAbilityUsed, setMachineAbilityUsed] = useState(false);
    const [machineAbilityRandomUsed, setMachineAbilityRandomUsed] = useState(false);
    const playerAttackAnim = useRef(new Animated.Value(0)).current;
    const machineAttackAnim = useRef(new Animated.Value(0)).current;

    const [userId, setUserId] = useState(null);

    useEffect(() => {
        loadUserId();
        startRound();
    }, []);

    const loadUserId = async () => {
        try {
            const userIdFromStorage = await AsyncStorage.getItem('userId');
            setUserId(userIdFromStorage);
        } catch (error) {
            console.error('Error loading userId from AsyncStorage:', error);
        }
    };

    const startRound = () => {
        if (rounds <= 6) {
            setActionSelected(false);
            setAbilityModalVisible(false);

            // Verificar si la habilidad de la máquina debe ser utilizada aleatoriamente
            if (!machineAbilityUsed && !machineAbilityRandomUsed) {
                if (rounds === 1 && Math.random() < 0.8) {
                    setMachineAbilityRandomUsed(true);
                    utilizarHabilidad(machineAbility.id, false);
                    return;
                } else if (rounds === 1) {
                    setMachineAbilityRandomUsed(true);
                }
            }

            setIsPlayerTurn(determineAttacker());

            if (!isPlayerTurn) {
                handleMachineTurn();
            }
        } else {
            alertGameOver('El juego ha terminado después de 6 rondas', false);
        }
    };

    const determineAttacker = () => {
        const playerCard = playerCards[playerIndex];
        const machineCard = machineCards[machineIndex];
        if (playerCard.velocidad > machineCard.velocidad) {
            return true;
        } else if (machineCard.velocidad > playerCard.velocidad) {
            return false;
        } else {
            return Math.random() < 0.5;
        }
    };

    const eleccion = () => {
        setActionSelected(false);
    };

    const startAttackAnimation = (isPlayer, callback) => {
        const animation = isPlayer ? playerAttackAnim : machineAttackAnim;
        const direction = isPlayer ? -50 : 50;

        Animated.sequence([
            Animated.timing(animation, {
                toValue: direction,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(animation, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(callback);
    };

    const ataque = (isPlayer) => {
        startAttackAnimation(isPlayer, () => handleAttack(isPlayer));
    };

    const handleAttack = (isPlayer) => {
        const attacker = isPlayer ? playerCards[playerIndex] : machineCards[machineIndex];
        const defender = isPlayer ? machineCards[machineIndex] : playerCards[playerIndex];
        const updatedDefender = { ...defender, defensa: defender.defensa - attacker.ataque };

        if (updatedDefender.defensa <= 0) {
            if (isPlayer) {
                if (machineIndex + 1 < machineCards.length) {
                    setMachineIndex(machineIndex + 1);
                    if (!machineAbilityUsed && machineIndex + 1 === machineCards.length - 1) {
                        utilizarHabilidad(machineAbility.id, false);
                        setMachineAbilityUsed(true);
                        return;
                    }
                    eleccion();
                } else {
                    alertGameOver('¡Felicidades! Has ganado', true);
                }
            } else {
                if (playerIndex + 1 < playerCards.length) {
                    setPlayerIndex(playerIndex + 1);
                    if (!machineAbilityUsed && machineIndex === machineCards.length - 1) {
                        utilizarHabilidad(machineAbility.id, false);
                        setMachineAbilityUsed(true);
                        return;
                    }
                    eleccion();
                } else {
                    alertGameOver('Lo siento, has perdido', false);
                }
            }
            setRounds(rounds + 1);
        } else {
            updateCardsState(isPlayer, updatedDefender);

            if (!isPlayer) {
                setTimeout(() => contraataque(true), 500);
            } else {
                setTimeout(() => contraataque(false), 500);
            }
        }
    };

    const contraataque = (isPlayer) => {
        startAttackAnimation(isPlayer, () => handleCounterAttack(isPlayer));
    };

    const handleCounterAttack = (isPlayer) => {
        const attacker = isPlayer ? playerCards[playerIndex] : machineCards[machineIndex];
        const defender = isPlayer ? machineCards[machineIndex] : playerCards[playerIndex];
        const updatedDefender = { ...defender, defensa: defender.defensa - attacker.ataque };

        if (updatedDefender.defensa <= 0) {
            if (isPlayer) {
                if (machineIndex + 1 < machineCards.length) {
                    setMachineIndex(machineIndex + 1);
                    if (!machineAbilityUsed && machineIndex + 1 === machineCards.length - 1) {
                        utilizarHabilidad(machineAbility.id, false);
                        setMachineAbilityUsed(true);
                        return;
                    }
                    eleccion();
                } else {
                    alertGameOver('¡Felicidades! Has ganado', true);
                }
            } else {
                if (playerIndex + 1 < playerCards.length) {
                    setPlayerIndex(playerIndex + 1);
                    if (!machineAbilityUsed && machineIndex === machineCards.length - 1) {
                        utilizarHabilidad(machineAbility.id, false);
                        setMachineAbilityUsed(true);
                        return;
                    }
                    eleccion();
                } else {
                    alertGameOver('Lo siento, has perdido', false);
                }
            }
            setRounds(rounds + 1);
        } else {
            updateCardsState(isPlayer, updatedDefender);
            eleccion(); // Después del contraataque, mostrar opciones
        }
    };

    const updateCardsState = (isPlayer, updatedDefender) => {
        if (isPlayer) {
            setMachineCards((cards) => {
                const updatedCards = [...cards];
                updatedCards[machineIndex] = updatedDefender;
                return updatedCards;
            });
        } else {
            setPlayerCards((cards) => {
                const updatedCards = [...cards];
                updatedCards[playerIndex] = updatedDefender;
                return updatedCards;
            });
        }
    };

    const utilizarHabilidad = (abilityId, isPlayer) => {
        const applyAbility = (card, opponentCard, abilityId) => {
            let message = '';
            switch (abilityId) {
                case 1:
                    [card.ataque, card.defensa] = [card.defensa, card.ataque];
                    message = 'Intercambio de ataque y defensa';
                    break;
                case 2:
                    card.velocidad *= 2;
                    message = 'Velocidad duplicada';
                    break;
                case 3:
                    card.defensa *= 2;
                    message = 'Defensa duplicada';
                    break;
                case 4:
                    opponentCard.defensa = Math.max(0, opponentCard.defensa / 2);
                    message = 'Defensa del oponente reducida a la mitad';
                    break;
                case 5:
                    opponentCard.velocidad = Math.max(0, opponentCard.velocidad / 2);
                    message = 'Velocidad del oponente reducida a la mitad';
                    break;
                default:
                    break;
            }
            return [card, opponentCard, message];
        };

        if (isPlayer) {
            if (playerAbilityUsed) return;

            setPlayerCards((cards) => {
                const updatedCards = [...cards];
                const [updatedCard, updatedOpponentCard, message] = applyAbility(
                    updatedCards[playerIndex],
                    machineCards[machineIndex],
                    abilityId
                );
                updatedCards[playerIndex] = updatedCard;
                setAbilityMessage(message);
                setMachineCards((machineCards) => {
                    const machineUpdatedCards = [...machineCards];
                    machineUpdatedCards[machineIndex] = updatedOpponentCard;
                    return machineUpdatedCards;
                });
                return updatedCards;
            });

            setPlayerAbilityUsed(true);
        } else {
            if (machineAbilityUsed) return;

            setMachineCards((cards) => {
                const updatedCards = [...cards];
                const [updatedCard, updatedOpponentCard, message] = applyAbility(
                    updatedCards[machineIndex],
                    playerCards[playerIndex],
                    abilityId
                );
                updatedCards[machineIndex] = updatedCard;
                setAbilityMessage(message);
                setPlayerCards((playerCards) => {
                    const playerUpdatedCards = [...playerCards];
                    playerUpdatedCards[playerIndex] = updatedOpponentCard;
                    return playerUpdatedCards;
                });
                return updatedCards;
            });

            setMachineAbilityUsed(true);
        }

        setAbilityModalVisible(true);
        setTimeout(() => {
            setAbilityModalVisible(false);
            eleccion(); // Después de usar la habilidad, mostrar opciones
        }, 2000);
    };

    const handleMachineTurn = () => {
        if (Math.random() < 0.5 && !machineAbilityUsed) {
            utilizarHabilidad(machineAbility.id, false);
        } else {
            ataque(false);
        }
    };

    const alertGameOver = async (message, playerWon) => {
        await fetch('https://momdel.es/animeWorld/api/modificarCopas.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                result: playerWon ? 'win' : 'lose',
            }),
        });
        const response2 = await fetch(
            'https://momdel.es/animeWorld/api/calculoNivel.php',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: userId,
                    puntos: 50,
                }),
            }
        );
        Alert.alert('Fin del Juego', message, [
            {
                text: 'OK',
                onPress: () => {
                    navigation.navigate('JuegoMundialDeCartas');
                },
            },
        ]);
    };

    const playerAttackAnimStyle = {
        transform: [
            {
                translateY: playerAttackAnim,
            },
        ],
    };

    const machineAttackAnimStyle = {
        transform: [
            {
                translateY: machineAttackAnim,
            },
        ],
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.roundsText}>Rondas: {rounds}</Text>
            <View style={styles.battleContainer}>
                <Animated.View
                    style={[
                        styles.cardContainer,
                        machineAttackAnimStyle,
                    ]}
                >
                    <Image
                        source={{
                            uri: `https://momdel.es/animeWorld/DOCS/cartas/${machineCards[machineIndex].carta}`,
                        }}
                        style={styles.cardImage}
                    />
                    <View style={styles.statsContainer}>
                        <View style={[styles.statBox, styles.attackBox]}>
                            <Text style={styles.statText}>
                                {machineCards[machineIndex].ataque}
                            </Text>
                        </View>
                        <View style={[styles.statBox, styles.defenseBox]}>
                            <Text style={styles.statText}>
                                {machineCards[machineIndex].defensa}
                            </Text>
                        </View>
                        <View style={[styles.statBox, styles.speedBox]}>
                            <Text style={styles.statText}>
                                {machineCards[machineIndex].velocidad}
                            </Text>
                        </View>
                    </View>
                </Animated.View>
                <Animated.View
                    style={[
                        styles.cardContainer,
                        playerAttackAnimStyle,
                    ]}
                >
                    <Image
                        source={{
                            uri: `https://momdel.es/animeWorld/DOCS/cartas/${playerCards[playerIndex].carta}`,
                        }}
                        style={styles.cardImage}
                    />
                    <View style={styles.statsContainer}>
                        <View style={[styles.statBox, styles.attackBox]}>
                            <Text style={styles.statText}>
                                {playerCards[playerIndex].ataque}
                            </Text>
                        </View>
                        <View style={[styles.statBox, styles.defenseBox]}>
                            <Text style={styles.statText}>
                                {playerCards[playerIndex].defensa}
                            </Text>
                        </View>
                        <View style={[styles.statBox, styles.speedBox]}>
                            <Text style={styles.statText}>
                                {playerCards[playerIndex].velocidad}
                            </Text>
                        </View>
                    </View>
                </Animated.View>
            </View>
            {!actionSelected && (
                <View style={styles.actionContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            setActionSelected(true);
                            ataque(determineAttacker());
                        }}
                    >
                        <Text style={styles.buttonText}>Atacar Normal</Text>
                    </TouchableOpacity>
                    {!playerAbilityUsed && (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                setActionSelected(true);
                                utilizarHabilidad(selectedAbility, true);
                            }}
                        >
                            <Text style={styles.buttonText}>Usar Habilidad</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
            <Modal
                visible={abilityModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setAbilityModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{abilityMessage}</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setAbilityModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Continuar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: '#e5e5e5',
    },
    roundsText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    battleContainer: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    cardContainer: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 10,
        borderRadius: 10,
        backgroundColor: '#f8f8f8',
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    cardImage: {
        width: 120,
        height: 180,
        resizeMode: 'cover',
        marginBottom: 15,
        borderRadius: 10,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 10,
    },
    statBox: {
        padding: 5,
        borderWidth: 1,
        borderRadius: 8,
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statText: {
        fontSize: 16,
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
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#1e90ff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        width: '40%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        fontSize: 20,
        marginBottom: 20,
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: '#1e90ff',
        padding: 10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default JuegoCartasPartida;
