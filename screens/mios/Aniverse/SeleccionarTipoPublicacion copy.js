import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { COLORS } from '../../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SeleccionarTipoPublicacion = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
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

    const handlePost = async () => {
        if (title.trim() === '' || text.trim() === '') {
            Alert.alert('Error', 'Por favor completa todos los campos.');
            return;
        }

        const responseData = await sendPostToAPI(title, text);

        console.log(responseData);
    };

    const sendPostToAPI = async (title, text) => {
        const response = await fetch(
            'https://momdel.es/animeWorld/api/subirPublicacion.php',
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title,
                    text: text,
                    idUsuario: userId,
                }),
            }
        );
        const response2 = await fetch(
            'https://momdel.es/animeWorld/api/calculoNivel.php',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: userId,
                    puntos: 35,
                }),
            }
        )
        navigation.navigate('SeleccionarSerie');
        return await response.json();
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };


    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.container}>
                <Text style={styles.title}>Contenido de la Publicación</Text>
                <Text style={styles.label}>Título</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ingresa el título"
                    value={title}
                    onChangeText={setTitle}
                />
                <Text style={styles.label}>Texto</Text>
                <TextInput
                    style={[styles.input, styles.multilineInput]}
                    placeholder="Ingresa el texto"
                    multiline
                    value={text}
                    onChangeText={setText}
                />
                <TouchableOpacity style={styles.button} onPress={handlePost}>
                    <Text style={styles.buttonText}>Publicar</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
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
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
        width: '100%',
    },
    multilineInput: {
        height: 100,
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
    },
});

export default SeleccionarTipoPublicacion;
