import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import HorizontalEventCardSeriesPerfil from '../../components/mios/HorizontalEventCardSeriesPerfil';

const SeriesUsuarios = () => {
    const navigation = useNavigation();
    const [userId, setUserId] = useState(null);
    const [datosSeries, setDatosSeries] = useState(null);
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
        if (userId && !datosSeries) { // Solo hacer el fetch si hay un userId y los datos no han sido cargados previamente
            fetchSeriesMejorValoradas();
        }
    }, [userId, datosSeries]);

    const fetchSeriesMejorValoradas = async () => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/seriesUsuario.php?id=${userId}`
            );
            const data = await response.json();
            setDatosSeries(data);
            setIsLoading(false); // Marcar que los datos han sido cargados
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    return (
        <View style={styles.container}>
            {isLoading ? (
                <Text>Loading...</Text>
            ) : datosSeries ? (
                <FlatList
                    data={datosSeries}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <HorizontalEventCardSeriesPerfil
                            name={item.nombre}
                            image={item.imagen}
                            date={item.date}
                            startTime={item.capitulo}
                            endTime={item.n_capitulos}
                            isFree={item.isFree}
                            location={item.location}
                            estado={item.estado}
                            nota={item.nota}
                            onPress={() =>
                                navigation.navigate('DetallesSeries', { id: item.id })
                            }                        />
                    )}
                />
            ) : (
                <Text>No hay series disponibles.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 16,
        marginBottom:50
    },
});

export default SeriesUsuarios;
