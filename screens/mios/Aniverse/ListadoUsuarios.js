import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, icons } from '../../constants';

const ListadoUsuarios = ({ navigation }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchListadoUsuarios();
    }, []);

    const fetchListadoUsuarios = async () => {
        try {
            const response = await fetch(`https://momdel.es/animeWorld/api/listadoUsuarios.php`);
            const data = await response.json();
            setUsuarios(data);
            setFilteredUsuarios(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching usuarios:', error);
            setLoading(false);
        }
    };

    const handleSearch = (text) => {
        setSearchText(text);
        const filteredData = usuarios.filter((item) =>
            item.nickname.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredUsuarios(filteredData);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate('PerfilUsuario', { idUsuario: item.id })}
        >
            <Image
                source={{ uri: item.imagen ? `https://momdel.es/animeWorld/DOCS/${item.imagen}` : 'https://via.placeholder.com/150' }}
                style={styles.userImage}
            />
            <Text style={styles.itemText}>{item.nickname}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image
                        source={icons.back}
                        resizeMode="contain"
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Buscador</Text>
            </View>
            <View style={styles.searchBarContainer}>
                <Image source={icons.search} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchBar}
                    placeholder="Buscar por nickname"
                    placeholderTextColor={COLORS.white}
                    value={searchText}
                    onChangeText={handleSearch}
                />
            </View>
            <FlatList
                data={filteredUsuarios}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 16,
    },
    backButton: {
        padding: 10,
    },
    backIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.black,
        textAlign: 'center',
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: COLORS.greyscale900,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d3d3d3', // Grisáceo oscuro
        borderRadius: 20, // Redondeado
        paddingHorizontal: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#1c1c1c', // Borde más oscuro
    },
    searchIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.grey,
        marginRight: 8,
    },
    searchBar: {
        flex: 1,
        height: 40,
        color: COLORS.black,
        fontSize: 16,
    },
    listContent: {
        paddingBottom: 50,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.greyscale300,
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
    },
    itemText: {
        fontSize: 16,
        color: COLORS.greyscale900,
    },
});

export default ListadoUsuarios;
