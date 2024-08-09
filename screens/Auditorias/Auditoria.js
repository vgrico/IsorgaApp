import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Auditoria = ({ navigation }) => {
    
    const { id } = route.params
    const [auditoria, setAuditoria] = useState(null);
    const [rutas, setRutas] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const loadUserId = async () => {
            try {
                const userIdFromStorage = await AsyncStorage.getItem('isorgaId');
                setUserId(userIdFromStorage);
                fetchAuditoriaData(userIdFromStorage);
            } catch (error) {
                console.error('Error loading userId from AsyncStorage:', error);
            }
        };
        loadUserId();
    }, []);

    const fetchAuditoriaData = async (userId) => {
        try {
            const response = await fetch(`https://momdel.es/dev/api/app/auditoria.php?id=${userId}`);
            const data = await response.json();
            setAuditoria(data.auditoria);
            setRutas(data.rutas);
        } catch (error) {
            console.error('Error fetching auditoria data:', error);
        }
    };

    const renderApartados = (apartados) => {
        return apartados.map((apartado) => (
            <View key={apartado.id} style={styles.card}>
                <Text style={styles.title}>{apartado.titulo}</Text>
                <Text style={styles.details}>{apartado.observaciones}</Text>
                {apartado.total_respuestas > 0 && (
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Ver Rutas ({apartado.total_respuestas})</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Añadir Nueva Ruta</Text>
                </TouchableOpacity>
            </View>
        ));
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.titulo}</Text>
            <Text style={styles.details}>{item.observaciones}</Text>
            {renderApartados(item.apartados)}
        </View>
    );

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                {auditoria && (
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{auditoria.titulo}</Text>
                        <Text style={styles.headerDetails}>{auditoria.observaciones}</Text>
                    </View>
                )}
                <FlatList
                    data={rutas}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerDetails: {
        fontSize: 16,
        color: '#666',
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    details: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
    },
});

export default Auditoria;
