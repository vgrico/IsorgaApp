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
    Image,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import { COLORS, SIZES, icons } from '../../constants'

const Documento = ({ route, navigation }) => {
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
                'https://isorga.com/api/Documento.php',
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

    const handleAcceptReview = async () => {
        try {
            Alert.alert(
                'Confirmar',
                '¿Está seguro que desea aceptar la revisión?',
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Aceptar',
                        onPress: async () => {
                            const response = await fetch(
                                'https://isorga.com/api/AceptarRevision.php',
                                {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        idDocumento: id,
                                        userId: userId,
                                    }),
                                }
                            )
                            const data = await response.json()
                            fetchDocumento()
                        },
                    },
                ]
            )
        } catch (error) {
            console.error('Error accepting review:', error)
            Alert.alert('Error', 'No se pudo aceptar la revisión.')
        }
    }

    const handleRejectReview = async () => {
        try {
            Alert.alert(
                'Confirmar',
                '¿Está seguro que desea rechazar la revisión?',
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Rechazar',
                        onPress: async () => {
                            const response = await fetch(
                                'https://isorga.com/api/RechazarRevision.php',
                                {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        idDocumento: id,
                                        userId: userId,
                                    }),
                                }
                            )
                            //DEBERIA REFRESCAR LA PAGINA O IR A OTRA PÁGINA
                            const data = await response.json()
                            fetchDocumento()
                        },
                    },
                ]
            )
        } catch (error) {
            console.error('Error rejecting review:', error)
            Alert.alert('Error', 'No se pudo rechazar la revisión.')
        }
    }

    const handleEnvioRevision = async () => {
        try {
            Alert.alert(
                'Confirmar',
                '¿Está seguro que desea enviar a revisión?',
                [

                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Aceptar',
                        onPress: async () => {
                            const response = await fetch(
                                'https://isorga.com/api/EnviarRevision.php',
                                {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        idDocumento: id,
                                        userId: userId,
                                    }),
                                }
                            )
                            const data = await response.json()
                            fetchDocumento()

                            // Alert.alert(
                            //     'Aprobación aceptada',
                            //     'La aprobación ha sido aceptada exitosamente.'
                            // )
                        },
                    },
                ]
            )
        } catch (error) {
            console.error('Error accepting approval:', error)
            Alert.alert('Error', 'No se pudo aceptar la aprobación.')
        }
    }


    const handleAcceptApproval = async () => {
        try {
            Alert.alert(
                'Confirmar',
                '¿Está seguro que desea aceptar la aprobación?',
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Aceptar',
                        onPress: async () => {
                            const response = await fetch(
                                'https://isorga.com/api/AceptarAprobacion.php',
                                {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        idDocumento: id,
                                        userId: userId,
                                    }),
                                }
                            )
                            const data = await response.json()
                            fetchDocumento()
                        },
                    },
                ]
            )
        } catch (error) {
            console.error('Error accepting approval:', error)
            Alert.alert('Error', 'No se pudo aceptar la aprobación.')
        }
    }

    const handleRejectApproval = async () => {
        try {
            Alert.alert(
                'Confirmar',
                '¿Está seguro que desea rechazar la aprobación?',
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Rechazar',
                        onPress: async () => {
                            const response = await fetch(
                                'https://isorga.com/api/RechazarAprobacion.php',
                                {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        idDocumento: id,
                                        userId: userId,
                                    }),
                                }
                            )
                            const data = await response.json()
                            fetchDocumento()
                        },
                    },
                ]
            )
        } catch (error) {
            console.error('Error rejecting approval:', error)
            Alert.alert('Error', 'No se pudo rechazar la aprobación.')
        }
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
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    {/* <Ionicons
                        name="arrow-back"
                        size={24}
                        color={COLORS.black}
                    /> */}
                     <Image
                        source={icons.arrowBack}
                        resizeMode="contain"
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{documento.codigo}</Text>
            </View>
            <View style={styles.horizontalLine} />

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.valueEstado}>{documento.estado}</Text>
                <View style={styles.horizontalLine} />

                <Text style={styles.label}>TÍTULO DOCUMENTO</Text>
                <Text style={styles.value}>
                    {documento.titulo}
                    {/* {documento.codigo} - {documento.titulo} */}
                </Text>

                <Text style={styles.label}>REVISIÓN:</Text>
                <Text style={styles.value}>{documento.revision}</Text>

                <Text style={styles.label}>OBSERVACIONES</Text>
                <Text style={styles.value}>
                    {documento.observaciones}
                    {/* {documento.observaciones || 'No hay observaciones'} */}
                </Text>

                {documento.tipo != 2 && (
                    <>
                        <View style={styles.horizontalLine} />
                        <Text style={styles.label}>PERTENECE A</Text>
                        <Text style={styles.value}>
                            {documento.perteneceCodigo} -{' '}
                            {documento.perteneceTitulo}
                        </Text>
                    </>
                )}

                <View style={styles.horizontalLine} />

                <Text style={styles.label}>EDITADO</Text>
                <Text style={styles.value}>
                    {documento.fechaEdita} {documento.usuarioEdita}
                </Text>

                <Text style={styles.label}>REVISADO</Text>
                <Text style={styles.value}>
                    {documento.fechaRevisa} {documento.usuarioRevisa}
                </Text>

                <Text style={styles.label}>APROBADO</Text>
                <Text style={styles.value}>
                    {documento.fechaAprueba} {documento.usuarioAprueba}
                </Text>

                <Text style={styles.label}>MOTIVO CAMBIO</Text>
                <Text style={styles.value}>{documento.motivo}</Text>

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

                {documento.numeroEstado == 4 && 
                    userId == documento.usuarioRevisaId && (
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                onPress={handleAcceptReview}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>
                                    Aceptar Revisión
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleRejectReview}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>
                                    Rechazar Revisión
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                {documento.numeroEstado == 5 &&
                    userId == documento.usuarioApruebaId && (
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                onPress={handleAcceptApproval}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>
                                    Aceptar Aprobación
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleRejectApproval}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>
                                    Rechazar Aprobación
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                {documento.numeroEstado == 1 &&
                    userId == documento.usuarioEditaId && (
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                onPress={handleEnvioRevision}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>
                                    Enviar a Revisión
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
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
})

export default Documento
