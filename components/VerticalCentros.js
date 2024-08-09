import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { COLORS, SIZES } from '../constants'

const VerticalCentros = ({
    name,
    location,
    startTime,
    endTime,
    date,
    onPress,
}) => {
    const [isFavourite, setIsFavourite] = useState(false)

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.container,
                {
                    backgroundColor: COLORS.grayscale100,
                },
            ]}
        >
            <View style={styles.content}>
                <Text
                    style={[
                        styles.name,
                        {
                            color: COLORS.greyscale900,
                        },
                    ]}
                >
                    {name}
                </Text>
                <Text
                    style={[
                        styles.location,
                        {
                            color: COLORS.grayscale700,
                        },
                    ]}
                >
                    {location}
                </Text>
                <Text style={styles.duration}>
                    {startTime}
                </Text>
                <Text style={styles.location}>
                    {date} - {endTime}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        width: (SIZES.width - 32) / 2 - 12,
        backgroundColor: COLORS.magenta,
        padding: 8,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.magenta,
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        fontSize: 14,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        marginVertical: 2,
    },
    location: {
        fontSize: 12,
        fontFamily: 'regular',
        color: COLORS.grayscale700,
        marginVertical: 2,
    },
    duration: {
        fontSize: 10,
        fontFamily: 'semiBold',
        color: COLORS.grayscale400,
        marginVertical: 2,
    },
})

export default VerticalCentros
