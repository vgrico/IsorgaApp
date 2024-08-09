import React, { useState, useEffect, useRef } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    Animated,
    Modal,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const JuegoCartasPartida = ({ route, navigation }) => {
    const {
        idJuegoUsuario,
        selectedAbility,
        playerCards: initialPlayerCards,
        machineCards: initialMachineCards,
        machineAbility,
    } = route.params

    const [playerCards, setPlayerCards] = useState(initialPlayerCards)
    const [machineCards, setMachineCards] = useState(initialMachineCards)
    const [playerIndex, setPlayerIndex] = useState(0)
    const [machineIndex, setMachineIndex] = useState(0)
    const [isPlayerTurn, setIsPlayerTurn] = useState(true)
    const [abilityModalVisible, setAbilityModalVisible] = useState(false)
    const [abilityMessage, setAbilityMessage] = useState('')
    const [actionSelected, setActionSelected] = useState(false)
    const [rounds, setRounds] = useState(1)
    const [playerAbilityUsed, setPlayerAbilityUsed] = useState(false)
    const [machineAbilityUsed, setMachineAbilityUsed] = useState(false)
    const playerAttackAnim = useRef(new Animated.Value(0)).current
    const machineAttackAnim = useRef(new Animated.Value(0)).current

    const [userId, setUserId] = useState(null)

    useEffect(() => {
        console.log(machineAbility)
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
        startRound()
    }, [])

    const startRound = () => {
        if (rounds <= 6) {
            setActionSelected(false)
            setAbilityModalVisible(false)
            if (!isPlayerTurn) {
                handleMachineTurn()
            }
        } else {
            alertGameOver('El juego ha terminado después de 6 rondas', false)
        }
    }

    const determineAttacker = () => {
        const playerCard = playerCards[playerIndex]
        const machineCard = machineCards[machineIndex]
        if (playerCard.velocidad > machineCard.velocidad) {
            return true
        } else if (machineCard.velocidad > playerCard.velocidad) {
            return false
        } else {
            return Math.random() < 0.5
        }
    }

    const startAttackAnimation = (isPlayer) => {
        const animation = isPlayer ? playerAttackAnim : machineAttackAnim

        Animated.sequence([
            Animated.timing(animation, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(animation, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(() => {
            handleAttack(isPlayer)
        })
    }

    const handleAttack = (isPlayer) => {
        attack(isPlayer)
    }

    const attack = (isPlayer) => {
        const attacker = isPlayer
            ? playerCards[playerIndex]
            : machineCards[machineIndex]
        const defender = isPlayer
            ? machineCards[machineIndex]
            : playerCards[playerIndex]
        const updatedDefender = {
            ...defender,
            defensa: defender.defensa - attacker.ataque,
        }

        if (updatedDefender.defensa <= 0) {
            if (isPlayer) {
                if (machineIndex + 1 < machineCards.length) {
                    setMachineIndex(machineIndex + 1)
                } else {
                    alertGameOver('¡Felicidades! Has ganado', true)
                }
            } else {
                if (playerIndex + 1 < playerCards.length) {
                    setPlayerIndex(playerIndex + 1)
                } else {
                    alertGameOver('Lo siento, has perdido', false)
                }
            }
            setRounds(rounds + 1)
            startRound()
        } else {
            if (isPlayer) {
                setMachineCards((cards) => {
                    const updatedCards = [...cards]
                    updatedCards[machineIndex] = updatedDefender
                    return updatedCards
                })
                setIsPlayerTurn(false)
                setTimeout(() => handleMachineTurn(), 500)
            } else {
                setPlayerCards((cards) => {
                    const updatedCards = [...cards]
                    updatedCards[playerIndex] = updatedDefender
                    return updatedCards
                })
                setIsPlayerTurn(true)
                setActionSelected(false)
            }
        }
    }

    const useAbility = (abilityId, isPlayer) => {
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
          const [updatedCard, updatedOpponentCard, message] = applyAbility(updatedCards[playerIndex], machineCards[machineIndex], abilityId);
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
          const [updatedCard, updatedOpponentCard, message] = applyAbility(updatedCards[machineIndex], playerCards[playerIndex], abilityId);
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
        setIsPlayerTurn(determineAttacker());
        setActionSelected(false);
      }, 2000);
    };
    

    const handleMachineTurn = () => {
      if (!machineAbilityUsed && rounds <= 3) {
        useAbility(machineAbility.id, false); // Aquí se pasa el id de la habilidad
      } else {
        startAttackAnimation(false);
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
        })
        Alert.alert('Fin del Juego', message, [
            { text: 'OK', onPress: () => navigation.goBack() },
        ])
    }

    const playerAttackAnimStyle = {
        transform: [
            {
                translateY: playerAttackAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -50],
                }),
            },
        ],
    }

    const machineAttackAnimStyle = {
        transform: [
            {
                translateY: machineAttackAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 50],
                }),
            },
        ],
    }

    return (
        <View style={styles.container}>
            <Text style={styles.roundsText}>Rondas: {rounds}</Text>
            <View style={styles.battleContainer}>
                <Animated.View
                    style={[
                        styles.cardContainer,
                        !isPlayerTurn ? machineAttackAnimStyle : {},
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
                        isPlayerTurn ? playerAttackAnimStyle : {},
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
                            setActionSelected(true)
                            const firstAttacker = determineAttacker()
                            startAttackAnimation(firstAttacker)
                        }}
                    >
                        <Text style={styles.buttonText}>Atacar Normal</Text>
                    </TouchableOpacity>
                    {!playerAbilityUsed && (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                setActionSelected(true)
                                useAbility(selectedAbility, true)
                            }}
                        >
                            <Text style={styles.buttonText}>
                                Usar Habilidad
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
            {actionSelected && !isPlayerTurn && !abilityModalVisible && (
                <View style={styles.actionContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            startAttackAnimation(false)
                        }}
                    >
                        <Text style={styles.buttonText}>Atacar Normal</Text>
                    </TouchableOpacity>
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
                            <Text style={styles.modalButtonText}>
                                Continuar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#e5e5e5',
        justifyContent: 'center',
        alignItems: 'center',
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
        borderColor: '#4682b4',
        backgroundColor: '#e6f2ff',
    },
    speedBox: {
        borderColor: '#32cd32',
        backgroundColor: '#e6ffe6',
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
    },
})

export default JuegoCartasPartida
