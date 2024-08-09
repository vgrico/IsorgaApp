import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, SIZES, icons } from '../../constants';

const HorizontalEventCardSeriesPerfil = ({
    name,
    image,
    startTime,
    endTime,
    onPress,
    nota,
    estado,
}) => {
    const [isFavourite, setIsFavourite] = useState(false);

    // Determinar el icono para mostrar si la serie está completa o está por finalizar
    let completionIcon;
    if (estado === 3) {
        completionIcon = icons.check;
    } else {
        completionIcon = icons.incomplete;
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.container, {
                backgroundColor: COLORS.white
            }]}>
            <View style={styles.contentContainer}>
                <Text style={styles.number}>{nota}</Text>
                <Image
                    source={icons.star}
                    resizeMode='contain'
                    style={styles.starIcon}
                />
            </View>
            <Image
                source={{ uri: `https://momdel.es/animeWorld/DOCS/${image}` }}
                resizeMode='cover'
                style={styles.image}
            />
            <View style={styles.columnContainer}>
                <Text style={[styles.name, {
                    color: COLORS.greyscale900
                }]}>{name}</Text>
                <View style={styles.bottomRow}>
                    <Text style={styles.time}>{startTime}-{endTime}</Text>
                    <View style={styles.completionIconContainer}>
                        <Image
                            source={completionIcon}
                            resizeMode='contain'
                            style={styles.completionIcon}
                        />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: SIZES.width - 32,
        backgroundColor: COLORS.white,
        padding: 12,
        borderRadius: 16,
        marginBottom: 12,
        height: 112,
        alignItems: "center",
        justifyContent: "space-between", // Alinear los elementos en la fila
        elevation: 2, // Sombra en Android
        shadowColor: COLORS.black, // Sombra en iOS
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    contentContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 12,
    },
    number: {
        fontSize: 20,
        fontFamily: "bold",
        color: COLORS.primary,
        marginRight: 4,
    },
    starIcon: {
        width: 20,
        height: 20,
        tintColor: COLORS.primary,
        marginRight: 4,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 16
    },
    columnContainer: {
        flexDirection: "column",
        flex: 1,
    },
    name: {
        fontSize: 20,
        fontFamily: "bold",
        color: COLORS.greyscale900,
        marginBottom: 6,
    },
    bottomRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    time: {
        fontSize: 14,
        fontFamily: "semiBold",
        color: COLORS.primary,
    },
    completionIconContainer: {
        marginLeft: 'auto', // Para alinear a la derecha
    },
    completionIcon: {
        width: 20,
        height: 20,
        tintColor: COLORS.greeen,
    }
});

export default HorizontalEventCardSeriesPerfil;
