import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TextInput,
    TouchableOpacity,
    Image,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, icons, SIZES } from '../../constants'

const Pendientes = ({ route, navigation }) => {
    const [userId, setUserId] = useState(null)
    const [centroId, setCentroId] = useState(null)

    const [modulosRevisar, setModulosRevisar] = useState([])
    const [modulosAprobar, setModulosAprobar] = useState([])
    const [filteredRevisar, setFilteredRevisar] = useState([])
    const [filteredAprobar, setFilteredAprobar] = useState([])
    const [loading, setLoading] = useState(true)
    // const [searchRevisar, setSearchRevisar] = useState('')
    // const [searchAprobar, setSearchAprobar] = useState('')

    const tipoMap = {
        1: 'Manual / Documentos',
        2: 'Proceso',
        3: 'Procedimiento',
        4: 'Instrucción',
        5: 'Formato',
        6: 'Documentos Varios',
    }

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
            fetchPendientesRevisar()
            fetchPendientesAprobar()
        }
    }, [userId, centroId])

    const fetchPendientesRevisar = async () => {
        try {
            setLoading(true)
            const response = await fetch(
                'https://isorga.com/api/PendientesRevisar.php',
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
            setModulosRevisar(data)
            setFilteredRevisar(data)
        } catch (error) {
            console.error('Error fetching modulos revisar:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchPendientesAprobar = async () => {
        try {
            setLoading(true)
            const response = await fetch(
                'https://isorga.com/api/PendientesAprobar.php',
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
            setModulosAprobar(data)
            setFilteredAprobar(data)
        } catch (error) {
            console.error('Error fetching modulos aprobar:', error)
        } finally {
            setLoading(false)
        }
    }

    // const handleSearchRevisar = (text) => {
    //     setSearchRevisar(text)
    //     const filtered = modulosRevisar.filter(
    //         (item) =>
    //             item.codigo.toLowerCase().includes(text.toLowerCase()) ||
    //             item.titulo.toLowerCase().includes(text.toLowerCase())
    //     )
    //     setFilteredRevisar(filtered)
    // }
    // const handleSearchAprobar = (text) => {
    //     setSearchAprobar(text)
    //     const filtered = modulosAprobar.filter(
    //         (item) =>
    //             item.codigo.toLowerCase().includes(text.toLowerCase()) ||
    //             item.titulo.toLowerCase().includes(text.toLowerCase())
    //     )
    //     setFilteredAprobar(filtered)
    // }

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
                <Text style={styles.headerTitle}>PENDIENTES MIOS</Text>
                <View style={{ flex: 1 }} />
                <Image source={require('../../assets/images/logoIsorga.png')} style={styles.logo} />
            </View>
        )
    }

    const renderModulo = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('Documento', { id: item.id })
                }
            >
                <View style={styles.row}>
                    {/* <Text style={[styles.cell, styles.equalCell]}>{tipoMap[item.tipo]}</Text> */}
                    <Text style={[styles.cell, styles.equalCell]}>
                        {item.codigo}
                    </Text>
                    <Text style={[styles.cell, styles.equalCell]}>
                        {item.titulo}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.area}>
            {renderHeader()}
            <View style={styles.horizontalLine} />

            {modulosRevisar.length > 0 && (
                <>
                    <Text style={styles.tableTitle}>Ptes. Revisar</Text>
                    {/* <TextInput
                placeholder="Buscar..."
                style={styles.searchBar}
                placeholderTextColor={COLORS.gray}
                value={searchRevisar}
                onChangeText={handleSearchRevisar}
            /> */}
                    <View style={styles.table}>
                        <View style={styles.headerRow}>
                            {/* <Text style={[styles.headerCell, styles.equalCell]}>Tipo</Text> */}
                            <Text style={[styles.headerCell, styles.equalCell]}>
                                Código
                            </Text>
                            <Text style={[styles.headerCell, styles.equalCell]}>
                                Título
                            </Text>
                        </View>
                        <FlatList
                            data={filteredRevisar}
                            renderItem={renderModulo}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={styles.flatListContent}
                        />
                    </View>
                </>
            )}

            {modulosAprobar.length > 0 && (
                <>
                    <Text style={styles.tableTitle}>Ptes. Aprobar</Text>
                    {/* <TextInput
                placeholder="Buscar..."
                style={styles.searchBar}
                placeholderTextColor={COLORS.gray}
                value={searchAprobar}
                onChangeText={handleSearchAprobar}
            /> */}
                    <View style={styles.table}>
                        <View style={styles.headerRow}>
                            {/* <Text style={[styles.headerCell, styles.equalCell]}>Tipo</Text> */}
                            <Text style={[styles.headerCell, styles.equalCell]}>
                                Código
                            </Text>
                            <Text style={[styles.headerCell, styles.equalCell]}>
                                Título
                            </Text>
                        </View>
                        <FlatList
                            data={filteredAprobar}
                            renderItem={renderModulo}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={styles.flatListContent}
                        />
                    </View>
                </>
            )}
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
    backIcon: {
        height: 18,
        width: 18,
        tintColor: COLORS.black,
    },
    headerTitle: {
        color: COLORS.black,
        fontSize: SIZES.h3,
        fontWeight: 'bold',
        marginLeft: 20,
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
        paddingHorizontal: 14,
    },
    table: {
        flex: 1,
        paddingHorizontal: 10,
    },
    headerRow: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: COLORS.greyScale800,
        paddingBottom: 8,
        marginBottom: 16,
    },
    headerCell: {
        fontWeight: 'bold',
        fontSize: 12,
        color: COLORS.black,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
        paddingVertical: 8,
    },
    cell: {
        fontSize: 12,
        color: COLORS.black,
        paddingHorizontal: 1,
    },
    equalCell: {
        flex: 1, // 33%
        textAlign: 'center',
    },
    tableTitle: {
        fontSize: SIZES.h4,
        fontWeight: 'bold',
        marginHorizontal: 16,
        marginVertical: 8,
        paddingVertical: 10,
        textAlign: 'center',
    },
    horizontalLine: {
        borderBottomColor: COLORS.black,
        borderBottomWidth: 1,
        marginVertical: 10,
    },
    logo: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
      },
})

export default Pendientes
