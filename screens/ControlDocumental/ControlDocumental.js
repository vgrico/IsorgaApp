import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    SafeAreaView,
    TouchableOpacity,
    Image,
} from 'react-native'
import { COLORS, icons, SIZES } from '../../constants'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ControlDocumental = ({ navigation }) => {
    const [userId, setUserId] = useState(null)
    const [centroId, setCentroId] = useState(null)
    const [hayRevision, setHayRevision] = useState(null)

    const [modulosUsuario, setModulosUsuario] = useState([])
    const [filteredModulos, setFilteredModulos] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [centroNombre, setCentroNombre] = useState('')

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
            fetchRevisiones()
        }
    }, [userId, centroId])


    const tiposDocumentos = [
        {
            moduloTexto: 'MANUAL Y DOCUMENTOS',
            color: COLORS.grayscale100,
            url: 'Manual&Documentos',
            tipoDocumento: '1',
        },
        {
            moduloTexto: 'PROCESOS',
            color: COLORS.grayscale100,
            url: 'Procesos',
            tipoDocumento: '2',
        },
        {
            moduloTexto: 'PROCEDIMIENTOS',
            color: COLORS.grayscale100,
            url: 'Procedimientos',
            tipoDocumento: '3',
        },
        {
            moduloTexto: 'INSTRUCCIONES',
            color: COLORS.grayscale100,
            url: 'Instrucciones',
            tipoDocumento: '4',
        },
        {
            moduloTexto: 'FORMATOS',
            color: COLORS.grayscale100,
            url: 'Formatos',
            tipoDocumento: '5',
        },
        {
            moduloTexto: 'MIS PENDIENTES DE REVISION Y APORBACIÓN',
            color: COLORS.transparentSecondary,
            url: 'Pendientes',
            tipoDocumento: '0',
        },
    ]

    const fetchRevisiones = async () => {
        try {
            setLoading(true)
            const response = await fetch(
                'https://isorga.com/api/DocumentosPendientesAprobacionRevision.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        centroId: centroId,
                        userId: userId,
                    }),
                }
            )

            const data = await response.json()
            console.log(data.total)
            setHayRevision(data.total)

        } catch (error) {
            console.error('Error fetching modulos:', error)
        } finally {
            setLoading(false)
        }
    }

    const renderModulo = ({ item }) => {
        return (
            (item.tipoDocumento !== '0' || (item.tipoDocumento === '0' && hayRevision > 0)) ? (
                <TouchableOpacity
                    style={[styles.moduloContainer, { backgroundColor: item.color }]}
                    // style={[styles.moduloContainer, { borderColor: item.color }]}
                    onPress={() => navigation.navigate(item.url)}
                >
                    <Text style={styles.moduloTexto}>{item.moduloTexto}</Text>
                </TouchableOpacity>
            ) : null
        );
    };

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
                <Text style={styles.headerTitle}>CONTROL DOCUMENTAL</Text>
                <View style={{ flex: 1 }} />
                <Image source={require('../../assets/images/logoIsorga.png')} style={styles.logo} />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.area}>
            {renderHeader()}
            <View style={styles.horizontalLine} />
            <FlatList
                data={tiposDocumentos}
                renderItem={renderModulo}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                contentContainerStyle={styles.flatListContent}
                columnWrapperStyle={styles.columnWrapper}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    header: {
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    headerTitle: {
        fontSize: SIZES.h3,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    backIcon: {
        height: 18,
        width: 18,
        // tintColor: COLORS.black,
    },
    centroNombre: {
        fontSize: 15,
        fontWeight: 'bold',
        // color: COLORS.black,
    },
    flatListContent: {
        paddingHorizontal: 16,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    moduloContainer: {
        flex: 1,
        margin: 3,
        padding: 5, // Aumentar el padding
        borderRadius: 15,
        borderWidth: 1,
        borderColor: COLORS.magenta,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: '45%', // Ajustar el tamaño mínimo
        minHeight: 100, // Establecer una altura mínima mayor
        // backgroundColor: COLORS.secondaryWhite,
    },
    moduloTexto: {
        fontSize: 14, // Aumentar el tamaño de la fuente
        textAlign: 'center',
    },
    horizontalLine: {
        borderBottomColor: COLORS.black,
        borderBottomWidth: 1,
        marginVertical: 20,
    },
    logo: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
      },
})

export default ControlDocumental
