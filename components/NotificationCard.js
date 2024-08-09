import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React from 'react';
import { COLORS, SIZES } from '../constants';
import { getTimeAgo } from '../utils/date';

const NotificationCard = ({ icon, title, description, date, onPress }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.leftContainer}>
                <View style={styles.iconContainer}>
                    <Image
                        source={{ uri: `https://momdel.es/animeWorld/DOCS/${icon}` }}
                        resizeMode="cover"
                        style={styles.icon}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>
                </View>
            </View>
            <Text style={styles.date}>{getTimeAgo(date)}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
        padding: 12,
        backgroundColor: COLORS.lightGray,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        width: SIZES.width - 32,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        height: 44,
        width: 44,
        backgroundColor: COLORS.black2,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 22,
        marginRight: 12,
    },
    icon: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontFamily: 'medium',
        color: COLORS.greyscale900,
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        fontFamily: 'regular',
        color: COLORS.grey,
    },
    date: {
        fontSize: 12,
        fontFamily: 'regular',
        color: COLORS.grey,
    },
});

export default NotificationCard;
