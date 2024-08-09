import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES } from '../../constants';

const HorizontalEventCardPublicaciones = ({
    titulo,
    imagen,
    texto,
    usuario, // Nuevo prop para el nombre de usuario
    onPress,
    idUsuario,
}) => {
    const navigation = useNavigation();
    const [isFavourite, setIsFavourite] = useState(false);

    return (
        <TouchableOpacity
            onPress={() =>
                navigation.navigate('PerfilUsuario', {
                    idUsuario: idUsuario,
                })
            }
            style={styles.container}
        >
            <Image
                source={{ uri: `https://momdel.es/animeWorld/DOCS/${imagen}` }}
                resizeMode='cover'
                style={styles.image}
            />
            <View style={styles.contentContainer}>
                <Text style={styles.name}>{titulo}</Text>
                <Text style={styles.duration}>{texto}</Text>
            </View>
            {/* Nombre de usuario */}
            <Text style={styles.usuario}>{usuario}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: SIZES.width - 32,
        backgroundColor: COLORS.white,
        padding: 12,
        borderRadius: 16,
        marginBottom: 12,
        height: 128,
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 12,
        marginRight: 12,
    },
    contentContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        marginBottom: 4,
    },
    usuario: {
        fontSize: 14,
        fontFamily: 'bold',
        color: COLORS.primary, // Color lila para el nombre de usuario
        marginBottom: 2,
    },
    duration: {
        fontSize: 14,
        fontFamily: 'regular',
        color: COLORS.grayscale700,
    },
});

export default HorizontalEventCardPublicaciones;
