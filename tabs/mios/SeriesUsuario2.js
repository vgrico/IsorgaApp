import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Agregado
import { useNavigation } from '@react-navigation/native';
import HorizontalEventCardAnime from '../../components/HorizontalEventCardAnime';
import HorizontalEventCardSeriesPerfil from '../../components/mios/HorizontalEventCardSeriesPerfil';

const SeriesUsuarios2 = ({idUsuario}) => {
    const navigation = useNavigation();
    const [userId, setUserId] = useState(null);
    const [datosSeries, setDatosSeries] = useState(null);

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
            fetchSeriesMejorValoradas();
        }
    }, [userId]);

    const fetchSeriesMejorValoradas = async () => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/seriesUsuario.php?id=${idUsuario}`
            );
            const data = await response.json();
            setDatosSeries(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    return (
        <View style={styles.container}>
            {datosSeries && (
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
                            onPress={() => navigation.navigate('EventDetails')}
                        />
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 16,
    },
});

export default SeriesUsuarios2;
