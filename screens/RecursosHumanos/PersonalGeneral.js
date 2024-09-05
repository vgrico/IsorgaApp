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

const PersonalGeneral = ({  navigation }) => {

    const { nombre } = route.params

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
           
        }
    }, [userId, centroId])


    const apartados = [
        {
            moduloTexto: 'SECCIONES',
            url: 'PersonalSecciones',
        },
        {
            moduloTexto: 'PUESTOS',
            url: 'PersonalPuestos',
        },
        {
            moduloTexto: 'PERSONAL',
            url: 'PersonalLista',
        },
        {
            moduloTexto: 'FORMACIONES',
            url: 'PersonalFormaciones',
        },
    ]


    const renderModulo = ({ item }) => {
        return (
            
                <TouchableOpacity
                    style={[styles.moduloContainer, { backgroundColor: item.color }]}
                    // style={[styles.moduloContainer, { borderColor: item.color }]}
                    onPress={() => navigation.navigate(item.url, { id: item.id, nombre: item.nombre })}
                >
                    <Text style={styles.moduloTexto}>{item.moduloTexto}</Text>
                </TouchableOpacity>
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
                <Text style={styles.headerTitle}>{nombre}</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.area}>
            {renderHeader()}
            <View style={styles.horizontalLine} /> 
            <View style={styles.header}>
                <Text style={styles.tituloSegundo}>RECURSOS HUMANOS</Text>
            </View>
            <View style={styles.horizontalLine} /> 
            <FlatList
                data={apartados}
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
        padding: 1,
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
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    backIcon: {
        height: 18,
        width: 18,
        tintColor: COLORS.black,
    },
    tituloSegundo: {
        fontSize: 15,
        paddingHorizontal: 60,
        fontWeight: 'bold',
        color: COLORS.blackTie,
    },
    searchBar: {
        margin: 16,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        backgroundColor: COLORS.secondaryWhite,
    },
    flatListContent: {
        paddingHorizontal: 16,
    },
    centroNombre: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 16,
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
        backgroundColor: COLORS.secondaryWhite,
    },
    moduloTexto: {
        fontSize: SIZES.h5, // Aumentar el tamaño de la fuente
        color: COLORS.magenta,
        fontWeight: 'semibold',
        textAlign: 'center',
    },
    horizontalLine: {
        borderBottomColor: COLORS.black,
        borderBottomWidth: 1,
        marginVertical: 20,
    },
})

export default PersonalGeneral
