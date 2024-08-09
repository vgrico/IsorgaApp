import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PublicacionesUsuario2 = ({ idUsuario }) => {
    const navigation = useNavigation();
    const [userId, setUserId] = useState(null);
    const [datosPublicaciones, setDatosPublicaciones] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Nuevo estado para controlar si los datos están siendo cargados

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
        if (userId && !datosPublicaciones) { // Solo hacer el fetch si hay un userId y los datos no han sido cargados previamente
            fetchPublicaciones();
        }
    }, [userId, datosPublicaciones]);

    const fetchPublicaciones = async () => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/publicacionesUsuario.php?id=${idUsuario}`
            );
            const data = await response.json();
            setDatosPublicaciones(data);
            setIsLoading(false); // Marcar que los datos han sido cargados
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    return (
        <View style={styles.container}>
            {isLoading ? (
                <Text>Loading...</Text>
            ) : datosPublicaciones ? (
                <FlatList
                    data={datosPublicaciones}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.publicacionContainer}>
                            <Text style={styles.titulo}>{item.titulo}</Text>
                            <Image
                                source={{
                                    uri: `https://momdel.es/animeWorld/DOCS/${item.imagen}`,
                                }}
                                style={styles.imagen}
                            />
                            <Text style={styles.texto}>{item.texto}</Text>
                        </View>
                    )}
                />
            ) : (
                <Text>No hay publicaciones disponibles.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 16,
    },
    publicacionContainer: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    imagen: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 5,
    },
    texto: {
        fontSize: 16,
    },
});

export default PublicacionesUsuario2;
