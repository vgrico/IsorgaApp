import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SIZES } from '../../constants';

const CartasUsuarios = () => {
    const [userId, setUserId] = useState(null);
    const [cartas, setCartas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDataLoaded, setIsDataLoaded] = useState(false); // Nuevo estado para controlar si los datos ya han sido cargados

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
        if (userId && !isDataLoaded) { // Solo hacer el fetch si hay un userId y los datos no han sido cargados previamente
            fetchCartas();
        }
    }, [userId, isDataLoaded]);

    const fetchCartas = async () => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/cartasFavoritasUsuario.php?id=${userId}`
            );
            const data = await response.json();
            setCartas(data);
            setIsLoading(false);
            setIsDataLoaded(true); // Marcar que los datos han sido cargados
        } catch (error) {
            console.error('Error fetching serie data:', error);
            setIsLoading(false);
        }
    };

    const renderCartaItem = ({ item }) => (
        <Image
            source={{ uri: `https://momdel.es/animeWorld/DOCS/cartas/${item.carta}` }}
            resizeMode="cover"
            style={styles.galleryImage}
        />
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={cartas}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                style={{ marginVertical: 12 }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                renderItem={renderCartaItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 16,
        marginBottom: 50,
    },
    galleryImage: {
        width: (SIZES.width - 44) / 3,
        height: (SIZES.width - 44) / 3,
        borderRadius: 16,
        marginBottom: 6,
    },
});

export default CartasUsuarios;
