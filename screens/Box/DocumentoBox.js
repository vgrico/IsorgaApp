import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    Alert,
    Linking,
    Image
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import { COLORS, SIZES, icons } from '../../constants'

const DocumentoBox = ({ route, navigation }) => {
    const { id } = route.params

    const [userId, setUserId] = useState(null)
    const [centroId, setCentroId] = useState(null)
    const [documento, setDocumento] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userIdFromStorage = await AsyncStorage.getItem('isorgaId')
                setUserId(userIdFromStorage)

                const centroIdFromStorage =
                    await AsyncStorage.getItem('centroId')
                setCentroId(centroIdFromStorage)
            } catch (error) {
                console.error('Error loading data from AsyncStorage:', error)
            }
        }
        loadUserData()
    }, [])

    useEffect(() => {
        if (userId && centroId) {
            fetchDocumento()
        }
    }, [userId, centroId])

    const fetchDocumento = async () => {
        try {
            setLoading(true)
            const response = await fetch(
                'https://isorga.com/api/DocumentoBox.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idDocumento: id,
                    }),
                }
            )
            const data = await response.json()
            console.log('Received document:', data) // Log the received document data
            setDocumento(data)
        } catch (error) {
            console.error('Error fetching documento:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenInBrowser = () => {
        const encodedUrl = `https://isorga.com/DOCS/${centroId}/${encodeURIComponent(documento.pdf)}`
        Linking.openURL(encodedUrl)
    }

    const handleDownload = async () => {
        try {
            const encodedUrl = `https://isorga.com/DOCS/${centroId}/${encodeURIComponent(documento.pdf)}`
            const fileUri = `${FileSystem.documentDirectory}${documento.pdf}`
            const { uri } = await FileSystem.downloadAsync(encodedUrl, fileUri)
            Alert.alert('Descarga completada', `Archivo descargado a ${uri}`)
        } catch (error) {
            console.error('Error downloading file:', error)
            Alert.alert('Error', 'No se pudo descargar el archivo.')
        }
    }

    const handleShare = async () => {
        try {
            const encodedUrl = `https://isorga.com/DOCS/${centroId}/${encodeURIComponent(documento.pdf)}`
            const fileUri = `${FileSystem.documentDirectory}${documento.pdf}`
            await FileSystem.downloadAsync(encodedUrl, fileUri)

            await Sharing.shareAsync(fileUri)
        } catch (error) {
            console.error('Error sharing file:', error)
            Alert.alert('Error', 'No se pudo compartir el archivo.')
        }
    }

    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={icons.arrowBack}
                        resizeMode="contain"
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{documento.titulo}</Text>
                <View style={{ flex: 1 }} />
                <Image source={require('../../assets/images/logoIsorga.png')} style={styles.logo} />
            </View>
        )
    }

    if (loading || !documento) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </SafeAreaView>
        )
    }

    const pdfUrl = `https://isorga.com/DOCS/${centroId}/${encodeURIComponent(documento.pdf)}`
    console.log('PDF URL:', pdfUrl) // Log the PDF URL

    return (
        <SafeAreaView style={styles.area}>
            {renderHeader()}
           
            <View style={styles.horizontalLine} />

            <ScrollView contentContainerStyle={styles.content}>
        
                <Text style={styles.label}>FECHA</Text>
                <Text style={styles.value}>{documento.fecha}</Text>

                <Text style={styles.label}>TÍTULO DOCUMENTO</Text>
                <Text style={styles.value}>{documento.titulo}</Text>

                <Text style={styles.label}>DESCRIPCION</Text>
                <Text style={styles.value}>{documento.ubicacion}</Text>


                <Text style={styles.label}>OBSERVACIONES</Text>
                <Text style={styles.value}>{documento.observaciones}</Text>

                <View style={styles.horizontalLine} />

                <View style={styles.iconRow}>
                    <TouchableOpacity
                        onPress={handleOpenInBrowser}
                        style={styles.iconContainer}
                    >
                        <Ionicons
                            name="eye-outline"
                            size={30}
                            color={COLORS.greyscale600}
                        />
                        <Text style={styles.iconText}>Ver PDF</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleShare}
                        style={styles.iconContainer}
                    >
                        <Ionicons
                            name="share-outline"
                            size={30}
                            color={COLORS.greyscale600}
                        />
                        <Text style={styles.iconText}>Compartir PDF</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.horizontalLine} />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    headerTitle: {
        color: COLORS.black,
        fontSize: SIZES.h3,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    backIcon: {
        height: 18,
        width: 18,
        tintColor: COLORS.black,
    },
    content: {
        padding: 16,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 10,
        color: COLORS.black,
        marginTop: 8,
    },
    value: {
        fontSize: 14,
        color: COLORS.black,
        marginBottom: 8,
    },
    valueEstado: {
        fontSize: 14,
        color: COLORS.red,
        fontWeight: 'semibold',
        marginBottom: 8,
        textAlign: 'right',
    },
    observaciones: {
        marginBottom: 16,
        textAlign: 'right',
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    iconContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    iconText: {
        color: COLORS.greyscale600,
        fontWeight: 'regular',
        marginTop: 8,
    },
    horizontalLine: {
        borderBottomColor: COLORS.black,
        borderBottomWidth: 1,
        marginVertical: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
        padding: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    logo: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
      },
})

export default DocumentoBox
