import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, icons } from '../../../constants';

const { width } = Dimensions.get('window');

const Quiz = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image
                        source={icons.back}
                        resizeMode="contain"
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.headerTitle}>Juego Quiz</Text>
            </View>
            <View style={styles.iconContainer}>
                <TouchableOpacity
                    style={styles.iconWrapper}
                    onPress={() => navigation.navigate('JuegoPreguntas')}
                >
                    <Ionicons name="game-controller-outline" size={64} color="#999" />
                    <Text style={styles.iconText}>Jugar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconWrapper}
                    onPress={() => navigation.navigate('QuizRanking')}
                >
                    <Ionicons name="trophy-outline" size={64} color="#000" />
                    <Text style={styles.iconText}>Clasificación</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        paddingHorizontal: 16,
        marginTop: 50,
        marginBottom: 20,
    },
    backButton: {
        position: 'absolute',
        left: 16,
    },
    backIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: width * 0.8, // Adjust width based on screen width
    },
    iconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    iconText: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default Quiz;
