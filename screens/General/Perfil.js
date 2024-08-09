import React, { useState, useRef, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Switch,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { launchImagePicker } from '../../utils/ImagePickerHelper'
import RBSheet from 'react-native-raw-bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'

import SettingsItem from '../../components/SettingsItem'
import Button from '../../components/Button'
import { COLORS, SIZES, icons, images, FONTS } from '../../constants'

const Perfil = ({ navigation }) => {
    const refRBSheet = useRef()

    const [userId, setUserId] = useState(null)
    const [centroId, setCentroId] = useState(null)
    const [today, setToday] = useState('')
    const [datosUsuario, setDatosUsuario] = useState([])

    useEffect(() => {
        const loadUserId = async () => {
            try {
                const userIdFromStorage = await AsyncStorage.getItem('isorgaId')
                setUserId(userIdFromStorage)
                console.log('Loaded userId:', userIdFromStorage)

                const centroIdFromStorage =
                    await AsyncStorage.getItem('centroId')
                setCentroId(centroIdFromStorage)
                console.log('Loaded centroId:', centroIdFromStorage)
            } catch (error) {
                console.error('Error loading userId from AsyncStorage:', error)
            }
        }
        loadUserId()
    }, [])

    useEffect(() => {
        if (userId && centroId) {
            fetchDatosUsuario()
        }
    }, [userId, centroId])

    useEffect(() => {
        const currentDate = new Date()
        const formattedDate = currentDate.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        setToday(formattedDate)
    }, [])

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('isorgaId')
            await AsyncStorage.removeItem('centroId')
            navigation.navigate('Login')
        } catch (error) {
            console.error('Error during logout:', error)
        }
    }

    const fetchDatosUsuario = async () => {
        try {
            const response = await fetch(
                'https://isorga.com/api/DatosUsuario.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userId,
                    }),
                }
            )
            const data = await response.json()
            console.log(data)
            setDatosUsuario(data)
        } catch (error) {
            console.error('Error fetching modulos:', error)
        }
    }

    const renderLogo = () => {
        return (
            <View style={styles.container}>
                <Image
                    source={require('../../assets/images/logoIsorga.png')}
                    style={styles.logo}
                />
            </View>
        )
    }

    const renderFoto = () => {
        return (
            <View style={styles.container}>
                <Image
                    source={{
                        uri: `https://isorga.com/assets/images/foto/${datosUsuario.imagen}`,
                    }}
                    style={styles.logo}
                />
            </View>
        )
    }

    const renderFecha = () => (
        <View style={styles.container}>
            <Text style={styles.dateText}>{today}</Text>
        </View>
    )

    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>MI PERFIL</Text>
            </View>
        )
    }

    const renderUsuario = () => (
        <View style={styles.usuarioContainer}>
            {renderFoto()}
            <View style={styles.usuarioInfo}>
                <Text style={styles.usuarioTitulo}>{datosUsuario.nombre}</Text>
                <Text style={styles.usuarioDato}>{datosUsuario.mail}</Text>
                <Text style={styles.usuarioDato}>Nº: {userId}</Text>
            </View>
        </View>
    )

    const renderSettings = () => {
        const [isDarkMode, setIsDarkMode] = useState(false)

        const toggleDarkMode = () => {
            setIsDarkMode((prev) => !prev)
        }

        return (
            <View style={styles.settingsContainer}>
                <SettingsItem
                    icon={icons.home}
                    name="Cambiar Centro"
                    onPress={() =>
                        navigation.navigate('Centros', { pantalla: 1 })
                    }
                />
                <TouchableOpacity
                    onPress={handleLogout}
                    style={styles.logoutContainer}
                >
                    <View style={styles.logoutLeftContainer}>
                        <Image
                            source={icons.logout}
                            resizeMode="contain"
                            style={[
                                styles.logoutIcon,
                                {
                                    tintColor: 'black',
                                },
                            ]}
                        />
                        <Text
                            style={[
                                styles.logoutName,
                                {
                                    color: 'black',
                                },
                            ]}
                        >
                            Salir y desconectar
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.area}>
            {renderLogo()}
            {/* {renderFecha()} */}
            {renderHeader()}
            <View style={styles.horizontalLine} />
            {renderUsuario()}
            <View style={styles.horizontalLineaGruesa} />
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* {renderProfile()} */}
                    {renderSettings()}
                </ScrollView>
            </View>
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={false}
                height={SIZES.height * 0.8}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    },
                    draggableIcon: {
                        backgroundColor: COLORS.grayscale200,
                        height: 4,
                    },
                    container: {
                        borderTopRightRadius: 32,
                        borderTopLeftRadius: 32,
                        height: 260,
                        backgroundColor: COLORS.white,
                    },
                }}
            >
                <Text style={styles.bottomTitle}>Logout</Text>
                <View
                    style={[
                        styles.separateLine,
                        {
                            backgroundColor: COLORS.grayscale200,
                        },
                    ]}
                />
                <Text
                    style={[
                        styles.bottomSubtitle,
                        {
                            color: COLORS.black,
                        },
                    ]}
                >
                    Are you sure you want to log out?
                </Text>

                <View style={styles.bottomContainer}>
                    <Button
                        title="Cancel"
                        style={{
                            width: (SIZES.width - 32) / 2 - 8,
                            backgroundColor: COLORS.tansparentPrimary,
                            borderRadius: 32,
                            borderColor: COLORS.tansparentPrimary,
                        }}
                        textColor={COLORS.primary}
                        onPress={() => refRBSheet.current.close()}
                    />
                    <Button
                        title="Yes, Logout"
                        filled
                        style={styles.logoutButton}
                        onPress={() => refRBSheet.current.close()}
                    />
                </View>
            </RBSheet>
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
        marginBottom: 32,
    },
    // headerContainer: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    // },
    header: {
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    headerTitle: {
        fontSize: SIZES.h2,
        fontFamily: 'bold',
        marginLeft: 16,
    },
    headerIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.greyscale900,
    },
    arrowBackIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
    },
    bellIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        height: 32,
        width: 32,
        tintColor: COLORS.primary,
    },

    profileContainer: {
        alignItems: 'center',
        borderBottomColor: COLORS.grayscale400,
        borderBottomWidth: 0.4,
        paddingVertical: 20,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 999,
    },
    picContainer: {
        width: 20,
        height: 20,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        position: 'absolute',
        right: 0,
        bottom: 12,
    },
    title: {
        fontSize: 18,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        marginTop: 12,
    },
    usuarioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 25,
    },
    usuarioInfo: {
        marginLeft: 16,
    },
    usuarioTitulo: {
        fontSize: 18,
        fontFamily: 'semibold',
        color: COLORS.greyscale900,
        marginTop: 12,
    },
    usuarioDato: {
        fontSize: 12,
        fontFamily: 'regular',
        color: COLORS.greyscale900,
        marginTop: 12,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.greyscale900,
        fontFamily: 'medium',
        marginTop: 4,
    },
    settingsContainer: {
        marginVertical: 12,
    },
    settingsItemContainer: {
        width: SIZES.width - 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingsIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.greyscale900,
    },
    settingsName: {
        fontSize: 18,
        fontFamily: 'semiBold',
        color: COLORS.greyscale900,
        marginLeft: 12,
    },
    settingsArrowRight: {
        width: 24,
        height: 24,
        tintColor: COLORS.greyscale900,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightLanguage: {
        fontSize: 18,
        fontFamily: 'semiBold',
        color: COLORS.greyscale900,
        marginRight: 8,
    },
    switch: {
        marginLeft: 8,
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], // Adjust the size of the switch
    },
    logoutContainer: {
        width: SIZES.width - 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
    },
    logoutLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoutIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.greyscale900,
    },
    logoutName: {
        fontSize: 18,
        fontFamily: 'semiBold',
        color: COLORS.greyscale900,
        marginLeft: 12,
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
        paddingHorizontal: 16,
    },
    cancelButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.tansparentPrimary,
        borderRadius: 32,
    },
    logoutButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.primary,
        borderRadius: 32,
    },
    bottomTitle: {
        fontSize: 24,
        fontFamily: 'semiBold',
        color: 'red',
        textAlign: 'center',
        marginTop: 12,
    },
    bottomSubtitle: {
        fontSize: 20,
        fontFamily: 'semiBold',
        color: COLORS.greyscale900,
        textAlign: 'center',
        marginVertical: 28,
    },
    separateLine: {
        width: SIZES.width,
        height: 1,
        backgroundColor: COLORS.grayscale200,
        marginTop: 12,
    },
    horizontalLine: {
        borderBottomColor: COLORS.black,
        borderBottomWidth: 1,
        marginVertical: 10,
    },
    horizontalLineaGruesa: {
        borderBottomColor: COLORS.grayscale200,
        borderBottomWidth: 3,
        marginVertical: 20,
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    moduloLogo: {
        width: 50,
        height: 50,
        marginBottom: 15,
        resizeMode: 'contain',
    },
})

export default Perfil
