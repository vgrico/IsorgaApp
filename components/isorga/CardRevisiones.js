import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { COLORS, SIZES } from '../../constants'


const CardRevisiones = ({ item, onPress }) => {
    const today = new Date();
    const proximaDate = new Date(item.proxima);

    // Compara las fechas para determinar si proxima es anterior a hoy
    const isPastDate = proximaDate < today;

    return (
        <TouchableOpacity onPress={onPress} style={styles.card}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.textoTipo}>{item.revision}</Text>
            <Text style={[styles.proxima, isPastDate && styles.pastDate]}>
                {item.proxima}
            </Text>
        </TouchableOpacity>
    );
};

    
    const styles = StyleSheet.create({
        card: {
            backgroundColor: '#fff',
            borderRadius: 15,
            padding: 15,
            marginVertical: 5,
            marginHorizontal: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
            elevation: 5,
        },
        pastDate: {
            color: 'red', // Cambia el color a rojo si la fecha es anterior a hoy
        },
        proxima: {
            fontSize: 12,
            fontWeight: 'bold',
            color: '#333',

        },
        nombre: {
            fontSize: 14,
            color: '#555',
            marginBottom: 5,
        },
        textoTipo: {
            fontSize: 12,
            color: '#888',
            marginBottom: 5,
        },
    });

export default CardRevisiones
