import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Alert, ScrollView } from 'react-native'
import { COLORS } from '../../../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Header from '../../../components/Header'

const CambiarTitulo = ({ navigation }) => {
    const [titulos, setTitulos] = useState([])
    const [userId, setUserId] = useState(null)
    const [selectedTitle, setSelectedTitle] = useState(null)

    useEffect(() => {
        const loadUserId = async () => {
            try {
                const userIdFromStorage = await AsyncStorage.getItem('userId')
                setUserId(userIdFromStorage)
                fetchTitulos(userIdFromStorage)
            } catch (error) {
                console.error('Error loading userId from AsyncStorage:', error)
            }
        }

        loadUserId()
    }, [])

    const fetchTitulos = async (userId) => {
        try {
            const response = await fetch(
                `https://momdel.es/animeWorld/api/listadoTitulosUsuario.php?id=${userId}`
            )
            const data = await response.json()
            setTitulos(data)
        } catch (error) {
            console.error('Error fetching serie data:', error)
        }
    }

    const handleTitleSelect = (title) => {
        setSelectedTitle(title)
    }

    const handleSave = async () => {
        if (!selectedTitle) {
            Alert.alert(
                'Error',
                'Por favor selecciona un título antes de guardar.'
            )
            return
        }

        // Console.log del ID del título seleccionado
        console.log('ID del título seleccionado:', selectedTitle.id)

        // Aquí puedes hacer el fetch para enviar el ID del título seleccionado
        try {
            // Ejemplo de cómo podrías hacer el fetch
            const response = await fetch(
                'https://momdel.es/animeWorld/api/guardarTitulo.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userId,
                        tituloId: selectedTitle.id,
                    }),
                }
            )

            // Manejar la respuesta según lo necesario
            // Por ejemplo, mostrar un mensaje de éxito
            navigation.goBack()
        } catch (error) {
            console.error('Error al guardar el título:', error)
            Alert.alert(
                'Error',
                'Ocurrió un error al guardar el título. Por favor inténtalo de nuevo.'
            )
        }
    }

    return (
        <SafeAreaView style={styles.area}>
            <Header title="Cambiar Titulo" />

            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {/* Renderizar la lista de títulos */}
                    {titulos.map((title) => (
                        <TouchableOpacity
                            key={title.id.toString()}
                            onPress={() => handleTitleSelect(title)}
                            style={[
                                styles.titleItem,
                                selectedTitle === title && styles.selectedTitleItem,
                            ]}
                        >
                            <Text>{title.titulo}</Text>
                        </TouchableOpacity>
                    ))}

                    {/* Espacio en la parte inferior */}
                    <View style={styles.bottomSpacing} />
                </ScrollView>

                {/* Botón de guardar */}
                <TouchableOpacity
                    onPress={handleSave}
                    style={styles.saveButton}
                >
                    <Text style={styles.saveButtonText}>Guardar</Text>
                </TouchableOpacity>
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
    scrollContainer: {
        paddingBottom: 20, // Espacio al final del scroll
    },
    titleItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray,
    },
    selectedTitleItem: {
        backgroundColor: COLORS.gray, // Cambiar el color de fondo del título seleccionado
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    bottomSpacing: {
        height: 60, // Espacio adicional al final de la lista
    },
})

export default CambiarTitulo
