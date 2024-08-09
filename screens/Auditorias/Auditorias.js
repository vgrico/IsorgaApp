import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native'
import { COLORS, SIZES } from '../../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Auditorias = ({ navigation }) => {
    const [datosSeries, setDatosSeries] = useState(null)
    const [userId, setUserId] = useState(null)

    useEffect(() => {
        const loadUserId = async () => {
            try {
                const userIdFromStorage = await AsyncStorage.getItem('isorgaId')
                setUserId(userIdFromStorage)
            } catch (error) {
                console.error('Error loading userId from AsyncStorage:', error)
            }
        }
        loadUserId()
    }, [])

    useEffect(() => {
        if (userId) {
            fetchSeriesMejorValoradas()
        }
    }, [userId])

    const fetchSeriesMejorValoradas = async () => {
        try {
            const response = await fetch(`https://momdel.es/dev/api/app/listaAuditorias.php`)
            const data = await response.json()
            setDatosSeries(data)
        } catch (error) {
            console.error('Error fetching series data:', error)
        }
    }

    const getCardStyle = (estado) => {
        switch (estado) {
            case 1:
                return styles.cardCompleted
            case 0:
                return styles.cardPending
            default:
                return styles.cardDefault
        }
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={[styles.card, getCardStyle(item.estado)]} 
            onPress={() => navigation.navigate('Auditoria', { id: item.id })}>
            <Text style={styles.title}>{item.titulo}</Text>
            <Text style={styles.details}>{item.centroNombre}</Text>
            <Text style={styles.details}>Fechas de auditoría: {item.fechasAuditoria}</Text>
            <Text style={styles.details}>Fecha de cierre: {item.fecha_cierre}</Text>
            <Text style={styles.details}>Observaciones: {item.observaciones}</Text>
            {/* <Text style={styles.details}>Estado: {item.estado}</Text> */}
        </TouchableOpacity>
    )

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                <Text style={styles.sectionHeader}>Auditorías</Text>
                <FlatList
                    data={datosSeries}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                /> 
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
    },
    sectionHeader: {
        fontSize: 24,
        fontFamily: 'bold',
        color: COLORS.black,
        marginBottom: 16,
    },
    card: {
        padding: 16,
        borderRadius: 12,
        marginVertical: 8,
    },
    cardCompleted: {
        backgroundColor: 'lightgreen',
    },
    cardPending: {
        backgroundColor: 'lightred',
    },
    cardDefault: {
        backgroundColor: COLORS.secondaryWhite,
    },
    title: {
        fontSize: 18,
        fontFamily: 'bold',
        color: COLORS.black,
    },
    details: {
        fontSize: 14,
        fontFamily: 'regular',
        color: COLORS.black,
    },
})

export default Auditorias
