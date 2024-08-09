import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, icons } from '../../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SeleccionarTipoPublicacion = ({ navigation }) => {
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

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <SafeAreaView style={styles.area}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Image
                            source={icons.back}
                            resizeMode="contain"
                            style={styles.backIcon}
                        />
                    </TouchableOpacity>
                    <Text style={styles.title}>Selecciona el tipo de publicación</Text>
                </View>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SubirPublicacionSerie')}>
                        <Text style={styles.buttonText}>Subir Publicación de Series</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SubirPublicacionCarta')}>
                        <Text style={styles.buttonText}>Subir Publicación de Cartas</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 16,
        marginTop: 20,
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
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: COLORS.black, // Color negro para el texto del título
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
    },
});

export default SeleccionarTipoPublicacion;
